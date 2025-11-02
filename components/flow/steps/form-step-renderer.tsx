/**
 * Form Step Renderer
 *
 * Renders form steps from the flow configuration
 */

import { ThemedButton } from '@/components/themed-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedTextInput } from '@/components/themed-text-input';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/layout';
import type { FormStepConfig, StepRendererProps } from '@/types/flow';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

export function FormStepRenderer({ step, data, onUpdate }: StepRendererProps<FormStepConfig>) {
  const handleFieldChange = (fieldName: string, value: unknown) => {
    onUpdate({ [fieldName]: value });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <ThemedView style={styles.header}>
        {step.title && (
          <ThemedText type="title" style={styles.title}>
            {step.title}
          </ThemedText>
        )}
        {step.subtitle && (
          <ThemedText type="subtitle1" style={styles.subtitle}>
            {step.subtitle}
          </ThemedText>
        )}
        {step.description && (
          <ThemedText type="body" style={styles.description}>
            {step.description}
          </ThemedText>
        )}
      </ThemedView>

      <ThemedView style={styles.fieldsContainer}>
        {step.fields.map((field) => {
          // Skip conditional fields that shouldn't be shown
          if (field.condition && !field.condition(data)) {
            return null;
          }

          const fieldValue = data[field.name];

          switch (field.type) {
            case 'text':
            case 'email':
            case 'password':
            case 'phone':
            case 'number':
            case 'url':
              return (
                <View key={field.name} style={styles.fieldWrapper}>
                  <ThemedTextInput
                    placeholder={field.placeholder}
                    value={String(fieldValue || '')}
                    onChangeText={(value) => handleFieldChange(field.name, value)}
                    secureTextEntry={field.type === 'password' || field.secure}
                    keyboardType={field.type === 'email' ? 'email-address' : field.type === 'phone' ? 'phone-pad' : field.type === 'number' ? 'numeric' : 'default'}
                    autoCapitalize={field.autoCapitalize || 'none'}
                    autoCorrect={field.autoCorrect}
                  />
                  {field.helperText && (
                    <ThemedText type="caption" style={styles.helperText}>
                      {field.helperText}
                    </ThemedText>
                  )}
                </View>
              );

            case 'textarea':
              return (
                <View key={field.name} style={styles.fieldWrapper}>
                  <ThemedTextInput
                    placeholder={field.placeholder}
                    value={String(fieldValue || '')}
                    onChangeText={(value) => handleFieldChange(field.name, value)}
                    multiline={field.multiline}
                    numberOfLines={field.numberOfLines || 3}
                  />
                  {field.helperText && (
                    <ThemedText type="caption" style={styles.helperText}>
                      {field.helperText}
                    </ThemedText>
                  )}
                </View>
              );

            case 'checkbox':
              return (
                <View key={field.name} style={styles.fieldWrapper}>
                  <ThemedButton title={field.label} onPress={() => handleFieldChange(field.name, !fieldValue)} variant={fieldValue ? 'primary' : 'secondary'} />
                  {field.helperText && (
                    <ThemedText type="caption" style={styles.helperText}>
                      {field.helperText}
                    </ThemedText>
                  )}
                  {field.links && (
                    <View style={styles.linksContainer}>
                      {field.links.map((link, idx) => (
                        <ThemedText key={idx} type="caption" style={styles.link}>
                          {link.text}
                        </ThemedText>
                      ))}
                    </View>
                  )}
                </View>
              );

            default:
              return (
                <View key={field.name} style={styles.fieldWrapper}>
                  <ThemedText type="caption">Unsupported field type: {field.type}</ThemedText>
                </View>
              );
          }
        })}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.md,
  },
  header: {
    marginBottom: Spacing.lg,
  },
  title: {
    marginBottom: Spacing.xs,
  },
  subtitle: {
    marginBottom: Spacing.xs,
  },
  description: {
    marginTop: Spacing.sm,
  },
  fieldsContainer: {
    gap: Spacing.md,
  },
  fieldWrapper: {
    marginBottom: Spacing.sm,
  },
  helperText: {
    marginTop: Spacing.xs,
    opacity: 0.7,
  },
  linksContainer: {
    marginTop: Spacing.xs,
    gap: Spacing.xs,
  },
  link: {
    color: '#007AFF',
  },
});
