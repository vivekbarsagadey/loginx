import { ScreenContainer } from '@/components/screen-container';
import { ThemedButton } from '@/components/themed-button';
import { ThemedInput } from '@/components/themed-input';
import { ThemedText } from '@/components/themed-text';
import { SocialSignInButtons } from '@/components/ui/social-sign-in-buttons';
import { CommonText } from '@/constants/common-styles';
import { BorderRadius, Spacing, Typography } from '@/constants/layout';
import { auth } from '@/firebase-config';
import { useBiometricAuth } from '@/hooks/use-biometric-auth';
import { useSecuritySettings } from '@/hooks/use-security-settings';
import { useSocialAuth } from '@/hooks/use-social-auth';
import { useThemeColor } from '@/hooks/use-theme-color';
import i18n from '@/i18n';
import { showError } from '@/utils/error';

import { showSuccess } from '@/utils/success';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(i18n.t('screens.login.validation.invalidEmail')),
  password: z
    .string()
    .min(8, i18n.t('screens.login.validation.passwordTooShort'))
    .max(128, 'Password is too long')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.'),
});

export default function LoginScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [biometricAttempted, setBiometricAttempted] = useState(false);
  const { signInWithGoogle, signInWithApple, loading: socialLoading } = useSocialAuth();
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
          const success = await authenticateWithBiometric();
          if (success) {
            showSuccess('Success', 'Authenticated successfully with ' + biometricTypeName);
            router.replace('/(tabs)');
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
      const success = await authenticateWithBiometric();
      if (success) {
        showSuccess('Success', 'Authenticated successfully with ' + biometricTypeName);
        router.replace('/(tabs)');
      }
    } catch (error) {
      showError(error);
    }
  };

  const onSubmit = async (data: z.infer<typeof schema>) => {
    // Check if account is locked before attempting login
    if (isAccountLocked()) {
      const timeUntilUnlock = getTimeUntilUnlock();
      Alert.alert('Account Temporarily Locked', `Too many failed login attempts. Please try again in ${timeUntilUnlock} minutes.`, [{ text: 'OK' }]);
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
        Alert.alert('Account Will Be Locked', 'This was your last login attempt. Your account will be temporarily locked after one more failed attempt.', [{ text: 'OK' }]);
      } else if (remainingAttempts <= 3) {
        Alert.alert('Login Attempts Warning', `You have ${remainingAttempts - 1} login attempts remaining before your account is temporarily locked.`, [{ text: 'OK' }]);
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

      <ThemedButton title={i18n.t('screens.login.forgotPassword')} variant="link" onPress={() => router.push('/(auth)/forgot-password')} style={styles.linkButton} />

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

      {/* Biometric Login Button */}
      {biometricAvailable && biometricEnabled && !isAccountLocked() && (
        <ThemedButton
          title={`Login with ${biometricTypeName}`}
          onPress={handleBiometricLogin}
          variant="secondary"
          style={styles.biometricButton}
          accessibilityLabel={`Login with ${biometricTypeName}`}
          accessibilityHint={`Use your ${biometricTypeName.toLowerCase()} to login quickly`}
        />
      )}

      {/* Social Sign-In */}
      <SocialSignInButtons onGoogleSignIn={signInWithGoogle} onAppleSignIn={signInWithApple} loading={socialLoading} mode="login" />

      <ThemedButton title={i18n.t('screens.login.noAccount')} variant="link" onPress={() => router.push('/(auth)/register')} style={styles.linkButton} />
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
