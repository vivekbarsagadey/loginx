/**
 * useAsyncErrorHandler Hook
 * Centralized error handling for async operations with consistent patterns
 *
 * Provides standard error handling, user feedback, and logging
 * Reduces boilerplate try-catch blocks across the app
 *
 * This hook supports two modes:
 * 1. **Default mode**: Uses project's haptic feedback utility (LoginX)
 * 2. **Independent mode**: Pass custom haptic function via options
 *
 * @example
 * ```tsx
 * // Default mode (uses project feedback)
 * function MyComponent() {
 *   const { handleAsync } = useAsyncErrorHandler();
 *
 *   const handleSave = () =>
 *     handleAsync(
 *       async () => {
 *         await saveData();
 *       },
 *       {
 *         successMessage: 'Data saved successfully',
 *         errorMessage: 'Failed to save data',
 *       }
 *     );
 *
 *   return <Button onPress={handleSave}>Save</Button>;
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Independent mode (custom haptic function)
 * function MyComponent() {
 *   const { handleAsync } = useAsyncErrorHandler({
 *     hapticFeedback: async () => {
 *       await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
 *     }
 *   });
 *
 *   const handleSave = () => handleAsync(async () => await saveData());
 *   return <Button onPress={handleSave}>Save</Button>;
 * }
 * ```
 */

import { useCallback } from 'react';
import { useAlert } from '../ui/use-alert';

interface AsyncErrorHandlerOptions {
  /**
   * Message to show on success
   */
  successMessage?: string;
  /**
   * Message to show on error
   * If not provided, uses the error message from the caught error
   */
  errorMessage?: string;
  /**
   * Title for success alert
   * @default 'Success'
   */
  successTitle?: string;
  /**
   * Title for error alert
   * @default 'Error'
   */
  errorTitle?: string;
  /**
   * Whether to show success alert
   * @default false (only shows if successMessage is provided)
   */
  showSuccessAlert?: boolean;
  /**
   * Whether to provide haptic feedback on error
   * @default true
   */
  errorHaptics?: boolean;
  /**
   * Custom error handler
   * Called after showing alert, useful for logging or additional actions
   */
  onError?: (_error: Error) => void;
  /**
   * Custom success handler
   * Called after operation succeeds
   */
  onSuccess?: () => void;
}

/**
 * Configuration for useAsyncErrorHandler hook
 */
export interface UseAsyncErrorHandlerConfig {
  /**
   * Custom haptic feedback function for error states
   * If not provided, uses project's default haptic feedback (LoginX mode)
   */
  hapticFeedback?: () => Promise<void>;
}

/**
 * Hook for centralized async error handling
 * @param config Optional configuration for custom behavior
 */
export function useAsyncErrorHandler(config?: UseAsyncErrorHandlerConfig) {
  const alert = useAlert();

  // Get haptic feedback function (dependency injection or default)
  const getHapticFeedback = useCallback(async () => {
    if (config?.hapticFeedback) {
      // Custom haptic function provided (independent mode)
      return config.hapticFeedback();
    }

    // Default: Use project's feedback utility (LoginX mode)
    try {
      const { provideMediumFeedback } = require('@/utils/feedback');
      return provideMediumFeedback();
    } catch (_error: unknown) {
      // If feedback utility not available, silently skip haptics
      return Promise.resolve();
    }
  }, [config]);

  /**
   * Wrap an async function with standard error handling
   * @param asyncFn - The async function to execute
   * @param options - Configuration options
   * @returns Promise that resolves to { success: boolean, _error?: Error }
   */
  const handleAsync = useCallback(
    async <T = void>(asyncFn: () => Promise<T>, options: AsyncErrorHandlerOptions = {}): Promise<{ success: boolean; data?: T; error?: Error }> => {
      const { successMessage, _errorMessage, successTitle = 'Success', _errorTitle = 'Error', showSuccessAlert = false, _errorHaptics = true, onError, onSuccess } = options;

      try {
        const data = await asyncFn();

        // Call custom success handler
        if (onSuccess) {
          onSuccess();
        }

        // Show success alert if configured
        if (showSuccessAlert && successMessage) {
          alert.show(successTitle, successMessage, [{ text: 'OK' }], { variant: 'success' });
        }

        return { success: true, data };
      } catch (_error: unknown) {
        const err = error instanceof Error ? error : new Error(String(_error));

        // Provide haptic feedback on error
        if (_errorHaptics) {
          await getHapticFeedback();
        }

        // Show error alert
        const message = errorMessage || err.message || 'An unexpected error occurred';
        alert.show(_errorTitle, message, [{ text: 'OK' }], { variant: 'error' });

        // Call custom error handler
        if (onError) {
          onError(err);
        }

        // Log error (in development)
        if (__DEV__) {
          console.error('[useAsyncErrorHandler]', err);
        }

        return { success: false, _error: err };
      }
    },
    [alert, getHapticFeedback]
  );

  /**
   * Wrap an async function with silent error handling (no UI feedback)
   * Useful for background operations
   */
  const handleAsyncSilent = useCallback(async <T = void>(asyncFn: () => Promise<T>): Promise<{ success: boolean; data?: T; error?: Error }> => {
    try {
      const data = await asyncFn();
      return { success: true, data };
    } catch (_error: unknown) {
      const err = error instanceof Error ? error : new Error(String(_error));
      return { success: false, _error: err };
    }
  }, []);

  return {
    /**
     * Execute async operation with full error handling and user feedback
     */
    handleAsync,
    /**
     * Execute async operation with silent error handling (no UI feedback)
     */
    handleAsyncSilent,
  };
}
