/**
 * Layout constants for consistent UI across all screens
 * Ensures pixel-perfect, stable UI on both iOS and Android
 */

import { Dimensions, Platform } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * Spacing system based on 8px grid
 * Use these constants instead of hardcoded values
 */
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  xxxl: 48,
  huge: 64,
} as const;

/**
 * Border radius values for consistency
 */
export const BorderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

/**
 * Touch target sizes (minimum 44x44 points per Apple HIG)
 */
export const TouchTarget = {
  minimum: 44,
  comfortable: 48,
  large: 56,
} as const;

/**
 * Font sizes with proper line heights
 */
export const Typography = {
  display: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700' as const,
  },
  h1: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '700' as const,
  },
  h2: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '600' as const,
  },
  h3: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600' as const,
  },
  subtitle1: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '500' as const,
  },
  subtitle2: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500' as const,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400' as const,
  },
  bodyBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600' as const,
  },
  button: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500' as const,
    letterSpacing: 1.25,
  },
  caption: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400' as const,
  },
  overline: {
    fontSize: 10,
    lineHeight: 16,
    fontWeight: '500' as const,
    letterSpacing: 1.5,
    textTransform: 'uppercase' as const,
  },
  label: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500' as const,
  },
  small: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400' as const,
  },
} as const;

/**
 * Shadow/Elevation system for both platforms
 *
 * NOTE: These shadow definitions DO NOT include shadowColor intentionally.
 * Use the `getShadow()` utility from style-utils.ts instead, which provides
 * theme-aware shadow colors that adapt to light/dark mode.
 *
 * @example
 * import { getShadow } from '@/constants/style-utils';
 *
 * const styles = StyleSheet.create({
 *   card: {
 *     ...getShadow('md', colorScheme),
 *   },
 * });
 */
export const Shadow = {
  none: {
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  md: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3.0,
    elevation: 3,
  },
  lg: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5.0,
    elevation: 5,
  },
  xl: {
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10.0,
    elevation: 8,
  },
} as const;

/**
 * Screen dimensions and responsive breakpoints
 */
export const Screen = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  isSmallDevice: SCREEN_WIDTH < 375,
  isMediumDevice: SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 414,
  isLargeDevice: SCREEN_WIDTH >= 414,
  isIOS: Platform.OS === 'ios',
  isAndroid: Platform.OS === 'android',
} as const;

/**
 * Keyboard avoiding view offsets for different platforms
 */
export const KeyboardOffset = {
  ios: 0,
  android: 24,
} as const;

/**
 * Z-index layers for proper stacking
 */
export const ZIndex = {
  background: -1,
  base: 0,
  dropdown: 100,
  sticky: 200,
  overlay: 300,
  modal: 400,
  popover: 500,
  toast: 600,
  tooltip: 700,
} as const;

/**
 * Standard container padding
 */
export const Container = {
  padding: Spacing.md,
  paddingHorizontal: Spacing.md,
  paddingVertical: Spacing.lg,
} as const;

/**
 * Input field specifications
 */
export const InputField = {
  height: TouchTarget.comfortable,
  borderRadius: BorderRadius.md,
  paddingHorizontal: Spacing.md,
  borderWidth: 1,
  fontSize: Typography.body.fontSize,
} as const;

/**
 * Button specifications
 */
export const Button = {
  height: TouchTarget.comfortable,
  borderRadius: BorderRadius.md,
  paddingHorizontal: Spacing.lg,
  minWidth: 120,
  fontSize: Typography.bodyBold.fontSize,
} as const;
