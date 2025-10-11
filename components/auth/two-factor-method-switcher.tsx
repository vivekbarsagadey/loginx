import { ThemedButton } from '@/components/themed-button';
import { Spacing } from '@/constants/layout';
import { useAlert } from '@/hooks/use-alert';
import { StyleSheet, View } from 'react-native';

interface TwoFactorMethodSwitcherProps {
  /** Current verification method */
  showBackupCodes: boolean;
  /** Callback to switch to backup codes */
  onUseBackupCode: () => void;
  /** Callback to switch back to TOTP */
  onBackToCode: () => void;
  /** Callback to cancel verification */
  onCancel: () => void;
}

/**
 * Two-Factor Method Switcher
 * Handles switching between TOTP codes and backup codes with confirmation dialogs
 */
export function TwoFactorMethodSwitcher({ showBackupCodes, onUseBackupCode, onBackToCode, onCancel }: TwoFactorMethodSwitcherProps) {
  const alert = useAlert();

  const handleUseBackupCode = () => {
    alert.show('Use Backup Code', "Backup codes are one-time use codes that can be used if you don't have access to your authenticator app.", [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Use Backup Code',
        onPress: onUseBackupCode,
      },
    ]);
  };

  const handleCancel = () => {
    alert.show('Cancel 2FA Verification', 'You need to complete 2FA verification to access your account.', [
      { text: 'Continue', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: onCancel,
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {showBackupCodes ? (
        <ThemedButton title="Back to Authenticator Code" variant="link" onPress={onBackToCode} />
      ) : (
        <ThemedButton title="Use Backup Code Instead" variant="link" onPress={handleUseBackupCode} />
      )}

      <ThemedButton title="Cancel" variant="link" onPress={handleCancel} style={styles.cancelButton} />

      {alert.AlertComponent}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.sm,
  },
  cancelButton: {
    marginTop: Spacing.xs,
    alignSelf: 'center',
  },
});
