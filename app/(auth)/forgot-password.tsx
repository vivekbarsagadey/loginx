import { ScreenContainer } from '@/components/screen-container';
import { ThemedButton } from '@/components/themed-button';
import { ThemedInput } from '@/components/themed-input';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/layout';
import { auth } from '@/firebase-config';
import { useAlert } from '@/hooks/use-alert';
import i18n from '@/i18n';
import { AuthMethod, isAuthMethodEnabled } from '@/utils/auth-methods';
import { showError } from '@/utils/error';
import { showSuccess } from '@/utils/success';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(i18n.t('errors.validation.invalidEmail')),
});

export default function ForgotPasswordScreen() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
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
            onPress: () => router.replace('/(auth)/login'),
          },
        ],
        { variant: 'warning' }
      );
    }
  }, [router, showAlert]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: { email: string }) => {
    setLoading(true);
    try {
      // SECURITY: Sanitize email input before sending to Firebase
      const { sanitizeEmail } = await import('@/utils/sanitize');
      const sanitizedEmail = sanitizeEmail(data.email);

      await sendPasswordResetEmail(auth, sanitizedEmail);
      showSuccess(i18n.t('success.passwordReset.title'), i18n.t('success.passwordReset.message'), () => router.push('/(auth)/login'));
    } catch (err: unknown) {
      showError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
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
      {loading && <ActivityIndicator style={styles.loading} />}

      <ThemedButton title={i18n.t('forgotPassword.backToLogin')} variant="link" onPress={() => router.push('/(auth)/login')} />
      {AlertComponent}
    </ScreenContainer>
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
