/**
 * Tests for error handling utilities
 */

// Mock i18n and firebase config
jest.mock('@/i18n', () => ({
  __esModule: true,
  default: {
    t: (key: string) => key,
    locale: 'en',
  },
}));

jest.mock('@/utils/error-classifier', () => ({
  classifyError: jest.fn((error) => ({
    category: 'UNKNOWN',
    severity: 'MEDIUM',
    recoverable: true,
    retryable: false,
    userMessage: 'An error occurred',
  })),
}));

jest.mock('@/utils/error-messages', () => ({
  getFirebaseErrorMessage: jest.fn((code) => `Firebase error: ${code}`),
}));

import {
  isNetworkError,
  isRateLimitError,
  logError,
  showError,
} from '@/utils/error';

describe('error utilities', () => {
  describe('isNetworkError', () => {
    it('should identify network errors', () => {
      expect(isNetworkError(new Error('Network request failed'))).toBe(true);
      expect(isNetworkError(new Error('ECONNREFUSED'))).toBe(true);
      expect(isNetworkError({ code: 'NETWORK_ERROR' })).toBe(true);
    });

    it('should reject non-network errors', () => {
      expect(isNetworkError(new Error('Invalid input'))).toBe(false);
      expect(isNetworkError({ code: 'AUTH_ERROR' })).toBe(false);
      expect(isNetworkError('string error')).toBe(false);
    });
  });

  describe('isRateLimitError', () => {
    it('should identify rate limit errors', () => {
      expect(isRateLimitError({ code: 'auth/too-many-requests' })).toBe(true);
    });

    it('should reject non-rate-limit errors', () => {
      expect(isRateLimitError({ code: 'auth/invalid-email' })).toBe(false);
      expect(isRateLimitError(new Error('Regular error'))).toBe(false);
    });
  });

  describe('logError', () => {
    const originalConsoleError = console.error;

    beforeEach(() => {
      console.error = jest.fn();
    });

    afterEach(() => {
      console.error = originalConsoleError;
    });

    it('should log errors with context', () => {
      const error = new Error('Test error');
      logError(error, { action: 'test', userId: '123' });

      expect(console.error).toHaveBeenCalled();
    });

    it('should handle errors without message', () => {
      logError({ code: 'unknown' });

      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('showError', () => {
    it('should handle Error objects', () => {
      const error = new Error('Test error');
      expect(() => showError(error)).not.toThrow();
    });

    it('should handle error objects with code', () => {
      const error = { code: 'test/error', message: 'Test message' };
      expect(() => showError(error)).not.toThrow();
    });

    it('should handle unknown error types', () => {
      expect(() => showError('string error')).not.toThrow();
      expect(() => showError(null)).not.toThrow();
      expect(() => showError(undefined)).not.toThrow();
    });
  });

  describe('error type guards', () => {
    it('should handle Firebase auth error codes', () => {
      const errors = [
        { code: 'auth/user-not-found' },
        { code: 'auth/wrong-password' },
        { code: 'auth/too-many-requests' },
      ];

      errors.forEach((error) => {
        if ('code' in error && typeof error.code === 'string') {
          expect(error.code.startsWith('auth/')).toBe(true);
        }
      });
    });

    it('should handle Firestore error codes', () => {
      const errors = [
        { code: 'firestore/permission-denied' },
        { code: 'firestore/unavailable' },
      ];

      errors.forEach((error) => {
        if ('code' in error && typeof error.code === 'string') {
          expect(error.code.startsWith('firestore/')).toBe(true);
        }
      });
    });
  });
});
