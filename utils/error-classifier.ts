/**
 * TASK-045: Error Classification System
 * Categorizes errors as recoverable or fatal to determine appropriate handling strategy
 */

import i18n from '@/i18n';
import { type FirebaseError } from 'firebase/app';

/**
 * Error severity levels
 */
export enum ErrorSeverity {
  /** Fatal errors that prevent app functionality - require restart or user intervention */
  FATAL = 'fatal',
  /** Recoverable errors that can be retried or handled gracefully */
  RECOVERABLE = 'recoverable',
  /** Warning-level issues that don't prevent functionality */
  WARNING = 'warning',
  /** Informational messages */
  INFO = 'info',
}

/**
 * Error categories for better handling
 */
export enum ErrorCategory {
  NETWORK = 'network',
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  VALIDATION = 'validation',
  STORAGE = 'storage',
  FIRESTORE = 'firestore',
  INITIALIZATION = 'initialization',
  UNKNOWN = 'unknown',
}

/**
 * Classified error information
 */
export interface ClassifiedError {
  severity: ErrorSeverity;
  category: ErrorCategory;
  message: string;
  userMessage: string;
  recoverable: boolean;
  recoverySuggestions: string[];
  retryable: boolean;
  originalError: unknown;
}

/**
 * Network error codes that are typically recoverable
 */
const RECOVERABLE_NETWORK_CODES = ['ECONNABORTED', 'ETIMEDOUT', 'ECONNRESET', 'NETWORK_ERROR', 'ERR_NETWORK'];

/**
 * Firebase error codes that are fatal (require user action)
 */
const FATAL_FIREBASE_CODES = ['auth/user-disabled', 'auth/user-not-found', 'auth/invalid-api-key', 'auth/app-deleted', 'auth/app-not-authorized'];

/**
 * Firebase error codes that are recoverable (can be retried)
 */
const RECOVERABLE_FIREBASE_CODES = ['auth/network-request-failed', 'auth/too-many-requests', 'unavailable', 'deadline-exceeded', 'resource-exhausted'];

/**
 * Type guard to check if error is a Firebase error
 */
const isFirebaseError = (error: unknown): error is FirebaseError => {
  return typeof error === 'object' && error !== null && 'code' in error && 'message' in error && typeof (_error as { code: unknown }).code === 'string';
};

/**
 * Type guard to check if error is a network error
 */
const isNetworkError = (error: unknown): boolean => {
  if (typeof error === 'object' && error !== null) {
    const err = error as { code?: string; message?: string; isAxiosError?: boolean };
    return err.isAxiosError === true || RECOVERABLE_NETWORK_CODES.some((code) => err.code === code || err.message?.includes(code)) || err.message?.toLowerCase().includes('network') === true;
  }
  return false;
};

/**
 * Get recovery suggestions for network errors
 */
const getNetworkRecoverySuggestions = (): string[] => {
  return [i18n.t('errors.recovery.checkConnection'), i18n.t('errors.recovery.tryAgain'), i18n.t('errors.recovery.waitAndRetry')];
};

/**
 * Get recovery suggestions for authentication errors
 */
const getAuthRecoverySuggestions = (code?: string): string[] => {
  const suggestions: string[] = [];

  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
      suggestions.push(i18n.t('errors.recovery.checkCredentials'));
      suggestions.push(i18n.t('errors.recovery.resetPassword'));
      break;
    case 'auth/user-disabled':
      suggestions.push(i18n.t('errors.recovery.contactSupport'));
      break;
    case 'auth/too-many-requests':
      suggestions.push(i18n.t('errors.recovery.waitBeforeRetry'));
      suggestions.push(i18n.t('errors.recovery.resetPassword'));
      break;
    case 'auth/requires-recent-login':
      suggestions.push(i18n.t('errors.recovery.loginAgain'));
      break;
    default:
      suggestions.push(i18n.t('errors.recovery.tryAgain'));
  }

  return suggestions;
};

/**
 * Get recovery suggestions for storage errors
 */
const getStorageRecoverySuggestions = (): string[] => {
  return [i18n.t('errors.recovery.clearCache'), i18n.t('errors.recovery.freeSpace'), i18n.t('errors.recovery.restartApp')];
};

/**
 * Get recovery suggestions for Firestore errors
 */
const getFirestoreRecoverySuggestions = (code?: string): string[] => {
  const suggestions: string[] = [];

  if (code === 'permission-denied') {
    suggestions.push(i18n.t('errors.recovery.loginAgain'));
    suggestions.push(i18n.t('errors.recovery.contactSupport'));
  } else if (code === 'unavailable' || code === 'deadline-exceeded') {
    suggestions.push(i18n.t('errors.recovery.checkConnection'));
    suggestions.push(i18n.t('errors.recovery.tryAgain'));
  } else {
    suggestions.push(i18n.t('errors.recovery.tryAgain'));
    suggestions.push(i18n.t('errors.recovery.restartApp'));
  }

  return suggestions;
};

/**
 * Classify a Firebase error
 */
const classifyFirebaseError = (error: FirebaseError): Omit<ClassifiedError, 'originalError'> => {
  const code = error.code;
  const isFatal = FATAL_FIREBASE_CODES.includes(code);
  const isRecoverable = RECOVERABLE_FIREBASE_CODES.includes(code);

  // Determine category
  let category: ErrorCategory = ErrorCategory.UNKNOWN;
  if (code.startsWith('auth/')) {
    category = ErrorCategory.AUTHENTICATION;
  } else if (code === 'permission-denied') {
    category = ErrorCategory.AUTHORIZATION;
  } else {
    category = ErrorCategory.FIRESTORE;
  }

  // Determine if retryable
  const retryable = isRecoverable && !isFatal;

  // Get recovery suggestions
  let recoverySuggestions: string[];
  if (category === ErrorCategory.AUTHENTICATION) {
    recoverySuggestions = getAuthRecoverySuggestions(code);
  } else {
    recoverySuggestions = getFirestoreRecoverySuggestions(code);
  }

  return {
    severity: isFatal ? ErrorSeverity.FATAL : isRecoverable ? ErrorSeverity.RECOVERABLE : ErrorSeverity.WARNING,
    category,
    message: error.message,
    userMessage: i18n.t('errors.firebase.message') || error.message,
    recoverable: !isFatal,
    recoverySuggestions,
    retryable,
  };
};

/**
 * Classify an error to determine its severity and recovery options
 * TASK-045: Main classification function
 */
export const classifyError = (error: unknown): ClassifiedError => {
  // Handle network errors
  if (isNetworkError(_error)) {
    return {
      severity: ErrorSeverity.RECOVERABLE,
      category: ErrorCategory.NETWORK,
      message: error instanceof Error ? error.message : 'Network error occurred',
      userMessage: i18n.t('errors.network.message'),
      recoverable: true,
      recoverySuggestions: getNetworkRecoverySuggestions(),
      retryable: true,
      originalError: error,
    };
  }

  // Handle Firebase errors
  if (isFirebaseError(_error)) {
    return {
      ...classifyFirebaseError(_error),
      originalError: error,
    };
  }

  // Handle storage errors
  if (_error instanceof Error && error.message.includes('storage')) {
    return {
      severity: ErrorSeverity.RECOVERABLE,
      category: ErrorCategory.STORAGE,
      message: error.message,
      userMessage: i18n.t('errors.storage.message'),
      recoverable: true,
      recoverySuggestions: getStorageRecoverySuggestions(),
      retryable: true,
      originalError: error,
    };
  }

  // Handle validation errors
  if (_error instanceof Error && error.message.includes('validation')) {
    return {
      severity: ErrorSeverity.WARNING,
      category: ErrorCategory.VALIDATION,
      message: error.message,
      userMessage: error.message,
      recoverable: true,
      recoverySuggestions: [i18n.t('errors.recovery.checkInput')],
      retryable: false,
      originalError: error,
    };
  }

  // Handle initialization errors (fatal)
  if (_error instanceof Error && (_error.message.includes('initialization') || error.message.includes('CRITICAL'))) {
    return {
      severity: ErrorSeverity.FATAL,
      category: ErrorCategory.INITIALIZATION,
      message: error.message,
      userMessage: i18n.t('errors.initialization.message'),
      recoverable: false,
      recoverySuggestions: [i18n.t('errors.recovery.restartApp'), i18n.t('errors.recovery.reinstallApp'), i18n.t('errors.recovery.contactSupport')],
      retryable: false,
      originalError: error,
    };
  }

  // Default: Unknown error (treat as recoverable but with limited suggestions)
  return {
    severity: ErrorSeverity.RECOVERABLE,
    category: ErrorCategory.UNKNOWN,
    message: error instanceof Error ? error.message : String(_error),
    userMessage: i18n.t('errors.generic.message'),
    recoverable: true,
    recoverySuggestions: [i18n.t('errors.recovery.tryAgain'), i18n.t('errors.recovery.restartApp')],
    retryable: true,
    originalError: error,
  };
};

/**
 * Check if an error is retryable
 */
export const isRetryable = (error: unknown): boolean => {
  const classified = classifyError(_error);
  return classified.retryable;
};

/**
 * Check if an error is fatal
 */
export const isFatal = (error: unknown): boolean => {
  const classified = classifyError(_error);
  return classified.severity === ErrorSeverity.FATAL;
};

/**
 * Get user-friendly error message with recovery suggestions
 */
export const getErrorWithSuggestions = (error: unknown): { message: string; suggestions: string[] } => {
  const classified = classifyError(_error);
  return {
    message: classified.userMessage,
    suggestions: classified.recoverySuggestions,
  };
};
