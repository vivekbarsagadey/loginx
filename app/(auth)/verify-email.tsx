import { ThemedButton } from '@/components/themed-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CommonButtons, CommonContainers, CommonText } from '@/constants/common-styles';
import { Spacing, Typography } from '@/constants/layout';
import { auth } from '@/firebase-config';
import i18n from '@/i18n';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { sendEmailVerification, signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet } from 'react-native';

const getFirebaseAuthErrorMessage = (errorCode: string) => {
  switch (errorCode) {
    case 'auth/too-many-requests':
      return i18n.t('screens.verifyEmail.errors.tooManyRequests');
    default:
      return i18n.t('screens.verifyEmail.errors.generic');
  }
};

export default function VerifyEmailScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams();
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (auth.currentUser) {
        try {
          await auth.currentUser.reload();
          if (auth.currentUser.emailVerified) {
            clearInterval(interval);
            try {
              router.replace('/(tabs)');
            } catch (navError) {
              console.error('[VerifyEmail] Navigation failed:', navError);
              // User is verified, they can manually navigate
              Alert.alert(i18n.t('success.title'), 'Email verified successfully! Please restart the app to continue.', [{ text: 'OK' }]);
            }
          }
        } catch (reloadError) {
          console.error('[VerifyEmail] Failed to reload user:', reloadError);
          // Continue checking - don't break the interval
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [router]);

  const handleResend = async () => {
    if (!auth.currentUser) {
      Alert.alert(i18n.t('errors.generic.title'), i18n.t('screens.verifyEmail.errors.noUser'));
      return;
    }
    setIsResending(true);
    try {
      await sendEmailVerification(auth.currentUser);
      Alert.alert(i18n.t('screens.verifyEmail.success.emailSent'), i18n.t('screens.verifyEmail.success.emailSentMessage'));
    } catch (err: unknown) {
      const errorCode = (err as { code?: string })?.code ?? '';
      const friendlyMessage = getFirebaseAuthErrorMessage(errorCode);
      Alert.alert(i18n.t('errors.generic.title'), friendlyMessage);
    } finally {
      setIsResending(false);
    }
  };

  const handleLoginRedirect = async () => {
    await signOut(auth);
    router.replace('/(auth)/login');
  };

  return (
    <ThemedView style={CommonContainers.centeredContainer}>
      <ThemedText type="h1" style={CommonText.title}>
        {i18n.t('screens.verifyEmail.title')}
      </ThemedText>
      <ThemedText style={styles.subtitle}>{i18n.t('screens.verifyEmail.subtitle')}</ThemedText>
      <ThemedText type="h2" style={styles.email}>
        {email}
      </ThemedText>
      <ThemedText style={styles.subtitle}>{i18n.t('screens.verifyEmail.instructions')}</ThemedText>

      <ThemedButton
        title={isResending ? i18n.t('screens.verifyEmail.sending') : i18n.t('screens.verifyEmail.resendButton')}
        onPress={handleResend}
        disabled={isResending}
        variant="secondary"
        style={CommonButtons.button}
      />
      <ThemedButton title={i18n.t('screens.verifyEmail.goToLogin')} onPress={handleLoginRedirect} variant="link" style={CommonButtons.linkButtonSmall} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  email: {
    textAlign: 'center',
    fontWeight: Typography.bodyBold.fontWeight,
    marginBottom: Spacing.xl,
  },
});
