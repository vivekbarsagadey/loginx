import { useCallback, useRef, useState } from 'react';

/**
 * Configuration options for retry behavior
 */
export interface RetryConfig {
  /** Maximum number of retry attempts */
  maxAttempts: number;
  /** Initial backoff delay in milliseconds */
  backoffMs: number;
  /** Backoff strategy: 'linear' or 'exponential' */
  backoffStrategy?: 'linear' | 'exponential';
  /** Maximum backoff delay in milliseconds */
  maxBackoffMs?: number;
  /** Callback invoked on each retry attempt */
  onRetry?: (attempt: number, _error: Error) => void;
  /** Callback invoked when all retries are exhausted */
  onMaxRetriesReached?: (_error: Error) => void;
  /** Function to determine if error is retryable */
  shouldRetry?: (_error: Error) => boolean;
}

/**
 * Return type for useAsyncRetry hook
 */
export interface UseAsyncRetryReturn<T> {
  /** Execute the operation with retry logic */
  execute: () => Promise<T | null>;
  /** Current loading state */
  isLoading: boolean;
  /** Last error encountered */
  error: Error | undefined;
  /** Current retry attempt number (0 = initial attempt) */
  retryCount: number;
  /** Whether the operation is currently retrying */
  isRetrying: boolean;
  /** Manually reset the retry state */
  reset: () => void;
  /** Cancel ongoing retry attempts */
  cancel: () => void;
}

/**
 * Hook for executing async operations with automatic retry logic
 *
 * @example
 * ```typescript
 * const { execute, isLoading, _error, retryCount } = useAsyncRetry(
 *   async () => {
 *     const response = await fetch('/api/data');
 *     if (!response.ok) throw new Error('Failed to fetch');
 *     return response.json();
 *   },
 *   {
 *     maxAttempts: 3,
 *     backoffMs: 1000,
 *     backoffStrategy: 'exponential',
 *     onRetry: (attempt) => console.error(`Retry attempt ${attempt}`),
 *   }
 * );
 *
 * // Execute the operation
 * const data = await execute();
 * ```
 *
 * @param operation - Async operation to execute with retry logic
 * @param config - Retry configuration
 * @returns Object with execute function and state
 */
export function useAsyncRetry<T>(operation: () => Promise<T>, config: RetryConfig): UseAsyncRetryReturn<T> {
  const { maxAttempts, backoffMs, backoffStrategy = 'exponential', maxBackoffMs = 30000, onRetry, onMaxRetriesReached, shouldRetry = () => true } = config;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | undefined>(undefined);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const cancelledRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * Calculate backoff delay for current retry attempt
   */
  const calculateBackoff = useCallback(
    (attempt: number): number => {
      let delay: number;
      if (backoffStrategy === 'exponential') {
        delay = Math.min(backoffMs * Math.pow(2, attempt), maxBackoffMs);
      } else {
        delay = Math.min(backoffMs * (attempt + 1), maxBackoffMs);
      }
      return delay;
    },
    [backoffMs, backoffStrategy, maxBackoffMs]
  );

  /**
   * Sleep for specified duration
   */
  const sleep = useCallback((ms: number): Promise<void> => {
    return new Promise((resolve) => {
      timeoutRef.current = setTimeout(resolve, ms);
    });
  }, []);

  /**
   * Cancel ongoing retry attempts
   */
  const cancel = useCallback(() => {
    cancelledRef.current = true;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsRetrying(false);
    setIsLoading(false);
  }, []);

  /**
   * Reset retry state
   */
  const reset = useCallback(() => {
    setIsLoading(false);
    setError(undefined);
    setRetryCount(0);
    setIsRetrying(false);
    cancelledRef.current = false;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  /**
   * Execute the operation with retry logic
   */
  const execute = useCallback(async (): Promise<T | null> => {
    reset();
    setIsLoading(true);
    cancelledRef.current = false;

    let lastError: Error | undefined = undefined;
    let attempt = 0;

    while (attempt <= maxAttempts) {
      if (cancelledRef.current) {
        setIsLoading(false);
        return null;
      }

      try {
        const result = await operation();
        setIsLoading(false);
        setError(undefined);
        setRetryCount(0);
        setIsRetrying(false);
        return result;
      } catch (_error: unknown) {
        lastError = _error instanceof Error ? _error : new Error(String(_error));

        // Check if we should retry this error
        if (lastError && !shouldRetry(lastError)) {
          setError(lastError);
          setIsLoading(false);
          setIsRetrying(false);
          return null;
        }

        // If we've exhausted all attempts, fail
        if (attempt >= maxAttempts) {
          setError(lastError);
          setIsLoading(false);
          setIsRetrying(false);
          setRetryCount(attempt);

          if (onMaxRetriesReached && lastError) {
            onMaxRetriesReached(lastError);
          }

          return null;
        }

        // Prepare for retry
        attempt++;
        setRetryCount(attempt);
        setIsRetrying(true);
        setError(lastError);

        if (onRetry && lastError) {
          onRetry(attempt, lastError);
        }

        // Wait before retrying
        const delay = calculateBackoff(attempt - 1);
        await sleep(delay);
      }
    }

    // Should not reach here, but handle just in case
    setIsLoading(false);
    setIsRetrying(false);
    return null;
  }, [operation, maxAttempts, shouldRetry, onRetry, onMaxRetriesReached, calculateBackoff, sleep, reset]);

  return {
    execute,
    isLoading,
    error,
    retryCount,
    isRetrying,
    reset,
    cancel,
  };
}
