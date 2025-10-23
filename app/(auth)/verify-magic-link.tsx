import { ScreenContainer } from '@/components/screen-container';
import { ThemedButton } from '@/components/themed-button';
import { ThemedLoadingSpinner } from '@/components/themed-loading-spinner';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/layout';
import { auth } from '@/firebase-config';
import { useAsyncStorage } from '@/hooks/storage/use-async-storage';
import { useAlert } from '@/hooks/use-alert';
import { useFormSubmit } from '@/hooks/use-form-submit';
import { useHapticNavigation } from '@/hooks/use-haptic-navigation';
import { useThemeColors } from '@/hooks/use-theme-colors';
import i18n from '@/i18n';
import { Config } from '@/utils/config';
import { createLogger } from '@/utils/debug';
import { showError } from '@/utils/error';
import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';

const logger = createLogger('VerifyMagicLink');

/**
 * Magic Link Verification Screen
 * Monitors for magic link click and completes passwordless authentication
 */
export default function VerifyMagicLinkScreen() {
  const { replace } = useHapticNavigation();
  const colors = useThemeColors();
  const alert = useAlert();

  const [checking, setChecking] = useState(true);

  // Use storage hook for email persistence
  const emailForSignInStorage = useAsyncStorage<string>('emailForSignIn', '');
  const email = emailForSignInStorage.value;

  useEffect(() => {
    checkForMagicLink();
    // Email is automatically loaded by useAsyncStorage hook
    setChecking(emailForSignInStorage.loading);

    // Listen for deep links (when magic link is clicked)
    const subscription = Linking.addEventListener('url', handleDeepLink);

    return () => {
      subscription.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emailForSignInStorage.loading]);

  const completeSignIn = async (emailLink: string) => {
    try {
      const signInEmail = email;

      // If email not found in state, it should have been loaded by useAsyncStorage
      if (!signInEmail) {
        // Alert.prompt not available on all platforms, show simple error
        alert.show(i18n.t('passwordlessLogin.enterEmail.title'), i18n.t('passwordlessLogin.enterEmail.message'), [{ text: i18n.t('common.ok') }], { variant: 'error' });
        return;
      }

      await finishSignIn(signInEmail, emailLink);
    } catch (_error) {
      logger.error('Error completing sign-in:', error);
      showError(error);
    }
  };

  const finishSignIn = async (signInEmail: string, emailLink: string) => {
    // Sign in with email link
    await signInWithEmailLink(auth, signInEmail, emailLink);

    // Clear email from storage
    await emailForSignInStorage.remove();
  };

  const handleDeepLink = async ({ url }: { url: string }) => {
    if (isSignInWithEmailLink(auth, url)) {
      await completeSignIn(url);
    }
  };

  const checkForMagicLink = async () => {
    try {
      // Check if app was opened via magic link
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl && isSignInWithEmailLink(auth, initialUrl)) {
        await completeSignIn(initialUrl);
      }
    } catch (_error) {
      logger.error('Error checking initial URL:', error);
    }
  };

  const resendMagicLink = async () => {
    if (!email) {
      alert.show(i18n.t('passwordlessLogin.error.noEmail'), i18n.t('passwordlessLogin.error.noEmailMessage'), [{ text: i18n.t('common.ok') }], { variant: 'error' });
      throw new Error(i18n.t('passwordlessLogin.error.noEmail'));
    }

    const actionCodeSettings = {
      url: 'https://your-app.com/finish-sign-in',
      handleCodeInApp: true,
      iOS: {
        bundleId: Config.social.appleBundleId,
      },
      android: {
        packageName: Config.social.androidPackageName,
        installApp: true,
        minimumVersion: '1.0.0',
      },
      dynamicLinkDomain: 'yourapp.page.link',
    };

    const { sendSignInLinkToEmail } = await import('firebase/auth');
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
  };

  const { submit: submitResend, isSubmitting: resending } = useFormSubmit(resendMagicLink, {
    successTitle: i18n.t('passwordlessLogin.resent.title'),
    successMessage: i18n.t('passwordlessLogin.resent.message'),
  });

  const handleResend = async () => {
    await submitResend();
  };

  const handleBackToLogin = () => {
    emailForSignInStorage.remove();
    replace('/(auth)/login');
  };

  if (checking) {
    return (
      <ScreenContainer>
        <ThemedView style={styles.centerContent}>
          <ThemedLoadingSpinner size="large" text={i18n.t('passwordlessLogin.checking')} />
        </ThemedView>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ThemedView style={styles.centerContent}>
        <Ionicons name="mail-outline" size={64} color={colors.primary} style={styles.icon} />

        <ThemedText type="h1" style={styles.title}>
          {i18n.t('passwordlessLogin.verify.title')}
        </ThemedText>

        <ThemedText type="body" style={styles.subtitle}>
          {i18n.t('passwordlessLogin.verify.subtitle')}
        </ThemedText>

        {email && (
          <ThemedText type="h2" style={styles.email}>
            {email}
          </ThemedText>
        )}

        <ThemedText type="body" style={styles.instructions}>
          {i18n.t('passwordlessLogin.verify.instructions')}
        </ThemedText>

        <ThemedButton title={resending ? i18n.t('passwordlessLogin.resending') : i18n.t('passwordlessLogin.resendButton')} onPress={handleResend} disabled={resending} variant="secondary" />

        <ThemedButton title={i18n.t('passwordlessLogin.backToLogin')} onPress={handleBackToLogin} variant="link" />
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
  icon: {
    marginBottom: Spacing.lg,
  },
  email: {
    marginVertical: Spacing.md,
  },
  instructions: {
    textAlign: 'center',
    marginBottom: Spacing.xl,
    opacity: 0.7,
  },
});
