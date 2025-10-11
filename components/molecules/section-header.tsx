import { ThemedText } from '@/components/themed-text';
import { Spacing, TouchTarget } from '@/constants/layout';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Feather } from '@expo/vector-icons';
import type React from 'react';
import { StyleSheet, TouchableOpacity, View, type ViewStyle } from 'react-native';

interface SectionHeaderProps {
  /**
   * Main title text
   */
  title: string;
  /**
   * Optional subtitle text
   */
  subtitle?: string;
  /**
   * Optional action button configuration
   */
  action?: {
    label: string;
    onPress: () => void;
  };
  /**
   * Optional icon name from Feather icons
   */
  icon?: React.ComponentProps<typeof Feather>['name'];
  /**
   * Optional style overrides
   */
  style?: ViewStyle;
  /**
   * Accessibility label for the header
   */
  accessibilityLabel?: string;
}

/**
 * SectionHeader component for displaying section titles with optional subtitles and actions.
 * Commonly used to separate different sections of content.
 *
 * @example
 * <SectionHeader title="Account Settings" />
 * <SectionHeader
 *   title="Notifications"
 *   subtitle="Manage your notification preferences"
 * />
 * <SectionHeader
 *   title="Recent Activity"
 *   action={{ label: "View All", onPress: () => navigate('/activity') }}
 * />
 */
export function SectionHeader({ title, subtitle, action, icon, style, accessibilityLabel }: SectionHeaderProps) {
  const tintColor = useThemeColor({}, 'primary');
  const textColor = useThemeColor({}, 'text');

  return (
    <View style={[styles.container, style]} accessible accessibilityRole="header" accessibilityLabel={accessibilityLabel || title}>
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          {icon && (
            <View style={styles.iconContainer}>
              <Feather name={icon} size={20} color={textColor} />
            </View>
          )}
          <View style={styles.textContainer}>
            <ThemedText type="h3" style={styles.title}>
              {title}
            </ThemedText>
            {subtitle && (
              <ThemedText type="caption" style={styles.subtitle}>
                {subtitle}
              </ThemedText>
            )}
          </View>
        </View>
        {action && (
          <TouchableOpacity
            onPress={action.onPress}
            style={styles.actionButton}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessible
            accessibilityRole="button"
            accessibilityLabel={action.label}
          >
            <ThemedText style={[styles.actionText, { color: tintColor }]}>{action.label}</ThemedText>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.sm,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: Spacing.sm,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    marginBottom: 0,
  },
  subtitle: {
    marginTop: Spacing.xs,
    opacity: 0.7,
  },
  actionButton: {
    minHeight: TouchTarget.minimum,
    justifyContent: 'center',
    marginLeft: Spacing.md,
  },
  actionText: {
    fontWeight: '600',
    fontSize: 14,
  },
});
