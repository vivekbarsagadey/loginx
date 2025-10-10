/**
 * Layout constants for consistent UI across all screens
 * Ensures pixel-perfect, stable UI on both iOS and Android
 */

import { Dimensions, Platform } from 'react-native';

/**
 * Platform-specific font families
 * iOS uses San Francisco (system default)
 * Android uses Roboto (system default)
 */
export const FontFamily = {
  regular: Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'System',
  }),
  medium: Platform.select({
    ios: 'System',
    android: 'Roboto-Medium',
    default: 'System',
  }),
  bold: Platform.select({
    ios: 'System',
    android: 'Roboto-Bold',
    default: 'System',
  }),
  // iOS San Francisco font weights are handled through fontWeight
  // Android Roboto requires specific font family names
} as const;

/**
 * Font weights that work consistently across platforms
 * iOS: numeric weights (100-900)
 * Android: string weights or specific font family names
 */
export const FontWeight = {
  light: '300' as const,
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
} as const;

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
 * Icon sizes for consistent icon usage
 */
export const IconSize = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 28,
  xxl: 32,
  xxxl: 48,
  huge: 64,
} as const;

/**
 * Typography system with platform-specific fonts
 *
 * Font Families:
 * - iOS: San Francisco (system default) - Clean, legible at all sizes
 * - Android: Roboto - Designed for digital interfaces
 *
 * Type Scale: Complete hierarchy from hero text to small labels
 * - Display: 40px - Hero/landing screens, marketing
 * - Title (H1): 32px - Page titles, main headings
 * - Heading (H2): 28px - Section headers
 * - Subheading (H3): 24px - Subsection headers
 * - Subtitle1: 20px - Emphasized content, list headers
 * - Subtitle2: 18px - Secondary headers
 * - Body: 16px - Main content (optimal for readability)
 * - Body Small: 14px - Dense content
 * - Caption: 12px - Supporting text, metadata
 * - Label: 10px - Form labels, tiny text
 *
 * Line Heights: 1.4-1.6 for body text, 1.2-1.3 for headings
 * Font Weights: Light (300), Regular (400), Medium (500), Semibold (600), Bold (700)
 *
 * @example
 * // Using typography in styles
 * import { Typography, FontFamily } from '@/constants/layout';
 *
 * const styles = StyleSheet.create({
 *   title: {
 *     ...Typography.title,
 *     fontFamily: FontFamily.bold,
 *   },
 *   body: Typography.body,
 * });
 *
 * // Or use ThemedText component
 * <ThemedText type="title">My Title</ThemedText>
 */
export const Typography = {
  // Display - Hero text (40px)
  display: {
    fontSize: 40,
    lineHeight: 48,
    fontWeight: FontWeight.bold,
    fontFamily: FontFamily.bold,
    letterSpacing: -0.5, // Tighter spacing for large text
  },
  // Title/H1 - Page titles (32px)
  title: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: FontWeight.bold,
    fontFamily: FontFamily.bold,
    letterSpacing: -0.4,
  },
  // Heading/H2 - Section headers (28px)
  heading: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: FontWeight.semibold,
    fontFamily: FontFamily.bold,
    letterSpacing: -0.3,
  },
  // Subheading/H3 - Subsection headers (24px)
  subheading: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: FontWeight.semibold,
    fontFamily: FontFamily.medium,
    letterSpacing: -0.2,
  },
  // Subtitle1 - Emphasized content (20px)
  subtitle1: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: FontWeight.medium,
    fontFamily: FontFamily.medium,
    letterSpacing: 0,
  },
  // Subtitle2 - Secondary headers (18px)
  subtitle2: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: FontWeight.medium,
    fontFamily: FontFamily.medium,
    letterSpacing: 0,
  },
  // Body - Main content (16px) - Optimal for mobile readability
  body: {
    fontSize: 16,
    lineHeight: 24, // 1.5 ratio for excellent readability
    fontWeight: FontWeight.regular,
    fontFamily: FontFamily.regular,
    letterSpacing: 0.15,
  },
  // Body Bold - Emphasized body text (16px)
  bodyBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: FontWeight.semibold,
    fontFamily: FontFamily.medium,
    letterSpacing: 0.15,
  },
  // Body Small - Dense content (14px)
  bodySmall: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: FontWeight.regular,
    fontFamily: FontFamily.regular,
    letterSpacing: 0.25,
  },
  // Button - Button text (14px)
  button: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: FontWeight.medium,
    fontFamily: FontFamily.medium,
    letterSpacing: 1.25, // Wide spacing for buttons
  },
  // Caption - Supporting text (12px)
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: FontWeight.regular,
    fontFamily: FontFamily.regular,
    letterSpacing: 0.4,
  },
  // Label - Form labels, tiny text (10px)
  label: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: FontWeight.medium,
    fontFamily: FontFamily.medium,
    letterSpacing: 0.5,
  },
  // Overline - All caps labels (10px)
  overline: {
    fontSize: 10,
    lineHeight: 16,
    fontWeight: FontWeight.medium,
    fontFamily: FontFamily.medium,
    letterSpacing: 1.5,
    textTransform: 'uppercase' as const,
  },
  // Legacy aliases for backward compatibility
  h1: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: FontWeight.bold,
    fontFamily: FontFamily.bold,
  },
  h2: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: FontWeight.semibold,
    fontFamily: FontFamily.bold,
  },
  h3: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: FontWeight.semibold,
    fontFamily: FontFamily.medium,
  },
  small: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: FontWeight.regular,
    fontFamily: FontFamily.regular,
  },
} as const;

/**
 * Dynamic Type Support
 * Helps scale text sizes based on user's system font size preference
 *
 * @param baseSize - Base font size
 * @param maxScale - Maximum scale factor (default 1.3)
 * @returns Scaled font size
 *
 * @example
 * import { useWindowDimensions } from 'react-native';
 * import { getScaledFontSize } from '@/constants/layout';
 *
 * const { fontScale } = useWindowDimensions();
 * const fontSize = getScaledFontSize(16, fontScale);
 */
export const getScaledFontSize = (baseSize: number, fontScale: number = 1, maxScale: number = 1.3): number => {
  const scale = Math.min(fontScale, maxScale);
  return baseSize * scale;
};

/**
 * Line height calculator
 * Automatically calculates optimal line height for given font size
 *
 * @param fontSize - Font size in pixels
 * @param ratio - Line height ratio (default 1.5 for body text)
 * @returns Calculated line height
 *
 * @example
 * const lineHeight = getLineHeight(16); // Returns 24 (16 * 1.5)
 */
export const getLineHeight = (fontSize: number, ratio: number = 1.5): number => {
  return Math.round(fontSize * ratio);
};

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
