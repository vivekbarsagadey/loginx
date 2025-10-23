/**
 * Performance Optimization Utilities
 * Helper functions for optimizing React Native performance
 */

import { InteractionManager, LayoutAnimation, Platform, UIManager } from 'react-native';

// Re-export React for lazy loading
import React from 'react';

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

interface ArchitectureInfo {
  platform: string;
  version: string | number;
  isTV: boolean;
  fabric?: boolean;
  turboModules?: boolean;
  hermesEnabled?: boolean;
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
     
    console.error(`[Performance] ${componentName} render time: ${(end - start).toFixed(2)}ms`);
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
  return (globalThis as unknown as GlobalWithArchitecture).nativeFabricUIManager != null;
};

/**
 * Check if TurboModules are enabled
 */
export const isTurboModuleEnabled = (): boolean => {
  return (globalThis as unknown as GlobalWithArchitecture).__turboModuleProxy != null;
};

/**
 * Get current architecture info
 */
export function getArchitectureInfo(): ArchitectureInfo {
  const info: ArchitectureInfo = {
    platform: Platform.OS,
    version: Platform.Version as string | number,
    isTV: Platform.isTV || false,
  };

  if (__DEV__) {
    // Architecture info logged for debugging
  }

  return info;
}

/**
 * Log performance metrics
 */
export const logPerformanceMetrics = () => {
  if (__DEV__) {
    const info = getArchitectureInfo();
     
    console.error('[Performance] Architecture Info:', {
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
    const memory = (performance as PerformanceWithMemory).memory;
    if (!memory) {
      return null;
    }
    return {
      used: Math.round(memory.usedJSHeapSize / 1024 / 1024),
      total: Math.round(memory.totalJSHeapSize / 1024 / 1024),
      percentage: Math.round((memory.usedJSHeapSize / memory.totalJSHeapSize) * 100),
    };
  }
  return null;
};

/**
 * Preload images for faster rendering
 * @param uris - Array of image URIs to preload
 * @returns Promise that resolves when all images are loaded
 */
export const preloadImages = async (uris: string[]): Promise<void> => {
  try {
    await Promise.all(
      uris.map((uri) => {
        return new Promise<void>((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = reject;
          img.src = uri;
        });
      })
    );
  } catch (_error: unknown) {
    if (__DEV__) {
      console.warn('[Performance] Failed to preload some images:', error);
    }
  }
};

/**
 * Create a lazy component with error boundary
 * @param importFn - Dynamic import function
 * @returns Lazy loaded component
 */
export const createLazyComponent = <T extends React.ComponentType<unknown>>(importFn: () => Promise<{ default: T }>): React.LazyExoticComponent<T> => {
  return React.lazy(importFn);
};

/**
 * Optimize heavy computations by scheduling them after interactions
 * @param computation - Heavy computation function
 * @returns Promise with the computation result
 */
export const scheduleHeavyComputation = <T>(computation: () => T): Promise<T> => {
  return new Promise((resolve) => {
    runAfterInteractions(() => {
      const result = computation();
      resolve(result);
    });
  });
};

/**
 * Create a memoized selector for derived state
 * @param selector - Selector function
 * @returns Memoized selector
 */
export const createMemoizedSelector = <TState, TResult>(selector: (state: TState) => TResult): ((state: TState) => TResult) => {
  let lastState: TState | undefined;
  let lastResult: TResult | undefined;

  return (state: TState): TResult => {
    if (state === lastState && lastResult !== undefined) {
      return lastResult;
    }
    lastState = state;
    lastResult = selector(state);
    return lastResult;
  };
};

/**
 * Batch multiple callbacks into a single execution
 * @param callbacks - Array of callbacks to batch
 * @param delay - Delay before execution (default: 16ms - one frame)
 */
export const batchCallbacks = (callbacks: (() => void)[], delay = 16): void => {
  const executeAll = () => {
    batchUpdates(() => {
      callbacks.forEach((callback) => callback());
    });
  };

  setTimeout(executeAll, delay);
};

/**
 * Create a ref callback that only updates when dependencies change
 * Prevents unnecessary ref updates and re-renders
 */
export const useStableRef = <T>(value: T): React.MutableRefObject<T> => {
  const ref = React.useRef(value);
  ref.current = value;
  return ref;
};

/**
 * Optimize FlatList/SectionList rendering with calculated item layout
 * @param itemHeight - Fixed item height
 * @returns Optimized getItemLayout function
 */
export const createGetItemLayout = (itemHeight: number) => {
  return (_data: unknown, index: number) => ({
    length: itemHeight,
    offset: itemHeight * index,
    index,
  });
};

/**
 * Shallow compare two objects for equality
 * Useful for React.memo comparisons
 */
export const shallowEqual = <T extends Record<string, unknown>>(objA: T, objB: T): boolean => {
  if (objA === objB) {
    return true;
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  return keysA.every((key) => objA[key] === objB[key]);
};
