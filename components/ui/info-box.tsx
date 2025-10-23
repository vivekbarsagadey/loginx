import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BorderRadius, Spacing, Typography } from '@/constants/layout';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Feather } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { StyleSheet } from 'react-native';

interface InfoBoxProps {
  message: string;
  icon?: ComponentProps<typeof Feather>['name'];
  variant?: 'info' | 'warning' | 'success' | 'error';
  style?: object;
}

/**
 * Reusable InfoBox component for displaying informational messages
 * Used across feedback, rating, and issue reporting screens
 */
export function InfoBox({ message, icon = 'info', variant = 'info', style }: InfoBoxProps) {
  const primaryColor = useThemeColor({}, 'primary');
  const successColor = useThemeColor({}, 'success');
  const warningColor = useThemeColor({}, 'warning');
  const errorColor = useThemeColor({}, 'error');

  const variantColors = {
    info: primaryColor,
    success: successColor,
    warning: warningColor,
    _error: errorColor,
  };

  const color = variantColors[variant];

  return (
    <ThemedView style={[styles.infoBox, { backgroundColor: color + '1A' }, style]}>
      <Feather name={icon} size={20} color={color} />
      <ThemedText style={styles.infoText}>{message}</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  infoBox: {
    flexDirection: 'row',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
  },
  infoText: {
    flex: 1,
    fontSize: Typography.bodySmall.fontSize,
    lineHeight: Typography.bodySmall.lineHeight,
  },
});
