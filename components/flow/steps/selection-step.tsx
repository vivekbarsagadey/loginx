/**
 * Selection Step Component
 * Single or multiple choice selection
 */

import { ThemedText } from '@/components/themed-text';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { type SelectionOption, type SelectionStepConfig } from '@/types/flow';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import type { FlowData } from '../flow-step-wrapper';

interface SelectionStepProps {
  step: SelectionStepConfig;
  data: FlowData;
  onUpdate: (data: Partial<FlowData>) => void;
}

export function SelectionStep({ step, data, onUpdate }: SelectionStepProps) {
  const colors = useThemeColors();
  const options = Array.isArray(step.options) ? step.options : [];
  const selectedValue = data[step.id];

  // Parse selected values - handle both single values and comma-separated strings
  const selectedValues = typeof selectedValue === 'string' && selectedValue.includes(',') ? selectedValue.split(',').filter(Boolean) : selectedValue ? [String(selectedValue)] : [];

  const handleSelect = (option: SelectionOption) => {
    if (step.multiple) {
      // For multiple selections, store as comma-separated string
      const currentIds = typeof selectedValue === 'string' ? selectedValue.split(',').filter(Boolean) : [];
      const newIds = currentIds.includes(option.id) ? currentIds.filter((id) => id !== option.id) : [...currentIds, option.id];
      onUpdate({ [step.id]: newIds.join(',') });
    } else {
      onUpdate({ [step.id]: option.id });
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <ThemedText type="title" style={styles.title}>
        {step.title}
      </ThemedText>

      {step.subtitle && (
        <ThemedText type="subtitle1" style={styles.subtitle}>
          {step.subtitle}
        </ThemedText>
      )}

      {options.map((option) => {
        const isSelected = selectedValues.includes(option.id);
        return (
          <TouchableOpacity
            key={option.id}
            onPress={() => handleSelect(option)}
            style={[
              styles.option,
              {
                borderColor: isSelected ? colors.primary : colors.border,
                backgroundColor: isSelected ? colors['bg-elevated'] : 'transparent',
              },
            ]}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
          >
            <ThemedText style={styles.optionTitle}>{option.title}</ThemedText>
            {option.description && <ThemedText type="caption">{option.description}</ThemedText>}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    marginBottom: 24,
  },
  option: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
    marginBottom: 12,
  },
  optionTitle: {
    marginBottom: 4,
  },
});
