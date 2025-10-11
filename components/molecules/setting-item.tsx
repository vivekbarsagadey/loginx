import { ThemedText } from '@/components/themed-text';
import { Spacing, TouchTarget } from '@/constants/layout';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Feather } from '@expo/vector-icons';
import type React from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity, View, type ViewStyle } from 'react-native';

interface SettingItemProps {
  /**
   * Icon name from Feather icons
   */
  icon: React.ComponentProps<typeof Feather>['name'];
  /**
   * Title text
   */
  title: string;
  /**
   * Optional subtitle text
   */
  subtitle?: string;
  /**
   * Press handler
   */
  onPress: () => void;
  /**
   * Visual variant
   * @default 'default'
   */
  variant?: 'default' | 'danger';
  /**
   * Whether to show chevron indicator
   * @default true
   */
  showChevron?: boolean;
  /**
   * Custom right element to display instead of chevron
   */
  rightElement?: React.ReactNode;
  /**
   * Whether the item is disabled
   * @default false
   */
  disabled?: boolean;
  /**
   * Whether the item is in a loading state
   * @default false
   */
  loading?: boolean;
  /**
   * Optional style overrides
   */
  style?: ViewStyle;
  /**
   * Test ID for testing
   */
  testID?: string;
  /**
   * Accessibility label
   */
  accessibilityLabel?: string;
  /**
   * Accessibility hint
   */
  accessibilityHint?: string;
}

/**
 * SettingItem component for displaying individual settings in a list.
 * Supports danger variant for destructive actions, loading states, and custom right elements.
 *
 * @example
 * <SettingItem
 *   icon="user"
 *   title="Edit Profile"
 *   subtitle="Update your information"
 *   onPress={() => navigate('/profile/edit')}
 * />
 * <SettingItem
 *   icon="trash-2"
 *   title="Delete Account"
 *   variant="danger"
 *   onPress={handleDelete}
 * />
 */
export function SettingItem({
  icon,
  title,
  subtitle,
  onPress,
  variant = 'default',
  showChevron = true,
  rightElement,
  disabled = false,
  loading = false,
  style,
  testID,
  accessibilityLabel,
  accessibilityHint,
}: SettingItemProps) {
  const textColor = useThemeColor({}, 'text');
  const textMutedColor = useThemeColor({}, 'text-muted');
  const errorColor = useThemeColor({}, 'error');

  const isDanger = variant === 'danger';
  const iconColor = isDanger ? errorColor : textColor;
  const titleColor = isDanger ? errorColor : textColor;

  return (
    <TouchableOpacity
      style={[styles.container, disabled && styles.disabled, style]}
      onPress={onPress}
      disabled={disabled || loading}
      testID={testID}
      accessible
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: disabled || loading }}
    >
      <View style={styles.iconContainer}>
        <Feather name={icon} size={24} color={iconColor} />
      </View>
      <View style={styles.content}>
        <ThemedText style={[styles.title, { color: titleColor }]}>{title}</ThemedText>
        {subtitle && (
          <ThemedText type="caption" style={[styles.subtitle, { color: textMutedColor }]}>
            {subtitle}
          </ThemedText>
        )}
      </View>
      <View style={styles.rightContainer}>
        {loading ? <ActivityIndicator size="small" color={textMutedColor} /> : rightElement ? rightElement : showChevron ? <Feather name="chevron-right" size={24} color={textMutedColor} /> : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    minHeight: TouchTarget.large,
  },
  disabled: {
    opacity: 0.5,
  },
  iconContainer: {
    marginRight: Spacing.md,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
  },
  subtitle: {
    marginTop: Spacing.xs,
    opacity: 0.7,
  },
  rightContainer: {
    marginLeft: Spacing.md,
    minWidth: 24,
    alignItems: 'flex-end',
  },
});
