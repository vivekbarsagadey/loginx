import { ScreenContainer } from '@/components/screen-container';
import { ThemedButton } from '@/components/themed-button';
import { ThemedInput } from '@/components/themed-input';
import { ThemedText } from '@/components/themed-text';
import { SocialSignInButtons } from '@/components/ui/social-sign-in-buttons';
import { CommonText } from '@/constants/common-styles';
import { BorderRadius, Spacing, Typography } from '@/constants/layout';
import { ValidationConstants, ValidationMessages } from '@/constants/validation';
import { auth } from '@/firebase-config';
import { useAlert } from '@/hooks/use-alert';
import { useBiometricAuth } from '@/hooks/use-biometric-auth';
import { useSecuritySettings } from '@/hooks/use-security-settings';
import { useSocialAuth } from '@/hooks/use-social-auth';
import { useThemeColor } from '@/hooks/use-theme-color';
import i18n from '@/i18n';
import { AuthMethod, isAuthMethodEnabled } from '@/utils/auth-methods';
import { showError } from '@/utils/error';
import { BiometricStorage } from '@/utils/secure-storage';
import { showSuccess } from '@/utils/success';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { z } from 'zod';

// SECURITY: Use consolidated validation from constants
const schema = z.object({
  email: z.string().email(i18n.t('screens.login.validation.invalidEmail')),
  password: z
    .string()
    .min(ValidationConstants.PASSWORD_MIN_LENGTH, i18n.t('screens.login.validation.passwordTooShort'))
    .max(ValidationConstants.PASSWORD_MAX_LENGTH, ValidationMessages.PASSWORD_TOO_LONG)
    .regex(ValidationConstants.PASSWORD_STRONG_REGEX, ValidationMessages.PASSWORD_WEAK),
});

export default function LoginScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [biometricAttempted, setBiometricAttempted] = useState(false);
  const { show: showAlert, AlertComponent } = useAlert();
  const { signInWithGoogle, signInWithApple, signInWithFacebook, loading: socialLoading } = useSocialAuth();
  const { isAvailable: biometricAvailable, isEnabled: biometricEnabled, authenticateWithBiometric, biometricTypeName } = useBiometricAuth();

  const { isAccountLocked, remainingAttempts, incrementLoginAttempts, resetLoginAttempts, getTimeUntilUnlock } = useSecuritySettings();

  const warningColor = useThemeColor({}, 'warning');
  const errorColor = useThemeColor({}, 'error');

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

  // Auto-trigger biometric authentication on screen load
  useEffect(() => {
    const attemptBiometricAuth = async () => {
      if (biometricAvailable && biometricEnabled && !biometricAttempted) {
        setBiometricAttempted(true);
        try {
          // SECURITY: Biometric authentication with Firebase re-authentication
          const success = await authenticateWithBiometric();
          if (success) {
            // Get saved credentials from secure storage
            const { email } = await BiometricStorage.getBiometricCredentials();

            if (email && auth.currentUser) {
              // User is already authenticated via Firebase persistence
              showSuccess('Success', 'Authenticated successfully with ' + biometricTypeName);
              router.replace('/(tabs)');
            } else if (email) {
              // SECURITY: Re-authenticate with Firebase using stored email
              // Note: For true biometric login, user must login with password first
              // to establish Firebase session. Biometric only works for session restoration.
              showError(new Error('Please login with your password first to enable biometric authentication'));
            } else {
              // No credentials saved - biometric enabled but no stored email
              showError(new Error('Biometric authentication not set up. Please login with password first.'));
            }
          }
        } catch (_error) {
          // Silently fail to password login if biometric fails
          console.warn('[Login] Biometric authentication failed, showing password login');
        }
      }
    };

    // Small delay to allow UI to render first
    const timer = setTimeout(attemptBiometricAuth, 100); // Small delay for UI stabilization
    return () => clearTimeout(timer);
  }, [biometricAvailable, biometricEnabled, biometricAttempted, authenticateWithBiometric, biometricTypeName, router]);

  const handleBiometricLogin = async () => {
    try {
      // SECURITY: Biometric authentication with Firebase session check
      const success = await authenticateWithBiometric();
      if (success) {
        // Get saved credentials from secure storage
        const { email } = await BiometricStorage.getBiometricCredentials();

        if (email && auth.currentUser) {
          // User is already authenticated via Firebase persistence
          showSuccess('Success', 'Authenticated successfully with ' + biometricTypeName);
          router.replace('/(tabs)');
        } else if (email) {
          // SECURITY: For true biometric login, user must have logged in with password first
          showError(new Error('Please login with your password first to enable biometric authentication'));
        } else {
          // No credentials saved
          showError(new Error('Biometric authentication not set up. Please login with password first.'));
        }
      }
    } catch (error) {
      showError(error);
    }
  };

  const onSubmit = async (data: z.infer<typeof schema>) => {
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
      // Only saves email (not password) for Firebase session restoration
      if (biometricEnabled) {
        await BiometricStorage.setBiometricCredentials(sanitizedEmail);
      }

      // Check if 2FA is enabled for this user
      // Note: This is a simplified check. In production, 2FA status should be
      // checked against the server/Firestore after successful authentication
      try {
        const { TwoFactorStorage } = await import('@/utils/secure-storage');
        const is2FAEnabled = await TwoFactorStorage.getTwoFactorEnabled();

        if (is2FAEnabled) {
          // Redirect to 2FA verification screen
          router.push({
            pathname: '/(auth)/verify-2fa',
            params: { email: data.email },
          });
          return;
        }
      } catch (_storageError) {
        // Continue to main app if 2FA check fails
        console.warn('[Login] Could not check 2FA status, continuing to main app');
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

  return (
    <ScreenContainer scrollable centerContent>
      <ThemedText type="h1" style={CommonText.title}>
        {i18n.t('screens.login.title')}
      </ThemedText>
      <ThemedText type="body" style={CommonText.subtitle}>
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
        <ThemedButton title={i18n.t('screens.login.forgotPassword')} variant="link" onPress={() => router.push('/(auth)/forgot-password')} style={styles.linkButton} />
      )}

      <ThemedButton
        title={loading ? i18n.t('screens.login.loggingIn') : i18n.t('screens.login.loginButton')}
        onPress={handleSubmit(onSubmit)}
        disabled={loading || isAccountLocked()}
        style={styles.button}
      />
      {loading && <ActivityIndicator style={styles.loading} />}

      {/* Security Warning */}
      {remainingAttempts < 5 && remainingAttempts > 0 && !isAccountLocked() && (
        <View
          style={[
            styles.warningContainer,
            {
              backgroundColor: warningColor + '1A',
              borderColor: warningColor + '4D',
            },
          ]}
        >
          <ThemedText style={[styles.warningText, { color: warningColor }]}>⚠️ {remainingAttempts} login attempts remaining</ThemedText>
        </View>
      )}

      {/* Account Locked Warning */}
      {isAccountLocked() && (
        <View
          style={[
            styles.lockoutContainer,
            {
              backgroundColor: errorColor + '1A',
              borderColor: errorColor + '4D',
            },
          ]}
        >
          <ThemedText style={[styles.lockoutText, { color: errorColor }]}>🔒 Account temporarily locked. Try again in {getTimeUntilUnlock()} minutes.</ThemedText>
        </View>
      )}

      {/* Alternative Login Methods Section */}
      {(isAuthMethodEnabled(AuthMethod.EMAIL_MAGIC_LINK) || isAuthMethodEnabled(AuthMethod.EMAIL_OTP) || isAuthMethodEnabled(AuthMethod.PHONE_OTP)) && (
        <View style={styles.alternativeMethodsContainer}>
          <ThemedText type="caption" style={styles.alternativeMethodsTitle}>
            {i18n.t('screens.login.alternativeMethods', { defaultValue: 'Or sign in with' })}
          </ThemedText>

          {isAuthMethodEnabled(AuthMethod.EMAIL_MAGIC_LINK) && (
            <ThemedButton
              title={i18n.t('screens.login.magicLink', { defaultValue: 'Magic Link (Passwordless)' })}
              variant="secondary"
              // @ts-expect-error - Route exists but typed routes need regeneration
              onPress={() => router.push('/(auth)/passwordless-login')}
              style={styles.alternativeButton}
            />
          )}

          {isAuthMethodEnabled(AuthMethod.EMAIL_OTP) && (
            <ThemedButton
              title={i18n.t('screens.login.emailOtp', { defaultValue: 'Email OTP' })}
              variant="secondary"
              // @ts-expect-error - Route exists but typed routes need regeneration
              onPress={() => router.push('/(auth)/otp-login')}
              style={styles.alternativeButton}
            />
          )}

          {isAuthMethodEnabled(AuthMethod.PHONE_OTP) && (
            <ThemedButton
              title={i18n.t('screens.login.phoneOtp', { defaultValue: 'Phone OTP' })}
              variant="secondary"
              onPress={() => router.push('/(auth)/verify-phone')}
              style={styles.alternativeButton}
            />
          )}
        </View>
      )}

      {/* Biometric Login Button - Only show if enabled */}
      {isAuthMethodEnabled(AuthMethod.BIOMETRIC) && biometricAvailable && biometricEnabled && !isAccountLocked() && (
        <ThemedButton
          title={`Login with ${biometricTypeName}`}
          onPress={handleBiometricLogin}
          variant="secondary"
          style={styles.biometricButton}
          accessibilityLabel={`Login with ${biometricTypeName}`}
          accessibilityHint={`Use your ${biometricTypeName.toLowerCase()} to login quickly`}
        />
      )}

      {/* Social Sign-In - Only show if at least one social method is enabled */}
      {(isAuthMethodEnabled(AuthMethod.GOOGLE) || isAuthMethodEnabled(AuthMethod.APPLE) || isAuthMethodEnabled(AuthMethod.FACEBOOK)) && (
        <SocialSignInButtons
          onGoogleSignIn={isAuthMethodEnabled(AuthMethod.GOOGLE) ? signInWithGoogle : undefined}
          onAppleSignIn={isAuthMethodEnabled(AuthMethod.APPLE) ? signInWithApple : undefined}
          onFacebookSignIn={isAuthMethodEnabled(AuthMethod.FACEBOOK) ? signInWithFacebook : undefined}
          loading={socialLoading}
          mode="login"
        />
      )}

      <ThemedButton title={i18n.t('screens.login.noAccount')} variant="link" onPress={() => router.push('/(auth)/register')} style={styles.linkButton} />
      {AlertComponent}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
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
  biometricButton: {
    marginTop: Spacing.md,
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
  },
  alternativeMethodsContainer: {
    marginTop: Spacing.xl,
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
  },
  alternativeMethodsTitle: {
    textAlign: 'center',
    marginBottom: Spacing.md,
    opacity: 0.7,
  },
  alternativeButton: {
    marginTop: Spacing.sm,
    width: '100%',
  },
  warningContainer: {
    marginTop: Spacing.md,
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
  },
  warningText: {
    textAlign: 'center',
    fontSize: Typography.caption.fontSize,
  },
  lockoutContainer: {
    marginTop: Spacing.md,
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
  },
  lockoutText: {
    textAlign: 'center',
    fontSize: Typography.caption.fontSize,
  },
  linkButton: {
    marginTop: Spacing.md,
    alignSelf: 'center',
  },
  loading: {
    position: 'absolute',
    top: '50%',
    left: '50%',
  },
});
