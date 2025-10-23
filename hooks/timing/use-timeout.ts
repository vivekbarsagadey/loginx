/**
 * Timeout Hook
 *
 * Declarative wrapper around setTimeout for delayed operations.
 * Automatically handles cleanup and provides control methods.
 *
 * @module hooks/timing/use-timeout
 */

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Configuration options for useTimeout
 */
export interface UseTimeoutOptions {
  /**
   * Whether to start the timeout immediately on mount
   * @default true
   */
  immediate?: boolean;

  /**
   * Whether the timeout is currently enabled
   * Set to false to prevent the timeout from running
   * @default true
   */
  enabled?: boolean;
}

/**
 * Return type for useTimeout hook
 */
export interface UseTimeoutReturn {
  /** Whether the timeout is currently pending */
  isPending: boolean;
  /** Whether the timeout has completed */
  isComplete: boolean;
  /** Start or restart the timeout */
  start: () => void;
  /** Cancel the timeout */
  cancel: () => void;
  /** Reset the timeout (cancel and mark as incomplete) */
  reset: () => void;
}

/**
 * Creates a declarative timeout that executes a callback after a delay
 *
 * @param callback - Function to call after timeout
 * @param delay - Delay in milliseconds (null to disable)
 * @param options - Configuration options
 * @returns Control object with start, cancel, reset methods
 *
 * @example
 * // Show notification after 3 seconds
 * useTimeout(() => {
 *   showNotification('Welcome!');
 * }, 3000);
 *
 * @example
 * // Auto-save with timeout
 * const { start, cancel } = useTimeout(
 *   () => saveDraft(),
 *   5000,
 *   { immediate: false }
 * );
 *
 * // Start timeout when user stops typing
 * const handleChange = (text: string) => {
 *   setText(text);
 *   cancel();
 *   start();
 * };
 *
 * @example
 * // Conditional timeout with state tracking
 * const { isPending, isComplete, cancel } = useTimeout(
 *   () => setShowHint(true),
 *   10000
 * );
 *
 * {isPending && <Text>Hint coming soon...</Text>}
 * {isComplete && <Text>Here's a hint!</Text>}
 *
 * @example
 * // Delayed redirect
 * const { isPending } = useTimeout(() => {
 *   router.push('/home');
 * }, 2000);
 *
 * <View>
 *   <Text>Redirecting in 2 seconds...</Text>
 *   {isPending && <ActivityIndicator />}
 * </View>
 */
export function useTimeout(callback: () => void, delay: number | null, options: UseTimeoutOptions = {}): UseTimeoutReturn {
  const { immediate = true, enabled = true } = options;

  const [isPending, setIsPending] = useState(immediate && enabled && delay !== null);
  const [isComplete, setIsComplete] = useState(false);
  const savedCallback = useRef(callback);
  const timeoutId = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Remember the latest callback
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Cancel timeout
  const cancel = useCallback(() => {
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
      timeoutId.current = null;
    }
    setIsPending(false);
  }, []);

  // Start timeout
  const start = useCallback(() => {
    if (delay === null) {
      return;
    }

    // Cancel existing timeout
    cancel();

    setIsPending(true);
    setIsComplete(false);

    timeoutId.current = setTimeout(() => {
      savedCallback.current();
      setIsPending(false);
      setIsComplete(true);
      timeoutId.current = null;
    }, delay);
  }, [delay, cancel]);

  // Reset timeout
  const reset = useCallback(() => {
    cancel();
    setIsComplete(false);
  }, [cancel]);

  // Set up timeout on mount or when dependencies change
  useEffect(() => {
    if (!enabled || delay === null || !immediate) {
      return;
    }

    start();

    return () => {
      cancel();
    };
  }, [delay, enabled, immediate, start, cancel]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancel();
    };
  }, [cancel]);

  return {
    isPending,
    isComplete,
    start,
    cancel,
    reset,
  };
}
