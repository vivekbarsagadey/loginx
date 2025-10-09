/**
 * Typography Utilities
 * Helper functions for working with text and fonts
 *
 * Features:
 * - Dynamic Type support (iOS)
 * - Font scaling with limits
 * - Line height calculation
 * - Letter spacing helpers
 * - Text truncation utilities
 * - Responsive font sizing
 */

import { FontFamily, FontWeight, getLineHeight, getScaledFontSize, Typography } from '@/constants/layout';
import { Platform, type TextStyle } from 'react-native';

/**
 * Get platform-specific font family
 *
 * @param weight - Font weight ('regular' | 'medium' | 'bold')
 * @returns Platform-appropriate font family
 *
 * @example
 * const fontFamily = getPlatformFontFamily('bold');
 * // iOS: 'System'
 * // Android: 'Roboto-Bold'
 */
export function getPlatformFontFamily(weight: 'regular' | 'medium' | 'bold' = 'regular'): string {
  return FontFamily[weight];
}

/**
 * Create text style with dynamic type support
 * Scales font size based on user's accessibility settings
 *
 * @param fontSize - Base font size
 * @param fontScale - System font scale (from useWindowDimensions)
 * @param options - Additional style options
 * @returns Complete text style object
 *
 * @example
 * import { useWindowDimensions } from 'react-native';
 *
 * const { fontScale } = useWindowDimensions();
 * const textStyle = createScaledTextStyle(16, fontScale, {
 *   weight: 'medium',
 *   maxScale: 1.5,
 * });
 */
export function createScaledTextStyle(
  fontSize: number,
  fontScale: number = 1,
  options: {
    weight?: 'regular' | 'medium' | 'bold';
    maxScale?: number;
    lineHeightRatio?: number;
    letterSpacing?: number;
  } = {}
): TextStyle {
  const { weight = 'regular', maxScale = 1.3, lineHeightRatio = 1.5, letterSpacing = 0 } = options;

  const scaledFontSize = getScaledFontSize(fontSize, fontScale, maxScale);
  const calculatedLineHeight = getLineHeight(scaledFontSize, lineHeightRatio);

  return {
    fontSize: scaledFontSize,
    lineHeight: calculatedLineHeight,
    fontFamily: getPlatformFontFamily(weight),
    fontWeight: weight === 'regular' ? FontWeight.regular : weight === 'medium' ? FontWeight.medium : FontWeight.bold,
    letterSpacing,
  };
}

/**
 * Get responsive font size based on screen width
 * Useful for adapting text to different device sizes
 *
 * @param baseSize - Font size for medium devices (375-414px width)
 * @param screenWidth - Current screen width
 * @returns Adjusted font size
 *
 * @example
 * import { useWindowDimensions } from 'react-native';
 *
 * const { width } = useWindowDimensions();
 * const fontSize = getResponsiveFontSize(16, width);
 */
export function getResponsiveFontSize(baseSize: number, screenWidth: number): number {
  // Small devices (< 375px): scale down
  if (screenWidth < 375) {
    return Math.round(baseSize * 0.9);
  }
  // Large devices (>= 414px): scale up slightly
  if (screenWidth >= 414) {
    return Math.round(baseSize * 1.05);
  }
  // Medium devices: use base size
  return baseSize;
}

/**
 * Calculate optimal letter spacing for given font size
 * Larger text needs tighter spacing, smaller text needs wider spacing
 *
 * @param fontSize - Font size in pixels
 * @returns Recommended letter spacing
 *
 * @example
 * const spacing = getLetterSpacing(32); // -0.4 (tight for large text)
 * const spacing = getLetterSpacing(12); // 0.4 (wide for small text)
 */
export function getLetterSpacing(fontSize: number): number {
  if (fontSize >= 32) {
    return -0.5; // Display/Title
  }
  if (fontSize >= 24) {
    return -0.3; // Heading
  }
  if (fontSize >= 20) {
    return -0.2; // Subheading
  }
  if (fontSize >= 16) {
    return 0.15; // Body
  }
  if (fontSize >= 14) {
    return 0.25; // Body Small/Button
  }
  return 0.4; // Caption/Label
}

/**
 * Get text truncation style for number of lines
 *
 * @param numberOfLines - Maximum lines to display
 * @returns Style object with truncation properties
 *
 * @example
 * <Text style={[styles.text, getTruncationStyle(2)]}>
 *   Long text that will be truncated after two lines...
 * </Text>
 */
export function getTruncationStyle(numberOfLines: number = 1): TextStyle {
  return {
    numberOfLines,
    ellipsizeMode: 'tail',
  } as TextStyle;
}

/**
 * Combine typography preset with custom overrides
 * Useful for creating variations of existing type styles
 *
 * @param preset - Typography preset name
 * @param overrides - Custom style overrides
 * @returns Combined text style
 *
 * @example
 * const customTitle = combineTypography('title', {
 *   color: '#FF0000',
 *   textAlign: 'center',
 * });
 */
export function combineTypography(preset: keyof typeof Typography, overrides?: TextStyle): TextStyle {
  return {
    ...Typography[preset],
    ...overrides,
  };
}

/**
 * Text alignment utilities
 */
export const textAlign = {
  left: { textAlign: 'left' } as TextStyle,
  center: { textAlign: 'center' } as TextStyle,
  right: { textAlign: 'right' } as TextStyle,
  justify: { textAlign: 'justify' } as TextStyle,
};

/**
 * Text decoration utilities
 */
export const textDecoration = {
  underline: { textDecorationLine: 'underline' } as TextStyle,
  lineThrough: { textDecorationLine: 'line-through' } as TextStyle,
  none: { textDecorationLine: 'none' } as TextStyle,
};

/**
 * Text transform utilities
 */
export const textTransform = {
  uppercase: { textTransform: 'uppercase' } as TextStyle,
  lowercase: { textTransform: 'lowercase' } as TextStyle,
  capitalize: { textTransform: 'capitalize' } as TextStyle,
  none: { textTransform: 'none' } as TextStyle,
};

/**
 * Get monospace font family (for code, numbers)
 *
 * @returns Platform-specific monospace font
 *
 * @example
 * <Text style={{ fontFamily: getMonospaceFont() }}>
 *   1234567890
 * </Text>
 */
export function getMonospaceFont(): string {
  return Platform.select({
    ios: 'Courier',
    android: 'monospace',
    default: 'monospace',
  }) as string;
}

/**
 * Create style for code/monospace text
 *
 * @param fontSize - Font size (default 14)
 * @returns Style object for code text
 *
 * @example
 * <Text style={getCodeTextStyle(12)}>
 *   const code = 'example';
 * </Text>
 */
export function getCodeTextStyle(fontSize: number = 14): TextStyle {
  return {
    fontFamily: getMonospaceFont(),
    fontSize,
    lineHeight: fontSize * 1.6,
    letterSpacing: 0,
  };
}

/**
 * Accessibility font sizing
 * Ensures minimum font size for readability
 *
 * @param fontSize - Desired font size
 * @returns Font size clamped to minimum 12px
 *
 * @example
 * const size = getAccessibleFontSize(10); // Returns 12 (minimum)
 */
export function getAccessibleFontSize(fontSize: number): number {
  const MIN_FONT_SIZE = 12;
  return Math.max(fontSize, MIN_FONT_SIZE);
}

/**
 * Check if text will likely overflow
 * Rough estimation based on character count and width
 *
 * @param text - Text content
 * @param fontSize - Font size
 * @param containerWidth - Container width in pixels
 * @returns Whether text will likely overflow
 *
 * @example
 * const willOverflow = willTextOverflow('Long text here', 16, 200);
 * if (willOverflow) {
 *   // Apply truncation
 * }
 */
export function willTextOverflow(text: string, fontSize: number, containerWidth: number): boolean {
  // Rough estimation: average character width is ~0.6 of font size
  const avgCharWidth = fontSize * 0.6;
  const estimatedWidth = text.length * avgCharWidth;
  return estimatedWidth > containerWidth;
}

/**
 * Typography presets for common UI patterns
 */
export const TypographyPresets = {
  /**
   * Hero section on landing pages
   */
  hero: {
    ...Typography.display,
    textAlign: 'center' as const,
  },

  /**
   * Page title with standard spacing
   */
  pageTitle: {
    ...Typography.title,
    marginBottom: 8,
  },

  /**
   * Section header with spacing
   */
  sectionHeader: {
    ...Typography.heading,
    marginBottom: 12,
    marginTop: 24,
  },

  /**
   * Card title
   */
  cardTitle: {
    ...Typography.subtitle1,
    marginBottom: 4,
  },

  /**
   * Card description
   */
  cardDescription: {
    ...Typography.body,
    marginBottom: 8,
  },

  /**
   * Form label
   */
  formLabel: {
    ...Typography.label,
    marginBottom: 4,
  },

  /**
   * Error message
   */
  errorMessage: {
    ...Typography.caption,
    marginTop: 4,
  },

  /**
   * Helper text
   */
  helperText: {
    ...Typography.caption,
    marginTop: 4,
    opacity: 0.7,
  },

  /**
   * Link text
   */
  link: {
    ...Typography.body,
    textDecorationLine: 'underline' as const,
  },

  /**
   * Badge text
   */
  badge: {
    ...Typography.label,
    letterSpacing: 0.5,
  },
} as const;

/**
 * Export commonly used utilities
 */
export const typography = {
  align: textAlign,
  decoration: textDecoration,
  transform: textTransform,
  presets: TypographyPresets,
  monospace: getMonospaceFont,
  code: getCodeTextStyle,
  truncate: getTruncationStyle,
  scale: createScaledTextStyle,
  responsive: getResponsiveFontSize,
  accessible: getAccessibleFontSize,
};

export default typography;
