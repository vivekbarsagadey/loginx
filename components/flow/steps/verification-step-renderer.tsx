/**
 * Verification Step Renderer
 *
 * Renders OTP/code verification steps from the flow configuration
 */

import { ThemedButton } from '@/components/themed-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/layout';
import { useThemeColors } from '@/hooks/use-theme-colors';
import type { StepRendererProps, VerificationStepConfig } from '@/types/flow';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, TextInput } from 'react-native';

export function VerificationStepRenderer({ step, data: _data, onUpdate, onNext, onBack: _onBack, onSkip: _onSkip, context: _context }: StepRendererProps<VerificationStepConfig>) {
  const colors = useThemeColors();
  const [code, setCode] = useState<string[]>(Array(step.codeLength).fill(''));
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(step.resendInterval || 60);
  const [attempts, setAttempts] = useState(0);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  // Timer for resend button
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleCodeChange = (value: string, index: number) => {
    // Only allow single digit
    const digit = value.slice(-1);
    if (!/^\d*$/.test(digit)) return;

    const newCode = [...code];
    newCode[index] = digit;
    setCode(newCode);
    setError(null);

    // Move to next input if digit entered
    if (digit && index < step.codeLength - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit if code is complete and autoSubmit is enabled
    if (step.autoSubmit && newCode.every((d) => d !== '')) {
      handleVerify(newCode.join(''));
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = useCallback(
    async (verificationCode?: string) => {
      const codeToVerify = verificationCode || code.join('');
      if (codeToVerify.length !== step.codeLength) {
        setError('Please enter the complete verification code');
        return;
      }

      if (step.maxAttempts && attempts >= step.maxAttempts) {
        setError('Maximum verification attempts exceeded. Please request a new code.');
        return;
      }

      setVerifying(true);
      setError(null);

      try {
        const result = await step.onVerify(codeToVerify);
        if (result.verified) {
          // Store verification result
          onUpdate({ [`${step.id}_verified`]: true, [`${step.id}_code`]: codeToVerify });
          // Move to next step
          await onNext();
        } else {
          setError(result.error || 'Invalid verification code');
          setAttempts((prev) => prev + 1);
          setCode(Array(step.codeLength).fill(''));
          inputRefs.current[0]?.focus();
        }
      } catch (_error: unknown) {
        setError(_error instanceof Error ? _error.message : 'Verification failed. Please try again.');
        setAttempts((prev) => prev + 1);
      } finally {
        setVerifying(false);
      }
    },
    [code, step, attempts, onUpdate, onNext]
  );

  const handleResend = async () => {
    if (resendTimer > 0 || !step.onResend) return;

    setVerifying(true);
    setError(null);

    try {
      const result = await step.onResend();
      if (result.sent) {
        setResendTimer(step.resendInterval || 60);
        setCode(Array(step.codeLength).fill(''));
        setAttempts(0);
        inputRefs.current[0]?.focus();
      } else {
        setError(result.error || 'Failed to resend code');
      }
    } catch (_error: unknown) {
      setError(_error instanceof Error ? _error.message : 'Failed to resend code. Please try again.');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <ThemedView style={styles.header}>
        {step.icon && <Ionicons name={step.icon as keyof typeof Ionicons.glyphMap} size={48} color={step.iconColor || colors.primary} style={styles.headerIcon} />}
        {step.title && (
          <ThemedText type="title" style={styles.title}>
            {step.title}
          </ThemedText>
        )}
        {step.subtitle && (
          <ThemedText type="subtitle1" style={styles.subtitle}>
            {step.subtitle}
          </ThemedText>
        )}
        {step.description && (
          <ThemedText type="body" style={styles.description}>
            {step.description}
          </ThemedText>
        )}
      </ThemedView>

      <ThemedView style={styles.codeContainer}>
        {code.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => {
              inputRefs.current[index] = ref;
            }}
            style={[
              styles.codeInput,
              {
                borderColor: error ? colors.error : digit ? colors.primary : colors.border,
                color: colors.text,
              },
            ]}
            value={digit}
            onChangeText={(value) => handleCodeChange(value, index)}
            onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
            keyboardType="number-pad"
            maxLength={1}
            autoFocus={index === 0}
            editable={!verifying}
            selectTextOnFocus
            accessibilityLabel={`Digit ${index + 1} of ${step.codeLength}`}
          />
        ))}
      </ThemedView>

      {error && (
        <ThemedView style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={20} color={colors.error} />
          <ThemedText type="body" style={[styles.errorText, { color: colors.error }]}>
            {error}
          </ThemedText>
        </ThemedView>
      )}

      {step.maxAttempts && (
        <ThemedText type="caption" style={styles.attemptsText}>
          Attempts: {attempts}/{step.maxAttempts}
        </ThemedText>
      )}

      {!step.autoSubmit && (
        <ThemedButton
          title={verifying ? 'Verifying...' : 'Verify'}
          onPress={() => handleVerify()}
          disabled={verifying || code.some((d) => !d)}
          style={styles.verifyButton}
          leftIcon={verifying ? undefined : 'checkmark-circle'}
        />
      )}

      {verifying && <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />}

      {step.showResendButton !== false && step.onResend && (
        <ThemedView style={styles.resendContainer}>
          {step.showTimer !== false && resendTimer > 0 ? (
            <ThemedText type="body" style={styles.resendTimer}>
              Resend code in {resendTimer}s
            </ThemedText>
          ) : (
            <ThemedButton title="Resend Code" onPress={handleResend} variant="secondary" disabled={verifying} leftIcon="refresh" />
          )}
        </ThemedView>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.md,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  headerIcon: {
    marginBottom: Spacing.md,
  },
  title: {
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  description: {
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  codeInput: {
    width: 50,
    height: 60,
    borderWidth: 2,
    borderRadius: 12,
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.md,
    justifyContent: 'center',
  },
  errorText: {
    textAlign: 'center',
  },
  attemptsText: {
    textAlign: 'center',
    marginBottom: Spacing.md,
    opacity: 0.7,
  },
  verifyButton: {
    marginBottom: Spacing.md,
  },
  loader: {
    marginVertical: Spacing.md,
  },
  resendContainer: {
    marginTop: Spacing.lg,
    alignItems: 'center',
  },
  resendTimer: {
    textAlign: 'center',
    opacity: 0.7,
  },
});
