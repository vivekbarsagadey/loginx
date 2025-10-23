/**
 * Debounced Callback Hook
 *
 * Delays execution of callback until after delay has elapsed since last invocation.
 * Useful for search inputs, resize handlers, and other high-frequency events.
 *
 * @module hooks/timing/use-debounced-callback
 */

import { useCallback, useEffect, useRef } from 'react';

/**
 * Creates a debounced version of a callback function
 *
 * The debounced callback will only execute after the specified delay has passed
 * since the last invocation. If called again before the delay expires, the timer resets.
 *
 * @template T - Function type
 * @param callback - Function to debounce
 * @param delay - Delay in milliseconds before executing callback
 * @returns Debounced callback function
 *
 * @example
 * // Search with 300ms debounce
 * const debouncedSearch = useDebouncedCallback((query: string) => {
 *   searchAPI(query);
 * }, 300);
 *
 * // Use in input handler
 * <TextInput
 *   onChangeText={(text) => debouncedSearch(text)}
 * />
 *
 * @example
 * // Window resize handler with 500ms debounce
 * const debouncedResize = useDebouncedCallback(() => {
 *   recalculateLayout();
 * }, 500);
 *
 * useEffect(() => {
 *   window.addEventListener('resize', debouncedResize);
 *   return () => window.removeEventListener('resize', debouncedResize);
 * }, [debouncedResize]);
 *
 * @example
 * // Form validation with debounce
 * const debouncedValidate = useDebouncedCallback((value: string) => {
 *   validateField(value);
 * }, 400);
 */
export function useDebouncedCallback<T extends (...args: never[]) => unknown>(callback: T, delay: number): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useCallback(
    (...args: Parameters<T>) => {
      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set new timeout
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );
}
