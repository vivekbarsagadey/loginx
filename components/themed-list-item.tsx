/**
 * ThemedListItem Component
 * Reusable list row with icon, text, and optional actions
 *
 * Features:
 * - Icon with automatic container
 * - Title and description
 * - Right chevron or badge
 * - Optional switch/toggle
 * - Loading state
 * - Pressable with haptics
 * - Theme-aware
 *
 * @example
 * ```tsx
 * <ThemedListItem
 *   icon="settings"
 *   title="Settings"
 *   description="Manage your preferences"
 *   onPress={handlePress}
 *   showChevron
 * />
 *
 * <ThemedListItem
 *   icon="notifications"
 *   title="Notifications"
 *   badge="5"
 *   badgeVariant="error"
 * />
 *
 * <ThemedListItem
 *   icon="dark-mode"
 *   title="Dark Mode"
 *   switchValue={isDark}
 *   onSwitchChange={setIsDark}
 * />
 * ```
 */

import { ThemedBadge } from '@/components/themed-badge';
import { ThemedIconContainer } from '@/components/themed-icon-container';
import { ThemedPressable } from '@/components/themed-pressable';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/layout';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { Feather } from '@expo/vector-icons';
import { memo } from 'react';
import { ActivityIndicator, StyleSheet, Switch, View } from 'react-native';

export interface ThemedListItemProps {
  /**
   * Icon name from Feather icons
   */
  icon?: string;

  /**
   * Icon variant color
   * @default 'default'
   */
  iconVariant?: 'primary' | 'success' | 'warning' | 'error' | 'info' | 'default';

  /**
   * Item title
   */
  title: string;

  /**
   * Item description/subtitle
   */
  description?: string;

  /**
   * Show chevron on the right
   * @default false
   */
  showChevron?: boolean;

  /**
   * Badge content to show on the right
   */
  badge?: string | number;

  /**
   * Badge variant
   * @default 'default'
   */
  badgeVariant?: 'success' | 'warning' | 'error' | 'info' | 'default' | 'primary';

  /**
   * Press handler
   */
  onPress?: () => void;

  /**
   * Loading state
   * @default false
   */
  loading?: boolean;

  /**
   * Custom right content
   */
  rightElement?: React.ReactNode;

  /**
   * Switch value (for toggle items)
   */
  switchValue?: boolean;

  /**
   * Switch change handler
   */
  onSwitchChange?: (value: boolean) => void;

  /**
   * Disabled state
   * @default false
   */
  disabled?: boolean;

  /**
   * Show bottom border
   * @default true
   */
  showBorder?: boolean;
}

function ThemedListItemComponent({
  icon,
  iconVariant = 'default',
  title,
  description,
  showChevron = false,
  badge,
  badgeVariant = 'default',
  onPress,
  loading = false,
  rightElement,
  switchValue,
  onSwitchChange,
  disabled = false,
  showBorder = true,
}: ThemedListItemProps) {
  const colors = useThemeColors();

  const hasPress = Boolean(onPress);

  const content = (
    <View
      style={[
        styles.container,
        showBorder && {
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        },
      ]}
    >
      {/* Icon */}
      {icon && <ThemedIconContainer icon={icon} variant={iconVariant} size="md" />}

      {/* Content */}
      <View style={styles.content}>
        <ThemedText type="body" style={styles.title}>
          {title}
        </ThemedText>
        {description && (
          <ThemedText type="caption" style={[styles.description, { color: colors['text-muted'] }]}>
            {description}
          </ThemedText>
        )}
      </View>

      {/* Right Content */}
      <View style={styles.rightContent}>
        {loading ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : rightElement ? (
          rightElement
        ) : switchValue !== undefined && onSwitchChange ? (
          <Switch
            value={switchValue}
            onValueChange={onSwitchChange}
            disabled={disabled}
            trackColor={{
              false: colors.border,
              true: colors.primary,
            }}
            thumbColor={colors.background}
          />
        ) : badge !== undefined ? (
          <ThemedBadge variant={badgeVariant} size="sm">
            {badge}
          </ThemedBadge>
        ) : showChevron ? (
          <Feather name="chevron-right" size={20} color={colors['text-muted']} />
        ) : null}
      </View>
    </View>
  );

  if (hasPress && !disabled) {
    return (
      <ThemedPressable variant="none" onPress={onPress} disabled={disabled || loading} accessibilityRole="button" accessibilityLabel={title} accessibilityHint={description}>
        {content}
      </ThemedPressable>
    );
  }

  return content;
}

export const ThemedListItem = memo(ThemedListItemComponent);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    gap: Spacing.md,
    minHeight: 60,
  },
  content: {
    flex: 1,
    gap: Spacing.xs / 2,
  },
  title: {
    fontWeight: '500',
  },
  description: {
    lineHeight: 16,
  },
  rightContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
