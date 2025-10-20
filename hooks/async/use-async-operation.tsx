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

type AsyncFunction = (...args: readonly unknown[]) => Promise<unknown>;

export interface UseAsyncOperationResult<T extends AsyncFunction> {
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
 * }, { onSuccess: () => console.error('Success!') });
 *
 * // Use it
 * await execute(myData);
 */
export function useAsyncOperation<T extends AsyncFunction>(asyncFunction: T, options: UseAsyncOperationOptions = {}): UseAsyncOperationResult<T> {
  const [isLoading, setIsLoading] = useState(false);
  const [executionError, setExecutionError] = useState<unknown>(null);

  const { onSuccess, onError, showErrorToast = true } = options;

  const execute = useCallback(
    async (...args: Parameters<T>): Promise<void> => {
      setIsLoading(true);
      setExecutionError(null);

      try {
        await asyncFunction(...args);
        onSuccess?.();
      } catch (operationError: unknown) {
        setExecutionError(operationError);
        if (showErrorToast) {
          showError(operationError);
        }
        onError?.(operationError);
      } finally {
        setIsLoading(false);
      }
    },
    [asyncFunction, onSuccess, onError, showErrorToast]
  ) as T;

  const reset = useCallback(() => {
    setIsLoading(false);
    setExecutionError(null);
  }, []);

  return { loading: isLoading, error: executionError, execute, reset };
}
