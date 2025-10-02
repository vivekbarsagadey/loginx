import { ThemedButton } from '@/components/themed-button';
import { ThemedInput } from '@/components/themed-input';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { SocialSignInButtons } from '@/components/ui/social-sign-in-buttons';
import { auth } from '@/firebase-config';
import { useSocialAuth } from '@/hooks/use-social-auth';
import i18n from '@/i18n';
import { showError } from '@/utils/error';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(i18n.t('screens.login.validation.invalidEmail')),
  password: z
    .string()
    .min(5, i18n.t('screens.login.validation.passwordTooShort'))
    .regex(/^[a-zA-Z0-9@$]*$/, i18n.t('screens.login.validation.passwordInvalidChars')),
});

export default function LoginScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { signInWithGoogle, signInWithApple, loading: socialLoading } = useSocialAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      // The user will be redirected to the main app by the root layout observer
    } catch (error: unknown) {
      showError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="h1" style={styles.title}>
        {i18n.t('screens.login.title')}
      </ThemedText>
      <ThemedText type="body" style={styles.subtitle}>
        {i18n.t('screens.login.subtitle')}
      </ThemedText>

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <ThemedInput
            placeholder={i18n.t('screens.login.emailPlaceholder')}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            keyboardType="email-address"
            autoCapitalize="none"
            errorMessage={errors.email?.message}
            style={styles.input}
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <ThemedInput
            placeholder={i18n.t('screens.login.passwordPlaceholder')}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            secureTextEntry
            errorMessage={errors.password?.message}
            style={styles.input}
          />
        )}
      />

      <ThemedButton title={i18n.t('screens.login.forgotPassword')} variant="link" onPress={() => router.push('/(auth)/forgot-password')} style={styles.linkButton} />

      <ThemedButton title={loading ? i18n.t('screens.login.loggingIn') : i18n.t('screens.login.loginButton')} onPress={handleSubmit(onSubmit)} disabled={loading} style={styles.button} />
      {loading && <ActivityIndicator style={styles.loading} />}

      {/* Social Sign-In */}
      <SocialSignInButtons onGoogleSignIn={signInWithGoogle} onAppleSignIn={signInWithApple} loading={socialLoading} mode="login" />

      <ThemedButton title={i18n.t('screens.login.noAccount')} variant="link" onPress={() => router.push('/(auth)/register')} style={styles.linkButton} />
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
