/**
 * useNetworkStatus Hook
 * Monitor network connectivity status in React components
 */

import { getNetworkStatus, subscribeToNetworkChanges } from '@/utils/network';
import { useEffect, useState } from 'react';

interface NetworkStatus {
  isOnline: boolean;
  isConnected: boolean;
  isInternetReachable: boolean;
  connectionType: string;
}

/**
 * Hook to monitor network connectivity status
 * @returns Current network status with real-time updates
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { isOnline, connectionType } = useNetworkStatus();
 *
 *   return (
 *     <View>
 *       {!isOnline && (
 *         <ThemedText style={styles.offlineIndicator}>
 *           You're offline. Changes will sync when online.
 *         </ThemedText>
 *       )}
 *     </View>
 *   );
 * }
 * ```
 */
export function useNetworkStatus(): NetworkStatus {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isOnline: true,
    isConnected: true,
    isInternetReachable: true,
    connectionType: 'unknown',
  });

  useEffect(() => {
    // Get initial network status
    getNetworkStatus()
      .then((status) => {
        setNetworkStatus(status);
      })
      .catch((error) => {
        // Failed to get initial status
      });

    // Subscribe to network changes
    const unsubscribe = subscribeToNetworkChanges((_isOnline) => {
      getNetworkStatus()
        .then((status) => {
          setNetworkStatus(status);
        })
        .catch((error) => {
          // Failed to update status
        });
    });

    return unsubscribe;
  }, []);

  return networkStatus;
}

/**
 * Simple hook that only returns online/offline status
 * Use this when you only need to know if device is online
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const isOnline = useIsOnline();
 *
 *   if (!isOnline) {
 *     return <OfflineScreen />;
 *   }
 *
 *   return <NormalContent />;
 * }
 * ```
 */
export function useIsOnline(): boolean {
  const { isOnline } = useNetworkStatus();
  return isOnline;
}
