/**
 * App State Hook
 *
 * Tracks React Native app state (foreground, background, inactive).
 * Useful for pausing operations when app is backgrounded.
 *
 * @module hooks/device/use-app-state
 */

import { useEffect, useRef, useState } from 'react';
import { AppState, type AppStateStatus } from 'react-native';

/**
 * Configuration options for useAppState
 */
export interface UseAppStateOptions {
  /**
   * Callback when app comes to foreground
   */
  onForeground?: () => void;

  /**
   * Callback when app goes to background
   */
  onBackground?: () => void;

  /**
   * Callback on any state change
   */
  onChange?: (state: AppStateStatus) => void;
}

/**
 * Tracks React Native application state
 *
 * @param options - Configuration callbacks
 * @returns Current app state ('active' | 'background' | 'inactive')
 *
 * @example
 * // Basic app state tracking
 * const appState = useAppState();
 *
 * {appState === 'active' && <LiveData />}
 * {appState === 'background' && <PausedIndicator />}
 *
 * @example
 * // Pause/resume operations based on app state
 * const appState = useAppState({
 *   onForeground: () => {
 *     resumeOperations();
 *     refreshData();
 *   },
 *   onBackground: () => {
 *     pauseOperations();
 *     saveState();
 *   },
 * });
 *
 * @example
 * // Track time in background
 * const [backgroundTime, setBackgroundTime] = useState<Date | null>(null);
 * const appState = useAppState({
 *   onForeground: () => {
 *     if (backgroundTime) {
 *       const elapsed = Date.now() - backgroundTime.getTime();
 *       if (elapsed > 5 * 60 * 1000) {
 *         refreshAllData();
 *       }
 *     }
 *     setBackgroundTime(null);
 *   },
 *   onBackground: () => {
 *     setBackgroundTime(new Date());
 *   },
 * });
 *
 * @example
 * // Conditional rendering based on app state
 * const appState = useAppState();
 * const isActive = appState === 'active';
 *
 * useEffect(() => {
 *   if (isActive) {
 *     startPolling();
 *   } else {
 *     stopPolling();
 *   }
 * }, [isActive]);
 */
export function useAppState(
  options: UseAppStateOptions = {}
): AppStateStatus {
  const { onForeground, onBackground, onChange } = options;
  const [appState, setAppState] = useState<AppStateStatus>(
    AppState.currentState
  );
  const previousState = useRef<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      // Call onChange callback
      onChange?.(nextAppState);

      // Detect transitions
      if (
        previousState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        // App came to foreground
        onForeground?.();
      }

      if (
        previousState.current === 'active' &&
        nextAppState.match(/inactive|background/)
      ) {
        // App went to background
        onBackground?.();
      }

      previousState.current = nextAppState;
      setAppState(nextAppState);
    };

    // Subscribe to app state changes
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    // Cleanup
    return () => {
      subscription.remove();
    };
  }, [onForeground, onBackground, onChange]);

  return appState;
}
