/**
 * Form Step Component
 * Collects user input with validation
 */

import { ThemedText } from '@/components/themed-text';
import { ThemedTextInput } from '@/components/themed-text-input';
import { ThemedView } from '@/components/themed-view';
import type { FormStepConfig } from '@/types/flow';
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';

interface FormStepProps {
  step: FormStepConfig;
  data: Record<string, string | number | boolean>;
  onUpdate: (data: Partial<Record<string, string | number | boolean>>) => void;
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

      {step.fields.map((field) => {
        const fieldValue = data[field.name];
        const stringValue = fieldValue !== undefined && fieldValue !== null ? String(fieldValue) : '';

        // Type guard for autoComplete to ensure it's a valid type
        const isValidAutoComplete = (
          value: string | undefined
        ): value is
          | 'email'
          | 'password'
          | 'url'
          | 'additional-name'
          | 'address-line1'
          | 'address-line2'
          | 'birthdate-day'
          | 'birthdate-full'
          | 'birthdate-month'
          | 'birthdate-year'
          | 'cc-csc'
          | 'cc-exp'
          | 'cc-exp-day'
          | 'cc-exp-month'
          | 'cc-exp-year'
          | 'cc-number'
          | 'cc-name'
          | 'cc-given-name'
          | 'cc-middle-name'
          | 'cc-family-name'
          | 'cc-type'
          | 'country'
          | 'current-password'
          | 'family-name'
          | 'gender'
          | 'given-name'
          | 'honorific-prefix'
          | 'honorific-suffix'
          | 'name'
          | 'name-family'
          | 'name-given'
          | 'name-middle'
          | 'name-middle-initial'
          | 'name-prefix'
          | 'name-suffix'
          | 'new-password'
          | 'nickname'
          | 'one-time-code'
          | 'organization'
          | 'organization-title'
          | 'password-new'
          | 'postal-address'
          | 'postal-address-country'
          | 'postal-address-extended'
          | 'postal-address-extended-postal-code'
          | 'postal-address-locality'
          | 'postal-address-region'
          | 'postal-code'
          | 'street-address'
          | 'sms-otp'
          | 'tel'
          | 'tel-country-code'
          | 'tel-national'
          | 'tel-device'
          | 'username'
          | 'username-new'
          | 'off'
          | undefined => {
          if (!value) {
            return true;
          }
          const validValues = [
            'email',
            'password',
            'url',
            'additional-name',
            'address-line1',
            'address-line2',
            'birthdate-day',
            'birthdate-full',
            'birthdate-month',
            'birthdate-year',
            'cc-csc',
            'cc-exp',
            'cc-exp-day',
            'cc-exp-month',
            'cc-exp-year',
            'cc-number',
            'cc-name',
            'cc-given-name',
            'cc-middle-name',
            'cc-family-name',
            'cc-type',
            'country',
            'current-password',
            'family-name',
            'gender',
            'given-name',
            'honorific-prefix',
            'honorific-suffix',
            'name',
            'name-family',
            'name-given',
            'name-middle',
            'name-middle-initial',
            'name-prefix',
            'name-suffix',
            'new-password',
            'nickname',
            'one-time-code',
            'organization',
            'organization-title',
            'password-new',
            'postal-address',
            'postal-address-country',
            'postal-address-extended',
            'postal-address-extended-postal-code',
            'postal-address-locality',
            'postal-address-region',
            'postal-code',
            'street-address',
            'sms-otp',
            'tel',
            'tel-country-code',
            'tel-national',
            'tel-device',
            'username',
            'username-new',
            'off',
          ];
          return validValues.includes(value);
        };

        const autoCompleteValue = isValidAutoComplete(field.autoComplete) ? field.autoComplete : undefined;

        return (
          <ThemedView key={field.name} style={styles.fieldContainer}>
            <ThemedTextInput
              value={stringValue}
              onChangeText={(value) => onUpdate({ [field.name]: value })}
              placeholder={field.placeholder || field.label}
              secureTextEntry={field.type === 'password' || field.secure}
              keyboardType={field.type === 'email' ? 'email-address' : field.type === 'phone' ? 'phone-pad' : field.type === 'number' ? 'numeric' : 'default'}
              autoCapitalize={field.autoCapitalize}
              autoComplete={autoCompleteValue}
            />
            {field.helperText && (
              <ThemedText type="caption" style={styles.helperText}>
                {field.helperText}
              </ThemedText>
            )}
          </ThemedView>
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
  fieldContainer: {
    marginBottom: 16,
  },
  helperText: {
    marginTop: 4,
  },
});
