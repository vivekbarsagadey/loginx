import { SectionHeader } from '@/components/molecules/section-header';
import { SettingItem } from '@/components/molecules/setting-item';
import { ThemedDivider } from '@/components/themed-divider';
import { Card } from '@/components/ui/card';
import { Spacing } from '@/constants/layout';
import type React from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';

export interface SettingsItemConfig {
  icon: string;
  title: string;
  subtitle?: string;
  type: 'link' | 'action' | 'danger';
  href?: string;
  action?: string;
  rightElement?: React.ReactNode;
}

interface SettingsSectionProps {
  /**
   * Optional section title
   */
  title?: string;
  /**
   * Optional section subtitle
   */
  subtitle?: string;
  /**
   * Array of settings items to display
   */
  items: SettingsItemConfig[];
  /**
   * Handler for item press events
   */
  onItemPress: (item: SettingsItemConfig) => void;
  /**
   * Optional style overrides
   */
  style?: ViewStyle;
  /**
   * Elevation of the card
   * @default 1
   */
  elevation?: 0 | 1 | 2 | 3 | 4 | 5;
}

/**
 * SettingsSection component for displaying a group of related settings.
 * Handles both navigation links and action items with proper styling.
 *
 * @example
 * <SettingsSection
 *   title="Account Settings"
 *   items={[
 *     { icon: 'user', title: 'Edit Profile', type: 'link', href: '/profile/edit' },
 *     { icon: 'mail', title: 'Update Email', type: 'link', href: '/profile/update-email' },
 *   ]}
 *   onItemPress={(item) => handleItemPress(item)}
 * />
 */
export function SettingsSection({ title, subtitle, items, onItemPress, style, elevation = 1 }: SettingsSectionProps) {
  return (
    <View style={[styles.container, style]}>
      {title && <SectionHeader title={title} subtitle={subtitle} style={styles.header} />}
      <Card elevation={elevation} noPadding>
        {items.map((item, index) => (
          <View key={`${item.title}-${index}`}>
            <SettingItem
              icon={item.icon as React.ComponentProps<typeof SettingItem>['icon']}
              title={item.title}
              subtitle={item.subtitle}
              onPress={() => onItemPress(item)}
              variant={item.type === 'danger' ? 'danger' : 'default'}
              showChevron={item.type === 'link' || item.type === 'action' || item.type === 'danger'}
              rightElement={item.rightElement}
            />
            {index < items.length - 1 && (
              <View style={{ marginLeft: Spacing.md + 24 + Spacing.md }}>
                <ThemedDivider spacing="sm" />
              </View>
            )}
          </View>
        ))}
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  header: {
    marginBottom: Spacing.sm,
  },
});
