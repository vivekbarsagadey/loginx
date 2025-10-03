/**
 * Storage and device-related constants
 * File storage, secure storage keys, and device limits
 */

export const StorageKeys = {
  // User preferences
  THEME_PREFERENCE: 'theme_preference',
  LANGUAGE_PREFERENCE: 'language_preference',
  TEXT_SIZE_PREFERENCE: 'text_size_preference',

  // App state
  ONBOARDING_COMPLETED: 'onboarding_completed',
  APP_VERSION: 'app_version',
  LAST_LOGIN: 'last_login',

  // Notification settings
  PUSH_NOTIFICATIONS: 'push_notifications',
  EMAIL_NOTIFICATIONS: 'email_notifications',
  MARKETING_NOTIFICATIONS: 'marketing_notifications',

  // Cache and temporary data
  CACHE_VERSION: 'cache_version',
  TEMP_USER_DATA: 'temp_user_data',
} as const;

export const SecureStorageKeys = {
  // Biometric settings
  BIOMETRIC_ENABLED: 'biometric_enabled',
  BIOMETRIC_TYPE: 'biometric_type',

  // 2FA settings
  TWO_FA_ENABLED: '2fa_enabled',
  TWO_FA_BACKUP_CODES: '2fa_backup_codes',
  TWO_FA_SECRET: '2fa_secret',

  // Security settings
  AUTO_LOCK_ENABLED: 'auto_lock_enabled',
  AUTO_LOCK_TIMEOUT: 'auto_lock_timeout',
  SECURITY_NOTIFICATIONS: 'security_notifications',
  LOGIN_ATTEMPTS: 'login_attempts',

  // Session data
  REFRESH_TOKEN: 'refresh_token',
  DEVICE_ID: 'device_id',
} as const;

export const FileConstants = {
  // File size limits (in bytes)
  MAX_AVATAR_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_DOCUMENT_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB

  // Image dimensions
  AVATAR_SIZE: 200, // 200x200 pixels
  THUMBNAIL_SIZE: 100, // 100x100 pixels

  // Supported file types
  SUPPORTED_IMAGE_TYPES: ['jpg', 'jpeg', 'png', 'webp'],
  SUPPORTED_DOCUMENT_TYPES: ['pdf', 'doc', 'docx', 'txt'],
} as const;

export const DeviceConstants = {
  // Screen size breakpoints
  SMALL_SCREEN: 480,
  MEDIUM_SCREEN: 768,
  LARGE_SCREEN: 1024,

  // Performance thresholds
  LOW_MEMORY_THRESHOLD: 1024 * 1024 * 1024, // 1GB
  SLOW_DEVICE_THRESHOLD: 2000, // 2 seconds

  // Battery optimization
  LOW_BATTERY_THRESHOLD: 20, // 20%
  CRITICAL_BATTERY_THRESHOLD: 10, // 10%
} as const;
