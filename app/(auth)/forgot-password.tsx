import { AuthErrorBoundary } from '@/components/auth/auth-error-boundary';
import { ScreenContainer } from '@/components/screen-container';
import { ThemedButton } from '@/components/themed-button';
import { ThemedInput } from '@/components/themed-input';
import { ThemedLoadingSpinner } from '@/components/themed-loading-spinner';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/layout';
import { auth } from '@/firebase-config';
import { useAlert } from '@/hooks/use-alert';
import { useFormSubmit } from '@/hooks/use-form-submit';
import { useHapticNavigation } from '@/hooks/use-haptic-navigation';
import i18n from '@/i18n';
import { AuthMethod, isAuthMethodEnabled } from '@/utils/auth-methods';
import { zodResolver } from '@hookform/resolvers/zod';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet } from 'react-native';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(i18n.t('errors.validation.invalidEmail')),
});

export default function ForgotPasswordScreen() {
  const { push, replace } = useHapticNavigation();
  const { show: showAlert, AlertComponent } = useAlert();

  // Check if forgot password feature is enabled
  useEffect(() => {
    if (!isAuthMethodEnabled(AuthMethod.FORGOT_PASSWORD)) {
      showAlert(
        'Feature Disabled',
        'Password reset is currently unavailable. Please contact support for assistance.',
        [
          {
            text: 'OK',
            onPress: () => replace('/(auth)/login'),
          },
        ],
        { variant: 'warning' }
      );
    }
  }, [replace, showAlert]);

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
    },
  });

  // Form submission with hook
  const { submit: handlePasswordReset, isSubmitting: loading } = useFormSubmit(
    async () => {
      const data = getValues();
      // SECURITY: Sanitize email input before sending to Firebase
      const { sanitizeEmail } = await import('@/utils/sanitize');
      const sanitizedEmail = sanitizeEmail(data.email);
      await sendPasswordResetEmail(auth, sanitizedEmail);
    },
    {
      successTitle: i18n.t('success.passwordReset.title'),
      successMessage: i18n.t('success.passwordReset.message'),
      onSuccess: () => push('/(auth)/login'),
    }
  );

  const onSubmit = () => handlePasswordReset();

  return (
    <AuthErrorBoundary fallbackMessage="We're having trouble loading the password reset form">
      <ScreenContainer scrollable>
        <ThemedText type="h1" style={styles.title}>
          {i18n.t('forgotPassword.title')}
        </ThemedText>
        <ThemedText type="body" style={styles.subtitle}>
          {i18n.t('forgotPassword.subtitle')}
        </ThemedText>

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <ThemedInput
              placeholder={i18n.t('forgotPassword.emailPlaceholder')}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              autoCapitalize="none"
              keyboardType="email-address"
              errorMessage={errors.email?.message}
            />
          )}
        />

        <ThemedButton title={loading ? i18n.t('forgotPassword.sendingButton') : i18n.t('forgotPassword.sendButton')} onPress={handleSubmit(onSubmit)} disabled={loading} style={styles.submitButton} />
        {loading && <ThemedLoadingSpinner size="large" style={styles.loading} />}

        <ThemedButton title={i18n.t('forgotPassword.backToLogin')} variant="link" onPress={() => push('/(auth)/login')} />
        {AlertComponent}
      </ScreenContainer>
    </AuthErrorBoundary>
  );
}

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  submitButton: {
    marginTop: Spacing.xl,
  },
  loading: {
    position: 'absolute',
    top: '50%',
    left: '50%',
  },
});
