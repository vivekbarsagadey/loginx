import { ThemedButton } from '@/components/themed-button';
import { ThemedInput } from '@/components/themed-input';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing, Typography } from '@/constants/layout';
import { useAlert } from '@/hooks/use-alert';
import { useAutoFocus } from '@/hooks/use-auto-focus';
import { useFormSubmit } from '@/hooks/use-form-submit';
import { useHapticNavigation } from '@/hooks/use-haptic-navigation';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useTwoFactorAuth } from '@/hooks/use-two-factor-auth';
import { useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, type TextInput, View } from 'react-native';

/**
 * Two-Factor Authentication Code Input Screen
 * Displays after successful email/password login when 2FA is enabled
 */
export default function Verify2FAScreen() {
  const { replace } = useHapticNavigation();
  const { email } = useLocalSearchParams<{ email: string }>();
  const alert = useAlert();

  const [code, setCode] = useState('');
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [backupCode, setBackupCode] = useState('');

  const { consumeBackupCode, isBackupCodesLow, backupCodesCount } = useTwoFactorAuth();
  const warningColor = useThemeColor({}, 'warning');

  const codeRef = useRef<TextInput>(null);
  const backupCodeRef = useRef<TextInput>(null);

  // Auto-focus appropriate input based on mode
  useAutoFocus(showBackupCodes ? backupCodeRef : codeRef, 100, true);

  const verifyCode = async () => {
    if (!code.trim()) {
      throw new Error('Please enter your 2FA code');
    }

    if (code.length !== 6) {
      throw new Error('2FA code must be 6 digits');
    }

    // In a real implementation, this would validate the TOTP code
    // For demo purposes, we'll accept any 6-digit code
    // TODO: Implement actual TOTP validation when backend is available

    const isValidCode = /^\d{6}$/.test(code);

    if (!isValidCode) {
      throw new Error('Invalid 2FA code format');
    }

    // Mock validation - in production, validate against TOTP server
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Keep as is for UX delay
  };

  const { submit: handleVerifyCode, isSubmitting: loading } = useFormSubmit(verifyCode, {
    successTitle: 'Success',
    successMessage: '2FA code verified successfully!',
    onSuccess: () => replace('/(tabs)'),
  });

  const verifyBackupCode = async () => {
    if (!backupCode.trim()) {
      throw new Error('Please enter your backup code');
    }

    if (backupCode.length !== 8) {
      throw new Error('Backup code must be 8 characters');
    }

    const success = await consumeBackupCode(backupCode);

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
    alert.show('Use Backup Code', "Backup codes are one-time use codes that can be used if you don't have access to your authenticator app.", [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Use Backup Code',
        onPress: () => {
          setShowBackupCodes(true);
          setCode('');
        },
      },
    ]);
  };

  const handleBackToCode = () => {
    setShowBackupCodes(false);
    setBackupCode('');
  };

  const handleCancel = () => {
    alert.show('Cancel 2FA Verification', 'You need to complete 2FA verification to access your account.', [
      { text: 'Continue', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => replace('/(auth)/login'),
      },
    ]);
  };

  if (showBackupCodes) {
    return (
      <ThemedView style={styles.screenContainer}>
        <View style={styles.content}>
          <ThemedText type="h1" style={styles.title}>
            Enter Backup Code
          </ThemedText>
          <ThemedText style={styles.subtitle}>Enter one of your backup codes to complete authentication.</ThemedText>

          {email && <ThemedText style={styles.email}>{email}</ThemedText>}

          <ThemedInput
            ref={backupCodeRef}
            placeholder="Enter 8-character backup code"
            value={backupCode}
            onChangeText={(text) => setBackupCode(text.replace(/\s/g, '').toUpperCase())}
            keyboardType="default"
            maxLength={8}
            style={styles.input}
            autoFocus
            autoCapitalize="characters"
            autoComplete="one-time-code"
            textContentType="oneTimeCode"
            accessibilityLabel="Backup code input"
            accessibilityHint="Enter your 8-character backup code"
          />

          <View style={styles.backupCodeWarning}>
            <ThemedText type="caption" style={styles.warningText}>
              ⚠️ Backup codes can only be used once
            </ThemedText>
            {isBackupCodesLow && (
              <ThemedText type="caption" style={[styles.lowCodesWarning, { color: warningColor }]}>
                Only {backupCodesCount} backup codes remaining
              </ThemedText>
            )}
          </View>

          <ThemedButton title={loadingBackup ? 'Verifying...' : 'Verify Backup Code'} onPress={handleVerifyBackupCode} loading={loadingBackup} disabled={loadingBackup || backupCode.length !== 8} />
          {loadingBackup && <ActivityIndicator style={styles.loading} />}

          <ThemedButton title="Back to Authenticator Code" variant="link" onPress={handleBackToCode} />

          <ThemedButton title="Cancel" variant="link" onPress={handleCancel} style={styles.cancelButton} />
        </View>
        {alert.AlertComponent}
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.screenContainer}>
      <View style={styles.content}>
        <ThemedText type="h1" style={styles.title}>
          Enter 2FA Code
        </ThemedText>
        <ThemedText style={styles.subtitle}>Open your authenticator app and enter the 6-digit code to complete your login.</ThemedText>

        {email && <ThemedText style={styles.email}>{email}</ThemedText>}

        <ThemedInput
          ref={codeRef}
          placeholder="Enter 6-digit code"
          value={code}
          onChangeText={(text) => setCode(text.replace(/\D/g, ''))}
          keyboardType="number-pad"
          maxLength={6}
          style={styles.input}
          autoFocus
          textContentType="oneTimeCode"
          autoComplete="one-time-code"
          accessibilityLabel="2FA code input"
          accessibilityHint="Enter the 6-digit code from your authenticator app"
        />

        <View style={styles.helperText}>
          <ThemedText type="caption" style={styles.instructionText}>
            Check your authenticator app for the current 6-digit code
          </ThemedText>
        </View>

        <ThemedButton title={loading ? 'Verifying...' : 'Verify Code'} onPress={handleVerifyCode} loading={loading} disabled={loading || code.length !== 6} />
        {loading && <ActivityIndicator style={styles.loading} />}

        <ThemedButton title="Use Backup Code Instead" variant="link" onPress={handleUseBackupCode} />

        <ThemedButton title="Cancel" variant="link" onPress={handleCancel} style={styles.cancelButton} />
      </View>
      {alert.AlertComponent}
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
  title: {
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: Spacing.md,
  },
  email: {
    textAlign: 'center',
    fontSize: Typography.body.fontSize,
    fontWeight: Typography.bodyBold.fontWeight,
    marginBottom: Spacing.md,
  },
  input: {
    fontSize: Typography.h1.fontSize,
    textAlign: 'center',
    letterSpacing: 4,
  },
  helperText: {
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  instructionText: {
    textAlign: 'center',
    opacity: 0.7,
  },
  backupCodeWarning: {
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  warningText: {
    textAlign: 'center',
    opacity: 0.8,
  },
  lowCodesWarning: {
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
  cancelButton: {
    marginTop: Spacing.xs,
    alignSelf: 'center',
  },
  loading: {
    marginTop: Spacing.md,
  },
});
