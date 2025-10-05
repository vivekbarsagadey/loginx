import { ThemedButton } from '@/components/themed-button';
import { ThemedInput } from '@/components/themed-input';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CommonButtons, CommonContainers, CommonText } from '@/constants/common-styles';
import { Spacing, Typography } from '@/constants/layout';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useTwoFactorAuth } from '@/hooks/use-two-factor-auth';
import { showError } from '@/utils/error';
import { showSuccess } from '@/utils/success';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, TextInput, View } from 'react-native';

/**
 * Two-Factor Authentication Code Input Screen
 * Displays after successful email/password login when 2FA is enabled
 */
export default function Verify2FAScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();

  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [backupCode, setBackupCode] = useState('');

  const { consumeBackupCode, isBackupCodesLow, backupCodesCount } = useTwoFactorAuth();
  const warningColor = useThemeColor({}, 'warning');

  const codeRef = useRef<TextInput>(null);
  const backupCodeRef = useRef<TextInput>(null);

  // Auto-focus code input on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      if (showBackupCodes) {
        backupCodeRef.current?.focus();
      } else {
        codeRef.current?.focus();
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [showBackupCodes]);

  const handleVerifyCode = async () => {
    if (!code.trim()) {
      showError('Please enter your 2FA code');
      return;
    }

    if (code.length !== 6) {
      showError('2FA code must be 6 digits');
      return;
    }

    setLoading(true);

    try {
      // In a real implementation, this would validate the TOTP code
      // For demo purposes, we'll accept any 6-digit code
      // TODO: Implement actual TOTP validation when backend is available

      const isValidCode = /^\d{6}$/.test(code);

      if (!isValidCode) {
        throw new Error('Invalid 2FA code format');
      }

      // Mock validation - in production, validate against TOTP server
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Keep as is for UX delay

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      showSuccess('Success', '2FA code verified successfully!', () => {
        router.replace('/(tabs)');
      });
    } catch (error) {
      console.error('[2FA] Error verifying code:', error);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      showError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyBackupCode = async () => {
    if (!backupCode.trim()) {
      showError('Please enter your backup code');
      return;
    }

    if (backupCode.length !== 8) {
      showError('Backup code must be 8 characters');
      return;
    }

    setLoading(true);

    try {
      const success = await consumeBackupCode(backupCode);

      if (success) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        let message = 'Backup code verified successfully!';
        if (isBackupCodesLow) {
          message += `\n\nWarning: Only ${backupCodesCount} backup codes remaining.`;
        }

        showSuccess('Success', message, () => {
          router.replace('/(tabs)');
        });
      } else {
        throw new Error('Invalid backup code');
      }
    } catch (error) {
      console.error('[2FA] Error verifying backup code:', error);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      showError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUseBackupCode = () => {
    Alert.alert('Use Backup Code', "Backup codes are one-time use codes that can be used if you don't have access to your authenticator app.", [
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
    Alert.alert('Cancel 2FA Verification', 'You need to complete 2FA verification to access your account.', [
      { text: 'Continue', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => router.replace('/(auth)/login'),
      },
    ]);
  };

  if (showBackupCodes) {
    return (
      <ThemedView style={CommonContainers.screenContainer}>
        <View style={styles.content}>
          <ThemedText type="h1" style={CommonText.title}>
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

          <ThemedButton
            title={loading ? 'Verifying...' : 'Verify Backup Code'}
            onPress={handleVerifyBackupCode}
            loading={loading}
            disabled={loading || backupCode.length !== 8}
            style={CommonButtons.button}
          />
          {loading && <ActivityIndicator style={styles.loading} />}

          <ThemedButton title="Back to Authenticator Code" variant="link" onPress={handleBackToCode} style={CommonButtons.linkButtonSmall} />

          <ThemedButton title="Cancel" variant="link" onPress={handleCancel} style={styles.cancelButton} />
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={CommonContainers.screenContainer}>
      <View style={styles.content}>
        <ThemedText type="h1" style={CommonText.title}>
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

        <ThemedButton title={loading ? 'Verifying...' : 'Verify Code'} onPress={handleVerifyCode} loading={loading} disabled={loading || code.length !== 6} style={CommonButtons.button} />
        {loading && <ActivityIndicator style={styles.loading} />}

        <ThemedButton title="Use Backup Code Instead" variant="link" onPress={handleUseBackupCode} style={CommonButtons.linkButtonSmall} />

        <ThemedButton title="Cancel" variant="link" onPress={handleCancel} style={styles.cancelButton} />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    gap: Spacing.md,
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
