import { ThemedButton } from '@/components/themed-button';
import { ThemedInput } from '@/components/themed-input';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/layout';
import { useAutoFocus } from '@/hooks/use-auto-focus';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useRef, useState } from 'react';
import { StyleSheet, type TextInput, View } from 'react-native';

interface BackupCodeFormProps {
  /** User's email address */
  email?: string;
  /** Callback when verify button is pressed */
  onVerify: (code: string) => void;
  /** Whether verification is in progress */
  loading: boolean;
  /** Whether backup codes are running low */
  isBackupCodesLow?: boolean;
  /** Number of backup codes remaining */
  backupCodesCount?: number;
}

/**
 * Backup Code Verification Form
 * Handles 8-character backup code input with warnings for low codes
 */
export function BackupCodeForm({ email, onVerify, loading, isBackupCodesLow = false, backupCodesCount = 0 }: BackupCodeFormProps) {
  const [backupCode, setBackupCode] = useState('');
  const backupCodeRef = useRef<TextInput>(null);
  const warningColor = useThemeColor({}, 'warning');

  useAutoFocus(backupCodeRef, 100, true);

  const handleCodeChange = (text: string) => {
    // Remove spaces and convert to uppercase
    const cleanedText = text.replace(/\s/g, '').toUpperCase();
    setBackupCode(cleanedText);
  };

  const handleVerify = () => {
    if (backupCode.length === 8) {
      onVerify(backupCode);
    }
  };

  return (
    <View style={styles.container}>
      <ThemedText type="h1" style={styles.title}>
        Enter Backup Code
      </ThemedText>

      <ThemedText style={styles.subtitle}>Enter one of your backup codes to complete authentication.</ThemedText>

      {email && <ThemedText style={styles.email}>{email}</ThemedText>}

      <ThemedInput
        ref={backupCodeRef}
        placeholder="Enter 8-character backup code"
        value={backupCode}
        onChangeText={handleCodeChange}
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

      <View style={styles.warningContainer}>
        <ThemedText type="caption" style={styles.warningText}>
          ⚠️ Backup codes can only be used once
        </ThemedText>
        {isBackupCodesLow && (
          <ThemedText type="caption" style={[styles.lowCodesWarning, { color: warningColor }]}>
            Only {backupCodesCount} backup codes remaining
          </ThemedText>
        )}
      </View>

      <ThemedButton title={loading ? 'Verifying...' : 'Verify Backup Code'} onPress={handleVerify} loading={loading} disabled={loading || backupCode.length !== 8} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  input: {
    fontSize: 32,
    textAlign: 'center',
    letterSpacing: 4,
  },
  warningContainer: {
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
});
