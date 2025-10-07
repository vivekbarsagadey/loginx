/**
 * Application route constants
 * Centralized route paths to avoid typos and maintain consistency
 */

export const Routes = {
  // Auth routes
  AUTH: {
    WELCOME: '/(auth)/welcome',
    LOGIN: '/(auth)/login',
    REGISTER: '/(auth)/register',
    REGISTER_STEP_1: '/(auth)/register/step-1',
    REGISTER_STEP_2: '/(auth)/register/step-2',
    REGISTER_STEP_3: '/(auth)/register/step-3',
    FORGOT_PASSWORD: '/(auth)/forgot-password',
    VERIFY_EMAIL: '/(auth)/verify-email',
  },

  // Tab routes
  TABS: {
    HOME: '/(tabs)',
    ITEMS: '/(tabs)/items',
    SETTINGS: '/(tabs)/settings',
  },

  // Onboarding
  ONBOARDING: {
    INDEX: '/onboarding',
  },

  // Profile routes
  PROFILE: {
    EDIT: '/profile/edit',
    UPDATE_EMAIL: '/profile/update-email',
  },

  // Security routes
  SECURITY: {
    CHANGE_PASSWORD: '/security/change-password',
    TWO_FACTOR: '/security/2fa',
    SESSIONS: '/security/sessions',
  },

  // Settings routes
  SETTINGS: {
    THEME: '/settings/theme',
    LANGUAGE: '/settings/language',
    NOTIFICATIONS: '/settings/notifications',
    TEXT_SIZE: '/settings/text-size',
  },

  // Notifications
  NOTIFICATIONS: {
    CENTER: '/notifications',
  },

  // Legal routes
  LEGAL: {
    TERMS: '/legal/terms',
    PRIVACY: '/legal/privacy',
    LICENSE: '/legal/license',
  },

  // About routes
  ABOUT: {
    WHATS_NEW: '/about/whats-new',
  },

  // Other
  HELP: '/help',
  SUPPORT: '/support',
  FEEDBACK: '/feedback',
  PRIVACY_STANDALONE: '/privacy',
  MODAL: '/modal',
  NOT_FOUND: '+not-found',
} as const;
