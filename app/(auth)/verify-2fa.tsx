import { BackupCodeForm } from '@/components/auth/backup-code-form';
import { TOTPVerificationForm } from '@/components/auth/totp-verification-form';
import { TwoFactorMethodSwitcher } from '@/components/auth/two-factor-method-switcher';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/layout';
import { useFormSubmit } from '@/hooks/use-form-submit';
import { useHapticNavigation } from '@/hooks/use-haptic-navigation';
import { useTwoFactorAuth } from '@/hooks/use-two-factor-auth';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

/**
 * Two-Factor Authentication Code Input Screen
 * Displays after successful email/password login when 2FA is enabled
 */
export default function Verify2FAScreen() {
  const { replace } = useHapticNavigation();
  const { email } = useLocalSearchParams<{ email: string }>();

  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [currentCode, setCurrentCode] = useState('');

  const { consumeBackupCode, isBackupCodesLow, backupCodesCount } = useTwoFactorAuth();

  const verifyCode = async () => {
    if (!currentCode.trim()) {
      throw new Error('Please enter your 2FA code');
    }

    if (currentCode.length !== 6) {
      throw new Error('2FA code must be 6 digits');
    }

    // In a real implementation, this would validate the TOTP code
    const isValidCode = /^\d{6}$/.test(currentCode);

    if (!isValidCode) {
      throw new Error('Invalid 2FA code format');
    }

    // Mock validation - in production, validate against TOTP server
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  const { submit: handleVerifyCode, isSubmitting: loading } = useFormSubmit(verifyCode, {
    successTitle: 'Success',
    successMessage: '2FA code verified successfully!',
    onSuccess: () => replace('/(tabs)'),
  });

  const verifyBackupCode = async () => {
    if (!currentCode.trim()) {
      throw new Error('Please enter your backup code');
    }

    if (currentCode.length !== 8) {
      throw new Error('Backup code must be 8 characters');
    }

    const success = await consumeBackupCode(currentCode);

    if (!success) {
      throw new Error('Invalid backup code');
    }
  };

  const { submit: handleVerifyBackupCode, isSubmitting: loadingBackup } = useFormSubmit(verifyBackupCode, {
    successTitle: 'Success',
    successMessage: (() => {
      let message = 'Backup code verified successfully!';
      if (isBackupCodesLow) {
        message += `\n\nWarning: Only ${backupCodesCount} backup codes remaining.`;
      }
      return message;
    })(),
    onSuccess: () => replace('/(tabs)'),
  });

  const handleUseBackupCode = () => {
    setShowBackupCodes(true);
    setCurrentCode('');
  };

  const handleBackToCode = () => {
    setShowBackupCodes(false);
    setCurrentCode('');
  };

  const handleCancel = () => {
    replace('/(auth)/login');
  };

  const handleTOTPVerify = (code: string) => {
    setCurrentCode(code);
    // Trigger verification after state update
    setTimeout(() => handleVerifyCode(), 0);
  };

  const handleBackupVerify = (code: string) => {
    setCurrentCode(code);
    // Trigger verification after state update
    setTimeout(() => handleVerifyBackupCode(), 0);
  };

  return (
    <ThemedView style={styles.screenContainer}>
      <View style={styles.content}>
        {showBackupCodes ? (
          <BackupCodeForm email={email} onVerify={handleBackupVerify} loading={loadingBackup} isBackupCodesLow={isBackupCodesLow} backupCodesCount={backupCodesCount} />
        ) : (
          <TOTPVerificationForm email={email} onVerify={handleTOTPVerify} loading={loading} />
        )}

        <TwoFactorMethodSwitcher showBackupCodes={showBackupCodes} onUseBackupCode={handleUseBackupCode} onBackToCode={handleBackToCode} onCancel={handleCancel} />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    padding: Spacing.md,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    gap: Spacing.md,
  },
});
