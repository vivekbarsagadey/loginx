import { ThemedButton } from '@/components/themed-button';
import { Spacing } from '@/constants/layout';
import { auth } from '@/firebase-config';
import { useBiometricAuth } from '@/hooks/use-biometric-auth';
import { AuthMethod, isAuthMethodEnabled } from '@/utils/auth-methods';
import { showError } from '@/utils/error';
import { BiometricStorage } from '@/utils/secure-storage';
import { showSuccess } from '@/utils/success';
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';

interface BiometricLoginSectionProps {
  onSuccess: () => void;
  disabled?: boolean;
}

export function BiometricLoginSection({ onSuccess, disabled }: BiometricLoginSectionProps) {
  const [biometricAttempted, setBiometricAttempted] = useState(false);
  const { isAvailable: biometricAvailable, isEnabled: biometricEnabled, authenticateWithBiometric, biometricTypeName } = useBiometricAuth();

  // Auto-trigger biometric authentication on mount
  useEffect(() => {
    const attemptBiometricAuth = async () => {
      if (biometricAvailable && biometricEnabled && !biometricAttempted && !disabled) {
        setBiometricAttempted(true);
        try {
          const success = await authenticateWithBiometric();
          if (success) {
            const { email } = await BiometricStorage.getBiometricCredentials();

            if (email && auth.currentUser) {
              showSuccess('Success', `Authenticated successfully with ${biometricTypeName}`);
              onSuccess();
            } else if (email) {
              showError(new Error('Please login with your password first to enable biometric authentication'));
            } else {
              showError(new Error('Biometric authentication not set up. Please login with password first.'));
            }
          }
        } catch (error: unknown) {
          // Silently fail to password login if biometric fails
        }
      }
    };

    const timer = setTimeout(attemptBiometricAuth, 100);
    return () => clearTimeout(timer);
  }, [biometricAvailable, biometricEnabled, biometricAttempted, authenticateWithBiometric, biometricTypeName, disabled, onSuccess]);

  const handleBiometricLogin = async () => {
    try {
      const success = await authenticateWithBiometric();
      if (success) {
        const { email } = await BiometricStorage.getBiometricCredentials();

        if (email && auth.currentUser) {
          showSuccess('Success', `Authenticated successfully with ${biometricTypeName}`);
          onSuccess();
        } else if (email) {
          showError(new Error('Please login with your password first to enable biometric authentication'));
        } else {
          showError(new Error('Biometric authentication not set up. Please login with password first.'));
        }
      }
    } catch (error: unknown) {
      showError(error);
    }
  };

  // Only render if biometric is available, enabled, not disabled, and auth method is enabled
  if (!isAuthMethodEnabled(AuthMethod.BIOMETRIC) || !biometricAvailable || !biometricEnabled || disabled) {
    return null;
  }

  return (
    <ThemedButton
      title={`Login with ${biometricTypeName}`}
      onPress={handleBiometricLogin}
      variant="secondary"
      style={styles.button}
      accessibilityLabel={`Login with ${biometricTypeName}`}
      accessibilityHint={`Use your ${biometricTypeName.toLowerCase()} to login quickly`}
    />
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: Spacing.md,
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
  },
});
