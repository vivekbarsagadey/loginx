import { useEffect, useState } from 'react';
import { Dimensions, Platform, ScaledSize } from 'react-native';

/**
 * Media query condition type
 */
export type MediaQueryCondition = {
  /** Minimum width in pixels */
  minWidth?: number;
  /** Maximum width in pixels */
  maxWidth?: number;
  /** Minimum height in pixels */
  minHeight?: number;
  /** Maximum height in pixels */
  maxHeight?: number;
  /** Screen orientation */
  orientation?: 'portrait' | 'landscape';
  /** Minimum aspect ratio (width/height) */
  minAspectRatio?: number;
  /** Maximum aspect ratio (width/height) */
  maxAspectRatio?: number;
  /** Platform check */
  platform?: 'ios' | 'android' | 'web';
};

/**
 * Hook for advanced responsive design with custom media queries
 *
 * @example
 * ```typescript
 * // Simple width-based query
 * const isTablet = useMediaQuery({ minWidth: 768 });
 *
 * // Complex query with multiple conditions
 * const isLargePortraitTablet = useMediaQuery({
 *   minWidth: 768,
 *   maxWidth: 1024,
 *   orientation: 'portrait',
 * });
 *
 * // Aspect ratio based query
 * const isWideScreen = useMediaQuery({
 *   minAspectRatio: 16 / 9,
 * });
 *
 * // Platform-specific query
 * const isIOSTablet = useMediaQuery({
 *   minWidth: 768,
 *   platform: 'ios',
 * });
 * ```
 *
 * @param conditions - Media query conditions to check
 * @returns Boolean indicating if all conditions are met
 */
export function useMediaQuery(conditions: MediaQueryCondition): boolean {
  /**
   * Check if all conditions match the given dimensions
   */
  const checkConditions = (dimensions: ScaledSize): boolean => {
    const { width, height } = dimensions;
    const aspectRatio = width / height;
    const orientation = width > height ? 'landscape' : 'portrait';

    // Check minWidth
    if (conditions.minWidth !== undefined && width < conditions.minWidth) {
      return false;
    }

    // Check maxWidth
    if (conditions.maxWidth !== undefined && width > conditions.maxWidth) {
      return false;
    }

    // Check minHeight
    if (conditions.minHeight !== undefined && height < conditions.minHeight) {
      return false;
    }

    // Check maxHeight
    if (conditions.maxHeight !== undefined && height > conditions.maxHeight) {
      return false;
    }

    // Check orientation
    if (conditions.orientation !== undefined && orientation !== conditions.orientation) {
      return false;
    }

    // Check minAspectRatio
    if (conditions.minAspectRatio !== undefined && aspectRatio < conditions.minAspectRatio) {
      return false;
    }

    // Check maxAspectRatio
    if (conditions.maxAspectRatio !== undefined && aspectRatio > conditions.maxAspectRatio) {
      return false;
    }

    // Check platform
    if (conditions.platform !== undefined) {
      if (Platform.OS !== conditions.platform) {
        return false;
      }
    }

    return true;
  };

  const [matches, setMatches] = useState(() => {
    const dimensions = Dimensions.get('window');
    return checkConditions(dimensions);
  });

  useEffect(() => {
    const handleChange = ({ window }: { window: ScaledSize }) => {
      const newMatches = checkConditions(window);
      setMatches(newMatches);
    };

    const subscription = Dimensions.addEventListener('change', handleChange);

    // Check initial state
    const dimensions = Dimensions.get('window');
    const initialMatches = checkConditions(dimensions);
    if (initialMatches !== matches) {
      setMatches(initialMatches);
    }

    return () => {
      subscription.remove();
    };
  }, [
    conditions.minWidth,
    conditions.maxWidth,
    conditions.minHeight,
    conditions.maxHeight,
    conditions.orientation,
    conditions.minAspectRatio,
    conditions.maxAspectRatio,
    conditions.platform,
  ]);

  return matches;
}

/**
 * Preset media query hooks for common breakpoints
 */
export const useMediaQueries = {
  /**
   * Check if screen is phone-sized (< 768px)
   */
  useIsPhone: () => useMediaQuery({ maxWidth: 767 }),

  /**
   * Check if screen is tablet-sized (768px - 1023px)
   */
  useIsTablet: () => useMediaQuery({ minWidth: 768, maxWidth: 1023 }),

  /**
   * Check if screen is desktop-sized (>= 1024px)
   */
  useIsDesktop: () => useMediaQuery({ minWidth: 1024 }),

  /**
   * Check if screen is in landscape orientation
   */
  useIsLandscape: () => useMediaQuery({ orientation: 'landscape' }),

  /**
   * Check if screen is in portrait orientation
   */
  useIsPortrait: () => useMediaQuery({ orientation: 'portrait' }),

  /**
   * Check if screen is widescreen (aspect ratio >= 16:9)
   */
  useIsWidescreen: () => useMediaQuery({ minAspectRatio: 16 / 9 }),

  /**
   * Check if device is iOS
   */
  useIsIOS: () => useMediaQuery({ platform: 'ios' }),

  /**
   * Check if device is Android
   */
  useIsAndroid: () => useMediaQuery({ platform: 'android' }),

  /**
   * Check if platform is web
   */
  useIsWeb: () => useMediaQuery({ platform: 'web' }),
};
