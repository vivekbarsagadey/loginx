/**
 * Responsive Design Hook
 *
 * Provides reactive responsive design utilities that automatically update
 * when the window dimensions change (orientation, split screen, etc.)
 *
 * This hook uses React Native's useWindowDimensions() for automatic updates
 * instead of static Dimensions.get() calls.
 *
 * @example
 * ```tsx
 * const { width, height, isLandscape, deviceCategory, padding } = useResponsive();
 *
 * // Use in components
 * <View style={{ padding: padding.responsive }}>
 *   {deviceCategory === 'phone' && <CompactLayout />}
 *   {deviceCategory === 'tablet' && <TabletLayout />}
 * </View>
 * ```
 */

import { Spacing } from '@/constants/layout';
import {
  Breakpoints,
  getDeviceCategory,
  getGridColumns,
  getMaxContentWidth,
  getResponsiveFontScale,
  getResponsivePadding,
  getSafeMinTouchTarget,
  getSpacingMultiplier,
  getTextMaxLines,
  isLandscape,
  isTablet,
  isVerySmallScreen,
  ResponsiveContainerStyle,
  shouldSupportRotation,
} from '@/constants/responsive';
import { useMemo } from 'react';
import { Platform, useWindowDimensions } from 'react-native';

export interface ResponsiveValues {
  /** Current window width (reactive) */
  width: number;

  /** Current window height (reactive) */
  height: number;

  /** Current font scale from accessibility settings */
  fontScale: number;

  /** Current scale (pixel density) */
  scale: number;

  /** Device category: 'phone' | 'tablet' | 'desktop' */
  deviceCategory: 'phone' | 'tablet' | 'desktop';

  /** Is device in landscape orientation */
  isLandscape: boolean;

  /** Is device in portrait orientation */
  isPortrait: boolean;

  /** Is this a very small screen (< 320px width) */
  isVerySmall: boolean;

  /** Is this a tablet-sized device (>= 768px) */
  isTablet: boolean;

  /** Is this a small phone (<375px) */
  isSmallPhone: boolean;

  /** Is this a medium phone (375-414px) */
  isMediumPhone: boolean;

  /** Is this a large phone (>414px) */
  isLargePhone: boolean;

  /** Breakpoints object for manual checks */
  breakpoints: typeof Breakpoints;

  /** Responsive padding value based on screen size */
  padding: {
    /** Responsive padding (12-32px) */
    responsive: number;

    /** All spacing values multiplied by screen size */
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
    xxxl: number;
    huge: number;
  };

  /** Font scale multiplier for responsive typography */
  fontScaleMultiplier: number;

  /** Maximum content width for centered layouts */
  maxContentWidth: number;

  /** Number of columns for grid layouts */
  gridColumns: number;

  /** Minimum safe touch target size */
  minTouchTarget: number;

  /** Spacing multiplier for responsive gaps */
  spacingMultiplier: number;

  /** Should rotation be supported on this device */
  supportsRotation: boolean;

  /** Container style preset for responsive layouts */
  containerStyle: ReturnType<typeof ResponsiveContainerStyle>;

  /** Get max lines for text based on type */
  getMaxLines: (type: 'title' | 'body' | 'caption') => number;

  /** Get responsive size based on base value */
  getResponsiveSize: (baseSize: number) => number;

  /** Check if width is above breakpoint */
  isAbove: (breakpoint: keyof typeof Breakpoints) => boolean;

  /** Check if width is below breakpoint */
  isBelow: (breakpoint: keyof typeof Breakpoints) => boolean;

  /** Platform information */
  platform: {
    isIOS: boolean;
    isAndroid: boolean;
    isWeb: boolean;
  };
}

/**
 * Hook that provides reactive responsive design utilities
 *
 * Automatically updates when window dimensions change (orientation, split screen, etc.)
 * Use this instead of static Dimensions.get() calls for responsive layouts.
 */
export function useResponsive(): ResponsiveValues {
  const dimensions = useWindowDimensions();
  const { width, height, fontScale, scale } = dimensions;

  // Memoize all computed values to prevent unnecessary recalculations
  const responsiveValues = useMemo(() => {
    const deviceCategory = getDeviceCategory(width);
    const landscape = isLandscape(dimensions);
    const verySmall = isVerySmallScreen(dimensions);
    const tablet = isTablet(dimensions);
    const spacingMult = getSpacingMultiplier(width);

    return {
      width,
      height,
      fontScale,
      scale,

      // Device classification
      deviceCategory,
      isLandscape: landscape,
      isPortrait: !landscape,
      isVerySmall: verySmall,
      isTablet: tablet,
      isSmallPhone: width < Breakpoints.small,
      isMediumPhone: width >= Breakpoints.small && width < 414,
      isLargePhone: width >= 414 && width < Breakpoints.medium,

      // Constants
      breakpoints: Breakpoints,

      // Responsive padding
      padding: {
        responsive: getResponsivePadding(width),
        xs: Spacing.xs * spacingMult,
        sm: Spacing.sm * spacingMult,
        md: Spacing.md * spacingMult,
        lg: Spacing.lg * spacingMult,
        xl: Spacing.xl * spacingMult,
        xxl: Spacing.xxl * spacingMult,
        xxxl: Spacing.xxxl * spacingMult,
        huge: Spacing.huge * spacingMult,
      },

      // Typography
      fontScaleMultiplier: getResponsiveFontScale(width),

      // Layout
      maxContentWidth: getMaxContentWidth(width),
      gridColumns: getGridColumns(width),
      minTouchTarget: getSafeMinTouchTarget(dimensions),
      spacingMultiplier: spacingMult,
      supportsRotation: shouldSupportRotation(),

      // Preset styles
      containerStyle: ResponsiveContainerStyle(width),

      // Utility functions
      getMaxLines: (type: 'title' | 'body' | 'caption') => getTextMaxLines(width, type),

      getResponsiveSize: (baseSize: number) => {
        const scale = width / 375; // 375 is baseline (iPhone X width)
        const newSize = baseSize * scale;
        return Math.round(newSize);
      },

      isAbove: (breakpoint: keyof typeof Breakpoints) => width >= Breakpoints[breakpoint],

      isBelow: (breakpoint: keyof typeof Breakpoints) => width < Breakpoints[breakpoint],

      // Platform
      platform: {
        isIOS: Platform.OS === 'ios',
        isAndroid: Platform.OS === 'android',
        isWeb: Platform.OS === 'web',
      },
    };
  }, [width, height, fontScale, scale, dimensions]);

  return responsiveValues;
}

/**
 * Hook for getting responsive spacing values
 * Shorthand for accessing useResponsive().padding
 */
export function useResponsiveSpacing() {
  const { padding } = useResponsive();
  return padding;
}

/**
 * Hook for getting device category only
 * Lighter alternative when you only need device type
 */
export function useDeviceCategory() {
  const { width } = useWindowDimensions();
  return useMemo(() => getDeviceCategory(width), [width]);
}

/**
 * Hook for checking orientation
 * Lighter alternative when you only need orientation
 */
export function useOrientation() {
  const dimensions = useWindowDimensions();
  return useMemo(
    () => ({
      isLandscape: isLandscape(dimensions),
      isPortrait: !isLandscape(dimensions),
    }),
    [dimensions]
  );
}

/**
 * Hook for getting breakpoint checks
 * Useful for conditional rendering based on screen size
 */
export function useBreakpoint() {
  const { width } = useWindowDimensions();

  return useMemo(
    () => ({
      isSmall: width < Breakpoints.small,
      isMedium: width >= Breakpoints.small && width < Breakpoints.medium,
      isLarge: width >= Breakpoints.medium && width < Breakpoints.large,
      isXLarge: width >= Breakpoints.large,

      // Semantic names
      isPhone: width < Breakpoints.medium,
      isTablet: width >= Breakpoints.medium && width < Breakpoints.large,
      isDesktop: width >= Breakpoints.large,

      // Helper functions
      above: (breakpoint: keyof typeof Breakpoints) => width >= Breakpoints[breakpoint],
      below: (breakpoint: keyof typeof Breakpoints) => width < Breakpoints[breakpoint],
    }),
    [width]
  );
}
