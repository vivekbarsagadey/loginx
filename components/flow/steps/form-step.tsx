/**
 * Form Step Component
 * Collects user input with validation
 */

import { ThemedText } from '@/components/themed-text';
import { ThemedTextInput } from '@/components/themed-text-input';
import { ThemedView } from '@/components/themed-view';
import { type FormStepConfig } from '@/types/flow';
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';

interface FormStepProps {
  step: FormStepConfig;
  data: Record<string, any>;
  onUpdate: (data: Partial<Record<string, any>>) => void;
}

export function FormStep({ step, data, onUpdate }: FormStepProps) {
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

      {step.fields.map((field) => (
        <ThemedView key={field.name} style={styles.fieldContainer}>
          <ThemedTextInput
            value={data[field.name] || ''}
            onChangeText={(value) => onUpdate({ [field.name]: value })}
            placeholder={field.placeholder || field.label}
            secureTextEntry={field.type === 'password' || field.secure}
            keyboardType={field.type === 'email' ? 'email-address' : field.type === 'phone' ? 'phone-pad' : field.type === 'number' ? 'numeric' : 'default'}
            autoCapitalize={field.autoCapitalize}
            autoComplete={field.autoComplete as any}
          />
          {field.helperText && (
            <ThemedText type="caption" style={styles.helperText}>
              {field.helperText}
            </ThemedText>
          )}
        </ThemedView>
      ))}
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
  fieldContainer: {
    marginBottom: 16,
  },
  helperText: {
    marginTop: 4,
  },
});
