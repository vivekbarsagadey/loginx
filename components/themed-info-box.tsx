/**
 * ThemedInfoBox Component
 * Info/warning/error message box with variants
 *
 * Features:
 * - Variants: info, success, warning, error
 * - Optional icon (auto-selected based on variant)
 * - Dismissible with close button
 * - Action button support
 * - Theme-aware colors with proper contrast
 *
 * @example
 * ```tsx
 * <ThemedInfoBox variant="info">
 *   This is an informational message
 * </ThemedInfoBox>
 *
 * <ThemedInfoBox variant="error" icon="alert-circle">
 *   Something went wrong
 * </ThemedInfoBox>
 *
 * <ThemedInfoBox
 *   variant="success"
 *   dismissible
 *   onDismiss={handleDismiss}
 * >
 *   Changes saved successfully
 * </ThemedInfoBox>
 *
 * <ThemedInfoBox
 *   variant="warning"
 *   action={{ label: "Learn More", onPress: handleLearnMore }}
 * >
 *   Update available
 * </ThemedInfoBox>
 * ```
 */

import { ThemedText } from '@/components/themed-text';
import { BorderRadius, Spacing } from '@/constants/layout';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { memo } from 'react';
import { Pressable, StyleSheet, View, type ViewProps } from 'react-native';

export interface ThemedInfoBoxProps extends ViewProps {
  /**
   * Info box variant
   */
  variant: 'info' | 'success' | 'warning' | 'error';

  /**
   * Custom icon name from Feather icons
   * If not provided, auto-selected based on variant
   */
  icon?: string;

  /**
   * Whether the info box can be dismissed
   * @default false
   */
  dismissible?: boolean;

  /**
   * Dismiss handler
   */
  onDismiss?: () => void;

  /**
   * Optional action button
   */
  action?: {
    label: string;
    onPress: () => void;
  };

  /**
   * Content/message
   */
  children: string | React.ReactNode;
}

function ThemedInfoBoxComponent({ variant, icon, dismissible = false, onDismiss, action, style, children, ...rest }: ThemedInfoBoxProps) {
  const colors = useThemeColors();

  // Default icons for each variant
  const defaultIcons = {
    info: 'info',
    success: 'check-circle',
    warning: 'alert-triangle',
    _error: 'alert-circle',
  };

  const iconName = icon || defaultIcons[variant];

  // Variant colors
  const variantColors = {
    info: {
      bg: `${colors.info}15`, // 15% opacity
      border: colors.info,
      icon: colors.info,
      text: colors.text,
    },
    success: {
      bg: `${colors.success}15`,
      border: colors.success,
      icon: colors.success,
      text: colors.text,
    },
    warning: {
      bg: `${colors.warning}15`,
      border: colors.warning,
      icon: colors.warning,
      text: colors.text,
    },
    _error: {
      bg: `${colors.error}15`,
      border: colors.error,
      icon: colors.error,
      text: colors.text,
    },
  };

  const colorScheme = variantColors[variant];

  const handleDismiss = async () => {
    if (dismissible && onDismiss) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onDismiss();
    }
  };

  const handleAction = async () => {
    if (action) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      action.onPress();
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colorScheme.bg,
          borderColor: colorScheme.border,
        },
        style,
      ]}
      accessible={true}
      accessibilityRole="alert"
      accessibilityLabel={`${variant} message`}
      {...rest}
    >
      {/* Icon */}
      <View style={styles.iconContainer}>
        <Feather name={iconName as keyof typeof Feather.glyphMap} size={20} color={colorScheme.icon} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        {typeof children === 'string' ? (
          <ThemedText type="body" style={[styles.text, { color: colorScheme.text }]}>
            {children}
          </ThemedText>
        ) : (
          children
        )}

        {/* Action Button */}
        {action && (
          <Pressable onPress={handleAction} style={styles.actionButton} accessibilityRole="button" accessibilityLabel={action.label}>
            <ThemedText type="bodyBold" style={[styles.actionText, { color: colorScheme.icon }]}>
              {action.label}
            </ThemedText>
          </Pressable>
        )}
      </View>

      {/* Dismiss Button */}
      {dismissible && (
        <Pressable onPress={handleDismiss} style={styles.dismissButton} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} accessibilityRole="button" accessibilityLabel="Dismiss">
          <Feather name="x" size={18} color={colorScheme.icon} />
        </Pressable>
      )}
    </View>
  );
}

export const ThemedInfoBox = memo(ThemedInfoBoxComponent);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: Spacing.md,
  },
  iconContainer: {
    paddingTop: 2, // Align with text
  },
  content: {
    flex: 1,
    gap: Spacing.sm,
  },
  text: {
    lineHeight: 20,
  },
  actionButton: {
    alignSelf: 'flex-start',
    marginTop: Spacing.xs,
  },
  actionText: {
    textDecorationLine: 'underline',
  },
  dismissButton: {
    paddingTop: 2, // Align with text
  },
});
