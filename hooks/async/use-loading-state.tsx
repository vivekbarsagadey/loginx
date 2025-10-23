import { showError } from '@/utils/error';
import * as Haptics from 'expo-haptics';
import { useCallback, useState } from 'react';

interface UseLoadingStateOptions {
  /** Whether to provide haptic feedback on errors */
  enableHaptics?: boolean;
  /** Whether to show error alert automatically */
  showErrorAlert?: boolean;
  /** Custom error handler */
  onError?: (error: unknown) => void;
}

/**
 * Custom hook for managing loading states with automatic error handling
 * Simplifies async operations with consistent loading/error patterns
 */
export function useLoadingState(options: UseLoadingStateOptions = {}) {
  const { enableHaptics = true, showErrorAlert = true, onError } = options;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown | null>(null);

  /**
   * Execute an async operation with automatic loading state management
   */
  const execute = useCallback(
    async <T,>(operation: () => Promise<T>): Promise<{ success: boolean; data?: T; error?: unknown }> => {
      setLoading(true);
      setError(null);

      try {
        const data = await operation();
        return { success: true, data };
      } catch (err: unknown) {
        setError(err);

        // Haptic feedback on error
        if (enableHaptics) {
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }

        // Show error alert
        if (showErrorAlert) {
          showError(err);
        }

        // Custom error handler
        if (onError) {
          onError(err);
        }

        return { success: false, error: err };
      } finally {
        setLoading(false);
      }
    },
    [enableHaptics, showErrorAlert, onError]
  );

  /**
   * Reset error state
   */
  const resetError = useCallback(() => {
    setError(null);
  }, []);

  return {
    /** Whether an operation is currently loading */
    loading,
    /** Current error, if any */
    error,
    /** Execute an async operation with loading state management */
    execute,
    /** Reset the error state */
    resetError,
    /** Manually set loading state */
    setLoading,
  };
}
