/**
 * Selection Step Component
 * Single or multiple choice selection
 */

import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { type SelectionOption, type SelectionStepConfig } from '@/types/flow';
import { useThemeColors } from '@/hooks/use-theme-colors';

interface SelectionStepProps {
  step: SelectionStepConfig;
  data: Record<string, any>;
  onUpdate: (data: Partial<Record<string, any>>) => void;
}

export function SelectionStep({ step, data, onUpdate }: SelectionStepProps) {
  const colors = useThemeColors();
  const options = Array.isArray(step.options) ? step.options : [];
  const selectedValue = data[step.id];
  const selectedValues = Array.isArray(selectedValue) ? selectedValue : [selectedValue];

  const handleSelect = (option: SelectionOption) => {
    if (step.multiple) {
      const newValues = selectedValues.includes(option.id)
        ? selectedValues.filter(id => id !== option.id)
        : [...selectedValues, option.id];
      onUpdate({ [step.id]: newValues });
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
            {option.description && (
              <ThemedText type="caption">{option.description}</ThemedText>
            )}
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
