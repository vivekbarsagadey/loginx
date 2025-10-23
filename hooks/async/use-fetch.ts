import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Fetch configuration options
 */
export interface UseFetchOptions extends RequestInit {
  /** Skip automatic execution on mount */
  manual?: boolean;
  /** Callback on successful fetch */
  onSuccess?: (data: any) => void;
  /** Callback on error */
  onError?: (_error: Error) => void;
  /** Transform response data before setting state */
  transform?: (data: any) => any;
  /** Retry configuration */
  retry?: {
    count: number;
    delay: number;
  };
  /** Debounce delay in milliseconds */
  debounce?: number;
}

/**
 * Fetch state
 */
export interface UseFetchState<T> {
  /** Response data */
  data: T | null;
  /** Error if fetch failed */
  error: Error | undefined;
  /** Loading state */
  isLoading: boolean;
  /** Validating/refetching state */
  isValidating: boolean;
}

/**
 * Return type for useFetch hook
 */
export interface UseFetchReturn<T> extends UseFetchState<T> {
  /** Manually trigger a fetch */
  refetch: () => Promise<void>;
  /** Mutate data without refetching */
  mutate: (data: T | ((prevData: T | null) => T)) => void;
  /** Cancel ongoing request */
  cancel: () => void;
  /** Reset to initial state */
  reset: () => void;
}

/**
 * Hook for standardized API calls with built-in state management
 *
 * @example
 * ```typescript
 * // Basic usage
 * const { data, isLoading, error } = useFetch('/api/users');
 *
 * // Manual fetch with POST
 * const { data, refetch, isLoading } = useFetch('/api/users', {
 *   manual: true,
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({ name: 'John' }),
 * });
 *
 * // With retry and callbacks
 * const { data, error } = useFetch('/api/data', {
 *   retry: { count: 3, delay: 1000 },
 *   onSuccess: (data) => console.error('Success:', data),
 *   onError: (error) => console.error('Error:', error),
 * });
 *
 * // With data transformation
 * const { data } = useFetch('/api/users', {
 *   transform: (data) => data.users.map(u => ({ ...u, fullName: `${u.firstName} ${u.lastName}` })),
 * });
 * ```
 *
 * @param url - URL to fetch
 * @param options - Fetch options and hook configuration
 * @returns Object with data, loading state, and control functions
 */
export function useFetch<T = any>(
  url: string,
  options: UseFetchOptions = {}
): UseFetchReturn<T> {
  const {
    manual = false,
    onSuccess,
    onError,
    transform,
    retry,
    debounce,
    ...fetchOptions
  } = options;

  const [state, setState] = useState<UseFetchState<T>>({
    data: null,
    error: null,
    isLoading: !manual,
    isValidating: false,
  });

  const abortControllerRef = useRef<AbortController | null>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);

  /**
   * Sleep for retry delay
   */
  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  /**
   * Cancel ongoing request
   */
  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
  }, []);

  /**
   * Reset to initial state
   */
  const reset = useCallback(() => {
    cancel();
    setState({
      data: null,
      error: null,
      isLoading: false,
      isValidating: false,
    });
  }, [cancel]);

  /**
   * Perform the fetch with retry logic
   */
  const performFetch = useCallback(
    async (isRefetch = false) => {
      if (!mountedRef.current) {return;}

      // Cancel any existing request
      cancel();

      // Create new abort controller
      const controller = new AbortController();
      abortControllerRef.current = controller;

      // Update loading state
      setState((prev) => ({
        ...prev,
        isLoading: !isRefetch,
        isValidating: isRefetch,
        error: null,
      }));

      let lastError: Error | undefined = null;
      const maxRetries = retry?.count ?? 0;
      const retryDelay = retry?.delay ?? 1000;

      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          const response = await fetch(url, {
            ...fetchOptions,
            signal: controller.signal,
          });

          if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
          }

          let data = await response.json();

          // Transform data if transform function provided
          if (transform) {
            data = transform(data);
          }

          if (!mountedRef.current) {return;}

          setState({
            data,
            error: null,
            isLoading: false,
            isValidating: false,
          });

          if (onSuccess) {
            onSuccess(data);
          }

          return;
        } catch (_err) {
          // Ignore abort errors
          if (_error instanceof Error && err.name === 'AbortError') {
            return;
          }

          lastError = _error instanceof Error ? _error : new Error(String(_error));

          // If we have retries left and not cancelled, wait and retry
          if (attempt < maxRetries && mountedRef.current) {
            await sleep(retryDelay);
            continue;
          }

          // All retries exhausted or no retries
          if (mountedRef.current) {
            setState({
              data: null,
              error: lastError,
              isLoading: false,
              isValidating: false,
            });

            if (onError) {
              onError(lastError);
            }
          }

          return;
        }
      }
    },
    [url, fetchOptions, transform, retry, onSuccess, onError, cancel]
  );

  /**
   * Debounced fetch
   */
  const debouncedFetch = useCallback(
    (isRefetch = false) => {
      if (debounce && debounce > 0) {
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }
        debounceTimerRef.current = setTimeout(() => {
          performFetch(isRefetch);
        }, debounce);
      } else {
        performFetch(isRefetch);
      }
    },
    [debounce, performFetch]
  );

  /**
   * Manually trigger a refetch
   */
  const refetch = useCallback(async () => {
    await debouncedFetch(true);
  }, [debouncedFetch]);

  /**
   * Mutate data without refetching
   */
  const mutate = useCallback((newData: T | ((prevData: T | null) => T)) => {
    setState((prev) => ({
      ...prev,
      data: typeof newData === 'function' ? (newData as Function)(prev.data) : newData,
    }));
  }, []);

  // Auto-fetch on mount if not manual
  useEffect(() => {
    if (!manual) {
      debouncedFetch(false);
    }

    return () => {
      mountedRef.current = false;
      cancel();
    };
  }, [manual, debouncedFetch, cancel]);

  return {
    ...state,
    refetch,
    mutate,
    cancel,
    reset,
  };
}
