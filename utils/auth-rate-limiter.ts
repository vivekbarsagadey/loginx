/**
 * Client-Side Authentication Rate Limiter Helper
 * TASK-014: Helper to call Cloud Functions and handle rate limit errors gracefully
 * SECURITY: Integrates with server-side rate limiting
 */

import { functions } from '@/firebase-config';
import { httpsCallable, type HttpsCallableResult } from 'firebase/functions';
import { logger } from './logger-production';

/**
 * Rate limit error response
 */
export interface RateLimitError {
  code: 'rate-limited';
  message: string;
  retryAfter?: number; // seconds
}

/**
 * Validation response
 */
export interface ValidationResponse {
  success: boolean;
  message: string;
  rateLimited?: boolean;
  retryAfter?: number;
}

/**
 * Call Cloud Function with automatic rate limit error handling
 * @param functionName - Name of the Cloud Function
 * @param data - Data to pass to the function
 * @returns Validation response
 */
async function callAuthFunction(functionName: string, data: Record<string, any>): Promise<ValidationResponse> {
  try {
    if (!functions) {
      logger.warn('[AuthRateLimiter] Firebase Functions not initialized');
      return {
        success: true, // Allow operation if functions not available
        message: 'Validation skipped - functions not available',
      };
    }

    const fn = httpsCallable(functions, functionName);
    const result: HttpsCallableResult = await fn(data);

    return {
      success: true,
      message: (result.data as any)?.message || 'Validation passed',
    };
  } catch (error: any) {
    // Handle rate limit errors (HTTP 429)
    if (error.code === 'functions/resource-exhausted') {
      logger.warn('[AuthRateLimiter] Rate limit exceeded', {
        function: functionName,
        message: error.message,
      });

      // Extract retry time from error message
      const retryMatch = error.message.match(/(\d+)\s*minute/i);
      const retryAfter = retryMatch ? parseInt(retryMatch[1], 10) * 60 : 60;

      return {
        success: false,
        message: error.message || 'Too many attempts. Please try again later.',
        rateLimited: true,
        retryAfter,
      };
    }

    // Handle other errors
    if (error.code === 'functions/already-exists') {
      return {
        success: false,
        message: error.message || 'Resource already exists',
      };
    }

    if (error.code === 'functions/invalid-argument') {
      return {
        success: false,
        message: error.message || 'Invalid input',
      };
    }

    // Log unexpected errors
    logger.error('[AuthRateLimiter] Validation function failed', error);

    // Allow operation on unexpected errors (fail open for better UX)
    return {
      success: true,
      message: 'Validation skipped due to error',
    };
  }
}

/**
 * Validate login attempt with server-side rate limiting
 * TASK-010: Call validateLogin Cloud Function
 * @param email - User email
 * @returns Validation response
 */
export async function validateLogin(email: string): Promise<ValidationResponse> {
  return callAuthFunction('validateLogin', { email });
}

/**
 * Validate registration attempt with server-side rate limiting
 * TASK-011: Call validateRegistration Cloud Function
 * @param email - User email
 * @param displayName - User display name (optional)
 * @returns Validation response
 */
export async function validateRegistration(email: string, displayName?: string): Promise<ValidationResponse> {
  return callAuthFunction('validateRegistration', { email, displayName });
}

/**
 * Record login attempt for analytics and rate limiting
 * TASK-012: Call recordLoginAttempt Cloud Function
 * @param email - User email
 * @param success - Whether login was successful
 */
export async function recordLoginAttempt(email: string, success: boolean): Promise<void> {
  try {
    if (!functions) {
      return;
    }

    const fn = httpsCallable(functions, 'recordLoginAttempt');
    await fn({ email, success });
  } catch (error) {
    // Don't throw - recording failures shouldn't block auth flow
    logger.warn('[AuthRateLimiter] Failed to record login attempt', {
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * Validate password reset attempt
 * @param email - User email
 * @returns Validation response
 */
export async function validatePasswordReset(email: string): Promise<ValidationResponse> {
  return callAuthFunction('validatePasswordReset', { email });
}

/**
 * Validate email verification attempt
 * @param code - Verification code
 * @returns Validation response
 */
export async function validateEmailVerification(code: string): Promise<ValidationResponse> {
  return callAuthFunction('validateEmailVerification', { code });
}

/**
 * Format rate limit error message for display
 * @param response - Validation response with rate limit info
 * @returns User-friendly error message
 */
export function formatRateLimitMessage(response: ValidationResponse): string {
  if (!response.rateLimited) {
    return response.message;
  }

  const retryAfter = response.retryAfter || 60;
  const minutes = Math.ceil(retryAfter / 60);

  if (minutes <= 1) {
    return 'Too many attempts. Please wait a minute and try again.';
  }

  return `Too many attempts. Please wait ${minutes} minutes and try again.`;
}

/**
 * Check if error is a rate limit error
 * @param error - Error to check
 * @returns True if rate limit error
 */
export function isRateLimitError(error: any): boolean {
  return error?.code === 'functions/resource-exhausted' || error?.rateLimited === true;
}

/**
 * Get retry after time from error
 * @param error - Error object
 * @returns Retry after time in seconds, or 60 as default
 */
export function getRetryAfterTime(error: any): number {
  if (error?.retryAfter) {
    return error.retryAfter;
  }

  // Try to extract from error message
  const message = error?.message || '';
  const match = message.match(/(\d+)\s*minute/i);

  if (match) {
    return parseInt(match[1], 10) * 60;
  }

  return 60; // Default to 1 minute
}
