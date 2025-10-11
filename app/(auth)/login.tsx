import { AlternativeAuthMethods } from '@/components/auth/alternative-auth-methods';
import { BiometricLoginSection } from '@/components/auth/biometric-login-section';
import { LoginForm, type LoginFormData } from '@/components/auth/login-form';
import { SecurityWarnings } from '@/components/auth/security-warnings';
import { ScreenContainer } from '@/components/screen-container';
import { ThemedButton } from '@/components/themed-button';
import { SocialSignInButtons } from '@/components/ui/social-sign-in-buttons';
import { Spacing } from '@/constants/layout';
import { auth } from '@/firebase-config';
import { useAlert } from '@/hooks/use-alert';
import { useBiometricAuth } from '@/hooks/use-biometric-auth';
import { useHapticNavigation } from '@/hooks/use-haptic-navigation';
import { useSecuritySettings } from '@/hooks/use-security-settings';
import { useSocialAuth } from '@/hooks/use-social-auth';
import i18n from '@/i18n';
import { AuthMethod, isAuthMethodEnabled } from '@/utils/auth-methods';
import { showError } from '@/utils/error';
import { BiometricStorage } from '@/utils/secure-storage';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { StyleSheet } from 'react-native';

export default function LoginScreen() {
  const { push, replace } = useHapticNavigation();
  const { show: showAlert, AlertComponent } = useAlert();
  const { signInWithGoogle, signInWithApple, signInWithFacebook, loading: socialLoading } = useSocialAuth();
  const { isEnabled: biometricEnabled } = useBiometricAuth();

  const { isAccountLocked, remainingAttempts, incrementLoginAttempts, resetLoginAttempts, getTimeUntilUnlock } = useSecuritySettings();

  const [loading, setLoading] = useState(false);

  const handleLoginSuccess = () => {
    replace('/(tabs)');
  };

  const onSubmit = async (data: LoginFormData) => {
    // Check if account is locked before attempting login
    if (isAccountLocked()) {
      const timeUntilUnlock = getTimeUntilUnlock();
      showAlert('Account Temporarily Locked', `Too many failed login attempts. Please try again in ${timeUntilUnlock} minutes.`, [{ text: 'OK' }], { variant: 'error' });
      return;
    }

    setLoading(true);
    try {
      // Sanitize email input for consistency with registration flow
      const { sanitizeEmail } = await import('@/utils/sanitize');
      const sanitizedEmail = sanitizeEmail(data.email);

      await signInWithEmailAndPassword(auth, sanitizedEmail, data.password);

      // Reset login attempts on successful authentication
      await resetLoginAttempts();

      // SECURITY: Save email for biometric re-authentication
      if (biometricEnabled) {
        await BiometricStorage.setBiometricCredentials(sanitizedEmail);
      }

      // Check if 2FA is enabled for this user
      try {
        const { TwoFactorStorage } = await import('@/utils/secure-storage');
        const is2FAEnabled = await TwoFactorStorage.getTwoFactorEnabled();

        if (is2FAEnabled) {
          push({
            pathname: '/(auth)/verify-2fa',
            params: { email: data.email },
          });
          return;
        }
      } catch (_storageError) {
        // Continue to main app if 2FA check fails
      }

      // If 2FA is not enabled, user will be redirected to main app by root layout observer
    } catch (error: unknown) {
      // Increment failed login attempts
      await incrementLoginAttempts();

      // Check if account will be locked after this attempt
      if (remainingAttempts <= 1) {
        showAlert('Account Will Be Locked', 'This was your last login attempt. Your account will be temporarily locked after one more failed attempt.', [{ text: 'OK' }], { variant: 'warning' });
      } else if (remainingAttempts <= 3) {
        showAlert('Login Attempts Warning', `You have ${remainingAttempts - 1} login attempts remaining before your account is temporarily locked.`, [{ text: 'OK' }], { variant: 'warning' });
      }

      showError(error);
    } finally {
      setLoading(false);
    }
  };

  const hasSocialAuth = isAuthMethodEnabled(AuthMethod.GOOGLE) || isAuthMethodEnabled(AuthMethod.APPLE) || isAuthMethodEnabled(AuthMethod.FACEBOOK);

  return (
    <ScreenContainer scrollable centerContent>
      <LoginForm onSubmit={onSubmit} loading={loading} disabled={isAccountLocked()} />

      <SecurityWarnings remainingAttempts={remainingAttempts} isAccountLocked={isAccountLocked()} timeUntilUnlock={getTimeUntilUnlock()} />

      <AlternativeAuthMethods />

      <BiometricLoginSection onSuccess={handleLoginSuccess} disabled={isAccountLocked()} />

      {hasSocialAuth && (
        <SocialSignInButtons
          onGoogleSignIn={isAuthMethodEnabled(AuthMethod.GOOGLE) ? signInWithGoogle : undefined}
          onAppleSignIn={isAuthMethodEnabled(AuthMethod.APPLE) ? signInWithApple : undefined}
          onFacebookSignIn={isAuthMethodEnabled(AuthMethod.FACEBOOK) ? signInWithFacebook : undefined}
          loading={socialLoading}
          mode="login"
        />
      )}

      <ThemedButton title={i18n.t('screens.login.noAccount')} variant="link" onPress={() => push('/(auth)/register')} style={styles.linkButton} />

      {AlertComponent}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  linkButton: {
    marginTop: Spacing.md,
    alignSelf: 'center',
  },
});
