import { ThemedInput } from '@/components/themed-input';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CommonText } from '@/constants/common-styles';
import { Spacing } from '@/constants/layout';
import { useEffect, useRef } from 'react';
import { Controller, FieldErrors, useFormContext } from 'react-hook-form';
import { StyleSheet, TextInput } from 'react-native';

interface FormData {
  phoneNumber: string;
}

export default function RegisterStep4({ errors }: { errors: FieldErrors<FormData> }) {
  const { control } = useFormContext();
  const phoneRef = useRef<TextInput>(null);

  // Auto-focus phone input on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      phoneRef.current?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="h2" style={CommonText.sectionTitle}>
        Phone Verification (Optional)
      </ThemedText>
      <ThemedText type="caption" style={CommonText.descriptionText}>
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
  helperText: {
    opacity: 0.7,
    lineHeight: 18,
    marginTop: Spacing.sm,
  },
});
