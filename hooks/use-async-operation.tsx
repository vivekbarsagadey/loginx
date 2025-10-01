/**
 * Custom hook for handling async operations with loading and error states
 * Reduces boilerplate code for async operations throughout the app
 */

import { showError } from '@/utils/error';
import { useCallback, useState } from 'react';

export interface UseAsyncOperationOptions {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
  showErrorToast?: boolean;
}

export interface UseAsyncOperationResult<T extends (...args: any[]) => Promise<any>> {
  loading: boolean;
  error: unknown;
  execute: T;
  reset: () => void;
}

/**
 * Hook to manage async operations with automatic loading and error handling
 *
 * @example
 * const { loading, error, execute } = useAsyncOperation(async (data) => {
 *   await someAsyncFunction(data);
 * }, { onSuccess: () => console.log('Success!') });
 *
 * // Use it
 * await execute(myData);
 */
export function useAsyncOperation<T extends (...args: any[]) => Promise<any>>(asyncFunction: T, options: UseAsyncOperationOptions = {}): UseAsyncOperationResult<T> {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const { onSuccess, onError, showErrorToast = true } = options;

  const execute = useCallback(
    async (...args: Parameters<T>): Promise<void> => {
      setLoading(true);
      setError(null);

      try {
        await asyncFunction(...args);
        onSuccess?.();
      } catch (err: unknown) {
        setError(err);
        if (showErrorToast) {
          showError(err);
        }
        onError?.(err);
      } finally {
        setLoading(false);
      }
    },
    [asyncFunction, onSuccess, onError, showErrorToast]
  ) as T;

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
  }, []);

  return { loading, error, execute, reset };
}
