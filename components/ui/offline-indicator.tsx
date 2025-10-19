/**
 * Offline Indicator Component
 * Shows a banner when device is offline
 */

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useNetwork } from '@/hooks/network/use-network-context';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';

interface OfflineIndicatorProps {
  /** Custom message to display when offline */
  message?: string;
  /** Whether to show the indicator (overrides automatic detection) */
  visible?: boolean;
}

/**
 * Offline Indicator Component
 * Automatically shows a banner when device is offline
 *
 * @example
 * ```tsx
 * // Basic usage - automatic detection
 * <OfflineIndicator />
 *
 * // Custom message
 * <OfflineIndicator message="No internet connection. Working offline." />
 *
 * // Manual control
 * <OfflineIndicator visible={!isConnected} />
 * ```
 */
export function OfflineIndicator({ message, visible }: OfflineIndicatorProps) {
  // Use NetworkContext for centralized network status
  const { isConnected, isInternetReachable } = useNetwork();
  const warningColor = useThemeColor({}, 'warning');
  const onPrimaryColor = useThemeColor({}, 'on-primary');

  // Determine online status: both connected and internet reachable
  const isOnline = isConnected && (isInternetReachable !== false);

  // Don't show if online (unless manually overridden)
  const shouldShow = visible !== undefined ? visible : !isOnline;

  if (shouldShow === false) {
    return null;
  }

  const defaultMessage = message || "You're offline. Changes will sync when online.";

  return (
    <ThemedView
      style={[
        styles.container,
        {
          backgroundColor: warningColor,
        },
      ]}
    >
      <Ionicons name="cloud-offline-outline" size={20} color={onPrimaryColor} />
      <ThemedText
        style={[
          styles.text,
          {
            color: onPrimaryColor,
          },
        ]}
      >
        {defaultMessage}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    gap: 10,
    minHeight: 44,
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
});
