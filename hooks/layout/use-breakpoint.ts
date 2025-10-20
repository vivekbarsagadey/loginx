/**
 * Breakpoint hook for responsive design
 * Provides boolean flags for different screen size breakpoints
 */

import { useWindowDimensions } from 'react-native';
import { useMemo } from 'react';

export interface Breakpoint {
  /** Extra small screens (< 480px) */
  xs: boolean;
  /** Small screens (>= 480px and < 768px) */
  sm: boolean;
  /** Medium screens (>= 768px and < 1024px) */
  md: boolean;
  /** Large screens (>= 1024px and < 1280px) */
  lg: boolean;
  /** Extra large screens (>= 1280px) */
  xl: boolean;
  /** Current breakpoint name */
  current: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Is at least small */
  smUp: boolean;
  /** Is at least medium */
  mdUp: boolean;
  /** Is at least large */
  lgUp: boolean;
  /** Is at least extra large */
  xlUp: boolean;
  /** Is small or below */
  smDown: boolean;
  /** Is medium or below */
  mdDown: boolean;
  /** Is large or below */
  lgDown: boolean;
}

const BREAKPOINTS = {
  xs: 480,
  sm: 768,
  md: 1024,
  lg: 1280,
} as const;

/**
 * Custom hook for responsive breakpoints
 * Returns boolean flags for different screen sizes
 *
 * @returns Breakpoint state
 *
 * @example
 * ```tsx
 * const breakpoint = useBreakpoint();
 *
 * // Show different layouts based on screen size
 * {breakpoint.xs && <MobileLayout />}
 * {breakpoint.md && <TabletLayout />}
 * {breakpoint.lgUp && <DesktopLayout />}
 *
 * // Use current breakpoint
 * const columns = breakpoint.current === 'xs' ? 1 : breakpoint.current === 'sm' ? 2 : 3;
 * ```
 */
export function useBreakpoint(): Breakpoint {
  const { width } = useWindowDimensions();

  return useMemo(() => {
    const xs = width < BREAKPOINTS.xs;
    const sm = width >= BREAKPOINTS.xs && width < BREAKPOINTS.sm;
    const md = width >= BREAKPOINTS.sm && width < BREAKPOINTS.md;
    const lg = width >= BREAKPOINTS.md && width < BREAKPOINTS.lg;
    const xl = width >= BREAKPOINTS.lg;

    let current: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'xs';
    if (xl) {current = 'xl';} else if (lg) {current = 'lg';} else if (md) {current = 'md';} else if (sm) {current = 'sm';}

    return {
      xs,
      sm,
      md,
      lg,
      xl,
      current,
      smUp: width >= BREAKPOINTS.xs,
      mdUp: width >= BREAKPOINTS.sm,
      lgUp: width >= BREAKPOINTS.md,
      xlUp: width >= BREAKPOINTS.lg,
      smDown: width < BREAKPOINTS.sm,
      mdDown: width < BREAKPOINTS.md,
      lgDown: width < BREAKPOINTS.lg,
    };
  }, [width]);
}
