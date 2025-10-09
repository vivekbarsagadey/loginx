/**
 * Expo Go Banner
 * Shows a banner when running in Expo Go to inform users about limited features
 */
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';

export function ExpoGoBanner() {
  const warningColor = useThemeColor({}, 'warning');
  const borderColor = useThemeColor({}, 'border');
  const textColor = useThemeColor({}, 'text');
  const textMutedColor = useThemeColor({}, 'text-muted');
  const [dismissed, setDismissed] = useState(false);

  // Check if running in Expo Go
  const isExpoGo = Constants.appOwnership === 'expo';

  // Don't show banner if not in Expo Go or dismissed
  if (!isExpoGo || dismissed) {
    return null;
  }

  return (
    <ThemedView
      style={[
        styles.banner,
        {
          backgroundColor: colors.warning + '20', // 20% opacity
          borderColor: colors.border,
        },
      ]}
    >
      <Ionicons name="information-circle" size={20} color={colors.warning} />
      <ThemedView style={styles.textContainer}>
        <ThemedText style={[styles.title, { color: colors.text }]} numberOfLines={2}>
          Running in Expo Go
        </ThemedText>
        <ThemedText style={[styles.message, { color: colors['text-muted'] }]} numberOfLines={3}>
          Google Sign-In is not available. Use email/password or create a development build.
        </ThemedText>
      </ThemedView>
      <Pressable onPress={() => setDismissed(true)} style={styles.closeButton} accessibilityRole="button" accessibilityLabel="Dismiss banner">
        <Ionicons name="close" size={20} color={colors.text} />
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 1,
  },
  textContainer: {
    flex: 1,
    gap: 4,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
  },
  message: {
    fontSize: 12,
    opacity: 0.9,
  },
  closeButton: {
    padding: 4,
  },
});
