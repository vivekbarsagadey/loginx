import { AuthErrorBoundary } from '@/components/auth/auth-error-boundary';
import { ThemedButton } from '@/components/themed-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { SuccessAnimation } from '@/components/ui/success-animation';
import { Spacing, Typography } from '@/constants/layout';
import { auth } from '@/firebase-config';
import { useAlert } from '@/hooks/use-alert';
import { useFormSubmit } from '@/hooks/use-form-submit';
import { useHapticNavigation } from '@/hooks/use-haptic-navigation';
import i18n from '@/i18n';
import { createLogger } from '@/utils/debug';
import { useLocalSearchParams } from 'expo-router';
import { sendEmailVerification, signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';

const logger = createLogger('VerifyEmail');

const getFirebaseAuthErrorMessage = (errorCode: string) => {
  switch (errorCode) {
    case 'auth/too-many-requests':
      return i18n.t('screens.verifyEmail.errors.tooManyRequests');
    default:
      return i18n.t('screens.verifyEmail.errors.generic');
  }
};

export default function VerifyEmailScreen() {
  const { replace } = useHapticNavigation();
  const { email } = useLocalSearchParams();
  const { show: showAlert, AlertComponent } = useAlert();
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (auth.currentUser) {
        try {
          await auth.currentUser.reload();
          if (auth.currentUser.emailVerified) {
            clearInterval(interval);
            // Show success animation instead of navigating immediately
            setShowSuccessAnimation(true);
          }
        } catch (reloadError) {
          logger.error('Failed to reload user:', reloadError);
          // Continue checking - don't break the interval
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const resendEmail = async () => {
    if (!auth.currentUser) {
      showAlert(i18n.t('errors.generic.title'), i18n.t('screens.verifyEmail.errors.noUser'), [{ text: 'OK' }], { variant: 'error' });
      throw new Error(i18n.t('screens.verifyEmail.errors.noUser'));
    }
    await sendEmailVerification(auth.currentUser);
  };

  const { submit: handleResend, isSubmitting: isResending } = useFormSubmit(resendEmail, {
    successTitle: i18n.t('screens.verifyEmail.success.emailSent'),
    successMessage: i18n.t('screens.verifyEmail.success.emailSentMessage'),
    showSuccessAlert: false, // Using showAlert directly in component
    onSuccess: () => {
      showAlert(i18n.t('screens.verifyEmail.success.emailSent'), i18n.t('screens.verifyEmail.success.emailSentMessage'), [{ text: 'OK' }], { variant: 'success' });
    },
    onError: (error: unknown) => {
      const errorCode = (error as { code?: string })?.code ?? '';
      const friendlyMessage = getFirebaseAuthErrorMessage(errorCode);
      showAlert(i18n.t('errors.generic.title'), friendlyMessage, [{ text: 'OK' }], { variant: 'error' });
    },
  });

  const handleLoginRedirect = async () => {
    await signOut(auth);
    replace('/(auth)/login');
  };

  return (
    <AuthErrorBoundary fallbackMessage="We're having trouble loading the email verification screen">
      <ThemedView style={styles.centeredContainer}>
        <ThemedText type="h1" style={styles.title}>
          {i18n.t('screens.verifyEmail.title')}
        </ThemedText>
        <ThemedText style={styles.subtitle}>{i18n.t('screens.verifyEmail.subtitle')}</ThemedText>
        <ThemedText type="h2" style={styles.email}>
          {email}
        </ThemedText>
        <ThemedText style={styles.subtitle}>{i18n.t('screens.verifyEmail.instructions')}</ThemedText>

        <ThemedButton title={isResending ? i18n.t('screens.verifyEmail.sending') : i18n.t('screens.verifyEmail.resendButton')} onPress={handleResend} disabled={isResending} variant="secondary" />
        <ThemedButton title={i18n.t('screens.verifyEmail.goToLogin')} onPress={handleLoginRedirect} variant="link" />

        {/* Success animation for email verification */}
        <SuccessAnimation
          visible={showSuccessAnimation}
          title={i18n.t('success.emailVerified.title')}
          message={i18n.t('success.emailVerified.message')}
          icon="mail-open"
          showConfetti={true}
          duration={3000}
          onComplete={() => {
            setShowSuccessAnimation(false);
            try {
              replace('/(tabs)');
            } catch (navError) {
              logger.error('Navigation failed:', navError);
              showAlert(i18n.t('success.title'), 'Email verified successfully! Please restart the app to continue.', [{ text: 'OK' }], { variant: 'success' });
            }
          }}
        />

        {AlertComponent}
      </ThemedView>
    </AuthErrorBoundary>
  );
}

const styles = StyleSheet.create({
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.md,
  },
  title: {
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
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
