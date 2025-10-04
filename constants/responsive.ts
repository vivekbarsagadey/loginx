/**
 * Responsive design utilities for handling device rotation and extreme screen sizes
 * Ensures consistent layouts across all device types
 */

import { Dimensions, Platform, ScaledSize } from 'react-native';

/**
 * Breakpoints for responsive design
 */
export const Breakpoints = {
  small: 375,
  medium: 768,
  large: 1024,
  xlarge: 1440,
} as const;

/**
 * Device categories based on screen width
 */
export const getDeviceCategory = (width: number): 'phone' | 'tablet' | 'desktop' => {
  if (width < Breakpoints.medium) {
    return 'phone';
  }
  if (width < Breakpoints.large) {
    return 'tablet';
  }
  return 'desktop';
};

/**
 * Check if device is in landscape orientation
 */
export const isLandscape = (dimensions?: ScaledSize): boolean => {
  const { width, height } = dimensions || Dimensions.get('window');
  return width > height;
};

/**
 * Get responsive padding based on screen size
 */
export const getResponsivePadding = (width: number): number => {
  if (width < Breakpoints.small) {
    return 12; // Extra small devices
  }
  if (width < Breakpoints.medium) {
    return 16; // Phone
  }
  if (width < Breakpoints.large) {
    return 24; // Tablet
  }
  return 32; // Desktop
};

/**
 * Get responsive font scale based on screen size
 * Returns multiplier for base font sizes
 */
export const getResponsiveFontScale = (width: number): number => {
  if (width < Breakpoints.small) {
    return 0.9; // Smaller fonts on tiny screens
  }
  if (width < Breakpoints.medium) {
    return 1.0; // Standard phone
  }
  if (width < Breakpoints.large) {
    return 1.1; // Tablet
  }
  return 1.2; // Desktop
};

/**
 * Get maximum content width for different screen sizes
 * Prevents content from stretching too wide on large screens
 */
export const getMaxContentWidth = (width: number): number => {
  const category = getDeviceCategory(width);
  switch (category) {
    case 'phone':
      return width; // Use full width on phones
    case 'tablet':
      return Math.min(width * 0.85, 700); // Limit to 85% or 700px
    case 'desktop':
      return Math.min(width * 0.6, 1200); // Limit to 60% or 1200px
  }
};

/**
 * Get number of columns for grid layouts based on screen width
 */
export const getGridColumns = (width: number): number => {
  if (width < Breakpoints.small) {
    return 1;
  }
  if (width < Breakpoints.medium) {
    return 2;
  }
  if (width < Breakpoints.large) {
    return 3;
  }
  return 4;
};

/**
 * Utility to calculate responsive size
 * @param baseSize - Base size for phone in portrait
 * @param width - Current screen width
 */
export const getResponsiveSize = (baseSize: number, width: number): number => {
  const scale = width / 375; // 375 is baseline (iPhone X width)
  const newSize = baseSize * scale;
  return Math.round(newSize);
};

/**
 * Check if screen is very small (potential layout issues)
 */
export const isVerySmallScreen = (dimensions?: ScaledSize): boolean => {
  const { width, height } = dimensions || Dimensions.get('window');
  return width < 320 || height < 568; // iPhone SE 1st gen or smaller
};

/**
 * Check if device is tablet size
 */
export const isTablet = (dimensions?: ScaledSize): boolean => {
  const { width } = dimensions || Dimensions.get('window');
  return width >= Breakpoints.medium;
};

/**
 * Get safe minimum dimensions for interactive elements
 * Accounts for very small screens
 */
export const getSafeMinTouchTarget = (dimensions?: ScaledSize): number => {
  const { width } = dimensions || Dimensions.get('window');

  // On very small screens, allow slightly smaller touch targets
  if (width < 320) {
    return 40;
  }

  // Standard minimum touch target (iOS HIG, Android Material)
  return Platform.select({
    ios: 44,
    android: 48,
    default: 44,
  });
};

/**
 * Get responsive spacing multiplier
 */
export const getSpacingMultiplier = (width: number): number => {
  if (width < Breakpoints.small) {
    return 0.75; // Tighter spacing on small screens
  }
  if (width >= Breakpoints.large) {
    return 1.25; // More generous spacing on large screens
  }
  return 1.0; // Standard spacing
};

/**
 * Check if orientation change is supported and recommended
 */
export const shouldSupportRotation = (): boolean => {
  // Typically, we want to support rotation on tablets but can be restrictive on phones
  const { width } = Dimensions.get('window');
  return width >= Breakpoints.medium || Platform.OS === 'android';
};

/**
 * Get adaptive modal/sheet height based on content and screen size
 */
export const getAdaptiveModalHeight = (contentHeight: number, dimensions?: ScaledSize): number => {
  const { height } = dimensions || Dimensions.get('window');

  // Ensure modal doesn't exceed 90% of screen height
  const maxHeight = height * 0.9;

  // Add padding for gestures and safe areas
  const minHeight = Math.min(contentHeight + 100, maxHeight);

  return minHeight;
};

/**
 * Responsive style preset for common container patterns
 */
export const ResponsiveContainerStyle = (width: number) => ({
  width: '100%',
  maxWidth: getMaxContentWidth(width),
  alignSelf: 'center' as const,
  paddingHorizontal: getResponsivePadding(width),
});

/**
 * Get appropriate number of lines for text based on screen size
 */
export const getTextMaxLines = (width: number, type: 'title' | 'body' | 'caption'): number => {
  const category = getDeviceCategory(width);

  const baseLines = {
    title: { phone: 2, tablet: 3, desktop: 3 },
    body: { phone: 4, tablet: 6, desktop: 8 },
    caption: { phone: 2, tablet: 3, desktop: 3 },
  };

  return baseLines[type][category];
};
