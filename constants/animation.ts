/**
 * Animation and UI timing constants
 * Consistent animation durations and easing curves
 */

export const AnimationDurations = {
  // Micro-interactions
  INSTANT: 0,
  VERY_FAST: 100,
  FAST: 150,
  NORMAL: 200,
  MEDIUM: 300,
  SLOW: 500,
  VERY_SLOW: 800,

  // Specific animations
  BUTTON_PRESS: 100,
  TOAST_SHOW: 200,
  MODAL_OPEN: 300,
  SCREEN_TRANSITION: 250,
  TAB_SWITCH: 150,
  LOADING_FADE: 200,

  // Long animations
  SKELETON_SHIMMER: 1500,
  PULL_REFRESH: 400,
  SWIPE_ACTION: 200,
} as const;

export const EasingCurves = {
  // Standard curves
  LINEAR: 'linear',
  EASE: 'ease',
  EASE_IN: 'easeIn',
  EASE_OUT: 'easeOut',
  EASE_IN_OUT: 'easeInOut',

  // Custom curves for React Native Reanimated
  SPRING_CONFIG: {
    damping: 15,
    stiffness: 150,
  },
  SMOOTH_SPRING: {
    damping: 20,
    stiffness: 100,
  },
  BOUNCY_SPRING: {
    damping: 10,
    stiffness: 200,
  },
} as const;

export const UIConstants = {
  // Spacing (follows 8px grid system)
  SPACING_XS: 4,
  SPACING_SM: 8,
  SPACING_MD: 16,
  SPACING_LG: 24,
  SPACING_XL: 32,
  SPACING_XXL: 40,
  SPACING_XXXL: 48,

  // Border radius
  BORDER_RADIUS_SM: 4,
  BORDER_RADIUS_MD: 8,
  BORDER_RADIUS_LG: 12,
  BORDER_RADIUS_XL: 16,
  BORDER_RADIUS_FULL: 9999,

  // Touch targets (minimum 44x44 points)
  MIN_TOUCH_TARGET: 44,
  COMFORTABLE_TOUCH_TARGET: 48,

  // Z-index layers
  Z_INDEX_MODAL: 1000,
  Z_INDEX_TOAST: 2000,
  Z_INDEX_TOOLTIP: 3000,
  Z_INDEX_LOADING: 4000,

  // Shadow depths
  SHADOW_LIGHT: 2,
  SHADOW_MEDIUM: 4,
  SHADOW_HEAVY: 8,
  SHADOW_MAX: 16,
} as const;

export const HapticPatterns = {
  LIGHT: 'light',
  MEDIUM: 'medium',
  HEAVY: 'heavy',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
  SELECTION: 'selection',
} as const;
