/**
 * TASK-044: Retry Button Component
 * Button with exponential backoff display and automatic retry logic
 */

import { ThemedButton } from '@/components/themed-button';
import { ThemedText } from '@/components/themed-text';
import i18n from '@/i18n';
import { isRetryable } from '@/utils/error-classifier';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

interface RetryButtonProps {
  onRetry: () => Promise<void> | void;
  error?: unknown;
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  style?: object;
}

/**
 * Calculate next retry delay using exponential backoff
 */
const calculateNextDelay = (retryCount: number, initialDelay: number, maxDelay: number): number => {
  const delay = initialDelay * Math.pow(2, retryCount);
  return Math.min(delay, maxDelay);
};

/**
 * Format milliseconds to human-readable string
 */
const formatDelay = (ms: number): string => {
  if (ms < 1000) return `${ms}ms`;
  const seconds = Math.ceil(ms / 1000);
  return `${seconds}s`;
};

/**
 * Retry button with exponential backoff
 * Shows countdown timer and automatically manages retry logic
 */
export function RetryButton({ onRetry, error, maxRetries = 3, initialDelay = 1000, maxDelay = 30000, disabled = false, variant = 'primary', style }: RetryButtonProps) {
  const [retrying, setRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [nextRetryIn, setNextRetryIn] = useState(0);

  // Check if error is retryable
  const canRetry = !error || isRetryable(error);
  const retriesExhausted = retryCount >= maxRetries;
  const isDisabled = disabled || !canRetry || retriesExhausted;

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((prev) => prev - 100);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Handle retry
  const handleRetry = useCallback(async () => {
    if (isDisabled || retrying) return;

    setRetrying(true);
    try {
      await onRetry();
      // Success: reset retry count
      setRetryCount(0);
      setNextRetryIn(0);
    } catch (retryError) {
      // Failure: increment retry count and set delay
      const newRetryCount = retryCount + 1;
      setRetryCount(newRetryCount);

      if (newRetryCount < maxRetries) {
        const delay = calculateNextDelay(newRetryCount, initialDelay, maxDelay);
        setNextRetryIn(delay);
        setCountdown(delay);
      }

      // Re-throw error for parent to handle
      throw retryError;
    } finally {
      setRetrying(false);
    }
  }, [onRetry, retryCount, maxRetries, initialDelay, maxDelay, isDisabled, retrying]);

  // Auto-retry after countdown
  useEffect(() => {
    if (countdown === 0 && nextRetryIn > 0 && !retrying) {
      setNextRetryIn(0);
      handleRetry().catch(() => {
        // Error already handled in handleRetry
      });
    }
  }, [countdown, nextRetryIn, retrying, handleRetry]);

  // Get button title
  const getButtonTitle = (): string => {
    if (retrying) return i18n.t('common.retrying') || 'Retrying...';
    if (countdown > 0) return `${i18n.t('common.retry')} (${formatDelay(countdown)})`;
    if (retriesExhausted) return i18n.t('common.retriesExhausted') || 'Max Retries Reached';
    return i18n.t('common.retry');
  };

  return (
    <View style={[styles.container, style]}>
      <ThemedButton title={getButtonTitle()} onPress={handleRetry} variant={variant} disabled={isDisabled || retrying || countdown > 0} style={styles.button} />
      {retrying && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" />
        </View>
      )}
      {retryCount > 0 && retryCount < maxRetries && (
        <ThemedText type="caption" style={styles.retryInfo}>
          {i18n.t('common.retryAttempt', { current: retryCount, max: maxRetries }) || `Attempt ${retryCount}/${maxRetries}`}
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  button: {
    width: '100%',
  },
  loadingContainer: {
    position: 'absolute',
    right: 16,
    top: 12,
  },
  retryInfo: {
    marginTop: 8,
    textAlign: 'center',
    opacity: 0.7,
  },
});
