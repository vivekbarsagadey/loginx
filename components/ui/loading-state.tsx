import { Spacing } from '@/constants/layout';
import { useThemeColor } from '@/hooks/use-theme-color';
import React, { memo } from 'react';
import { ActivityIndicator, StyleSheet, View, type ViewStyle } from 'react-native';
import { ThemedText } from '../themed-text';
import { ThemedView } from '../themed-view';

export type LoadingStateVariant = 'fullscreen' | 'section' | 'inline' | 'button';

export interface LoadingStateProps {
  /**
   * Loading state variant
   * - fullscreen: Full screen loading with overlay
   * - section: Loading state for a section/card
   * - inline: Small inline loading indicator
   * - button: Loading state for buttons (small spinner)
   */
  variant?: LoadingStateVariant;
  /**
   * Optional loading message to display
   */
  message?: string;
  /**
   * Size of the activity indicator
   */
  size?: 'small' | 'large';
  /**
   * Container style override
   */
  style?: ViewStyle;
  /**
   * Whether the loading state is currently active
   */
  loading?: boolean;
}

/**
 * LoadingState Component
 *
 * Unified loading state component with multiple variants for different use cases.
 *
 * @example Fullscreen loading
 * ```tsx
 * <LoadingState variant="fullscreen" message="Loading your data..." />
 * ```
 *
 * @example Section loading
 * ```tsx
 * <LoadingState variant="section" message="Loading items..." />
 * ```
 *
 * @example Inline loading
 * ```tsx
 * <LoadingState variant="inline" size="small" />
 * ```
 *
 * @example Button loading
 * ```tsx
 * <LoadingState variant="button" size="small" />
 * ```
 */
function LoadingStateComponent({ variant = 'section', message, size = 'large', style, loading = true }: LoadingStateProps) {
  const primaryColor = useThemeColor({}, 'primary');
  const textColor = useThemeColor({}, 'text');

  if (!loading) {
    return null;
  }

  // Button variant - minimal inline spinner
  if (variant === 'button') {
    return (
      <View style={[styles.buttonContainer, style]}>
        <ActivityIndicator size="small" color={primaryColor} />
      </View>
    );
  }

  // Inline variant - small inline spinner with optional text
  if (variant === 'inline') {
    return (
      <View style={[styles.inlineContainer, style]}>
        <ActivityIndicator size={size} color={primaryColor} />
        {message && (
          <ThemedText type="body" style={[styles.inlineMessage, { color: textColor }]}>
            {message}
          </ThemedText>
        )}
      </View>
    );
  }

  // Section variant - centered loading in a container
  if (variant === 'section') {
    return (
      <ThemedView style={[styles.sectionContainer, style]}>
        <ActivityIndicator size={size} color={primaryColor} />
        {message && (
          <ThemedText type="body" style={[styles.sectionMessage, { color: textColor }]}>
            {message}
          </ThemedText>
        )}
      </ThemedView>
    );
  }

  // Fullscreen variant - full screen centered loading
  if (variant === 'fullscreen') {
    return (
      <ThemedView style={[styles.fullscreenContainer, style]}>
        <ActivityIndicator size={size} color={primaryColor} />
        {message && (
          <ThemedText type="body" style={[styles.fullscreenMessage, { color: textColor }]}>
            {message}
          </ThemedText>
        )}
      </ThemedView>
    );
  }

  return null;
}

export const LoadingState = memo(LoadingStateComponent);

const styles = StyleSheet.create({
  fullscreenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  fullscreenMessage: {
    marginTop: Spacing.lg,
    textAlign: 'center',
  },
  sectionContainer: {
    paddingVertical: Spacing.xxl,
    paddingHorizontal: Spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionMessage: {
    marginTop: Spacing.md,
    textAlign: 'center',
  },
  inlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  inlineMessage: {
    fontSize: 14,
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
