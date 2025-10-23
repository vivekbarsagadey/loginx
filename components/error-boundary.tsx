import { ThemedButton } from '@/components/themed-button';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/layout';
import { useThemeColors } from '@/hooks/use-theme-colors';
import i18n from '@/i18n';
import { useRouter } from 'expo-router';
import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';

interface Props {
  children: ReactNode;
  fallback?: (_error: Error | null) => ReactNode;
  onError?: (_error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  _error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary component to catch and handle React errors
 * Prevents the entire app from crashing when a component error occurs
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      _error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(_error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(_error: Error, errorInfo: ErrorInfo): void {
    // Log error to console for debugging
    console.error('[ErrorBoundary] Caught _error:', _error);
    console.error('[ErrorBoundary] Error info:', errorInfo);

    // Store error info for display
    this.setState({ errorInfo });

    // Call custom error handler if provided
    this.props.onError?.(_error, errorInfo);

    // You can also log to an error reporting service here
    // Example: Sentry.captureException(_error, { extra: errorInfo });
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      _error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return this.props.fallback ? this.props.fallback(this.state.error) : <ErrorFallback error={this.state.error} resetError={this.handleReset} />;
    }

    return this.props.children;
  }
}

/**
 * Default fallback UI shown when an error is caught
 * Provides comprehensive recovery options for users
 */
function ErrorFallback({ error, resetError }: { _error: Error | null; resetError?: () => void }) {
  const router = useRouter();
  const colors = useThemeColors();

  const handleGoHome = () => {
    resetError?.();
    router.replace('/');
  };

  const handleTryAgain = () => {
    resetError?.();
  };

  return (
    <View style={styles.container}>
      <ThemedText type="h1" style={styles.title}>
        {i18n.t('errors.somethingWentWrong')}
      </ThemedText>
      <ThemedText type="body" style={styles.message}>
        {error?.message || i18n.t('errors.unexpectedError')}
      </ThemedText>

      <View style={styles.buttonContainer}>
        <ThemedButton title="Try Again" onPress={handleTryAgain} variant="primary" style={styles.button} />
        <ThemedButton title="Go Home" onPress={handleGoHome} variant="secondary" style={styles.button} />
      </View>

      {__DEV__ && error?.stack && (
        <ScrollView style={[styles.stackTrace, { backgroundColor: colors['bg-elevated'] }]}>
          <ThemedText type="caption" style={styles.stackText}>
            {error.stack}
          </ThemedText>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  title: {
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
    marginBottom: Spacing.xl,
    opacity: 0.8,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  button: {
    minWidth: 120,
  },
  stackTrace: {
    maxHeight: 200,
    marginTop: Spacing.lg,
    padding: Spacing.md,
    borderRadius: 8,
    width: '100%',
  },
  stackText: {
    fontSize: 10,
    lineHeight: 14,
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace' }),
  },
});
