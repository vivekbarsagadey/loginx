import { ThemedText } from '@/components/themed-text';
import { BorderRadius, Spacing } from '@/constants/layout';
import { useThemeColor } from '@/hooks/use-theme-color';
import React from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';

export interface BadgeProps {
  /** Badge content (number or text) */
  content?: string | number;
  /** Visual variant based on semantic meaning */
  variant?: 'primary' | 'error' | 'success' | 'warning' | 'info' | 'default';
  /** Size of the badge */
  size?: 'small' | 'medium' | 'large';
  /** Show as a dot without content */
  dot?: boolean;
  /** Maximum number to display (e.g., 99+) */
  max?: number;
  /** Hide the badge */
  invisible?: boolean;
  /** Anchor point for badge positioning */
  anchorPosition?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  /** Content to attach badge to */
  children?: React.ReactNode;
  /** Custom style for the badge */
  style?: ViewStyle;
}

/**
 * Badge component for displaying counts, notifications, or status indicators.
 *
 * @example
 * ```tsx
 * // Notification badge
 * <Badge content={5}>
 *   <Icon name="notifications" />
 * </Badge>
 *
 * // Dot badge (status indicator)
 * <Badge dot variant="error">
 *   <Icon name="message" />
 * </Badge>
 *
 * // Badge with max value
 * <Badge content={100} max={99}>
 *   <Icon name="email" />
 * </Badge>
 *
 * // Standalone badge
 * <Badge content="New" variant="success" />
 * ```
 */
export function Badge({ content, variant = 'default', size = 'medium', dot = false, max, invisible = false, anchorPosition = 'top-right', children, style }: BadgeProps) {
  const primaryColor = useThemeColor({}, 'primary');
  const errorColor = useThemeColor({}, 'error');
  const successColor = useThemeColor({}, 'success');
  const warningColor = useThemeColor({}, 'warning');
  const infoColor = useThemeColor({}, 'info');
  const surfaceColor = useThemeColor({}, 'surface');
  const textColor = useThemeColor({}, 'text');
  const onPrimaryColor = useThemeColor({}, 'on-primary');

  if (invisible) {
    return <>{children}</>;
  }

  // Determine badge color based on variant
  const getBadgeColor = (): string => {
    switch (variant) {
      case 'primary':
        return primaryColor;
      case 'error':
        return errorColor;
      case 'success':
        return successColor;
      case 'warning':
        return warningColor;
      case 'info':
        return infoColor;
      default:
        return surfaceColor;
    }
  };

  // Determine text color (white for colored backgrounds, text color for default)
  const getTextColor = (): string => {
    return variant === 'default' ? textColor : onPrimaryColor;
  };

  // Format content with max value
  const formattedContent = content !== undefined && max !== undefined && typeof content === 'number' && content > max ? `${max}+` : content;

  // Get size styles
  const sizeStyle = dot ? styles.dot : size === 'small' ? styles.small : size === 'large' ? styles.large : styles.medium;

  // Get anchor position styles
  const getAnchorStyles = (): ViewStyle => {
    const offset = size === 'small' ? -4 : size === 'large' ? -8 : -6;

    switch (anchorPosition) {
      case 'top-left':
        return { top: offset, left: offset };
      case 'bottom-right':
        return { bottom: offset, right: offset };
      case 'bottom-left':
        return { bottom: offset, left: offset };
      case 'top-right':
      default:
        return { top: offset, right: offset };
    }
  };

  const badgeElement = (
    <View style={[styles.badge, sizeStyle, { backgroundColor: getBadgeColor() }, children ? styles.absolute : undefined, children ? getAnchorStyles() : undefined, style]}>
      {!dot && formattedContent !== undefined && (
        <ThemedText style={[styles.text, size === 'small' && styles.smallText, size === 'large' && styles.largeText, { color: getTextColor() }]}>{formattedContent}</ThemedText>
      )}
    </View>
  );

  // If no children, return standalone badge
  if (!children) {
    return badgeElement;
  }

  // Return badge anchored to children
  return (
    <View style={styles.container}>
      {children}
      {badgeElement}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignSelf: 'flex-start',
  },
  badge: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BorderRadius.full,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  absolute: {
    position: 'absolute',
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 14,
  },
  smallText: {
    fontSize: 10,
    lineHeight: 12,
  },
  largeText: {
    fontSize: 14,
    lineHeight: 16,
  },
  // Size variants
  dot: {
    width: 8,
    height: 8,
    minWidth: 8,
    minHeight: 8,
  },
  small: {
    minWidth: 16,
    minHeight: 16,
    paddingHorizontal: Spacing.xs,
  },
  medium: {
    minWidth: 20,
    minHeight: 20,
    paddingHorizontal: Spacing.xs,
  },
  large: {
    minWidth: 24,
    minHeight: 24,
    paddingHorizontal: Spacing.sm,
  },
});
