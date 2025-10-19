/**
 * useAsyncErrorHandler Hook
 * Centralized error handling for async operations with consistent patterns
 *
 * Provides standard error handling, user feedback, and logging
 * Reduces boilerplate try-catch blocks across the app
 *
 * @example
 * ```tsx
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
 */

import { provideMediumFeedback } from '@/utils/feedback';
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
  onError?: (error: Error) => void;
  /**
   * Custom success handler
   * Called after operation succeeds
   */
  onSuccess?: () => void;
}

export function useAsyncErrorHandler() {
  const alert = useAlert();

  /**
   * Wrap an async function with standard error handling
   * @param asyncFn - The async function to execute
   * @param options - Configuration options
   * @returns Promise that resolves to { success: boolean, error?: Error }
   */
  const handleAsync = useCallback(
    async <T = void>(asyncFn: () => Promise<T>, options: AsyncErrorHandlerOptions = {}): Promise<{ success: boolean; data?: T; error?: Error }> => {
      const { successMessage, errorMessage, successTitle = 'Success', errorTitle = 'Error', showSuccessAlert = false, errorHaptics = true, onError, onSuccess } = options;

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
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));

        // Provide haptic feedback on error
        if (errorHaptics) {
          await provideMediumFeedback();
        }

        // Show error alert
        const message = errorMessage || err.message || 'An unexpected error occurred';
        alert.show(errorTitle, message, [{ text: 'OK' }], { variant: 'error' });

        // Call custom error handler
        if (onError) {
          onError(err);
        }

        // Log error (in development)
        if (__DEV__) {
          console.error('[useAsyncErrorHandler]', err);
        }

        return { success: false, error: err };
      }
    },
    [alert]
  );

  /**
   * Wrap an async function with silent error handling (no UI feedback)
   * Useful for background operations
   */
  const handleAsyncSilent = useCallback(async <T = void>(asyncFn: () => Promise<T>): Promise<{ success: boolean; data?: T; error?: Error }> => {
    try {
      const data = await asyncFn();
      return { success: true, data };
    } catch (err) {
      throw err;
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
