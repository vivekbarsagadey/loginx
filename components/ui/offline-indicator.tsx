/**
 * Offline Indicator Component
 * Shows a banner when device is offline
 */

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useIsOnline } from '@/hooks/use-network-status';
import { useTheme } from '@/hooks/use-theme';
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
  const isOnline = useIsOnline();
  const { theme } = useTheme();

  // Resolve system theme
  const resolvedTheme = theme === 'system' ? 'light' : theme;
  const colors = Colors[resolvedTheme];

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
          backgroundColor: colors.warning,
        },
      ]}
    >
      <Ionicons name="cloud-offline-outline" size={20} color={colors['on-primary']} />
      <ThemedText
        style={[
          styles.text,
          {
            color: colors['on-primary'],
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
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 8,
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
  },
});
