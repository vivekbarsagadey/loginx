import { ThemedButton } from '@/components/themed-button';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/layout';
import { useHapticNavigation } from '@/hooks/use-haptic-navigation';
import i18n from '@/i18n';
import { AuthMethod, isAuthMethodEnabled } from '@/utils/auth-methods';
import type { Href } from 'expo-router';
import { StyleSheet, View } from 'react-native';

export function AlternativeAuthMethods() {
  const { push } = useHapticNavigation();

  // Check if unknown alternative methods are enabled
  const hasAlternativeMethods = isAuthMethodEnabled(AuthMethod.EMAIL_MAGIC_LINK) || isAuthMethodEnabled(AuthMethod.EMAIL_OTP) || isAuthMethodEnabled(AuthMethod.PHONE_OTP);

  if (!hasAlternativeMethods) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ThemedText type="caption" style={styles.title}>
        {i18n.t('screens.login.alternativeMethods', { defaultValue: 'Or sign in with' })}
      </ThemedText>

      {isAuthMethodEnabled(AuthMethod.EMAIL_MAGIC_LINK) && (
        <ThemedButton
          title={i18n.t('screens.login.magicLink', { defaultValue: 'Magic Link (Passwordless)' })}
          variant="secondary"
          onPress={() => push('/(auth)/passwordless-login' as Href)}
          style={styles.button}
        />
      )}

      {isAuthMethodEnabled(AuthMethod.EMAIL_OTP) && (
        <ThemedButton title={i18n.t('screens.login.emailOtp', { defaultValue: 'Email OTP' })} variant="secondary" onPress={() => push('/(auth)/email-otp-login' as Href)} style={styles.button} />
      )}

      {isAuthMethodEnabled(AuthMethod.PHONE_OTP) && (
        <ThemedButton title={i18n.t('screens.login.phoneOtp', { defaultValue: 'Phone OTP' })} variant="secondary" onPress={() => push('/(auth)/verify-phone')} style={styles.button} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: Spacing.xl,
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: Spacing.md,
    opacity: 0.7,
  },
  button: {
    marginTop: Spacing.sm,
    width: '100%',
  },
});
