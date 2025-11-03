/**
 * Timing constants used throughout the app
 * Centralized for consistency and easy adjustment
 */

export const TimingConstants = {
  // Animation delays
  SHORT_DELAY: 300,
  MODAL_CLOSE_DELAY: 300,
  NAVIGATION_DELAY: 100,
  FADE_ANIMATION: 200,
  SLIDE_ANIMATION: 250,

  // Network timeouts
  NETWORK_TIMEOUT: 5000,
  LONG_NETWORK_TIMEOUT: 10000,
  FIRESTORE_INIT_TIMEOUT: 10000,
  REMOTE_FETCH_TIMEOUT: 5000,

  // Input debouncing
  DEBOUNCE_INPUT: 300,
  DEBOUNCE_SEARCH: 500,
  SEARCH_BAR_BLUR_DELAY: 200,

  // Auto-hide/dismiss
  TOAST_DURATION: 3000,
  SNACKBAR_DURATION: 5000,
  SUCCESS_ANIMATION_DURATION: 2000,
  CLIPBOARD_RESET_DELAY: 2000,

  // Retry delays
  RETRY_SHORT: 1000,
  RETRY_MEDIUM: 3000,
  RETRY_LONG: 5000,

  // Cleanup intervals
  CLEANUP_INTERVAL: 5 * 60 * 1000, // 5 minutes
  STALE_CHECK_INTERVAL: 60 * 1000, // 1 minute
  FIRESTORE_STATUS_CHECK_INTERVAL: 5000, // 5 seconds
  MONITORING_REFRESH_INTERVAL: 30000, // 30 seconds

  // Biometric delays
  BIOMETRIC_AUTH_DELAY: 100,

  // Verification/Resend intervals
  VERIFICATION_RESEND_INTERVAL: 60, // 60 seconds
  VERIFICATION_TIMER_INTERVAL: 1000, // 1 second

  // Action delays
  ACTION_STEP_AUTO_ADVANCE: 2000, // 2 seconds
} as const;

export type TimingConstant = (typeof TimingConstants)[keyof typeof TimingConstants];
