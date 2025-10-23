/**
 * ThemedBadge / ThemedChip Component
 * Status indicator badge with color variants
 *
 * Features:
 * - Color variants matching design system
 * - Size variants (sm, md, lg)
 * - Optional icon support
 * - Outlined or filled style
 * - Automatic text color contrast
 *
 * @example
 * ```tsx
 * <ThemedBadge variant="success">Active</ThemedBadge>
 * <ThemedBadge variant="error" size="sm">Failed</ThemedBadge>
 * <ThemedBadge variant="warning" icon="alert-circle">Pending</ThemedBadge>
 * <ThemedBadge variant="info" outlined>New</ThemedBadge>
 * ```
 */

import { ThemedText } from '@/components/themed-text';
import { BorderRadius, Spacing } from '@/constants/layout';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { Feather } from '@expo/vector-icons';
import { memo } from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';

export interface ThemedBadgeProps extends ViewProps {
  /**
   * Color variant
   * @default 'default'
   */
  variant?: 'success' | 'warning' | 'error' | 'info' | 'default' | 'primary';

  /**
   * Size variant
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Icon to show before text
   * Uses Feather icon names
   */
  icon?: string;

  /**
   * Outlined style instead of filled
   * @default false
   */
  outlined?: boolean;

  /**
   * Badge content/text
   */
  children: string | number;
}

function ThemedBadgeComponent({ variant = 'default', size = 'md', icon, outlined = false, style, children, ...rest }: ThemedBadgeProps) {
  const colors = useThemeColors();

  // Get variant colors
  const variantColors = {
    success: { bg: colors.success, text: colors['on-primary'] },
    warning: { bg: colors.warning, text: colors['on-primary'] },
    _error: { bg: colors.error, text: colors['on-primary'] },
    info: { bg: colors.info, text: colors['on-primary'] },
    primary: { bg: colors.primary, text: colors['on-primary'] },
    default: { bg: colors['surface-variant'], text: colors.text },
  };

  const colorScheme = variantColors[variant];

  // Size configurations
  const sizeConfig = {
    sm: {
      paddingVertical: 2,
      paddingHorizontal: 6,
      fontSize: 10,
      iconSize: 10,
      borderRadius: BorderRadius.xs,
    },
    md: {
      paddingVertical: 4,
      paddingHorizontal: 8,
      fontSize: 12,
      iconSize: 12,
      borderRadius: BorderRadius.sm,
    },
    lg: {
      paddingVertical: 6,
      paddingHorizontal: 12,
      fontSize: 14,
      iconSize: 14,
      borderRadius: BorderRadius.sm,
    },
  };

  const config = sizeConfig[size];

  const badgeStyle = {
    paddingVertical: config.paddingVertical,
    paddingHorizontal: config.paddingHorizontal,
    borderRadius: config.borderRadius,
    backgroundColor: outlined ? 'transparent' : colorScheme.bg,
    borderWidth: outlined ? 1 : 0,
    borderColor: outlined ? colorScheme.bg : 'transparent',
  };

  const textColor = outlined ? colorScheme.bg : colorScheme.text;

  return (
    <View style={[styles.container, badgeStyle, style]} accessible={true} accessibilityRole="text" accessibilityLabel={`${variant} badge: ${children}`} {...rest}>
      {icon && <Feather name={icon as keyof typeof Feather.glyphMap} size={config.iconSize} color={textColor} style={styles.icon} />}
      <ThemedText
        style={[
          styles.text,
          {
            fontSize: config.fontSize,
            color: textColor,
            lineHeight: config.fontSize * 1.4,
          },
        ]}
      >
        {children}
      </ThemedText>
    </View>
  );
}

export const ThemedBadge = memo(ThemedBadgeComponent);

// Alias for chip
export const ThemedChip = ThemedBadge;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: Spacing.xs / 2,
  },
  icon: {
    // Icon styling handled by size config
  },
  text: {
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
