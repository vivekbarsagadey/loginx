/**
 * Expo Go Banner
 * Shows a banner when running in Expo Go to inform users about limited features
 */
import { Colors } from '@/constants/theme';
import { useThemeContext } from '@/hooks/use-theme-context';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { ThemedText } from '../themed-text';
import { ThemedView } from '../themed-view';

interface ExpoGoBannerProps {
  onDismiss?: () => void;
}

export function ExpoGoBanner({ onDismiss }: ExpoGoBannerProps) {
  const { resolvedTheme } = useThemeContext();
  const colors = Colors[resolvedTheme];

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(200)}
      style={[
        styles.banner,
        {
          backgroundColor: colors.warning + '20', // 20% opacity
          borderBottomColor: colors.border,
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
      {onDismiss && (
        <Pressable onPress={onDismiss} style={styles.closeButton} accessibilityRole="button" accessibilityLabel="Dismiss banner">
          <Ionicons name="close" size={20} color={colors.text} />
        </Pressable>
      )}
    </Animated.View>
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
