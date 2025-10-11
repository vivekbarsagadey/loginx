import { ThemedButton } from '@/components/themed-button';
import { ThemedInput } from '@/components/themed-input';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/layout';
import { ValidationConstants, ValidationMessages } from '@/constants/validation';
import { useHapticNavigation } from '@/hooks/use-haptic-navigation';
import i18n from '@/i18n';
import { AuthMethod, isAuthMethodEnabled } from '@/utils/auth-methods';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet } from 'react-native';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(i18n.t('screens.login.validation.invalidEmail')),
  password: z
    .string()
    .min(ValidationConstants.PASSWORD_MIN_LENGTH, i18n.t('screens.login.validation.passwordTooShort'))
    .max(ValidationConstants.PASSWORD_MAX_LENGTH, ValidationMessages.PASSWORD_TOO_LONG)
    .regex(ValidationConstants.PASSWORD_STRONG_REGEX, ValidationMessages.PASSWORD_WEAK),
});

export type LoginFormData = z.infer<typeof schema>;

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>;
  loading: boolean;
  disabled?: boolean;
}

export function LoginForm({ onSubmit, loading, disabled }: LoginFormProps) {
  const { push } = useHapticNavigation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  return (
    <>
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

      {/* Forgot Password Link - Only show if enabled and email/password auth is available */}
      {isAuthMethodEnabled(AuthMethod.FORGOT_PASSWORD) && isAuthMethodEnabled(AuthMethod.EMAIL_PASSWORD) && (
        <ThemedButton title={i18n.t('screens.login.forgotPassword')} variant="link" onPress={() => push('/(auth)/forgot-password')} style={styles.linkButton} />
      )}

      <ThemedButton
        title={loading ? i18n.t('screens.login.loggingIn') : i18n.t('screens.login.loginButton')}
        onPress={handleSubmit(onSubmit)}
        disabled={loading || disabled}
        loading={loading}
        style={styles.button}
      />
    </>
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
  input: {
    marginVertical: Spacing.sm,
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
  },
  button: {
    marginTop: Spacing.xl,
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
  },
  linkButton: {
    marginTop: Spacing.md,
    alignSelf: 'center',
  },
});
