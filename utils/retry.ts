import { ApiConstants } from '@/constants';

/**
 * Retry configuration options
 */
interface RetryOptions {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffMultiplier?: number;
  shouldRetry?: (error: unknown) => boolean;
}

/**
 * Default retry configuration
 */
const DEFAULT_OPTIONS: Required<RetryOptions> = {
  maxRetries: ApiConstants.MAX_RETRIES,
  initialDelay: ApiConstants.INITIAL_DELAY,
  maxDelay: ApiConstants.MAX_DELAY,
  backoffMultiplier: ApiConstants.BACKOFF_MULTIPLIER,
  shouldRetry: (error: unknown) => {
    // Retry on network errors, but not on auth errors
    if (typeof error === 'object' && error !== null && 'code' in error) {
      const code = (error as { code: string }).code;
      // Don't retry authentication errors
      if (code.startsWith('auth/')) {
        return false;
      }
    }
    return true;
  },
};

/**
 * Sleep for a specified duration
 * @param ms - Milliseconds to sleep
 */
const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Calculate delay with exponential backoff and jitter
 * @param attempt - Current attempt number (0-indexed)
 * @param options - Retry options
 */
const calculateDelay = (attempt: number, options: Required<RetryOptions>): number => {
  const exponentialDelay = options.initialDelay * Math.pow(options.backoffMultiplier, attempt);
  const cappedDelay = Math.min(exponentialDelay, options.maxDelay);
  // Add jitter (random 0-25% variation) to prevent thundering herd
  const jitter = cappedDelay * 0.25 * Math.random();
  return cappedDelay + jitter;
};

/**
 * Retry an async operation with exponential backoff
 * @param fn - Async function to retry
 * @param options - Retry configuration
 * @returns Promise that resolves with the function result
 * @example
 * ```typescript
 * const result = await withRetry(
 *   () => fetchUserData(userId),
 *   { maxRetries: 3, initialDelay: 1000 }
 * );
 * ```
 */
export async function withRetry<T>(fn: () => Promise<T>, options: RetryOptions = {}): Promise<T> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  let lastError: unknown;

  for (let attempt = 0; attempt <= opts.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Check if we should retry this error
      if (!opts.shouldRetry(error)) {
        console.warn(`[Retry] Not retrying error:`, error);
        throw error;
      }

      // Don't retry if we've exhausted all attempts
      if (attempt === opts.maxRetries) {
        console.error(`[Retry] All ${opts.maxRetries + 1} attempts failed`);
        break;
      }

      // Calculate delay and wait
      const delay = calculateDelay(attempt, opts);
      console.warn(`[Retry] Attempt ${attempt + 1}/${opts.maxRetries + 1} failed. Retrying in ${Math.round(delay)}ms...`);
      await sleep(delay);
    }
  }

  // All retries exhausted, throw the last error
  throw lastError;
}

/**
 * Create a retry wrapper for a function
 * @param fn - Function to wrap with retry logic
 * @param options - Retry configuration
 * @returns Wrapped function with automatic retry
 * @example
 * ```typescript
 * const fetchWithRetry = retryable(
 *   (userId: string) => fetchUserData(userId),
 *   { maxRetries: 3 }
 * );
 * const user = await fetchWithRetry('user-123');
 * ```
 */
export function retryable<T extends unknown[], R>(fn: (...args: T) => Promise<R>, options: RetryOptions = {}): (...args: T) => Promise<R> {
  return async (...args: T): Promise<R> => {
    return withRetry(() => fn(...args), options);
  };
}
