import { ThemedText } from '@/components/themed-text';
import { AccessibilityRoles } from '@/constants/accessibility';
import { BorderRadius, Spacing, TouchTarget } from '@/constants/layout';
import { useThemeColor } from '@/hooks/use-theme-color';
import React from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';

export interface ChipProps {
  /** Label text displayed in the chip */
  label: string;
  /** Visual style variant */
  variant?: 'filled' | 'outlined';
  /** Size of the chip */
  size?: 'small' | 'medium';
  /** Called when chip is pressed */
  onPress?: () => void;
  /** Called when delete icon is pressed */
  onDelete?: () => void;
  /** Icon name to display (left side) */
  icon?: React.ReactNode;
  /** Whether chip appears selected */
  selected?: boolean;
  /** Whether chip is disabled */
  disabled?: boolean;
  /** Custom container style */
  style?: ViewStyle;
}

/**
 * Chip component for displaying compact elements like tags, filters, or selections.
 *
 * @example
 * ```tsx
 * // Basic chip
 * <Chip label="React Native" />
 *
 * // Outlined variant
 * <Chip label="TypeScript" variant="outlined" />
 *
 * // Deletable chip
 * <Chip label="Removable" onDelete={() => handleDelete()} />
 *
 * // Clickable chip
 * <Chip label="Filter" onPress={() => handlePress()} />
 *
 * // Selected chip
 * <Chip label="Active" selected />
 * ```
 */
export function Chip({ label, variant = 'filled', size = 'medium', onPress, onDelete, icon, selected = false, disabled = false, style }: ChipProps) {
  const primaryColor = useThemeColor({}, 'primary');
  const surfaceColor = useThemeColor({}, 'surface');
  const textColor = useThemeColor({}, 'text');
  const mutedColor = useThemeColor({}, 'text-muted');
  const onPrimaryColor = useThemeColor({}, 'on-primary');
  const borderColor = useThemeColor({}, 'border');

  const isInteractive = !!onPress || !!onDelete;

  // Determine colors based on variant and state
  const getBackgroundColor = () => {
    if (disabled) {
      return surfaceColor;
    }
    if (selected) {
      return primaryColor;
    }
    if (variant === 'outlined') {
      return 'transparent';
    }
    return surfaceColor;
  };

  const getTextColor = () => {
    if (disabled) {
      return mutedColor;
    }
    if (selected) {
      return onPrimaryColor;
    }
    return textColor;
  };

  const getBorderColor = () => {
    if (disabled) {
      return borderColor;
    }
    if (selected) {
      return primaryColor;
    }
    return borderColor;
  };

  const handlePress = () => {
    if (!disabled && onPress) {
      onPress();
    }
  };

  const handleDelete = () => {
    if (!disabled && onDelete) {
      onDelete();
    }
  };

  // Get size-specific styles
  const containerSizeStyle = size === 'small' ? styles.smallContainer : styles.mediumContainer;
  const textSizeStyle = size === 'small' ? styles.smallText : styles.mediumText;

  const content = (
    <>
      {icon && <View style={styles.icon}>{icon}</View>}
      <ThemedText style={[textSizeStyle, { color: getTextColor() }, disabled && styles.disabledText]} numberOfLines={1}>
        {label}
      </ThemedText>
      {onDelete && !disabled && (
        <Pressable
          onPress={handleDelete}
          style={styles.deleteButton}
          accessibilityRole={AccessibilityRoles.BUTTON}
          accessibilityLabel={`Delete ${label}`}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <ThemedText style={[styles.deleteIcon, { color: getTextColor() }]}>×</ThemedText>
        </Pressable>
      )}
    </>
  );

  const containerStyle: ViewStyle = {
    backgroundColor: getBackgroundColor(),
    borderColor: getBorderColor(),
    opacity: disabled ? 0.5 : 1,
  };

  if (isInteractive && onPress) {
    return (
      <Pressable
        onPress={handlePress}
        disabled={disabled}
        style={({ pressed }) => [styles.container, containerSizeStyle, variant === 'outlined' && styles.outlined, containerStyle, pressed && !disabled && styles.pressed, style]}
        accessibilityRole={AccessibilityRoles.BUTTON}
        accessibilityLabel={label}
        accessibilityState={{ disabled, selected }}
      >
        {content}
      </Pressable>
    );
  }

  return <View style={[styles.container, containerSizeStyle, variant === 'outlined' && styles.outlined, containerStyle, style]}>{content}</View>;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  outlined: {
    borderWidth: 1,
  },
  pressed: {
    opacity: 0.7,
  },
  icon: {
    marginRight: Spacing.xs,
  },
  deleteButton: {
    marginLeft: Spacing.xs,
    minWidth: TouchTarget.minimum / 2,
    minHeight: TouchTarget.minimum / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteIcon: {
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 20,
  },
  disabledText: {
    opacity: 0.5,
  },
  // Size variants - Container
  smallContainer: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    height: 24,
  },
  mediumContainer: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    height: 32,
  },
  // Size variants - Text
  smallText: {
    fontSize: 12,
    lineHeight: 16,
  },
  mediumText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
