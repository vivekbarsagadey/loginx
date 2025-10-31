import { ThemedText } from '@/components/themed-text';
import { Typography } from '@/constants/layout';
import { gap, rounded } from '@/constants/style-utils';
import { useThemeColors } from '@/hooks/use-theme-colors';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

export interface CheckboxProps {
  /** Current checked state */
  checked: boolean;
  /** Called when state changes */
  onCheckedChange: (checked: boolean) => void;
  /** Label text */
  label?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Indeterminate state (partial selection) */
  indeterminate?: boolean;
  /** Accessibility label */
  accessibilityLabel?: string;
}

export function Checkbox({ checked, onCheckedChange, label, disabled = false, indeterminate = false, accessibilityLabel }: CheckboxProps) {
  const colors = useThemeColors();

  const handlePress = async () => {
    if (!disabled) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onCheckedChange(!checked);
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      style={styles.container}
      accessible={true}
      accessibilityRole="checkbox"
      accessibilityState={{
        checked: indeterminate ? 'mixed' : checked,
        disabled,
      }}
      accessibilityLabel={accessibilityLabel || label}
    >
      <View
        style={[
          styles.box,
          {
            backgroundColor: checked || indeterminate ? colors.primary : colors.background,
            borderColor: checked || indeterminate ? colors.primary : colors.border,
            opacity: disabled ? 0.4 : 1,
          },
        ]}
      >
        {(checked || indeterminate) && <ThemedText style={[styles.icon, { color: colors.background }]}>{indeterminate ? '−' : '✓'}</ThemedText>}
      </View>

      {label && (
        <ThemedText
          style={[
            styles.label,
            {
              color: colors.text,
              opacity: disabled ? 0.4 : 1,
            },
          ]}
        >
          {label}
        </ThemedText>
      )}
    </Pressable>
  );
}

/**
 * Group of checkboxes
 */
export interface CheckboxGroupProps {
  /** Array of checkbox items */
  items: { checked: boolean; label: string; value: string }[];
  /** Called when unknown checkbox changes */
  onChange: (value: string, checked: boolean) => void;
  /** Disabled state for entire group */
  disabled?: boolean;
  /** Accessibility label */
  accessibilityLabel?: string;
}

export function CheckboxGroup({ items, onChange, disabled = false, accessibilityLabel }: CheckboxGroupProps) {
  return (
    <View style={styles.group} accessible={true} accessibilityLabel={accessibilityLabel || 'Checkbox group'}>
      {items.map((item) => (
        <Checkbox
          key={item.value}
          checked={item.checked}
          onCheckedChange={(checked) => {
            onChange(item.value, checked);
          }}
          label={item.label}
          disabled={disabled}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    alignItems: 'center',
    ...rounded.sm,
    borderWidth: 2,
    height: 20,
    justifyContent: 'center',
    width: 20,
  },
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    ...gap.sm,
    minHeight: 44,
  },
  group: {
    ...gap.md,
  },
  icon: {
    fontSize: Typography.bodySmall.fontSize,
    fontWeight: '700',
    lineHeight: 14,
  },
  label: {
    flex: 1,
  },
});
