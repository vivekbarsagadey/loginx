/**
 * Performance Optimization Utilities
 * Helper functions for optimizing React Native performance
 */

import { InteractionManager, LayoutAnimation, Platform, UIManager } from 'react-native';

// Global type extensions
interface GlobalWithArchitecture {
  nativeFabricUIManager?: unknown;
  __turboModuleProxy?: unknown;
  HermesInternal?: unknown;
}

interface PerformanceWithMemory extends Performance {
  memory?: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  };
}

/**
 * Enable LayoutAnimation on Android
 */
export const enableLayoutAnimations = () => {
  if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
};

/**
 * Run a callback after interactions/animations complete
 * Useful for deferring non-critical work
 *
 * @example
 * runAfterInteractions(() => {
 *   // Heavy computation or data loading
 *   loadMoreData();
 * });
 */
export const runAfterInteractions = (callback: () => void): Promise<void> => {
  return new Promise((resolve) => {
    InteractionManager.runAfterInteractions(() => {
      callback();
      resolve();
    });
  });
};

/**
 * Debounce a function call
 * Prevents excessive function calls during rapid events (e.g., text input)
 *
 * @example
 * const debouncedSearch = debounce((query: string) => {
 *   searchAPI(query);
 * }, 300);
 */
export const debounce = <T extends (...args: never[]) => unknown>(func: T, wait: number): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
};

/**
 * Throttle a function call
 * Ensures function is called at most once per specified time period
 *
 * @example
 * const throttledScroll = throttle((event) => {
 *   handleScroll(event);
 * }, 100);
 */
export const throttle = <T extends (...args: never[]) => unknown>(func: T, limit: number): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
};

/**
 * Measure component render time
 * Useful for identifying performance bottlenecks
 *
 * @example
 * const Component = () => {
 *   measureRenderTime('MyComponent', () => {
 *     // Component logic
 *   });
 *   return <View />;
 * };
 */
export const measureRenderTime = (componentName: string, callback: () => void) => {
  if (__DEV__) {
    const start = performance.now();
    callback();
    const end = performance.now();
    // eslint-disable-next-line no-console
    console.log(`[Performance] ${componentName} render time: ${(end - start).toFixed(2)}ms`);
  } else {
    callback();
  }
};

/**
 * Batch multiple state updates together
 * Reduces re-renders by combining updates
 *
 * @example
 * batchUpdates(() => {
 *   setState1(newValue1);
 *   setState2(newValue2);
 *   setState3(newValue3);
 * });
 */
export const batchUpdates = (callback: () => void) => {
  // React 18+ automatically batches updates
  // This is for compatibility with older versions
  if (LayoutAnimation.configureNext) {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }
  callback();
};

/**
 * Check if device supports React Native's new architecture (Fabric/TurboModules)
 */
export const isFabricEnabled = (): boolean => {
  return (global as GlobalWithArchitecture).nativeFabricUIManager != null;
};

/**
 * Check if TurboModules are enabled
 */
export const isTurboModuleEnabled = (): boolean => {
  return (global as GlobalWithArchitecture).__turboModuleProxy != null;
};

/**
 * Get current architecture info
 */
export const getArchitectureInfo = () => {
  return {
    fabric: isFabricEnabled(),
    turboModules: isTurboModuleEnabled(),
    hermesEnabled: !!(global as GlobalWithArchitecture).HermesInternal,
    platform: Platform.OS,
    version: Platform.Version,
  };
};

/**
 * Log performance metrics
 */
export const logPerformanceMetrics = () => {
  if (__DEV__) {
    const info = getArchitectureInfo();
    // eslint-disable-next-line no-console
    console.log('[Performance] Architecture Info:', {
      'New Architecture (Fabric)': info.fabric ? '✅ Enabled' : '❌ Disabled',
      TurboModules: info.turboModules ? '✅ Enabled' : '❌ Disabled',
      'Hermes Engine': info.hermesEnabled ? '✅ Enabled' : '❌ Disabled',
      Platform: info.platform,
      Version: info.version,
    });
  }
};

/**
 * Optimize images for better performance
 */
export const getOptimizedImageProps = (size: 'thumbnail' | 'small' | 'medium' | 'large' = 'medium') => {
  const sizes = {
    thumbnail: { width: 100, height: 100, quality: 0.6 },
    small: { width: 200, height: 200, quality: 0.7 },
    medium: { width: 400, height: 400, quality: 0.8 },
    large: { width: 800, height: 800, quality: 0.9 },
  };

  return {
    ...sizes[size],
    resizeMode: 'cover' as const,
    cache: 'force-cache' as const,
  };
};

/**
 * Memoization helper for expensive computations with explicit return type
 */
export const memoize = <TArgs extends unknown[], TReturn>(fn: (...args: TArgs) => TReturn): ((...args: TArgs) => TReturn) => {
  const cache = new Map<string, TReturn>();

  return (...args: TArgs): TReturn => {
    const key = JSON.stringify(args);
    const cached = cache.get(key);

    if (cached !== undefined) {
      return cached;
    }

    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};

/**
 * Check if component should update with explicit types
 */
export const shouldComponentUpdate = <TProps extends Record<string, unknown>>(prevProps: TProps, nextProps: TProps, keys?: readonly (keyof TProps)[]): boolean => {
  const propsToCheck = keys ?? (Object.keys(nextProps) as (keyof TProps)[]);

  return propsToCheck.some((key: keyof TProps) => {
    return prevProps[key] !== nextProps[key];
  });
};

/**
 * Calculate memory usage (development only)
 */
export const getMemoryUsage = (): { used: number; total: number; percentage: number } | null => {
  if (__DEV__ && (performance as PerformanceWithMemory).memory) {
    const memory = (performance as PerformanceWithMemory).memory!;
    return {
      used: Math.round(memory.usedJSHeapSize / 1024 / 1024),
      total: Math.round(memory.totalJSHeapSize / 1024 / 1024),
      percentage: Math.round((memory.usedJSHeapSize / memory.totalJSHeapSize) * 100),
    };
  }
  return null;
};
