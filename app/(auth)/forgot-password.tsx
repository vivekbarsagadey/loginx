import { ThemedButton } from '@/components/themed-button';
import { ThemedInput } from '@/components/themed-input';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { auth } from '@/firebase-config';
import i18n from '@/i18n';
import { showError } from '@/utils/error';
import { showSuccess } from '@/utils/success';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(i18n.t('errors.validation.invalidEmail')),
});

export default function ForgotPasswordScreen() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
    <ThemedView style={styles.container}>
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
            style={styles.input}
          />
        )}
      />

      <ThemedButton title={loading ? i18n.t('forgotPassword.sendingButton') : i18n.t('forgotPassword.sendButton')} onPress={handleSubmit(onSubmit)} disabled={loading} style={styles.button} />
      {loading && <ActivityIndicator style={styles.loading} />}

      <ThemedButton title={i18n.t('forgotPassword.backToLogin')} variant="link" onPress={() => router.push('/(auth)/login')} style={styles.linkButton} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 32,
  },
  input: {
    marginVertical: 8,
  },
  button: {
    marginTop: 32,
  },
  linkButton: {
    marginTop: 16,
    alignSelf: 'center',
  },
  loading: {
    position: 'absolute',
    top: '50%',
    left: '50%',
  },
});
