/**
 * API and network-related constants
 * Centralized API configuration and network timeouts
 */

export const ApiConstants = {
  // Timeouts (in milliseconds)
  DEFAULT_TIMEOUT: 10000, // 10 seconds
  UPLOAD_TIMEOUT: 30000, // 30 seconds
  DOWNLOAD_TIMEOUT: 60000, // 60 seconds
  WEBSOCKET_TIMEOUT: 5000, // 5 seconds

  // Retry configuration
  MAX_RETRIES: 3,
  INITIAL_DELAY: 1000, // 1 second
  MAX_DELAY: 10000, // 10 seconds
  BACKOFF_MULTIPLIER: 2,

  // Status codes
  HTTP_OK: 200,
  HTTP_CREATED: 201,
  HTTP_BAD_REQUEST: 400,
  HTTP_UNAUTHORIZED: 401,
  HTTP_FORBIDDEN: 403,
  HTTP_NOT_FOUND: 404,
  HTTP_INTERNAL_SERVER_ERROR: 500,

  // Request limits
  MAX_UPLOAD_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_CONCURRENT_REQUESTS: 5,
} as const;

export const ApiEndpoints = {
  // Auth endpoints
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  VERIFY_EMAIL: '/auth/verify-email',
  VERIFY_PHONE: '/auth/verify-phone',

  // User endpoints
  USER_PROFILE: '/user/profile',
  USER_SETTINGS: '/user/settings',
  USER_SESSIONS: '/user/sessions',
  USER_DELETE: '/user/delete',

  // Security endpoints
  ENABLE_2FA: '/security/2fa/enable',
  DISABLE_2FA: '/security/2fa/disable',
  VERIFY_2FA: '/security/2fa/verify',
  BACKUP_CODES: '/security/2fa/backup-codes',

  // Misc endpoints
  FEEDBACK: '/feedback',
  SUPPORT: '/support',
  HEALTH_CHECK: '/health',
} as const;
