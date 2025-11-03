/**
 * Battery Hook
 *
 * Tracks device battery level and charging state.
 * Requires expo-battery package (optional dependency).
 *
 * @module hooks/device/use-battery
 */

import { useEffect, useState } from 'react';

// Type definitions for expo-battery (optional dependency)
interface BatteryModule {
  getBatteryLevelAsync: () => Promise<number>;
  getBatteryStateAsync: () => Promise<number>;
  addBatteryLevelListener: (callback: (event: { batteryLevel: number }) => void) => { remove: () => void };
  addBatteryStateListener: (callback: (event: { batteryState: number }) => void) => { remove: () => void };
  BatteryState: {
    UNKNOWN: number;
    UNPLUGGED: number;
    CHARGING: number;
    FULL: number;
  };
}

/**
 * Battery state information
 */
export interface BatteryState {
  /** Battery level from 0 to 1 (e.g., 0.75 = 75%) */
  level: number;
  /** Whether device is currently charging */
  charging: boolean;
  /** Whether battery state is available */
  available: boolean;
}

/**
 * Tracks device battery status
 *
 * Note: Requires expo-battery to be installed:
 * `npx expo install expo-battery`
 *
 * @returns Object containing battery level and charging state
 *
 * @example
 * // Basic battery status display
 * const { level, charging, available } = useBattery();
 *
 * {available && (
 *   <View>
 *     <Text>Battery: {Math.round(level * 100)}%</Text>
 *     {charging && <Text>⚡ Charging</Text>}
 *   </View>
 * )}
 *
 * @example
 * // Low battery warning
 * const { level, charging } = useBattery();
 *
 * {level < 0.2 && !charging && (
 *   <Banner type="warning">
 *     Low battery! Consider charging your device.
 *   </Banner>
 * )}
 *
 * @example
 * // Disable expensive operations on low battery
 * const { level, charging } = useBattery();
 * const canRunExpensiveTask = level > 0.3 || charging;
 *
 * useEffect(() => {
 *   if (canRunExpensiveTask) {
 *     startBackgroundSync();
 *   } else {
 *     pauseBackgroundSync();
 *   }
 * }, [canRunExpensiveTask]);
 */
export function useBattery(): BatteryState {
  const [batteryState, setBatteryState] = useState<BatteryState>({
    level: 1,
    charging: false,
    available: false,
  });

  useEffect(() => {
    let Battery: BatteryModule | null = null;
    let isMounted = true;

    // Dynamically import expo-battery if available
    const loadBattery = async (): Promise<(() => void) | undefined> => {
      try {
        // @ts-expect-error - Optional dependency, may not be installed
        // eslint-disable-next-line import/no-unresolved
        Battery = (await import('expo-battery')) as BatteryModule;

        if (!isMounted || !Battery) {
          return undefined;
        }

        // Get initial battery state
        const [level, state] = await Promise.all([Battery.getBatteryLevelAsync(), Battery.getBatteryStateAsync()]);

        if (!isMounted || !Battery) {
          return undefined;
        }

        setBatteryState({
          level,
          charging: state === Battery.BatteryState.CHARGING || state === Battery.BatteryState.FULL,
          available: true,
        });

        // Subscribe to battery level changes
        const levelSubscription = Battery.addBatteryLevelListener(({ batteryLevel }: { batteryLevel: number }) => {
          if (isMounted) {
            setBatteryState((prev) => ({ ...prev, level: batteryLevel }));
          }
        });

        // Store reference for closure
        const batteryRef = Battery;

        // Subscribe to battery state changes
        const stateSubscription = Battery.addBatteryStateListener(({ batteryState }: { batteryState: number }) => {
          if (isMounted) {
            setBatteryState((prev) => ({
              ...prev,
              charging: batteryState === batteryRef.BatteryState.CHARGING || batteryState === batteryRef.BatteryState.FULL,
            }));
          }
        });

        return () => {
          levelSubscription.remove();
          stateSubscription.remove();
        };
      } catch (_error) {
        // expo-battery not installed or not available on this platform
        if (isMounted) {
          setBatteryState({
            level: 1,
            charging: false,
            available: false,
          });
        }
        return undefined;
      }
    };

    const cleanup = loadBattery();

    return () => {
      isMounted = false;
      cleanup
        .then((cleanupFn) => cleanupFn?.())
        .catch(() => {
          // Ignore cleanup errors
        });
    };
  }, []);

  return batteryState;
}
