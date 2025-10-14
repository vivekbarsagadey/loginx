/**
 * Firestore Helper Utilities
 * Provides error handling and retry logic for Firestore operations
 */

import { firestore, initializeFirestore, isFirestoreReady } from '@/firebase-config';
import {
  type CollectionReference,
  deleteDoc,
  type DocumentData,
  type DocumentReference,
  type DocumentSnapshot,
  getDoc,
  getDocs,
  query,
  type Query,
  type QueryConstraint,
  type QuerySnapshot,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { sanitizeDocumentId, sanitizeFieldName, sanitizeFirestoreValue } from './input-sanitization';
import { logger } from './logger-production';
import { withRetry } from './retry';

/**
 * Custom Firestore error class
 */
export class FirestoreError extends Error {
  constructor(
    message: string,
    public code: string,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'FirestoreError';
  }
}

/**
 * TASK-013: Validate and sanitize document ID before Firestore operations
 * Prevents NoSQL injection attacks via document IDs
 * @param docId - Document ID to validate
 * @returns Sanitized document ID
 * @throws FirestoreError if document ID is invalid
 */
export function validateDocumentId(docId: string): string {
  const sanitized = sanitizeDocumentId(docId);
  if (sanitized !== docId) {
    logger.warn('[Firestore] Document ID was sanitized', {
      original: docId.substring(0, 20) + '...',
      sanitized: sanitized.substring(0, 20) + '...',
    });
  }
  if (!sanitized || sanitized.length === 0) {
    throw new FirestoreError('Invalid document ID: ID cannot be empty after sanitization', 'firestore/invalid-document-id');
  }
  return sanitized;
}

/**
 * TASK-013: Validate and sanitize field name before Firestore operations
 * Prevents NoSQL injection attacks via field names
 * @param fieldName - Field name to validate
 * @returns Sanitized field name
 * @throws FirestoreError if field name is invalid
 */
export function validateFieldName(fieldName: string): string {
  const sanitized = sanitizeFieldName(fieldName);
  if (sanitized !== fieldName) {
    logger.warn('[Firestore] Field name was sanitized', {
      original: fieldName,
      sanitized: sanitized,
    });
  }
  if (!sanitized || sanitized.length === 0) {
    throw new FirestoreError('Invalid field name: Field name cannot be empty after sanitization', 'firestore/invalid-field-name');
  }
  return sanitized;
}

/**
 * TASK-013: Whitelist of allowed field names for Firestore queries
 * This prevents injection attacks by restricting queries to known fields
 */
const ALLOWED_QUERY_FIELDS = new Set([
  // User fields
  'uid',
  'email',
  'displayName',
  'phoneNumber',
  'photoURL',
  'createdAt',
  'updatedAt',
  'lastLogin',
  'emailVerified',
  'phoneVerified',
  'isActive',
  'role',
  // Timestamps
  'timestamp',
  'date',
  'startDate',
  'endDate',
  // Status fields
  'status',
  'type',
  'category',
  'priority',
  // Common fields
  'id',
  'name',
  'title',
  'description',
  'tags',
  'owner',
  'author',
  // Add more allowed fields as needed
]);

/**
 * TASK-013: Validate field name against whitelist
 * @param fieldName - Field name to check
 * @returns True if field name is allowed
 * @throws FirestoreError if field name is not in whitelist
 */
export function validateFieldNameWhitelist(fieldName: string): boolean {
  const sanitized = validateFieldName(fieldName);
  if (!ALLOWED_QUERY_FIELDS.has(sanitized)) {
    logger.error('[Firestore] Query attempted on non-whitelisted field', {
      fieldName: sanitized,
    });
    throw new FirestoreError(`Invalid field name for query: ${sanitized}`, 'firestore/invalid-query-field');
  }
  return true;
}

/**
 * TASK-013: Sanitize query value to prevent injection attacks
 * @param value - Query value to sanitize
 * @returns Sanitized value
 */
export function sanitizeQueryValue(value: unknown): unknown {
  if (typeof value === 'string') {
    return sanitizeFirestoreValue(value);
  }
  if (typeof value === 'number' || typeof value === 'boolean' || value === null) {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map(sanitizeQueryValue);
  }
  if (typeof value === 'object' && value !== null) {
    const sanitized: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value)) {
      const sanitizedKey = validateFieldName(key);
      sanitized[sanitizedKey] = sanitizeQueryValue(val);
    }
    return sanitized;
  }
  return value;
}

/**
 * Check if error is a Firestore network error that should be retried
 */
function shouldRetryFirestoreError(error: unknown): boolean {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const code = (error as { code: string }).code;
    // Retry on network errors, but not on permission or validation errors
    const retryableCodes = ['unavailable', 'deadline-exceeded', 'resource-exhausted', 'internal', 'unknown', 'cancelled'];
    return retryableCodes.some((retryableCode) => code.includes(retryableCode));
  }
  return false;
}

/**
 * Get a document with error handling and retry logic
 * TASK-062: Waits for Firestore initialization before attempting operation
 * @param docRef - Document reference
 * @returns Document snapshot or null if not found
 */
export async function getDocumentSafe<T = DocumentData>(docRef: DocumentReference<T>): Promise<DocumentSnapshot<T> | null> {
  // TASK-062: Wait for Firestore initialization with timeout
  if (!isFirestoreReady()) {
    try {
      await initializeFirestore();
    } catch (initError) {
      throw new FirestoreError('Firestore initialization failed', 'firestore/initialization-failed', initError);
    }
  }

  try {
    const snapshot = await withRetry(() => getDoc(docRef), {
      maxRetries: 2,
      initialDelay: 500,
      shouldRetry: shouldRetryFirestoreError,
    });
    return snapshot.exists() ? snapshot : null;
  } catch {
    return null;
  }
}

/**
 * Set a document with error handling and retry logic
 * TASK-062: Waits for Firestore initialization before attempting operation
 * @param docRef - Document reference
 * @param data - Document data
 * @param merge - Whether to merge with existing data
 */
export async function setDocumentSafe<T = DocumentData>(docRef: DocumentReference<T>, data: Partial<T>, merge = false): Promise<void> {
  // TASK-062: Wait for Firestore initialization with timeout
  if (!isFirestoreReady()) {
    try {
      await initializeFirestore();
    } catch (initError) {
      throw new FirestoreError('Firestore initialization failed', 'firestore/initialization-failed', initError);
    }
  }

  try {
    await withRetry(() => setDoc(docRef, data as T, { merge }), {
      maxRetries: 2,
      initialDelay: 500,
      shouldRetry: shouldRetryFirestoreError,
    });
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'code' in error) {
      const firestoreError = error as { code: string; message: string };
      // SECURITY FIX (TASK-007): Log only metadata, not actual document data
      logger.error('[Firestore] Set document failed', {
        path: docRef.path,
        code: firestoreError.code,
        message: firestoreError.message,
        merge: merge,
      });

      if (firestoreError.code === 'permission-denied') {
        throw new FirestoreError('You do not have permission to write this document', firestoreError.code, error);
      }
    }
    throw error;
  }
}

/**
 * Update a document with error handling and retry logic
 * TASK-062: Waits for Firestore initialization before attempting operation
 * @param docRef - Document reference
 * @param data - Partial document data to update
 */
export async function updateDocumentSafe<T = DocumentData>(docRef: DocumentReference<T>, data: Partial<T>): Promise<void> {
  // TASK-062: Wait for Firestore initialization with timeout
  if (!isFirestoreReady()) {
    try {
      await initializeFirestore();
    } catch (initError) {
      throw new FirestoreError('Firestore initialization failed', 'firestore/initialization-failed', initError);
    }
  }

  try {
    await withRetry(() => updateDoc(docRef, data as DocumentData), {
      maxRetries: 2,
      initialDelay: 500,
      shouldRetry: shouldRetryFirestoreError,
    });
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'code' in error) {
      const firestoreError = error as { code: string; message: string };
      // SECURITY FIX (TASK-007): Log only metadata, not actual document data
      logger.error('[Firestore] Update document failed', {
        path: docRef.path,
        code: firestoreError.code,
        message: firestoreError.message,
      });

      if (firestoreError.code === 'not-found') {
        throw new FirestoreError('Document does not exist', firestoreError.code, error);
      }
      if (firestoreError.code === 'permission-denied') {
        throw new FirestoreError('You do not have permission to update this document', firestoreError.code, error);
      }
    }
    throw error;
  }
}

/**
 * Delete a document with error handling and retry logic
 * TASK-062: Waits for Firestore initialization before attempting operation
 * @param docRef - Document reference
 */
export async function deleteDocumentSafe<T = DocumentData>(docRef: DocumentReference<T>): Promise<void> {
  // TASK-062: Wait for Firestore initialization with timeout
  if (!isFirestoreReady()) {
    try {
      await initializeFirestore();
    } catch (initError) {
      throw new FirestoreError('Firestore initialization failed', 'firestore/initialization-failed', initError);
    }
  }

  try {
    await withRetry(() => deleteDoc(docRef), {
      maxRetries: 2,
      initialDelay: 500,
      shouldRetry: shouldRetryFirestoreError,
    });
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'code' in error) {
      const firestoreError = error as { code: string; message: string };
      // SECURITY FIX (TASK-007): Log only metadata
      logger.error('[Firestore] Delete document failed', {
        path: docRef.path,
        code: firestoreError.code,
        message: firestoreError.message,
      });

      if (firestoreError.code === 'permission-denied') {
        throw new FirestoreError('You do not have permission to delete this document', firestoreError.code, error);
      }
    }
    throw error;
  }
}

/**
 * Query documents with error handling and retry logic
 * TASK-062: Waits for Firestore initialization before attempting operation
 * @param collectionRef - Collection reference or query
 * @param constraints - Query constraints
 * @returns Query snapshot
 */
export async function queryDocumentsSafe<T = DocumentData>(collectionRef: CollectionReference<T> | Query<T>, ...constraints: QueryConstraint[]): Promise<QuerySnapshot<T>> {
  // TASK-062: Wait for Firestore initialization with timeout
  if (!isFirestoreReady()) {
    try {
      await initializeFirestore();
    } catch (initError) {
      throw new FirestoreError('Firestore initialization failed', 'firestore/initialization-failed', initError);
    }
  }

  try {
    const q = constraints.length > 0 ? query(collectionRef, ...constraints) : collectionRef;
    return await withRetry(() => getDocs(q), {
      maxRetries: 2,
      initialDelay: 500,
      shouldRetry: shouldRetryFirestoreError,
    });
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'code' in error) {
      const firestoreError = error as { code: string; message: string };
      // SECURITY FIX (TASK-007): Log only metadata, not query details
      logger.error('[Firestore] Query documents failed', {
        code: firestoreError.code,
        message: firestoreError.message,
      });

      if (firestoreError.code === 'permission-denied') {
        throw new FirestoreError('You do not have permission to query this collection', firestoreError.code, error);
      }
    }
    throw error;
  }
}

/**
 * Handle Firestore errors and provide user-friendly messages
 * @param error - Error to handle
 * @returns User-friendly error message
 */
export function getFirestoreErrorMessage(error: unknown): string {
  if (error instanceof FirestoreError) {
    return error.message;
  }

  if (typeof error === 'object' && error !== null && 'code' in error) {
    const code = (error as { code: string }).code;

    switch (code) {
      case 'permission-denied':
        return 'You do not have permission to perform this action';
      case 'not-found':
        return 'The requested data was not found';
      case 'already-exists':
        return 'This data already exists';
      case 'unavailable':
        return 'Service is temporarily unavailable. Please try again';
      case 'deadline-exceeded':
        return 'Request timed out. Please check your connection';
      case 'unauthenticated':
        return 'You must be signed in to perform this action';
      case 'resource-exhausted':
        return 'Too many requests. Please try again later';
      case 'failed-precondition':
        return 'Operation cannot be performed in the current state';
      case 'cancelled':
        return 'Operation was cancelled';
      default:
        return 'An unexpected error occurred. Please try again';
    }
  }

  return 'An unexpected error occurred';
}

export { firestore };
