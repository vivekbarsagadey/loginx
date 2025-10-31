/**
 * Throttled Callback Hook
 *
 * Ensures callback is called at most once per specified time period.
 * Useful for scroll handlers, mouse move events, and other high-frequency operations.
 *
 * @module hooks/timing/use-throttled-callback
 */

import { useCallback, useRef } from 'react';

/**
 * Creates a throttled version of a callback function
 *
 * The throttled callback will execute immediately on first call, then ignore
 * subsequent calls until the time limit has passed. Unlike debounce, this ensures
 * the callback is called regularly at the specified interval.
 *
 * @template T - Function type
 * @param callback - Function to throttle
 * @param limit - Minimum time in milliseconds between executions
 * @returns Throttled callback function
 *
 * @example
 * // Scroll handler with 100ms throttle
 * const throttledScroll = useThrottledCallback((event: unknown) => {
 *   handleScroll(event);
 * }, 100);
 *
 * <ScrollView onScroll={throttledScroll}>
 *   {content}
 * </ScrollView>
 *
 * @example
 * // Mouse move tracker with throttle
 * const throttledMouseMove = useThrottledCallback((x: number, y: number) => {
 *   updateCursor(x, y);
 * }, 50);
 *
 * @example
 * // API call throttling
 * const throttledSave = useThrottledCallback((data: FormData) => {
 *   saveToAPI(data);
 * }, 2000); // At most once every 2 seconds
 */
export function useThrottledCallback<T extends (...args: never[]) => unknown>(callback: T, limit: number): (...args: Parameters<T>) => void {
  const inThrottle = useRef(false);

  return useCallback(
    (...args: Parameters<T>) => {
      if (!inThrottle.current) {
        // Execute callback immediately
        callback(...args);
        inThrottle.current = true;

        // Reset throttle after limit
        setTimeout(() => {
          inThrottle.current = false;
        }, limit);
      }
    },
    [callback, limit]
  );
}
