/**
 * Firestore Helper Utilities
 * Provides error handling and retry logic for Firestore operations
 */

import { firestore, isFirestoreReady } from '@/firebase-config';
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
 * @param docRef - Document reference
 * @returns Document snapshot or null if not found
 */
export async function getDocumentSafe<T = DocumentData>(docRef: DocumentReference<T>): Promise<DocumentSnapshot<T> | null> {
  if (!isFirestoreReady()) {
    throw new FirestoreError('Firestore is not initialized', 'firestore/not-initialized');
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
 * @param docRef - Document reference
 * @param data - Document data
 * @param merge - Whether to merge with existing data
 */
export async function setDocumentSafe<T = DocumentData>(docRef: DocumentReference<T>, data: Partial<T>, merge = false): Promise<void> {
  if (!isFirestoreReady()) {
    throw new FirestoreError('Firestore is not initialized', 'firestore/not-initialized');
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
      console.error('[Firestore] Set document failed:', {
        path: docRef.path,
        code: firestoreError.code,
        message: firestoreError.message,
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
 * @param docRef - Document reference
 * @param data - Partial document data to update
 */
export async function updateDocumentSafe<T = DocumentData>(docRef: DocumentReference<T>, data: Partial<T>): Promise<void> {
  if (!isFirestoreReady()) {
    throw new FirestoreError('Firestore is not initialized', 'firestore/not-initialized');
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
      console.error('[Firestore] Update document failed:', {
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
 * @param docRef - Document reference
 */
export async function deleteDocumentSafe<T = DocumentData>(docRef: DocumentReference<T>): Promise<void> {
  if (!isFirestoreReady()) {
    throw new FirestoreError('Firestore is not initialized', 'firestore/not-initialized');
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
      console.error('[Firestore] Delete document failed:', {
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
 * @param collectionRef - Collection reference or query
 * @param constraints - Query constraints
 * @returns Query snapshot
 */
export async function queryDocumentsSafe<T = DocumentData>(collectionRef: CollectionReference<T> | Query<T>, ...constraints: QueryConstraint[]): Promise<QuerySnapshot<T>> {
  if (!isFirestoreReady()) {
    throw new FirestoreError('Firestore is not initialized', 'firestore/not-initialized');
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
      console.error('[Firestore] Query documents failed:', {
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
