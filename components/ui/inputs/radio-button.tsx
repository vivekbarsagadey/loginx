import { ThemedText } from '@/components/themed-text';
import { gap, rounded } from '@/constants/style-utils';
import { useThemeColors } from '@/hooks/use-theme-colors';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

export interface RadioButtonProps {
  /** Current selected state */
  selected: boolean;
  /** Called when selected */
  onSelect: () => void;
  /** Label text */
  label?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Accessibility label */
  accessibilityLabel?: string;
}

export function RadioButton({ selected, onSelect, label, disabled = false, accessibilityLabel }: RadioButtonProps) {
  const colors = useThemeColors();

  return (
    <Pressable
      onPress={onSelect}
      disabled={disabled}
      style={styles.container}
      accessible={true}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected, disabled }}
      accessibilityLabel={accessibilityLabel || label}
    >
      <View
        style={[
          styles.radio,
          {
            borderColor: selected ? colors.primary : colors.border,
            opacity: disabled ? 0.4 : 1,
          },
        ]}
      >
        {selected && (
          <View
            style={[
              styles.inner,
              {
                backgroundColor: colors.primary,
              },
            ]}
          />
        )}
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
 * Radio group for mutually exclusive options
 */
export interface RadioGroupProps {
  /** Array of radio items */
  items: { label: string; value: string }[];
  /** Currently selected value */
  value: string;
  /** Called when selection changes */
  onChange: (value: string) => void;
  /** Disabled state for entire group */
  disabled?: boolean;
  /** Accessibility label */
  accessibilityLabel?: string;
}

export function RadioGroup({ items, value, onChange, disabled = false, accessibilityLabel }: RadioGroupProps) {
  return (
    <View style={styles.group} accessible={true} accessibilityLabel={accessibilityLabel || 'Radio group'}>
      {items.map((item) => (
        <RadioButton
          key={item.value}
          selected={value === item.value}
          onSelect={() => {
            onChange(item.value);
          }}
          label={item.label}
          disabled={disabled}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    ...gap.sm,
    minHeight: 44,
  },
  group: {
    ...gap.md,
  },
  inner: {
    ...rounded.full,
    height: 10,
    width: 10,
  },
  label: {
    flex: 1,
  },
  radio: {
    alignItems: 'center',
    ...rounded.full,
    borderWidth: 2,
    height: 20,
    justifyContent: 'center',
    width: 20,
  },
});
