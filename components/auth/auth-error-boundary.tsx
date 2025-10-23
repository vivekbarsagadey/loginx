/**
 * Authentication Error Boundary - TASK-005 (SEC-004)
 *
 * Wraps authentication screens to catch and handle React errors gracefully.
 * Provides user-friendly error messages and recovery options.
 *
 * Usage:
 * ```tsx
 * <AuthErrorBoundary>
 *   <LoginScreen />
 * </AuthErrorBoundary>
 * ```
 *
 * Features:
 * - Catches React component errors
 * - Shows user-friendly error UI
 * - Provides retry/recovery actions
 * - Logs errors for debugging
 * - Resets error state on navigation
 *
 * @module auth-error-boundary
 */

import { ThemedButton } from '@/components/themed-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { logger } from '@/utils/logger-production';
import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

interface Props {
  /** Child components to render */
  children: ReactNode;
  /** Custom error message to display (optional) */
  fallbackMessage?: string;
  /** Callback when user attempts to recover (optional) */
  onReset?: () => void;
  /** Whether to show technical error details in development */
  showTechnicalDetails?: boolean;
}

interface State {
  /** Whether an error has been caught */
  hasError: boolean;
  /** The caught error object */
  error: Error | null;
  /** Error info from React */
  errorInfo: ErrorInfo | null;
  /** Error count for rate limiting retries */
  errorCount: number;
}

/**
 * Error boundary for authentication screens
 * Catches and handles React component errors gracefully
 */
export class AuthErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
    };
  }

  /**
   * Update state when an error is caught
   */
  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  /**
   * Log error details
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error with production-safe logger
    logger.error('[AuthErrorBoundary] React component error caught', {
      error: {
        name: error.name,
        message: error.message,
        stack: __DEV__ ? error.stack : '[REDACTED]',
      },
      componentStack: __DEV__ ? errorInfo.componentStack : '[REDACTED]',
      errorCount: this.state.errorCount + 1,
    });

    // Update state with error info
    this.setState((prevState) => ({
      errorInfo,
      errorCount: prevState.errorCount + 1,
    }));

    // TODO: Send error to external monitoring service (Sentry, etc.)
    // if (Config.errorReporting.enabled) {
    //   Sentry.captureException(_error, { contexts: { react: errorInfo } });
    // }
  }

  /**
   * Reset error boundary state
   */
  handleReset = (): void => {
    logger.info('[AuthErrorBoundary] User initiated error recovery', {
      errorCount: this.state.errorCount,
    });

    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });

    // Call optional reset callback
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  /**
   * Render error fallback UI
   */
  renderErrorFallback(): ReactNode {
    const { fallbackMessage, showTechnicalDetails = __DEV__ } = this.props;
    const { error, errorInfo, errorCount } = this.state;

    // Determine if user should be rate-limited from retrying
    const maxRetries = 5;
    const canRetry = errorCount < maxRetries;

    return (
      <ThemedView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Error Icon */}
          <View style={styles.iconContainer}>
            <IconSymbol name="exclamationmark.triangle.fill" size={64} color={Colors.light.error} />
          </View>

          {/* Error Title */}
          <ThemedText type="title" style={styles.title}>
            {fallbackMessage || 'Something went wrong'}
          </ThemedText>

          {/* Error Message */}
          <ThemedText type="body" style={styles.message}>
            {canRetry
              ? "We encountered an unexpected error. Don't worry, your data is safe. Try refreshing the screen."
              : "We're experiencing technical difficulties. Please restart the app or contact support if the problem persists."}
          </ThemedText>

          {/* Technical Details (Development Only) */}
          {showTechnicalDetails && error && (
            <View style={styles.technicalDetails}>
              <ThemedText type="caption" style={styles.technicalTitle}>
                Technical Details (Development Only):
              </ThemedText>
              <ThemedText type="caption" style={styles.technicalText}>
                {error.name}: {error.message}
              </ThemedText>
              {error.stack && (
                <ThemedText type="caption" style={styles.technicalText}>
                  {error.stack.substring(0, 500)}
                  {error.stack.length > 500 ? '...' : ''}
                </ThemedText>
              )}
              {errorInfo?.componentStack && (
                <ThemedText type="caption" style={styles.technicalText}>
                  Component Stack:
                  {errorInfo.componentStack.substring(0, 300)}
                  {errorInfo.componentStack.length > 300 ? '...' : ''}
                </ThemedText>
              )}
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actions}>
            {canRetry && <ThemedButton title="Try Again" onPress={this.handleReset} variant="primary" style={styles.button} />}

            {!canRetry && (
              <ThemedText type="caption" style={styles.rateLimitMessage}>
                Too many errors. Please restart the app.
              </ThemedText>
            )}
          </View>

          {/* Error Count (Development Only) */}
          {__DEV__ && (
            <ThemedText type="caption" style={styles.errorCount}>
              Error count: {errorCount} / {maxRetries}
            </ThemedText>
          )}
        </ScrollView>
      </ThemedView>
    );
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return this.renderErrorFallback();
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
    color: Colors.light.error,
  },
  message: {
    textAlign: 'center',
    marginBottom: 32,
    opacity: 0.8,
  },
  technicalDetails: {
    backgroundColor: Colors.light['bg-elevated'],
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    width: '100%',
    maxWidth: 500,
  },
  technicalTitle: {
    fontWeight: '600',
    marginBottom: 8,
    color: Colors.light.warning,
  },
  technicalText: {
    fontFamily: 'monospace',
    fontSize: 11,
    marginBottom: 4,
    opacity: 0.7,
  },
  actions: {
    width: '100%',
    maxWidth: 400,
    gap: 12,
  },
  button: {
    minHeight: 48,
  },
  rateLimitMessage: {
    textAlign: 'center',
    color: Colors.light.error,
    marginTop: 8,
  },
  errorCount: {
    marginTop: 16,
    opacity: 0.5,
  },
});
