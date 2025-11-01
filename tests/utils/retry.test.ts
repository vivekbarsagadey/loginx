/**
 * Tests for retry utility
 */

import { retryable, withRetry } from '@/utils/retry';

describe('retry utility', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('withRetry', () => {
    it('should succeed on first attempt', async () => {
      const fn = jest.fn().mockResolvedValue('success');
      const result = await withRetry(fn);
      
      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should retry on failure and eventually succeed', async () => {
      const fn = jest
        .fn()
        .mockRejectedValueOnce(new Error('Attempt 1 failed'))
        .mockRejectedValueOnce(new Error('Attempt 2 failed'))
        .mockResolvedValueOnce('success');
      
      const result = await withRetry(fn, { maxRetries: 3, initialDelay: 10 });
      
      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(3);
    });

    it('should throw error after exhausting retries', async () => {
      const error = new Error('Persistent failure');
      const fn = jest.fn().mockRejectedValue(error);
      
      await expect(
        withRetry(fn, { maxRetries: 2, initialDelay: 10 })
      ).rejects.toThrow('Persistent failure');
      
      expect(fn).toHaveBeenCalledTimes(3);
    });

    it('should not retry when shouldRetry returns false', async () => {
      const authError = { code: 'auth/invalid-email' };
      const fn = jest.fn().mockRejectedValue(authError);
      
      await expect(
        withRetry(fn, {
          maxRetries: 3,
          shouldRetry: (_error: unknown) => {
            if (typeof _error === 'object' && _error !== null && 'code' in _error) {
              const code = (_error as { code: string }).code;
              return !code.startsWith('auth/');
            }
            return true;
          },
        })
      ).rejects.toEqual(authError);
      
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should apply exponential backoff', async () => {
      const fn = jest
        .fn()
        .mockRejectedValueOnce(new Error('Attempt 1'))
        .mockRejectedValueOnce(new Error('Attempt 2'))
        .mockResolvedValueOnce('success');
      
      const startTime = Date.now();
      await withRetry(fn, { maxRetries: 2, initialDelay: 100, backoffMultiplier: 2 });
      const duration = Date.now() - startTime;
      
      expect(duration).toBeGreaterThanOrEqual(300);
    });
  });

  describe('retryable', () => {
    it('should wrap function with retry logic', async () => {
      const originalFn = jest
        .fn()
        .mockRejectedValueOnce(new Error('Failed'))
        .mockResolvedValueOnce('success');
      
      const wrappedFn = retryable(originalFn, { maxRetries: 2, initialDelay: 10 });
      const result = await wrappedFn();
      
      expect(result).toBe('success');
      expect(originalFn).toHaveBeenCalledTimes(2);
    });

    it('should pass arguments to wrapped function', async () => {
      const originalFn = jest.fn().mockResolvedValue('result');
      const wrappedFn = retryable(
        (a: number, b: string) => originalFn(a, b),
        { maxRetries: 1 }
      );
      
      await wrappedFn(42, 'test');
      
      expect(originalFn).toHaveBeenCalledWith(42, 'test');
    });
  });
});
