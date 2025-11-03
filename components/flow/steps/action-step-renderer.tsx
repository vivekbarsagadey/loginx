/**
 * Action Step Renderer
 *
 * Renders action steps (async operations) from the flow configuration
 */

import { ThemedButton } from '@/components/themed-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/layout';
import { useThemeColors } from '@/hooks/use-theme-colors';
import type { ActionStepConfig, StepRendererProps } from '@/types/flow';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet } from 'react-native';

type ActionState = 'idle' | 'loading' | 'success' | 'error';

export function ActionStepRenderer({ step, data: _data, onUpdate, onNext, onBack: _onBack, onSkip: _onSkip, context: _context }: StepRendererProps<ActionStepConfig>) {
  const colors = useThemeColors();
  const [state, setState] = useState<ActionState>('idle');
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const executeAction = useCallback(async () => {
    setState('loading');
    setError(null);

    try {
      const result = await step.action();
      setState('success');
      onUpdate({ [`${step.id}_result`]: result });

      // Auto-advance to next step after a short delay
      setTimeout(() => {
        onNext();
      }, 1500);
    } catch (_error: unknown) {
      setState('error');
      setError(_error instanceof Error ? _error : new Error('Unknown error occurred'));
    }
  }, [step, onUpdate, onNext]);

  const handleRetry = useCallback(() => {
    if (!step.retry?.enabled || (step.retry.maxAttempts && retryCount >= step.retry.maxAttempts)) {
      return;
    }

    setRetryCount((prev) => prev + 1);

    if (step.retry.retryDelay) {
      setTimeout(() => {
        executeAction();
      }, step.retry.retryDelay);
    } else {
      executeAction();
    }
  }, [step.retry, retryCount, executeAction]);

  // Auto-execute action on mount
  useEffect(() => {
    executeAction();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderContent = () => {
    switch (state) {
      case 'loading':
        return (
          <>
            {step.loadingTitle && (
              <ThemedText type="title" style={styles.title}>
                {step.loadingTitle}
              </ThemedText>
            )}
            {step.loadingSubtitle && (
              <ThemedText type="body" style={styles.subtitle}>
                {step.loadingSubtitle}
              </ThemedText>
            )}
            <ActivityIndicator size="large" color={colors.primary} style={styles.indicator} />
          </>
        );

      case 'success':
        return (
          <>
            {step.successIcon && <Ionicons name={step.successIcon as keyof typeof Ionicons.glyphMap} size={64} color={colors.success} style={styles.stateIcon} />}
            {step.successTitle && (
              <ThemedText type="title" style={styles.title}>
                {step.successTitle}
              </ThemedText>
            )}
            {step.successSubtitle && (
              <ThemedText type="body" style={styles.subtitle}>
                {step.successSubtitle}
              </ThemedText>
            )}
          </>
        );

      case 'error':
        return (
          <>
            {step.errorIcon && <Ionicons name={step.errorIcon as keyof typeof Ionicons.glyphMap} size={64} color={colors.error} style={styles.stateIcon} />}
            {step.errorTitle && (
              <ThemedText type="title" style={styles.title}>
                {step.errorTitle}
              </ThemedText>
            )}
            {step.errorSubtitle && (
              <ThemedText type="body" style={styles.subtitle}>
                {step.errorSubtitle}
              </ThemedText>
            )}
            {error && (
              <ThemedText type="caption" style={[styles.errorMessage, { color: colors.error }]}>
                {error.message}
              </ThemedText>
            )}
            {step.retry?.enabled && (!step.retry.maxAttempts || retryCount < step.retry.maxAttempts) && (
              <ThemedButton title="Retry" onPress={handleRetry} variant="secondary" style={styles.retryButton} />
            )}
            {step.retry?.maxAttempts && (
              <ThemedText type="caption" style={styles.retryCount}>
                Attempts: {retryCount}/{step.retry.maxAttempts}
              </ThemedText>
            )}
          </>
        );

      default:
        return null;
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <ThemedView style={styles.centerContent}>{renderContent()}</ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.md,
    flexGrow: 1,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stateIcon: {
    marginBottom: Spacing.lg,
  },
  title: {
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: Spacing.md,
    opacity: 0.8,
  },
  indicator: {
    marginTop: Spacing.xl,
  },
  errorMessage: {
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  retryButton: {
    marginTop: Spacing.lg,
  },
  retryCount: {
    textAlign: 'center',
    marginTop: Spacing.sm,
    opacity: 0.7,
  },
});
