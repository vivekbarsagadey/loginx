/**
 * Advanced hooks for performance optimization
 * These hooks provide fine-grained control over re-renders and computations
 */

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Like useCallback, but with deep comparison of dependencies
 * Useful when dependencies are objects or arrays
 *
 * @param callback - Function to memoize
 * @param deps - Dependencies array
 * @returns Memoized callback
 *
 * @example
 * const handleSubmit = useDeepCallback((data) => {
 *   submitForm(data);
 * }, [formConfig]); // formConfig is an object
 */
export function useDeepCallback<T extends (...args: never[]) => unknown>(callback: T, deps: React.DependencyList): T {
  const ref = useRef<T>(callback);
  const depsRef = useRef(deps);

  // Deep compare dependencies
  const depsChanged = deps.some((dep, i) => {
    const prevDep = depsRef.current[i];
    return JSON.stringify(dep) !== JSON.stringify(prevDep);
  });

  if (depsChanged) {
    ref.current = callback;
    depsRef.current = deps;
  }

  return useCallback(((...args: Parameters<T>) => ref.current(...args)) as T, []);
}

/**
 * Debounced callback hook
 * Delays execution of callback until after delay has elapsed since last invocation
 *
 * @param callback - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced callback
 *
 * @example
 * const debouncedSearch = useDebouncedCallback((query) => {
 *   searchAPI(query);
 * }, 300);
 */
export function useDebouncedCallback<T extends (...args: never[]) => unknown>(callback: T, delay: number): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );
}

/**
 * Throttled callback hook
 * Ensures callback is called at most once per specified time period
 *
 * @param callback - Function to throttle
 * @param limit - Time limit in milliseconds
 * @returns Throttled callback
 *
 * @example
 * const throttledScroll = useThrottledCallback((event) => {
 *   handleScroll(event);
 * }, 100);
 */
export function useThrottledCallback<T extends (...args: never[]) => unknown>(callback: T, limit: number): (...args: Parameters<T>) => void {
  const inThrottle = useRef(false);

  return useCallback(
    (...args: Parameters<T>) => {
      if (!inThrottle.current) {
        callback(...args);
        inThrottle.current = true;

        setTimeout(() => {
          inThrottle.current = false;
        }, limit);
      }
    },
    [callback, limit]
  );
}

/**
 * Previous value hook
 * Returns the previous value of a variable
 *
 * @param value - Current value
 * @returns Previous value
 *
 * @example
 * const prevCount = usePrevious(count);
 * const countIncreased = count > (prevCount ?? 0);
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

/**
 * Update effect hook
 * Like useEffect, but only runs on updates (not on mount)
 *
 * @param effect - Effect function
 * @param deps - Dependencies array
 *
 * @example
 * useUpdateEffect(() => {
 *   console.error('User changed:', user);
 * }, [user]);
 */
export function useUpdateEffect(effect: React.EffectCallback, deps: React.DependencyList): void {
  const isFirstMount = useRef(true);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    return effect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/**
 * Mounted state hook
 * Returns whether component is currently mounted
 * Useful for preventing state updates after unmount
 *
 * @returns Ref object with current mounted state
 *
 * @example
 * const isMounted = useIsMounted();
 *
 * const fetchData = async () => {
 *   const data = await api.getData();
 *   if (isMounted.current) {
 *     setData(data);
 *   }
 * };
 */
export function useIsMounted(): React.MutableRefObject<boolean> {
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  return isMounted;
}

/**
 * Optimized state hook with update batching
 * Batches multiple state updates into a single re-render
 *
 * @param initialState - Initial state value
 * @returns [state, batchedSetState]
 *
 * @example
 * const [state, setState] = useBatchedState({ count: 0, name: '' });
 *
 * // These updates will be batched
 * setState({ count: 1 });
 * setState({ name: 'John' });
 */
export function useBatchedState<T extends Record<string, unknown>>(initialState: T): [T, (updates: Partial<T>) => void] {
  const [state, setState] = useState<T>(initialState);
  const pendingUpdates = useRef<Partial<T>>({});
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const batchedSetState = useCallback((updates: Partial<T>) => {
    // Accumulate updates
    pendingUpdates.current = {
      ...pendingUpdates.current,
      ...updates,
    };

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Schedule batch update
    timeoutRef.current = setTimeout(() => {
      setState((prevState) => ({
        ...prevState,
        ...pendingUpdates.current,
      }));
      pendingUpdates.current = {};
    }, 0);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return [state, batchedSetState];
}

/**
 * Stable callback ref hook
 * Creates a ref that always has the latest callback without changing reference
 *
 * @param callback - Callback function
 * @returns Stable callback ref
 *
 * @example
 * const handlePress = useCallbackRef((item) => {
 *   // Can use latest props/state without re-creating callback
 *   console.error(item, currentFilter);
 * });
 */
export function useCallbackRef<T extends (...args: never[]) => unknown>(callback: T): T {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  });

  return useCallback(
    ((...args: Parameters<T>) => {
      return callbackRef.current(...args);
    }) as T,
    []
  );
}
