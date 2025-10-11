import { ThemedText } from '@/components/themed-text';
import { Spacing, TouchTarget } from '@/constants/layout';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { Feather } from '@expo/vector-icons';
import type React from 'react';
import { StyleSheet, TouchableOpacity, View, type ViewStyle } from 'react-native';

interface InfoRowProps {
  /**
   * Icon name from Feather icons
   */
  icon?: React.ComponentProps<typeof Feather>['name'];
  /**
   * Label text
   */
  label: string;
  /**
   * Value text to display
   */
  value: string;
  /**
   * Custom icon color. If not provided, uses theme text color
   */
  iconColor?: string;
  /**
   * Handler for press events. If provided, makes the row pressable
   */
  onPress?: () => void;
  /**
   * Custom right element to display instead of value
   */
  rightElement?: React.ReactNode;
  /**
   * Optional style overrides
   */
  style?: ViewStyle;
  /**
   * Accessibility label for the row
   */
  accessibilityLabel?: string;
  /**
   * Accessibility hint for the row
   */
  accessibilityHint?: string;
}

/**
 * InfoRow component for displaying label-value pairs with optional icons.
 * Can be made interactive with onPress handler.
 *
 * @example
 * <InfoRow
 *   icon="mail"
 *   label="Email"
 *   value="user@example.com"
 * />
 * <InfoRow
 *   icon="phone"
 *   label="Phone"
 *   value="+1 234 567 8900"
 *   onPress={() => makeCall()}
 * />
 */
export function InfoRow({ icon, label, value, iconColor, onPress, rightElement, style, accessibilityLabel, accessibilityHint }: InfoRowProps) {
  const colors = useThemeColors();
  const finalIconColor = iconColor || colors.text;

  const content = (
    <View style={[styles.container, style]}>
      {icon && (
        <View style={styles.iconContainer}>
          <Feather name={icon} size={20} color={finalIconColor} />
        </View>
      )}
      <View style={styles.content}>
        <ThemedText type="body" style={styles.label}>
          {label}
        </ThemedText>
        {rightElement || (
          <ThemedText type="body" style={[styles.value, { color: colors['text-muted'] }]}>
            {value}
          </ThemedText>
        )}
      </View>
      {onPress && (
        <View style={styles.chevronContainer}>
          <Feather name="chevron-right" size={20} color={colors['text-muted']} />
        </View>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={styles.touchable}
        accessible
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel || `${label}: ${value}`}
        accessibilityHint={accessibilityHint}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return (
    <View accessible accessibilityRole="text" accessibilityLabel={accessibilityLabel || `${label}: ${value}`}>
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  touchable: {
    minHeight: TouchTarget.comfortable,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  iconContainer: {
    marginRight: Spacing.md,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    flex: 1,
  },
  value: {
    textAlign: 'right',
    marginLeft: Spacing.sm,
  },
  chevronContainer: {
    marginLeft: Spacing.sm,
  },
});
