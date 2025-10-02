import { ThemedInput } from '@/components/themed-input';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import i18n from '@/i18n';
import { useEffect, useRef } from 'react';
import { Controller, FieldErrors, useFormContext } from 'react-hook-form';
import { StyleSheet, TextInput, View } from 'react-native';

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterStep2({ errors }: { errors: FieldErrors<FormData> }) {
  const { control } = useFormContext();
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

  // Auto-focus email input on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      emailRef.current?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="h2" style={styles.title}>
        {i18n.t('register.step2.title')}
      </ThemedText>
      <ThemedText type="caption" style={styles.description}>
        Create your login credentials
      </ThemedText>

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <ThemedInput
            ref={emailRef}
            placeholder={i18n.t('register.step2.emailPlaceholder')}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            errorMessage={errors.email?.message as string}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            textContentType="emailAddress"
            autoComplete="email"
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current?.focus()}
            accessibilityLabel="Email address input"
            accessibilityHint="Enter your email address for account login"
            maxLength={254}
          />
        )}
      />

      <View style={styles.passwordSection}>
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <ThemedInput
              ref={passwordRef}
              placeholder={i18n.t('register.step2.passwordPlaceholder')}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              errorMessage={errors.password?.message as string}
              secureTextEntry
              textContentType="newPassword"
              autoComplete="password-new"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
              onSubmitEditing={() => confirmPasswordRef.current?.focus()}
              accessibilityLabel="Password input"
              accessibilityHint="Create a strong password with at least 8 characters, including uppercase, lowercase, number, and special character"
              maxLength={128}
            />
          )}
        />

        <ThemedText type="caption" style={styles.helperText}>
          Password must contain:
          {`\n`}• At least 8 characters
          {`\n`}• Uppercase and lowercase letters
          {`\n`}• At least one number
          {`\n`}• At least one special character (@$!%*?&)
        </ThemedText>
      </View>

      <Controller
        control={control}
        name="confirmPassword"
        render={({ field: { onChange, onBlur, value } }) => (
          <ThemedInput
            ref={confirmPasswordRef}
            placeholder={i18n.t('register.step2.confirmPasswordPlaceholder')}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            errorMessage={errors.confirmPassword?.message as string}
            secureTextEntry
            textContentType="newPassword"
            autoComplete="password-new"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="done"
            accessibilityLabel="Confirm password input"
            accessibilityHint="Re-enter your password to confirm"
            maxLength={128}
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
  passwordSection: {
    gap: 8,
  },
  helperText: {
    opacity: 0.7,
    lineHeight: 18,
  },
});
