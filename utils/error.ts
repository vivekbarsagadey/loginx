import i18n from '@/i18n';
import { classifyError } from './error-classifier';
import { getFirebaseErrorMessage } from './error-messages';
import { logger } from './logger-production';

// Global error handler callback (set by root component)
let globalErrorHandler: ((title: string, message: string) => void) | null = null;

// Firebase error code prefixes
const FIREBASE_AUTH_PREFIX = 'auth/';
const FIRESTORE_PREFIX = 'firestore/';
const STORAGE_PREFIX = 'storage/';

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
 * Check if error is a Firebase error (auth, firestore, or storage)
 */
const isFirebaseError = (error: unknown): boolean => {
  if (!hasErrorCode(error)) {
    return false;
  }
  return error.code.startsWith(FIREBASE_AUTH_PREFIX) || error.code.startsWith(FIRESTORE_PREFIX) || error.code.startsWith(STORAGE_PREFIX);
};

/**
 * Get detailed error information from any error type
 * Enhanced with Firebase error message mapping and error classification
 * @param error - Error object (unknown type for safety)
 * @returns Structured error information
 */
export const getErrorInfo = (error: unknown): ErrorInfo => {
  // Use Firebase error message utility for all Firebase errors
  if (isFirebaseError(error) && hasErrorCode(error)) {
    const message = getFirebaseErrorMessage(error.code);

    return {
      title: i18n.t('errors.firebase.title'),
      message,
    };
  }

  // Use error classifier for non-Firebase errors
  let classified: { userMessage: string; recoverySuggestions: string[] } | null = null;
  try {
    classified = classifyError(error);
  } catch {
    // Fallback if classifier fails
  }

  // Handle network/Axios errors
  if (isAxiosError(error) && !error.response) {
    return {
      title: i18n.t('errors.network.title'),
      message: classified?.userMessage || i18n.t('errors.network.message'),
    };
  }

  // Handle standard Error objects
  if (error instanceof Error) {
    return {
      title: i18n.t('errors.generic.title'),
      message: classified?.userMessage || error.message || i18n.t('errors.generic.message'),
    };
  }

  // Fallback for unknown error types
  return {
    title: i18n.t('errors.generic.title'),
    message: classified?.userMessage || i18n.t('errors.generic.message'),
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
