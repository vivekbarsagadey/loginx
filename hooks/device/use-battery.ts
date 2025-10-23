/**
 * Battery Hook
 *
 * Tracks device battery level and charging state.
 * Requires expo-battery package (optional dependency).
 *
 * @module hooks/device/use-battery
 */

import { useEffect, useState } from 'react';

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
    let Battery: any = null;
    let isMounted = true;

    // Dynamically import expo-battery if available
    const loadBattery = async () => {
      try {
        // @ts-ignore - Optional dependency, may not be installed
        // eslint-disable-next-line import/no-unresolved
        Battery = await import('expo-battery');

        if (!isMounted) {return;}

        // Get initial battery state
        const [level, state] = await Promise.all([
          Battery.getBatteryLevelAsync(),
          Battery.getBatteryStateAsync(),
        ]);

        if (!isMounted) {return;}

        setBatteryState({
          level,
          charging: state === Battery.BatteryState.CHARGING ||
                    state === Battery.BatteryState.FULL,
          available: true,
        });

        // Subscribe to battery level changes
        const levelSubscription = Battery.addBatteryLevelListener(
          ({ batteryLevel }: { batteryLevel: number }) => {
            if (isMounted) {
              setBatteryState((prev) => ({ ...prev, level: batteryLevel }));
            }
          }
        );

        // Subscribe to battery state changes
        const stateSubscription = Battery.addBatteryStateListener(
          ({ batteryState }: { batteryState: number }) => {
            if (isMounted) {
              setBatteryState((prev) => ({
                ...prev,
                charging:
                  batteryState === Battery.BatteryState.CHARGING ||
                  batteryState === Battery.BatteryState.FULL,
              }));
            }
          }
        );

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
      }
    };

    const cleanup = loadBattery();

    return () => {
      isMounted = false;
      cleanup.then((cleanupFn) => cleanupFn?.());
    };
  }, []);

  return batteryState;
}
