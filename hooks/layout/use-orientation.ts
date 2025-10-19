/**
 * Device orientation hook
 * Tracks device orientation changes and provides orientation state
 */

import { useWindowDimensions } from 'react-native';
import { useMemo } from 'react';

export type Orientation = 'portrait' | 'landscape';

export interface UseOrientationReturn {
  /** Current orientation */
  orientation: Orientation;
  /** Is device in portrait mode */
  isPortrait: boolean;
  /** Is device in landscape mode */
  isLandscape: boolean;
  /** Screen width */
  width: number;
  /** Screen height */
  height: number;
  /** Aspect ratio (width / height) */
  aspectRatio: number;
}

/**
 * Custom hook for tracking device orientation
 * Automatically updates when device orientation changes
 *
 * @returns Orientation state
 *
 * @example
 * ```tsx
 * const { orientation, isLandscape, aspectRatio } = useOrientation();
 *
 * // Render different layouts based on orientation
 * {isLandscape ? (
 *   <LandscapeLayout />
 * ) : (
 *   <PortraitLayout />
 * )}
 *
 * // Or use orientation directly
 * <View style={styles[orientation]}>
 *   <Content />
 * </View>
 * ```
 */
export function useOrientation(): UseOrientationReturn {
  const { width, height } = useWindowDimensions();

  return useMemo(() => {
    const isLandscape = width > height;
    const orientation: Orientation = isLandscape ? 'landscape' : 'portrait';
    const aspectRatio = width / height;

    return {
      orientation,
      isPortrait: !isLandscape,
      isLandscape,
      width,
      height,
      aspectRatio,
    };
  }, [width, height]);
}
