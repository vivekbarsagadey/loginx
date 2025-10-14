/**
 * Firebase Cloud Functions for LoginX
 * TASK-010, TASK-011, TASK-012: Server-side rate limiting for authentication
 */

import * as admin from 'firebase-admin';
import { HttpsError, onCall } from 'firebase-functions/v2/https';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import { authRateLimit, cleanupExpiredRateLimits, emailVerificationRateLimit, passwordResetRateLimit } from './middleware/rate-limit';

// Initialize Firebase Admin
admin.initializeApp();

/**
 * TASK-010: Server-side rate limiting for signInWithEmailAndPassword
 * Validates login attempts and enforces rate limits
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const validateLogin = onCall(async (request: any) => {
  try {
    // Apply rate limiting
    await authRateLimit(request);

    const { email } = request.data;

    if (!email || typeof email !== 'string') {
      throw new HttpsError('invalid-argument', 'Email is required');
    }

    // Additional validation can be added here
    // For example: Check if user exists, is not banned, etc.

    // Return success - actual authentication happens on client
    return {
      success: true,
      message: 'Login validation passed',
    };
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('Rate limit exceeded')) {
        throw new HttpsError('resource-exhausted', error.message);
      }
    }
    throw new HttpsError('internal', 'Login validation failed');
  }
});

/**
 * TASK-011: Server-side rate limiting for createUserWithEmailAndPassword
 * Validates registration attempts and enforces rate limits
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const validateRegistration = onCall(async (request: any) => {
  try {
    // Apply rate limiting
    await authRateLimit(request);

    const { email, displayName } = request.data;

    if (!email || typeof email !== 'string') {
      throw new HttpsError('invalid-argument', 'Email is required');
    }

    if (displayName && typeof displayName !== 'string') {
      throw new HttpsError('invalid-argument', 'Display name must be a string');
    }

    // Check if email is already in use
    try {
      const userRecord = await admin.auth().getUserByEmail(email);
      if (userRecord) {
        throw new HttpsError('already-exists', 'Email is already in use');
      }
    } catch (error: unknown) {
      // User not found is expected - continue
      const authError = error as { code?: string };
      if (authError.code !== 'auth/user-not-found') {
        throw error;
      }
    }

    return {
      success: true,
      message: 'Registration validation passed',
    };
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('Rate limit exceeded')) {
        throw new HttpsError('resource-exhausted', error.message);
      }
    }
    if (error instanceof HttpsError) {
      throw error;
    }
    throw new HttpsError('internal', 'Registration validation failed');
  }
});

/**
 * TASK-012: IP-based rate limiting using Firestore
 * Track login attempts by IP address
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const recordLoginAttempt = onCall(async (request: any) => {
  try {
    const { email, success } = request.data;

    if (!email || typeof email !== 'string') {
      throw new HttpsError('invalid-argument', 'Email is required');
    }

    const ip = request.rawRequest.ip || 'unknown';
    const db = admin.firestore();

    // Record attempt in rate_limits collection
    const attemptRef = db.collection('login_attempts').doc();
    await attemptRef.set({
      email,
      ip,
      success: success || false,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      userAgent: request.rawRequest.headers['user-agent'] || 'unknown',
    });

    return {
      success: true,
      message: 'Login attempt recorded',
    };
  } catch (error) {
    console.error('Failed to record login attempt:', error);
    // Don't throw - logging failures shouldn't block auth
    return {
      success: false,
      message: 'Failed to record attempt',
    };
  }
});

/**
 * Password reset rate limiting
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const validatePasswordReset = onCall(async (request: any) => {
  try {
    // Apply stricter rate limiting for password resets
    await passwordResetRateLimit(request);

    const { email } = request.data;

    if (!email || typeof email !== 'string') {
      throw new HttpsError('invalid-argument', 'Email is required');
    }

    // Check if user exists
    try {
      await admin.auth().getUserByEmail(email);
    } catch (_error: unknown) {
      // Don't reveal if user exists or not for security
      // Return success regardless
    }

    return {
      success: true,
      message: 'Password reset validation passed',
    };
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('Rate limit exceeded')) {
        throw new HttpsError('resource-exhausted', error.message);
      }
    }
    throw new HttpsError('internal', 'Password reset validation failed');
  }
});

/**
 * Email verification rate limiting
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const validateEmailVerification = onCall(async (request: any) => {
  try {
    // Apply rate limiting for email verification
    await emailVerificationRateLimit(request);

    const { code } = request.data;

    if (!code || typeof code !== 'string') {
      throw new HttpsError('invalid-argument', 'Verification code is required');
    }

    return {
      success: true,
      message: 'Email verification validation passed',
    };
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('Rate limit exceeded')) {
        throw new HttpsError('resource-exhausted', error.message);
      }
    }
    throw new HttpsError('internal', 'Email verification validation failed');
  }
});

/**
 * Scheduled function to cleanup expired rate limit records
 * Runs daily at 2 AM
 */
export const scheduledRateLimitCleanup = onSchedule('0 2 * * *', async () => {
  try {
    await cleanupExpiredRateLimits();
    // eslint-disable-next-line no-console
    console.log('Rate limit cleanup completed successfully');
  } catch (error) {
    console.error('Rate limit cleanup failed:', error);
  }
});

/**
 * Get rate limit status for debugging (admin only)
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getRateLimitStatus = onCall(async (request: any) => {
  try {
    // Verify admin authentication
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'Authentication required');
    }

    // Check if user is admin (you should implement proper admin check)
    const user = await admin.auth().getUser(request.auth.uid);
    const isAdmin = user.customClaims?.admin === true;

    if (!isAdmin) {
      throw new HttpsError('permission-denied', 'Admin access required');
    }

    const { collection = 'rate_limits' } = request.data;
    const db = admin.firestore();

    const snapshot = await db.collection(collection).limit(100).get();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const records = snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return {
      success: true,
      collection,
      count: records.length,
      records,
    };
  } catch (error) {
    if (error instanceof HttpsError) {
      throw error;
    }
    throw new HttpsError('internal', 'Failed to get rate limit status');
  }
});
