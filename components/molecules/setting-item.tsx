import { ThemedListItem } from '@/components/themed-list-item';
import { type Feather } from '@expo/vector-icons';
import type React from 'react';
import type { ViewStyle } from 'react-native';

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
 * Now uses ThemedListItem for consistency and reduced code.
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
export function SettingItem({ icon, title, subtitle, onPress, variant = 'default', showChevron = true, rightElement, disabled = false, loading = false }: SettingItemProps) {
  const iconVariant = variant === 'danger' ? 'error' : 'default';

  return (
    <ThemedListItem
      icon={icon}
      iconVariant={iconVariant}
      title={title}
      description={subtitle}
      onPress={onPress}
      showChevron={showChevron}
      rightElement={rightElement}
      loading={loading}
      disabled={disabled}
    />
  );
}
