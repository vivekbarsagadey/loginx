/**
 * Extended storage keys used throughout the app
 * Centralized to prevent typos and conflicts
 * Note: Basic storage keys are in constants/storage.ts
 * This file contains additional keys with @ prefixes for AsyncStorage
 */

export const StorageKeysExtended = {
  // Authentication (AsyncStorage)
  AUTH_STATE: '@LoginX:auth_state',
  AUTH_USER: '@LoginX:auth_user',
  AUTH_TIMESTAMP: '@LoginX:auth_timestamp',

  // Authentication (SecureStore - encrypted)
  AUTH_TOKEN_SECURE: 'auth_token',
  BIOMETRIC_PUBLIC_KEY: 'biometric_public_key',
  TWO_FACTOR_SECRET: 'two_factor_secret',

  // Onboarding
  ONBOARDING_COMPLETED: '@LoginX:onboarding_completed',
  ONBOARDING_PERMISSIONS: '@LoginX:onboarding_permissions',
  ONBOARDING_ANALYTICS: '@LoginX:onboarding_analytics',

  // Settings
  SETTINGS_THEME: '@LoginX:settings_theme',
  SETTINGS_LANGUAGE: '@LoginX:settings_language',
  SETTINGS_TEXT_SIZE: '@LoginX:settings_text_size',
  SETTINGS_NOTIFICATIONS: '@LoginX:settings_notifications',
  SETTINGS_SECURITY: '@LoginX:settings_security',
  SETTINGS_APP: '@LoginX:settings_app',
  SETTINGS_PRIVACY: '@LoginX:settings_privacy',

  // Security
  BIOMETRIC_ENABLED: '@LoginX:biometric_enabled',
  TWO_FACTOR_ENABLED: '@LoginX:two_factor_enabled',
  TWO_FACTOR_BACKUP_CODES: '@LoginX:two_factor_backup_codes',
  LOGIN_ATTEMPTS: '@LoginX:login_attempts',
  AUTO_LOCK_SETTINGS: '@LoginX:auto_lock_settings',
  SECURITY_NOTIFICATIONS: '@LoginX:security_notifications',

  // Pending data
  PENDING_PROFILE: '@LoginX:pending_profile',

  // Cache
  CACHE_PREFIX: '@LoginX:cache:',

  // Permissions
  PERMISSION_CAMERA: '@LoginX:permission:camera',
  PERMISSION_MEDIA_LIBRARY: '@LoginX:permission:media_library',
  PERMISSION_LOCATION: '@LoginX:permission:location',
  PERMISSION_NOTIFICATIONS: '@LoginX:permission:notifications',

  // Sessions
  ACTIVE_SESSIONS: '@LoginX:active_sessions',
  SESSION_TOKEN: '@LoginX:session_token',

  // Notifications
  NOTIFICATION_COUNT: '@LoginX:notification_count',
  NOTIFICATION_SETTINGS: '@LoginX:notification_settings',

  // Flow state
  FLOW_STATE_PREFIX: '@LoginX:flow:',

  // Local-first
  LOCAL_DATA_PREFIX: '@LoginX:local:',
  PENDING_OPERATIONS: '@LoginX:pending_operations',
} as const;

export type StorageKeyExtended = (typeof StorageKeysExtended)[keyof typeof StorageKeysExtended];

/**
 * Helper to generate cache keys
 */
export function getCacheKey(key: string): string {
  return `${StorageKeysExtended.CACHE_PREFIX}${key}`;
}

/**
 * Helper to generate flow state keys
 */
export function getFlowStateKey(flowId: string): string {
  return `${StorageKeysExtended.FLOW_STATE_PREFIX}${flowId}`;
}

/**
 * Helper to generate local data keys
 */
export function getLocalDataKey(key: string): string {
  return `${StorageKeysExtended.LOCAL_DATA_PREFIX}${key}`;
}
