import { ThemedInput } from '@/components/themed-input';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import i18n from '@/i18n';
import { useEffect, useRef } from 'react';
import { Controller, FieldErrors, useFormContext } from 'react-hook-form';
import { StyleSheet, TextInput } from 'react-native';

interface FormData {
  firstName: string;
  lastName: string;
}

export default function RegisterStep1({ errors }: { errors: FieldErrors<FormData> }) {
  const { control } = useFormContext();
  const firstNameRef = useRef<TextInput>(null);
  const lastNameRef = useRef<TextInput>(null);

  // Auto-focus first input on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      firstNameRef.current?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="h2" style={styles.title}>
        {i18n.t('register.step1.title')}
      </ThemedText>
      <ThemedText type="caption" style={styles.description}>
        Let&apos;s start with your basic information
      </ThemedText>

      <Controller
        control={control}
        name="firstName"
        render={({ field: { onChange, onBlur, value } }) => (
          <ThemedInput
            ref={firstNameRef}
            placeholder={i18n.t('register.step1.firstNamePlaceholder')}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            errorMessage={errors.firstName?.message as string}
            autoCapitalize="words"
            autoCorrect={false}
            textContentType="givenName"
            autoComplete="name-given"
            returnKeyType="next"
            onSubmitEditing={() => lastNameRef.current?.focus()}
            accessibilityLabel="First name input"
            accessibilityHint="Enter your first name"
            maxLength={50}
          />
        )}
      />

      <Controller
        control={control}
        name="lastName"
        render={({ field: { onChange, onBlur, value } }) => (
          <ThemedInput
            ref={lastNameRef}
            placeholder={i18n.t('register.step1.lastNamePlaceholder')}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            errorMessage={errors.lastName?.message as string}
            autoCapitalize="words"
            autoCorrect={false}
            textContentType="familyName"
            autoComplete="name-family"
            returnKeyType="next"
            accessibilityLabel="Last name input"
            accessibilityHint="Enter your last name"
            maxLength={50}
          />
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  title: {
    marginBottom: 8,
  },
  description: {
    marginBottom: 16,
    opacity: 0.7,
  },
});
