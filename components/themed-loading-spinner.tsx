/**
 * ThemedLoadingSpinner Component
 * Themed wrapper around ActivityIndicator with sizes and variants
 *
 * Features:
 * - Size variants: small, medium, large
 * - Color variants: primary, secondary, surface
 * - Optional text label
 * - Centered layout option
 *
 * @example
 * ```tsx
 * <ThemedLoadingSpinner />
 *
 * <ThemedLoadingSpinner size="large" variant="primary" />
 *
 * <ThemedLoadingSpinner text="Loading..." />
 *
 * <ThemedLoadingSpinner size="large" text="Please wait..." centered />
 * ```
 */

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/layout';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { memo } from 'react';
import { ActivityIndicator, StyleSheet, View, type ViewProps } from 'react-native';

export interface ThemedLoadingSpinnerProps extends ViewProps {
  /**
   * Spinner size
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * Color variant
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'surface';

  /**
   * Optional text to display below spinner
   */
  text?: string;

  /**
   * Center the spinner in its container
   * @default false
   */
  centered?: boolean;
}

const SIZE_MAP = {
  small: 20,
  medium: 32,
  large: 48,
} as const;

function ThemedLoadingSpinnerComponent({ size = 'medium', variant = 'primary', text, centered = false, style, ...rest }: ThemedLoadingSpinnerProps) {
  const colors = useThemeColors();

  // Variant colors
  const variantColors = {
    primary: colors.primary,
    secondary: colors.text,
    surface: colors['text-muted'],
  };

  const color = variantColors[variant];
  const spinnerSize = SIZE_MAP[size];

  const content = (
    <>
      <ActivityIndicator size={spinnerSize} color={color} accessibilityLabel="Loading" accessibilityRole="progressbar" />
      {text && (
        <ThemedText type="body" style={[styles.text, { color: colors['text-muted'] }]}>
          {text}
        </ThemedText>
      )}
    </>
  );

  if (centered) {
    return (
      <View style={[styles.centeredContainer, style]} accessible={true} accessibilityLabel={text ? `Loading: ${text}` : 'Loading'} {...rest}>
        {content}
      </View>
    );
  }

  return (
    <View style={[styles.container, style]} accessible={true} accessibilityLabel={text ? `Loading: ${text}` : 'Loading'} {...rest}>
      {content}
    </View>
  );
}

export const ThemedLoadingSpinner = memo(ThemedLoadingSpinnerComponent);

const styles = StyleSheet.create({
  container: {
    gap: Spacing.sm,
    alignItems: 'center',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  text: {
    textAlign: 'center',
  },
});
