import { ThemedText } from '@/components/themed-text';
import { BorderRadius } from '@/constants/layout';
import { useThemeColor } from '@/hooks/use-theme-color';
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
  const primaryColor = useThemeColor({}, 'primary');
  const borderColor = useThemeColor({}, 'border');
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');

  const handlePress = () => {
    if (!disabled) {
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
            backgroundColor: checked || indeterminate ? primaryColor : backgroundColor,
            borderColor: checked || indeterminate ? primaryColor : borderColor,
            opacity: disabled ? 0.4 : 1,
          },
        ]}
      >
        {(checked || indeterminate) && <ThemedText style={[styles.icon, { color: backgroundColor }]}>{indeterminate ? '−' : '✓'}</ThemedText>}
      </View>

      {label && (
        <ThemedText
          style={[
            styles.label,
            {
              color: textColor,
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
  /** Called when any checkbox changes */
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
    borderRadius: BorderRadius.sm,
    borderWidth: 2,
    height: 20,
    justifyContent: 'center',
    width: 20,
  },
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    minHeight: 44,
  },
  group: {
    gap: 12,
  },
  icon: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 14,
  },
  label: {
    flex: 1,
  },
});
