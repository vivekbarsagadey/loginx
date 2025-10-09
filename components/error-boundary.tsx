import { useThemeColor } from '@/hooks/use-theme-color';
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedButton } from './themed-button';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
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
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to console for debugging
    console.error('[ErrorBoundary] Caught error:', error);
    console.error('[ErrorBoundary] Error info:', errorInfo);

    // You can also log to an error reporting service here
    // Example: Sentry.captureException(error, { extra: errorInfo });
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return <ErrorFallback error={this.state.error} onReset={this.handleReset} />;
    }

    return this.props.children;
  }
}

/**
 * Default fallback UI shown when an error is caught
 */
function ErrorFallback({ error, onReset }: { error: Error | null; onReset: () => void }) {
  const errorColor = useThemeColor({}, 'error');
  const mutedColor = useThemeColor({}, 'text-muted');

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="h1" style={styles.title}>
        Oops! Something went wrong
      </ThemedText>
      <ThemedText type="body" style={styles.message}>
        We encountered an unexpected error. Don&apos;t worry, your data is safe.
      </ThemedText>
      {__DEV__ && error && (
        <View style={[styles.errorDetails, { backgroundColor: errorColor + '1A' }]}>
          <ThemedText type="caption" style={[styles.errorText, { color: errorColor }]}>
            {error.message}
          </ThemedText>
          {error.stack && (
            <ThemedText type="caption" style={[styles.stackText, { color: mutedColor }]}>
              {error.stack.slice(0, 500)}
            </ThemedText>
          )}
        </View>
      )}
      <ThemedButton title="Try Again" onPress={onReset} style={styles.button} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  message: {
    marginBottom: 32,
    textAlign: 'center',
    opacity: 0.8,
    paddingHorizontal: 16,
    lineHeight: 22,
  },
  errorDetails: {
    marginBottom: 32,
    padding: 16,
    borderRadius: 12,
    maxWidth: '100%',
  },
  errorText: {
    marginBottom: 8,
    lineHeight: 18,
  },
  stackText: {
    fontSize: 10,
    lineHeight: 14,
  },
  button: {
    minWidth: 200,
    marginTop: 8,
  },
});
