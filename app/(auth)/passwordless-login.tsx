import { ScreenContainer } from '@/components/screen-container';
import { ThemedButton } from '@/components/themed-button';
import { ThemedInput } from '@/components/themed-input';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/layout';
import { auth } from '@/firebase-config';
import { useFormSubmit } from '@/hooks/use-form-submit';
import { useHapticNavigation } from '@/hooks/use-haptic-navigation';
import { useAsyncStorage } from '@/hooks/storage/use-async-storage';
import i18n from '@/i18n';
import { Config } from '@/utils/config';
import { zodResolver } from '@hookform/resolvers/zod';
import { sendSignInLinkToEmail } from 'firebase/auth';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet } from 'react-native';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

/**
 * Passwordless Login Screen
 * Allows users to sign in via magic link sent to their email
 * No password required - secure, convenient authentication
 */
export default function PasswordlessLoginScreen() {
  const { push, back } = useHapticNavigation();
  
  // Use storage hook for email persistence
  const emailForSignInStorage = useAsyncStorage<string>('emailForSignIn', '');

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

  const sendMagicLink = async () => {
    const data = getValues();
    const actionCodeSettings = {
      // URL you want to redirect back to after email link is clicked
      url: 'https://your-app.com/finish-sign-in', // Replace with your actual domain
      handleCodeInApp: true,
      // iOS and Android app configuration
      iOS: {
        bundleId: Config.social.appleBundleId,
      },
      android: {
        packageName: Config.social.androidPackageName,
        installApp: true,
        minimumVersion: '1.0.0',
      },
      // Dynamic link domain for universal links
      dynamicLinkDomain: 'yourapp.page.link', // Replace with your Firebase Dynamic Link domain
    };

    await sendSignInLinkToEmail(auth, data.email, actionCodeSettings);

    // Save email to local storage so we can complete sign-in later
    await emailForSignInStorage.setValue(data.email);
  };

  const { submit, isSubmitting } = useFormSubmit(sendMagicLink, {
    successTitle: i18n.t('passwordlessLogin.success.title'),
    successMessage: i18n.t('passwordlessLogin.success.message', { email: getValues().email }),
    onSuccess: () => push('/(auth)/verify-email'),
  });

  const onSubmit = async () => {
    await submit();
  };

  return (
    <ScreenContainer scrollable>
      <ThemedView style={styles.centerContent}>
        <ThemedText type="h1" style={styles.title}>
          {i18n.t('passwordlessLogin.title')}
        </ThemedText>

        <ThemedText type="body" style={styles.subtitle}>
          {i18n.t('passwordlessLogin.subtitle')}
        </ThemedText>

        <ThemedView style={styles.benefitsContainer}>
          <ThemedText type="caption" style={styles.benefitItem}>
            ✓ {i18n.t('passwordlessLogin.benefits.noPassword')}
          </ThemedText>
          <ThemedText type="caption" style={styles.benefitItem}>
            ✓ {i18n.t('passwordlessLogin.benefits.secure')}
          </ThemedText>
          <ThemedText type="caption" style={styles.benefitItem}>
            ✓ {i18n.t('passwordlessLogin.benefits.fast')}
          </ThemedText>
        </ThemedView>

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <ThemedInput
              placeholder={i18n.t('passwordlessLogin.emailPlaceholder')}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              textContentType="emailAddress"
              errorMessage={errors.email?.message}
            />
          )}
        />

        <ThemedButton
          title={isSubmitting ? i18n.t('passwordlessLogin.sendingButton') : i18n.t('passwordlessLogin.sendButton')}
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          style={styles.submitButton}
        />

        <ThemedButton title={i18n.t('passwordlessLogin.backToLogin')} variant="link" onPress={() => back()} />
      </ThemedView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    padding: Spacing.md,
  },
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
    marginTop: Spacing.md,
  },
  benefitsContainer: {
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.md,
  },
  benefitItem: {
    marginBottom: Spacing.sm,
    opacity: 0.8,
  },
});
