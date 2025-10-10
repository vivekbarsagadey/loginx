import { ThemedText } from '@/components/themed-text';
import { IconSize, Spacing, Typography } from '@/constants/layout';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Feather } from '@expo/vector-icons';
import type { ComponentProps, ReactNode } from 'react';
import { ActivityIndicator, StyleSheet, Switch, View } from 'react-native';

interface SettingRowProps {
  /** Icon name from Feather icons */
  icon: ComponentProps<typeof Feather>['name'];
  /** Setting title */
  title: string;
  /** Setting description */
  description: string;
  /** Whether this is the last row (no bottom border) */
  isLast?: boolean;
  /** Current switch value (for toggle settings) */
  value?: boolean;
  /** Toggle change handler (for toggle settings) */
  onValueChange?: (value: boolean) => void;
  /** Loading state */
  loading?: boolean;
  /** Custom right content (instead of switch) */
  rightContent?: ReactNode;
  /** Custom style */
  style?: object;
}

/**
 * Reusable SettingRow component
 * Displays a setting with icon, title, description, and optional switch or custom content
 * Extracted from notifications.tsx for reuse across settings screens
 */
export function SettingRow({ icon, title, description, isLast = false, value, onValueChange, loading = false, rightContent, style }: SettingRowProps) {
  const borderColor = useThemeColor({}, 'border');
  const backgroundColor = useThemeColor({}, 'bg');
  const tintColor = useThemeColor({}, 'primary');
  const textMutedColor = useThemeColor({}, 'text-muted');

  return (
    <View
      style={[
        styles.settingRow,
        {
          borderBottomColor: borderColor,
          backgroundColor,
        },
        isLast && styles.settingRowLast,
        style,
      ]}
    >
      <View style={[styles.iconContainer, { backgroundColor: tintColor + '20' }]}>
        <Feather name={icon} size={IconSize.md} color={tintColor} />
      </View>
      <View style={styles.settingInfo}>
        <ThemedText style={styles.settingTitle}>{title}</ThemedText>
        <ThemedText type="caption" style={[styles.settingDescription, { color: textMutedColor }]}>
          {description}
        </ThemedText>
      </View>
      {loading ? (
        <ActivityIndicator />
      ) : rightContent ? (
        rightContent
      ) : value !== undefined && onValueChange ? (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{
            false: borderColor,
            true: tintColor,
          }}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
  },
  settingRowLast: {
    borderBottomWidth: 0,
  },
  iconContainer: {
    width: Spacing.xxl, // 40px
    height: Spacing.xxl, // 40px
    borderRadius: Spacing.lg - Spacing.xs, // 20px
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  settingInfo: {
    flex: 1,
    marginRight: Spacing.md,
  },
  settingTitle: {
    fontWeight: Typography.bodyBold.fontWeight,
    marginBottom: Spacing.xs,
  },
  settingDescription: {
    opacity: 0.8,
  },
});
