import i18n from '@/i18n';
import { logger } from './logger-production';

// Global error handler callback (set by root component)
let globalErrorHandler: ((title: string, message: string) => void) | null = null;

// Firebase error code prefix
const FIREBASE_AUTH_PREFIX = 'auth/';

/**
 * Set the global error handler (called from root component)
 */
export const setGlobalErrorHandler = (handler: (title: string, message: string) => void) => {
  globalErrorHandler = handler;
};

interface ErrorInfo {
  title: string;
  message: string;
}

const getFirebaseError = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/invalid-credential':
      return i18n.t('errors.firebase.invalid-credential');
    case 'auth/user-not-found':
      return i18n.t('errors.firebase.user-not-found');
    case 'auth/wrong-password':
      return i18n.t('errors.firebase.wrong-password');
    case 'auth/user-disabled':
      return i18n.t('errors.firebase.user-disabled');
    case 'auth/requires-recent-login':
      return i18n.t('errors.firebase.requires-recent-login');
    case 'auth/email-already-in-use':
      return i18n.t('errors.firebase.email-already-in-use');
    case 'auth/invalid-email':
      return i18n.t('errors.firebase.invalid-email');
    case 'auth/operation-not-allowed':
      return i18n.t('errors.firebase.operation-not-allowed');
    case 'auth/weak-password':
      return i18n.t('errors.firebase.weak-password');
    default:
      return i18n.t('errors.generic.message');
  }
};

/**
 * Type guard: Check if error is an Axios-like error
 */
const isAxiosError = (error: unknown): error is { isAxiosError: boolean; response?: unknown } => {
  return typeof error === 'object' && error !== null && 'isAxiosError' in error;
};

/**
 * Type guard: Check if error has a code property (Firebase errors)
 */
const hasErrorCode = (error: unknown): error is { code: string } => {
  return typeof error === 'object' && error !== null && 'code' in error && typeof (error as { code: unknown }).code === 'string';
};

/**
 * Get detailed error information from any error type
 * @param error - Error object (unknown type for safety)
 * @returns Structured error information
 */
export const getErrorInfo = (error: unknown): ErrorInfo => {
  // Handle network/Axios errors
  if (isAxiosError(error) && !error.response) {
    return {
      title: i18n.t('errors.network.title'),
      message: i18n.t('errors.network.message'),
    };
  }

  // Handle Firebase auth errors
  if (hasErrorCode(error) && error.code.startsWith(FIREBASE_AUTH_PREFIX)) {
    return {
      title: i18n.t('errors.firebase.title'),
      message: getFirebaseError(error.code),
    };
  }

  // Handle standard Error objects
  if (error instanceof Error) {
    return {
      title: i18n.t('errors.generic.title'),
      message: error.message || i18n.t('errors.generic.message'),
    };
  }

  // Fallback for unknown error types
  return {
    title: i18n.t('errors.generic.title'),
    message: i18n.t('errors.generic.message'),
  };
};

/**
 * Display error alert to user
 * Safely handles all error types and provides fallback behavior
 * @param error - Error object (unknown type for safety)
 */
export const showError = (error: unknown): void => {
  try {
    const { title, message } = getErrorInfo(error);

    if (globalErrorHandler) {
      globalErrorHandler(title, message);
    } else {
      // Fallback to logger if no handler is set (shouldn't happen in production)
      logger.error(`[${title}] ${message}`, { error });
    }
  } catch (displayError: unknown) {
    // Fallback if error display fails - this is the last resort
    const fallbackTitle = i18n.t('errors.generic.title');
    const fallbackMessage = i18n.t('errors.generic.message');

    logger.error('[Error Display] Failed to show error', displayError instanceof Error ? displayError : new Error(String(displayError)));

    if (globalErrorHandler) {
      try {
        globalErrorHandler(fallbackTitle, fallbackMessage);
      } catch (finalError: unknown) {
        // Ultimate fallback - just log
        logger.error('[Error] Critical error in error handling', finalError instanceof Error ? finalError : new Error(String(finalError)));
      }
    } else {
      logger.error(`[${fallbackTitle}] ${fallbackMessage}`);
    }
  }
};
