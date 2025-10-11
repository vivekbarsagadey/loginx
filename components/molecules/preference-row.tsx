import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/layout';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Feather } from '@expo/vector-icons';
import type React from 'react';
import { StyleSheet, TouchableOpacity, View, type ViewStyle } from 'react-native';

interface PreferenceRowProps {
  /**
   * Label text (preference name)
   */
  label: string;
  /**
   * Value text (preference state)
   */
  value: string;
  /**
   * Optional icon name from Feather icons
   */
  icon?: React.ComponentProps<typeof Feather>['name'];
  /**
   * Custom icon color. If not provided, uses theme text color
   */
  iconColor?: string;
  /**
   * Handler for press events. If provided, makes the row pressable
   */
  onPress?: () => void;
  /**
   * Optional style overrides
   */
  style?: ViewStyle;
  /**
   * Accessibility label for the row
   */
  accessibilityLabel?: string;
}

/**
 * PreferenceRow component for displaying preference settings in a label-value format.
 * Commonly used in settings screens and profile displays.
 *
 * @example
 * <PreferenceRow
 *   icon="bell"
 *   label="Push Notifications"
 *   value="Enabled"
 * />
 * <PreferenceRow
 *   icon="mail"
 *   label="Email Updates"
 *   value="Disabled"
 *   onPress={() => navigate('/settings/email')}
 * />
 */
export function PreferenceRow({ label, value, icon, iconColor, onPress, style, accessibilityLabel }: PreferenceRowProps) {
  const textColor = useThemeColor({}, 'text');
  const textMutedColor = useThemeColor({}, 'text-muted');
  const finalIconColor = iconColor || textColor;

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
        <ThemedText type="body" style={[styles.value, { color: textMutedColor }]}>
          {value}
        </ThemedText>
      </View>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} accessible accessibilityRole="button" accessibilityLabel={accessibilityLabel || `${label}: ${value}`} accessibilityHint="Tap to change this preference">
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
    opacity: 0.8,
  },
});
