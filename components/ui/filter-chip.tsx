import { BorderRadius, Spacing } from '@/constants/layout';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import React, { memo } from 'react';
import { Pressable, StyleSheet, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { ThemedText } from '../themed-text';

export interface FilterChipProps {
  /**
   * Chip label text
   */
  label: string;
  /**
   * Whether the chip is selected
   */
  selected?: boolean;
  /**
   * Press handler
   */
  onPress?: () => void;
  /**
   * Optional icon name (Ionicons)
   */
  icon?: keyof typeof Ionicons.glyphMap;
  /**
   * Whether to show close button
   */
  closable?: boolean;
  /**
   * Close button press handler
   */
  onClose?: () => void;
  /**
   * Chip size variant
   */
  size?: 'small' | 'medium';
  /**
   * Container style override
   */
  style?: ViewStyle;
  /**
   * Whether the chip is disabled
   */
  disabled?: boolean;
}

/**
 * FilterChip Component
 * 
 * Selectable chip component for filters and tags.
 * Used in filter bars, tag lists, and selection interfaces.
 * 
 * @example Basic usage
 * ```tsx
 * <FilterChip
 *   label="Active"
 *   selected={filter === 'active'}
 *   onPress={() => setFilter('active')}
 * />
 * ```
 * 
 * @example With icon
 * ```tsx
 * <FilterChip
 *   label="Favorites"
 *   icon="heart"
 *   selected={showFavorites}
 *   onPress={() => setShowFavorites(!showFavorites)}
 * />
 * ```
 * 
 * @example Closable chip
 * ```tsx
 * <FilterChip
 *   label="JavaScript"
 *   selected
 *   closable
 *   onClose={() => removeTag('javascript')}
 * />
 * ```
 */
function FilterChipComponent({
  label,
  selected = false,
  onPress,
  icon,
  closable = false,
  onClose,
  size = 'medium',
  style,
  disabled = false,
}: FilterChipProps) {
  const primaryColor = useThemeColor({}, 'primary');
  const surfaceColor = useThemeColor({}, 'surface');
  const textColor = useThemeColor({}, 'text');
  const mutedTextColor = useThemeColor({}, 'text-muted');
  const borderColor = useThemeColor({}, 'border');

  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 10 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 10 });
  };

  const handlePress = () => {
    if (!disabled && onPress) {
      onPress();
    }
  };

  const handleClose = (e: any) => {
    e.stopPropagation();
    if (onClose) {
      onClose();
    }
  };

  const backgroundColor = selected ? primaryColor : surfaceColor;
  const chipTextColor = selected ? '#FFFFFF' : textColor;
  const iconColor = selected ? '#FFFFFF' : mutedTextColor;

  const isSmall = size === 'small';
  const paddingVertical = isSmall ? Spacing.xs : Spacing.sm;
  const paddingHorizontal = isSmall ? Spacing.sm : Spacing.md;
  const fontSize = isSmall ? 12 : 14;
  const iconSize = isSmall ? 14 : 16;

  return (
    <Animated.View style={[animatedStyle, style]}>
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        style={[
          styles.chip,
          {
            backgroundColor,
            borderColor: selected ? primaryColor : borderColor,
            paddingVertical,
            paddingHorizontal,
            opacity: disabled ? 0.5 : 1,
          },
        ]}
        accessibilityRole="button"
        accessibilityState={{ selected, disabled }}
        accessibilityLabel={`${label} ${selected ? 'selected' : 'not selected'}`}
      >
        {icon && (
          <Ionicons
            name={icon}
            size={iconSize}
            color={iconColor}
            style={styles.icon}
          />
        )}
        <ThemedText
          type="body"
          style={[styles.label, { color: chipTextColor, fontSize }]}
        >
          {label}
        </ThemedText>
        {closable && (
          <Pressable
            onPress={handleClose}
            style={styles.closeButton}
            accessibilityRole="button"
            accessibilityLabel={`Remove ${label}`}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="close-circle" size={iconSize} color={iconColor} />
          </Pressable>
        )}
      </Pressable>
    </Animated.View>
  );
}

export const FilterChip = memo(FilterChipComponent);

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    gap: Spacing.xs,
  },
  icon: {
    marginRight: -2,
  },
  label: {
    fontWeight: '500',
  },
  closeButton: {
    marginLeft: -2,
  },
});
