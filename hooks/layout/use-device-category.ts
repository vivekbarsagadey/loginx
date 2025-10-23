/**
 * Device category hook
 * Determines device category (phone, tablet, desktop) based on screen dimensions
 */

import { useMemo } from 'react';
import { Platform, useWindowDimensions } from 'react-native';

export type DeviceCategory = 'phone' | 'tablet' | 'desktop';

export interface UseDeviceCategoryReturn {
  /** Current device category */
  category: DeviceCategory;
  /** Is this a phone */
  isPhone: boolean;
  /** Is this a tablet */
  isTablet: boolean;
  /** Is this a desktop */
  isDesktop: boolean;
  /** Is this a small phone (< 375px) */
  isSmallPhone: boolean;
  /** Is this a medium phone (375-414px) */
  isMediumPhone: boolean;
  /** Is this a large phone (> 414px) */
  isLargePhone: boolean;
  /** Is this a compact device (phone in portrait or small tablet) */
  isCompact: boolean;
  /** Is this an expanded device (large tablet or desktop) */
  isExpanded: boolean;
}

// Breakpoints for device categorization
const DEVICE_BREAKPOINTS = {
  // Phone sizes
  smallPhone: 375,
  mediumPhone: 414,
  // Tablet breakpoint
  tablet: 768,
  // Desktop breakpoint
  desktop: 1024,
} as const;

/**
 * Custom hook for determining device category
 * Categorizes device as phone, tablet, or desktop based on screen dimensions
 *
 * @returns Device category state
 *
 * @example
 * ```tsx
 * const device = useDeviceCategory();
 *
 * // Conditional rendering based on device
 * {device.isPhone && <PhoneLayout />}
 * {device.isTablet && <TabletLayout />}
 * {device.isDesktop && <DesktopLayout />}
 *
 * // Or use category directly
 * const columns = device.category === 'phone' ? 1 : device.category === 'tablet' ? 2 : 3;
 *
 * // Phone-specific layouts
 * {device.isSmallPhone && <CompactLayout />}
 * {device.isLargePhone && <ComfortableLayout />}
 * ```
 */
export function useDeviceCategory(): UseDeviceCategoryReturn {
  const { width, height } = useWindowDimensions();

  return useMemo(() => {
    // Use the smaller dimension for categorization to handle orientation changes
    const smallerDimension = Math.min(width, height);

    // Determine device category
    let category: DeviceCategory = 'phone';
    if (Platform.OS === 'web' && width >= DEVICE_BREAKPOINTS.desktop) {
      category = 'desktop';
    } else if (smallerDimension >= DEVICE_BREAKPOINTS.tablet) {
      category = 'tablet';
    }

    // Phone subcategories
    const isSmallPhone = category === 'phone' && width < DEVICE_BREAKPOINTS.smallPhone;
    const isMediumPhone = category === 'phone' && width >= DEVICE_BREAKPOINTS.smallPhone && width < DEVICE_BREAKPOINTS.mediumPhone;
    const isLargePhone = category === 'phone' && width >= DEVICE_BREAKPOINTS.mediumPhone;

    // Compact vs Expanded (useful for adaptive UI)
    const isCompact = width < DEVICE_BREAKPOINTS.tablet;
    const isExpanded = width >= DEVICE_BREAKPOINTS.desktop;

    return {
      category,
      isPhone: category === 'phone',
      isTablet: category === 'tablet',
      isDesktop: category === 'desktop',
      isSmallPhone,
      isMediumPhone,
      isLargePhone,
      isCompact,
      isExpanded,
    };
  }, [width, height]);
}
