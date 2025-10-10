import { ScreenContainer } from '@/components/screen-container';
import { ThemedButton } from '@/components/themed-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/layout';
import { auth } from '@/firebase-config';
import { useAlert } from '@/hooks/use-alert';
import { useThemeColor } from '@/hooks/use-theme-color';
import i18n from '@/i18n';
import { showError } from '@/utils/error';
import { showSuccess } from '@/utils/success';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import { isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';

/**
 * Magic Link Verification Screen
 * Monitors for magic link click and completes passwordless authentication
 */
export default function VerifyMagicLinkScreen() {
  const router = useRouter();
  const primaryColor = useThemeColor({}, 'primary');
  const alert = useAlert();

  const [email, setEmail] = useState<string>('');
  const [checking, setChecking] = useState(true);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    checkForMagicLink();
    loadStoredEmail();

    // Listen for deep links (when magic link is clicked)
    const subscription = Linking.addEventListener('url', handleDeepLink);

    return () => {
      subscription.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadStoredEmail = async () => {
    try {
      const storedEmail = await AsyncStorage.getItem('emailForSignIn');
      if (storedEmail) {
        setEmail(storedEmail);
      }
    } catch (error) {
      console.error('[VerifyMagicLink] Failed to load stored email:', error);
    } finally {
      setChecking(false);
    }
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
    } catch (error) {
      console.error('[VerifyMagicLink] Error checking initial URL:', error);
    }
  };

  const completeSignIn = async (emailLink: string) => {
    try {
      let signInEmail = email;

      // If email not found in state, try loading from storage
      if (!signInEmail) {
        const storedEmail = await AsyncStorage.getItem('emailForSignIn');
        if (storedEmail) {
          signInEmail = storedEmail;
        } else {
          // Alert.prompt not available on all platforms, show simple error
          alert.show(i18n.t('passwordlessLogin.enterEmail.title'), i18n.t('passwordlessLogin.enterEmail.message'), [{ text: i18n.t('common.ok') }], { variant: 'error' });
          return;
        }
      }

      await finishSignIn(signInEmail, emailLink);
    } catch (error) {
      console.error('[VerifyMagicLink] Error completing sign-in:', error);
      showError(error);
    }
  };

  const finishSignIn = async (signInEmail: string, emailLink: string) => {
    try {
      // Sign in with email link
      await signInWithEmailLink(auth, signInEmail, emailLink);

      // Clear email from storage
      await AsyncStorage.removeItem('emailForSignIn');

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      showSuccess(i18n.t('passwordlessLogin.success.signInTitle'), i18n.t('passwordlessLogin.success.signInMessage'), () => {
        router.replace('/(tabs)');
      });
    } catch (error) {
      console.error('[VerifyMagicLink] Sign-in failed:', error);
      showError(error);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const handleResend = async () => {
    if (!email) {
      alert.show(i18n.t('passwordlessLogin.error.noEmail'), i18n.t('passwordlessLogin.error.noEmailMessage'), [{ text: i18n.t('common.ok') }], { variant: 'error' });
      return;
    }

    setResending(true);

    try {
      const actionCodeSettings = {
        url: 'https://your-app.com/finish-sign-in',
        handleCodeInApp: true,
        iOS: {
          bundleId: 'com.yourcompany.loginx',
        },
        android: {
          packageName: 'com.yourcompany.loginx',
          installApp: true,
          minimumVersion: '1.0.0',
        },
        dynamicLinkDomain: 'yourapp.page.link',
      };

      const { sendSignInLinkToEmail } = await import('firebase/auth');
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      showSuccess(i18n.t('passwordlessLogin.resent.title'), i18n.t('passwordlessLogin.resent.message'));
    } catch (error) {
      showError(error);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setResending(false);
    }
  };

  const handleBackToLogin = () => {
    AsyncStorage.removeItem('emailForSignIn');
    router.replace('/(auth)/login');
  };

  if (checking) {
    return (
      <ScreenContainer>
        <ThemedView style={styles.centerContent}>
          <ActivityIndicator size="large" color={primaryColor} />
          <ThemedText style={styles.checkingText}>{i18n.t('passwordlessLogin.checking')}</ThemedText>
        </ThemedView>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ThemedView style={styles.centerContent}>
        <Ionicons name="mail-outline" size={64} color={primaryColor} style={styles.icon} />

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
  checkingText: {
    marginTop: Spacing.md,
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
