/**
 * Interval Hook
 *
 * Declarative wrapper around setInterval for periodic operations.
 * Automatically handles cleanup and provides start/stop control.
 *
 * @module hooks/timing/use-interval
 */

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Configuration options for useInterval
 */
export interface UseIntervalOptions {
  /**
   * Whether to start the interval immediately on mount
   * @default true
   */
  immediate?: boolean;

  /**
   * Whether the interval is currently enabled
   * Set to false to pause the interval
   * @default true
   */
  enabled?: boolean;
}

/**
 * Return type for useInterval hook
 */
export interface UseIntervalReturn {
  /** Whether the interval is currently running */
  isRunning: boolean;
  /** Start the interval */
  start: () => void;
  /** Stop the interval */
  stop: () => void;
  /** Restart the interval (stop and start) */
  restart: () => void;
}

/**
 * Creates a declarative interval that runs a callback periodically
 *
 * @param callback - Function to call on each interval
 * @param delay - Delay in milliseconds between executions (null to disable)
 * @param options - Configuration options
 * @returns Control object with start, stop, restart methods
 *
 * @example
 * // Auto-refresh data every 5 seconds
 * useInterval(() => {
 *   fetchLatestData();
 * }, 5000);
 *
 * @example
 * // Countdown timer with controls
 * const [count, setCount] = useState(60);
 * const { isRunning, start, stop, restart } = useInterval(
 *   () => setCount((c) => c - 1),
 *   1000,
 *   { immediate: false }
 * );
 *
 * <View>
 *   <Text>{count} seconds</Text>
 *   <Button onPress={start} title="Start" />
 *   <Button onPress={stop} title="Stop" />
 *   <Button onPress={restart} title="Restart" />
 * </View>
 *
 * @example
 * // Conditional interval (only when enabled)
 * const [enabled, setEnabled] = useState(false);
 * useInterval(
 *   () => console.log('Tick'),
 *   1000,
 *   { enabled }
 * );
 *
 * @example
 * // Real-time clock
 * const [time, setTime] = useState(new Date());
 * useInterval(() => {
 *   setTime(new Date());
 * }, 1000);
 */
export function useInterval(
  callback: () => void,
  delay: number | null,
  options: UseIntervalOptions = {}
): UseIntervalReturn {
  const { immediate = true, enabled = true } = options;

  const [isRunning, setIsRunning] = useState(immediate && enabled);
  const savedCallback = useRef(callback);
  const intervalId = useRef<ReturnType<typeof setInterval> | null>(null);

  // Remember the latest callback
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Start interval
  const start = useCallback(() => {
    if (!isRunning && delay !== null) {
      setIsRunning(true);
    }
  }, [isRunning, delay]);

  // Stop interval
  const stop = useCallback(() => {
    if (isRunning) {
      setIsRunning(false);
    }
  }, [isRunning]);

  // Restart interval
  const restart = useCallback(() => {
    stop();
    // Use setTimeout to ensure stop completes before start
    setTimeout(() => start(), 0);
  }, [start, stop]);

  // Set up and clean up interval
  useEffect(() => {
    if (!enabled || delay === null || !isRunning) {
      if (intervalId.current) {
        clearInterval(intervalId.current);
        intervalId.current = null;
      }
      return;
    }

    intervalId.current = setInterval(() => {
      savedCallback.current();
    }, delay);

    return () => {
      if (intervalId.current) {
        clearInterval(intervalId.current);
        intervalId.current = null;
      }
    };
  }, [delay, enabled, isRunning]);

  return {
    isRunning,
    start,
    stop,
    restart,
  };
}
