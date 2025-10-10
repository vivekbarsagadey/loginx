import { ThemedText } from '@/components/themed-text';
import { BorderRadius, Spacing } from '@/constants/layout';
import { useThemeColor } from '@/hooks/use-theme-color';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

export interface AlertBannerProps {
  /** Message to display */
  message: string;
  /** Severity variant */
  variant?: 'info' | 'success' | 'warning' | 'error';
  /** Optional title */
  title?: string;
  /** Action button label */
  actionLabel?: string;
  /** Action button callback */
  onAction?: () => void;
  /** Whether banner is dismissible */
  dismissible?: boolean;
  /** Called when banner is dismissed */
  onDismiss?: () => void;
  /** Accessibility label */
  accessibilityLabel?: string;
}

export function AlertBanner({ message, variant = 'info', title, actionLabel, onAction, dismissible = false, onDismiss, accessibilityLabel }: AlertBannerProps) {
  const primaryColor = useThemeColor({}, 'primary');
  const successColor = useThemeColor({}, 'success');
  const warningColor = useThemeColor({}, 'warning');
  const errorColor = useThemeColor({}, 'error');
  const surfaceColor = useThemeColor({}, 'surface');
  const textColor = useThemeColor({}, 'text');
  const shadowColor = useThemeColor({}, 'shadow');

  const variantColors = {
    error: errorColor,
    info: primaryColor,
    success: successColor,
    warning: warningColor,
  };

  const icons = {
    error: '✕',
    info: 'ℹ',
    success: '✓',
    warning: '⚠',
  };

  const dynamicStyles = React.useMemo(
    () =>
      StyleSheet.create({
        containerDynamic: {
          backgroundColor: surfaceColor,
          borderLeftColor: variantColors[variant],
          shadowColor,
        },
      }),
    [surfaceColor, variantColors, variant, shadowColor]
  );

  return (
    <View
      style={[styles.container, dynamicStyles.containerDynamic]}
      accessible={true}
      accessibilityRole="alert"
      accessibilityLabel={accessibilityLabel || `${variant}: ${title || message}`}
      accessibilityLiveRegion="polite"
    >
      <View style={[styles.iconContainer, { backgroundColor: variantColors[variant] }]}>
        <ThemedText style={[styles.icon, { color: surfaceColor }]}>{icons[variant]}</ThemedText>
      </View>

      <View style={styles.content}>
        {title && (
          <ThemedText type="bodyBold" style={[styles.title, { color: textColor }]}>
            {title}
          </ThemedText>
        )}
        <ThemedText style={[styles.message, { color: textColor }]}>{message}</ThemedText>

        {actionLabel && onAction && (
          <Pressable onPress={onAction} style={styles.action} accessible={true} accessibilityRole="button" accessibilityLabel={actionLabel}>
            <ThemedText style={[styles.actionText, { color: variantColors[variant] }]}>{actionLabel}</ThemedText>
          </Pressable>
        )}
      </View>

      {dismissible && onDismiss && (
        <Pressable onPress={onDismiss} style={styles.dismiss} accessible={true} accessibilityRole="button" accessibilityLabel="Dismiss alert" hitSlop={{ bottom: 8, left: 8, right: 8, top: 8 }}>
          <ThemedText style={[styles.dismissText, { color: textColor }]}>✕</ThemedText>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  action: {
    marginTop: Spacing.sm,
  },
  actionText: {
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  container: {
    borderLeftWidth: 4,
    borderRadius: BorderRadius.md,
    flexDirection: 'row',
    gap: Spacing.md,
    padding: Spacing.md,
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  content: {
    flex: 1,
  },
  dismiss: {
    padding: Spacing.xs,
  },
  dismissText: {
    fontSize: 18,
    lineHeight: 18,
  },
  icon: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 16,
  },
  iconContainer: {
    alignItems: 'center',
    borderRadius: 999,
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  message: {
    marginTop: Spacing.xs,
  },
  title: {
    marginBottom: Spacing.xs,
  },
});
