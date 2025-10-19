import { Spacing } from '@/constants/layout';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme-context';
import { Ionicons } from '@expo/vector-icons';
import React, { memo, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedButton } from '../themed-button';
import { ThemedText } from '../themed-text';
import { ThemedView } from '../themed-view';

export type ErrorSeverity = 'error' | 'warning' | 'info';

export interface ErrorAction {
  /** Action button label */
  label: string;
  /** Action button callback */
  onPress: () => void | Promise<void>;
  /** Button variant (default: 'primary') */
  variant?: 'primary' | 'secondary' | 'link';
}

export interface ErrorBannerProps {
  /** Error title */
  title: string;
  /** Error message/description */
  message: string;
  /** Error severity (affects colors and icons) */
  severity?: ErrorSeverity;
  /** Optional custom illustration */
  illustration?: ReactNode;
  /** Primary action (e.g., Retry, Try Again) */
  primaryAction?: ErrorAction;
  /** Secondary action (e.g., Cancel, Dismiss) */
  secondaryAction?: ErrorAction;
  /** Show dismiss button (X in top right) */
  dismissible?: boolean;
  /** Callback when dismissed */
  onDismiss?: () => void;
  /** Show icon (if no illustration provided) */
  showIcon?: boolean;
}

/**
 * ErrorBanner component
 *
 * Reusable component for displaying errors, warnings, and informational messages
 * with optional illustrations, actions, and recovery steps.
 *
 * @example
 * ```tsx
 * <ErrorBanner
 *   title="Network Error"
 *   message="Please check your internet connection and try again."
 *   severity="error"
 *   illustration={<ErrorNetworkIllustration />}
 *   primaryAction={{
 *     label: "Try Again",
 *     onPress: handleRetry
 *   }}
 *   secondaryAction={{
 *     label: "Cancel",
 *     onPress: handleCancel,
 *     variant: "secondary"
 *   }}
 *   dismissible
 *   onDismiss={handleDismiss}
 * />
 * ```
 */
export const ErrorBanner = memo(function ErrorBanner({
  title,
  message,
  severity = 'error',
  illustration,
  primaryAction,
  secondaryAction,
  dismissible = false,
  onDismiss,
  showIcon = true,
}: ErrorBannerProps) {
  const { resolvedTheme } = useTheme();
  const colors = Colors[resolvedTheme];

  const getSeverityColor = (): string => {
    switch (severity) {
      case 'error':
        return colors.error;
      case 'warning':
        return colors.warning;
      case 'info':
        return colors.info;
      default:
        return colors.error;
    }
  };

  const getSeverityIcon = (): keyof typeof Ionicons.glyphMap => {
    switch (severity) {
      case 'error':
        return 'alert-circle';
      case 'warning':
        return 'warning';
      case 'info':
        return 'information-circle';
      default:
        return 'alert-circle';
    }
  };

  const severityColor = getSeverityColor();

  return (
    <ThemedView
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderLeftColor: severityColor,
        },
      ]}
      accessibilityRole="alert"
    >
      {/* Dismiss button */}
      {dismissible && onDismiss && (
        <Ionicons name="close" size={20} color={colors['text-muted']} style={styles.dismissButton} onPress={onDismiss} accessibilityRole="button" accessibilityLabel="Dismiss error" />
      )}

      {/* Illustration or Icon */}
      {illustration ? (
        <View style={styles.illustrationContainer}>{illustration}</View>
      ) : (
        showIcon && (
          <View style={styles.iconContainer}>
            <Ionicons name={getSeverityIcon()} size={48} color={severityColor} />
          </View>
        )
      )}

      {/* Content */}
      <View style={styles.content}>
        <ThemedText type="subtitle1" style={[styles.title, { color: severityColor }]} accessibilityRole="header">
          {title}
        </ThemedText>
        <ThemedText type="body" style={styles.message} accessibilityLabel={`Error message: ${message}`}>
          {message}
        </ThemedText>

        {/* Actions */}
        {(primaryAction || secondaryAction) && (
          <View style={styles.actionsContainer}>
            {primaryAction && (
              <ThemedButton
                title={primaryAction.label}
                onPress={primaryAction.onPress}
                variant={primaryAction.variant || 'primary'}
                style={styles.actionButton}
                accessibilityLabel={`${primaryAction.label} button`}
                accessibilityHint="Tap to perform this action"
              />
            )}
            {secondaryAction && (
              <ThemedButton
                title={secondaryAction.label}
                onPress={secondaryAction.onPress}
                variant={secondaryAction.variant || 'secondary'}
                style={styles.actionButton}
                accessibilityLabel={`${secondaryAction.label} button`}
              />
            )}
          </View>
        )}
      </View>
    </ThemedView>
  );
});

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: Spacing.lg,
    marginVertical: Spacing.md,
    borderLeftWidth: 4,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dismissButton: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    padding: Spacing.xs,
    zIndex: 1,
  },
  illustrationContainer: {
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  content: {
    gap: Spacing.sm,
  },
  title: {
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  message: {
    lineHeight: 22,
    opacity: 0.9,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.md,
    flexWrap: 'wrap',
  },
  actionButton: {
    flex: 1,
    minWidth: 100,
  },
});
