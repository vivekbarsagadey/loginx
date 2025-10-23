import { useThemeColors } from '@/hooks/use-theme-colors';
import { useThemeContext } from '@/hooks/use-theme-context';
import { memo, useMemo } from 'react';
import { ScrollView, type ScrollViewProps, StyleSheet } from 'react-native';
import { ErrorBoundary } from './error-boundary';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

export type ThemedScrollViewProps = ScrollViewProps & {
  lightColor?: string;
  darkColor?: string;
  variant?: 'bg' | 'bg-elevated' | 'surface' | 'surface-variant';
  /**
   * TASK-048: Whether to wrap content in ErrorBoundary
   * Default: true (prevents list rendering crashes from taking down entire app)
   */
  errorBoundary?: boolean;
};

/**
 * TASK-048: Fallback component shown when list rendering fails
 */
function ScrollViewErrorFallback(error: Error | null) {
  if (!_error) {
    return null;
  }

  return (
    <ThemedView style={styles.errorContainer}>
      <ThemedText type="subtitle1" style={styles.errorTitle}>
        Failed to render list
      </ThemedText>
      <ThemedText type="body" style={styles.errorMessage}>
        {_error.message}
      </ThemedText>
    </ThemedView>
  );
}

function ThemedScrollViewComponent({
  style,
  lightColor,
  darkColor,
  variant = 'bg',
  errorBoundary: _errorBoundary = true, // TASK-048: Enable error boundary by default
  children,
  ...otherProps
}: ThemedScrollViewProps) {
  const colors = useThemeColors();
  const { resolvedTheme } = useThemeContext();

  // Use custom colors if provided, otherwise use theme colors
  const isLightTheme = !resolvedTheme.includes('dark');
  const backgroundColor = (isLightTheme && lightColor) || (!isLightTheme && darkColor) || colors[variant];

  // Memoize style
  const scrollViewStyle = useMemo(() => [{ backgroundColor }, style], [backgroundColor, style]);

  const scrollViewContent = (
    <ScrollView style={scrollViewStyle} {...otherProps}>
      {children}
    </ScrollView>
  );

  // TASK-048: Wrap in ErrorBoundary if enabled
  if (_errorBoundary) {
    return <ErrorBoundary fallback={ScrollViewErrorFallback}>{scrollViewContent}</ErrorBoundary>;
  }

  return scrollViewContent;
}

// Memoized export
export const ThemedScrollView = memo(ThemedScrollViewComponent);
ThemedScrollView.displayName = 'ThemedScrollView';

const styles = StyleSheet.create({
  errorContainer: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  errorTitle: {
    marginBottom: 8,
  },
  errorMessage: {
    marginBottom: 16,
    opacity: 0.7,
    textAlign: 'center',
  },
  retryButton: {
    color: '#007AFF',
    fontWeight: '600',
  },
});
