import { ThemedButton } from '@/components/themed-button';
import { ThemedInput } from '@/components/themed-input';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CommonButtons, CommonContainers, CommonInputs, CommonText } from '@/constants/common-styles';
import { auth } from '@/firebase-config';
import i18n from '@/i18n';
import { AuthMethod, isAuthMethodEnabled } from '@/utils/auth-methods';
import { showError } from '@/utils/error';
import { showSuccess } from '@/utils/success';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(i18n.t('errors.validation.invalidEmail')),
});

export default function ForgotPasswordScreen() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Check if forgot password feature is enabled
  useEffect(() => {
    if (!isAuthMethodEnabled(AuthMethod.FORGOT_PASSWORD)) {
      Alert.alert('Feature Disabled', 'Password reset is currently unavailable. Please contact support for assistance.', [
        {
          text: 'OK',
          onPress: () => router.replace('/(auth)/login'),
        },
      ]);
    }
  }, [router]);

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
      await sendPasswordResetEmail(auth, data.email);
      showSuccess(i18n.t('success.passwordReset.title'), i18n.t('success.passwordReset.message'), () => router.push('/(auth)/login'));
    } catch (err: unknown) {
      showError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={CommonContainers.centerContent}>
      <ThemedText type="h1" style={CommonText.title}>
        {i18n.t('forgotPassword.title')}
      </ThemedText>
      <ThemedText type="body" style={CommonText.subtitle}>
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
            style={CommonInputs.input}
          />
        )}
      />

      <ThemedButton
        title={loading ? i18n.t('forgotPassword.sendingButton') : i18n.t('forgotPassword.sendButton')}
        onPress={handleSubmit(onSubmit)}
        disabled={loading}
        style={CommonButtons.buttonLarge}
      />
      {loading && <ActivityIndicator style={styles.loading} />}

      <ThemedButton title={i18n.t('forgotPassword.backToLogin')} variant="link" onPress={() => router.push('/(auth)/login')} style={CommonButtons.linkButton} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  loading: {
    position: 'absolute',
    top: '50%',
    left: '50%',
  },
});
