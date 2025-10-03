/**
 * Cache-related constants
 * Centralized cache durations and keys
 */

export const CacheConstants = {
  // Cache durations (in milliseconds)
  DEFAULT_DURATION: 5 * 60 * 1000, // 5 minutes
  SHORT_DURATION: 1 * 60 * 1000, // 1 minute
  MEDIUM_DURATION: 15 * 60 * 1000, // 15 minutes
  LONG_DURATION: 60 * 60 * 1000, // 1 hour
  PERSISTENT_DURATION: 24 * 60 * 60 * 1000, // 24 hours

  // Cache limits
  MAX_ENTRIES: 1000,
  MAX_MEMORY_SIZE: 50 * 1024 * 1024, // 50MB

  // Cache prefixes
  USER_PREFIX: 'user-',
  PROFILE_PREFIX: 'user-profile-',
  SETTINGS_PREFIX: 'user-settings-',
  SESSION_PREFIX: 'session-',
  API_PREFIX: 'api-',
} as const;

export const CacheKeys = {
  USER_PROFILE: 'user-profile',
  USER_SETTINGS: 'user-settings',
  APP_SETTINGS: 'app-settings',
  THEME_PREFERENCE: 'theme-preference',
  LANGUAGE_PREFERENCE: 'language-preference',
  ONBOARDING_STATUS: 'onboarding-status',
  BIOMETRIC_STATUS: 'biometric-status',
  TWO_FA_STATUS: '2fa-status',
} as const;
