/**
 * Firebase Error Message Mapping
 * Maps Firebase error codes to user-friendly messages with actionable recovery steps
 */

import i18n from '@/i18n';

/**
 * Firebase Authentication error codes mapped to user-friendly messages
 */
export const FIREBASE_AUTH_ERROR_MESSAGES: Record<string, string> = {
  // User/Account errors
  'auth/user-not-found': i18n.t('errors.auth.userNotFound'),
  'auth/user-disabled': i18n.t('errors.auth.userDisabled'),
  'auth/email-already-in-use': i18n.t('errors.auth.emailInUse'),
  'auth/account-exists-with-different-credential': i18n.t('errors.auth.accountExistsDifferentCredential'),

  // Credential errors
  'auth/invalid-credential': i18n.t('errors.auth.invalidCredential'),
  'auth/wrong-password': i18n.t('errors.auth.wrongPassword'),
  'auth/invalid-email': i18n.t('errors.auth.invalidEmail'),
  'auth/invalid-password': i18n.t('errors.auth.invalidPassword'),

  // Token/Session errors
  'auth/expired-action-code': i18n.t('errors.auth.expiredActionCode'),
  'auth/invalid-action-code': i18n.t('errors.auth.invalidActionCode'),
  'auth/user-token-expired': i18n.t('errors.auth.tokenExpired'),
  'auth/requires-recent-login': i18n.t('errors.auth.requiresRecentLogin'),

  // Rate limiting
  'auth/too-many-requests': i18n.t('errors.auth.tooManyRequests'),

  // Network errors
  'auth/network-request-failed': i18n.t('errors.auth.networkFailed'),

  // Configuration errors
  'auth/invalid-api-key': i18n.t('errors.auth.invalidApiKey'),
  'auth/app-deleted': i18n.t('errors.auth.appDeleted'),
  'auth/app-not-authorized': i18n.t('errors.auth.appNotAuthorized'),

  // Popup/Redirect errors
  'auth/popup-closed-by-user': i18n.t('errors.auth.popupClosed'),
  'auth/popup-blocked': i18n.t('errors.auth.popupBlocked'),
  'auth/redirect-cancelled-by-user': i18n.t('errors.auth.redirectCancelled'),

  // Provider errors
  'auth/provider-already-linked': i18n.t('errors.auth.providerAlreadyLinked'),
  'auth/credential-already-in-use': i18n.t('errors.auth.credentialInUse'),

  // Weak password
  'auth/weak-password': i18n.t('errors.auth.weakPassword'),

  // Operation not allowed
  'auth/operation-not-allowed': i18n.t('errors.auth.operationNotAllowed'),
};

/**
 * Firestore error codes mapped to user-friendly messages
 */
export const FIRESTORE_ERROR_MESSAGES: Record<string, string> = {
  'permission-denied': i18n.t('errors.firestore.permissionDenied'),
  'not-found': i18n.t('errors.firestore.notFound'),
  'already-exists': i18n.t('errors.firestore.alreadyExists'),
  'resource-exhausted': i18n.t('errors.firestore.resourceExhausted'),
  'failed-precondition': i18n.t('errors.firestore.failedPrecondition'),
  aborted: i18n.t('errors.firestore.aborted'),
  'out-of-range': i18n.t('errors.firestore.outOfRange'),
  unimplemented: i18n.t('errors.firestore.unimplemented'),
  internal: i18n.t('errors.firestore.internal'),
  unavailable: i18n.t('errors.firestore.unavailable'),
  'data-loss': i18n.t('errors.firestore.dataLoss'),
  unauthenticated: i18n.t('errors.firestore.unauthenticated'),
  'deadline-exceeded': i18n.t('errors.firestore.deadlineExceeded'),
  cancelled: i18n.t('errors.firestore.cancelled'),
  'invalid-argument': i18n.t('errors.firestore.invalidArgument'),
};

/**
 * Storage error codes mapped to user-friendly messages
 */
export const STORAGE_ERROR_MESSAGES: Record<string, string> = {
  'storage/unknown': i18n.t('errors.storage.unknown'),
  'storage/object-not-found': i18n.t('errors.storage.objectNotFound'),
  'storage/bucket-not-found': i18n.t('errors.storage.bucketNotFound'),
  'storage/project-not-found': i18n.t('errors.storage.projectNotFound'),
  'storage/quota-exceeded': i18n.t('errors.storage.quotaExceeded'),
  'storage/unauthenticated': i18n.t('errors.storage.unauthenticated'),
  'storage/unauthorized': i18n.t('errors.storage.unauthorized'),
  'storage/retry-limit-exceeded': i18n.t('errors.storage.retryLimitExceeded'),
  'storage/invalid-checksum': i18n.t('errors.storage.invalidChecksum'),
  'storage/canceled': i18n.t('errors.storage.canceled'),
  'storage/invalid-event-name': i18n.t('errors.storage.invalidEventName'),
  'storage/invalid-url': i18n.t('errors.storage.invalidUrl'),
  'storage/invalid-argument': i18n.t('errors.storage.invalidArgument'),
  'storage/no-default-bucket': i18n.t('errors.storage.noDefaultBucket'),
  'storage/cannot-slice-blob': i18n.t('errors.storage.cannotSliceBlob'),
  'storage/server-file-wrong-size': i18n.t('errors.storage.serverFileWrongSize'),
};

/**
 * Get user-friendly error message for Firebase error code
 */
export function getFirebaseErrorMessage(code: string): string {
  // Check auth errors
  if (code in FIREBASE_AUTH_ERROR_MESSAGES) {
    return FIREBASE_AUTH_ERROR_MESSAGES[code];
  }

  // Check Firestore errors
  if (code in FIRESTORE_ERROR_MESSAGES) {
    return FIRESTORE_ERROR_MESSAGES[code];
  }

  // Check storage errors
  if (code in STORAGE_ERROR_MESSAGES) {
    return STORAGE_ERROR_MESSAGES[code];
  }

  // Fallback to generic error message
  return i18n.t('errors.generic.message');
}

/**
 * Check if error code is a network-related error
 */
export function isNetworkError(code: string): boolean {
  return code === 'auth/network-request-failed' || code === 'unavailable' || code === 'deadline-exceeded';
}

/**
 * Check if error requires user re-authentication
 */
export function requiresReauth(code: string): boolean {
  return code === 'auth/requires-recent-login' || code === 'auth/user-token-expired';
}

/**
 * Check if error is due to rate limiting
 */
export function isRateLimited(code: string): boolean {
  return code === 'auth/too-many-requests' || code === 'resource-exhausted';
}

/**
 * Get appropriate retry delay for rate-limited errors (in milliseconds)
 */
export function getRetryDelay(code: string): number {
  if (isRateLimited(code)) {
    return 60000; // 1 minute
  }
  if (isNetworkError(code)) {
    return 3000; // 3 seconds
  }
  return 1000; // 1 second default
}
