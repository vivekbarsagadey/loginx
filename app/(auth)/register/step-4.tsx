import { ThemedInput } from '@/components/themed-input';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing, Typography } from '@/constants/layout';
import { useAutoFocus } from '@/hooks/use-auto-focus';
import { useRef } from 'react';
import { Controller, type FieldErrors, useFormContext } from 'react-hook-form';
import { StyleSheet, type TextInput } from 'react-native';

interface FormData {
  phoneNumber: string;
}

export default function RegisterStep4({ errors }: { errors: FieldErrors<FormData> }) {
  const { control } = useFormContext();
  const phoneRef = useRef<TextInput>(null);

  // Auto-focus phone input on mount
  useAutoFocus(phoneRef);

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="h2" style={styles.sectionTitle}>
        Phone Verification (Optional)
      </ThemedText>
      <ThemedText type="caption" style={styles.descriptionText}>
        Add your phone number for enhanced security and account recovery
      </ThemedText>

      <Controller
        control={control}
        name="phoneNumber"
        render={({ field: { onChange, onBlur, value } }) => (
          <ThemedInput
            ref={phoneRef}
            placeholder="+1 (555) 123-4567"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            errorMessage={errors.phoneNumber?.message as string}
            keyboardType="phone-pad"
            textContentType="telephoneNumber"
            autoComplete="tel"
            returnKeyType="done"
            accessibilityLabel="Phone number input"
            accessibilityHint="Enter your phone number for SMS verification (optional)"
            maxLength={20}
          />
        )}
      />

      <ThemedText type="caption" style={styles.helperText}>
        • We&apos;ll send you a verification code via SMS
        {`\n`}• Your phone number will be kept private
        {`\n`}• You can skip this step and add it later
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.sm,
  },
  sectionTitle: {
    marginBottom: Spacing.md,
    fontWeight: Typography.bodyBold.fontWeight as 'bold',
  },
  descriptionText: {
    marginBottom: Spacing.md,
    opacity: 0.7,
  },
  helperText: {
    opacity: 0.7,
    lineHeight: 18,
    marginTop: Spacing.sm,
  },
});
