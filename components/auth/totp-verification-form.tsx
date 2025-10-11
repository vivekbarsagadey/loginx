import { ThemedButton } from '@/components/themed-button';
import { ThemedInput } from '@/components/themed-input';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/layout';
import { useAutoFocus } from '@/hooks/use-auto-focus';
import { useRef, useState } from 'react';
import { StyleSheet, type TextInput, View } from 'react-native';

interface TOTPVerificationFormProps {
  /** User's email address */
  email?: string;
  /** Callback when verify button is pressed */
  onVerify: (code: string) => void;
  /** Whether verification is in progress */
  loading: boolean;
}

/**
 * TOTP (Time-based One-Time Password) Verification Form
 * Handles 6-digit authenticator code input and validation
 */
export function TOTPVerificationForm({ email, onVerify, loading }: TOTPVerificationFormProps) {
  const [code, setCode] = useState('');
  const codeRef = useRef<TextInput>(null);

  useAutoFocus(codeRef, 100, true);

  const handleCodeChange = (text: string) => {
    // Only allow digits
    const numericText = text.replace(/\D/g, '');
    setCode(numericText);
  };

  const handleVerify = () => {
    if (code.length === 6) {
      onVerify(code);
    }
  };

  return (
    <View style={styles.container}>
      <ThemedText type="h1" style={styles.title}>
        Enter 2FA Code
      </ThemedText>

      <ThemedText style={styles.subtitle}>Open your authenticator app and enter the 6-digit code to complete your login.</ThemedText>

      {email && <ThemedText style={styles.email}>{email}</ThemedText>}

      <ThemedInput
        ref={codeRef}
        placeholder="Enter 6-digit code"
        value={code}
        onChangeText={handleCodeChange}
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

      <ThemedButton title={loading ? 'Verifying...' : 'Verify Code'} onPress={handleVerify} loading={loading} disabled={loading || code.length !== 6} />
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
  helperText: {
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  instructionText: {
    textAlign: 'center',
    opacity: 0.7,
  },
});
