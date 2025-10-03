/**
 * Security-related constants
 * Authentication, biometric, and session management
 */

export const SecurityConstants = {
  // Session timeouts (in milliseconds)
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  REMEMBER_ME_DURATION: 30 * 24 * 60 * 60 * 1000, // 30 days
  AUTO_LOCK_TIMEOUT: 5 * 60 * 1000, // 5 minutes

  // Login attempt limits
  MAX_LOGIN_ATTEMPTS: 5,
  LOGIN_LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes

  // Password requirements
  PASSWORD_HISTORY_COUNT: 5, // Remember last 5 passwords

  // 2FA settings
  TWO_FA_CODE_LENGTH: 6,
  TWO_FA_CODE_VALIDITY: 30000, // 30 seconds
  BACKUP_CODES_COUNT: 10,

  // Biometric settings
  BIOMETRIC_RETRY_LIMIT: 3,
  BIOMETRIC_LOCKOUT_DURATION: 30000, // 30 seconds
} as const;

export const BiometricTypes = {
  FINGERPRINT: 'fingerprint',
  FACE_ID: 'faceId',
  TOUCH_ID: 'touchId',
  VOICE: 'voice',
  IRIS: 'iris',
} as const;

export const SecurityMessages = {
  BIOMETRIC_NOT_AVAILABLE: 'Biometric authentication is not available on this device',
  BIOMETRIC_NOT_ENROLLED: 'No biometric credentials are enrolled',
  BIOMETRIC_LOCKED_OUT: 'Too many failed attempts. Try again later.',
  SESSION_EXPIRED: 'Your session has expired. Please log in again.',
  ACCOUNT_LOCKED: 'Account temporarily locked due to multiple failed login attempts',
  PASSWORD_REUSED: "Please choose a password you haven't used recently",
  TWO_FA_REQUIRED: 'Two-factor authentication is required',
  TWO_FA_INVALID: 'Invalid two-factor authentication code',
} as const;
