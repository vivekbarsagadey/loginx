/**
 * Rate Limiting Middleware for Firebase Cloud Functions
 * TASK-009: Server-side rate limiting for authentication endpoints
 * SECURITY: Prevents brute force attacks on auth endpoints
 */

import * as admin from 'firebase-admin';
import type { CallableRequest } from 'firebase-functions/v2/https';

/**
 * Rate limit configuration
 */
export interface RateLimitConfig {
  /**
   * Maximum number of attempts allowed within the window
   */
  maxAttempts: number;

  /**
   * Time window in milliseconds
   */
  windowMs: number;

  /**
   * Firestore collection to store rate limit data
   */
  collection: string;

  /**
   * Key generator function to identify the requester
   * Default: Uses IP address
   */
  keyGenerator?: (request: CallableRequest) => string;

  /**
   * Error message to return when rate limited
   */
  message?: string;
}

/**
 * Rate limit data structure in Firestore
 */
interface RateLimitData {
  attempts: number;
  firstAttempt: admin.firestore.Timestamp;
  lastAttempt: admin.firestore.Timestamp;
  blockedUntil?: admin.firestore.Timestamp;
}

/**
 * Default key generator - uses IP address and user agent
 */
function defaultKeyGenerator(request: CallableRequest): string {
  const ip = request.rawRequest.ip || 'unknown';
  const userAgent = request.rawRequest.headers['user-agent'] || 'unknown';
  // Create a hash-like key from IP and user agent
  const key = `${ip}-${userAgent}`.substring(0, 100);
  return Buffer.from(key).toString('base64').substring(0, 100);
}

/**
 * Rate limiting middleware
 * @param config - Rate limit configuration
 * @returns Middleware function
 */
export function rateLimit(config: RateLimitConfig) {
  const { maxAttempts, windowMs, collection, keyGenerator = defaultKeyGenerator } = config;

  return async (request: CallableRequest): Promise<void> => {
    const db = admin.firestore();
    const key = keyGenerator(request);
    const docRef = db.collection(collection).doc(key);

    try {
      // Run in transaction to ensure atomic operations
      await db.runTransaction(async (transaction) => {
        const doc = await transaction.get(docRef);
        const now = admin.firestore.Timestamp.now();
        const nowMs = now.toMillis();

        if (!doc.exists) {
          // First attempt - create new record
          const newData: RateLimitData = {
            attempts: 1,
            firstAttempt: now,
            lastAttempt: now,
          };
          transaction.set(docRef, newData);
          return;
        }

        const data = doc.data() as RateLimitData;

        // Check if currently blocked
        if (data.blockedUntil) {
          const blockedUntilMs = data.blockedUntil.toMillis();
          if (nowMs < blockedUntilMs) {
            const remainingMs = blockedUntilMs - nowMs;
            const remainingMinutes = Math.ceil(remainingMs / 60000);
            throw new Error(`Rate limit exceeded. Please try again in ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}.`);
          } else {
            // Block period expired - reset
            const resetData: RateLimitData = {
              attempts: 1,
              firstAttempt: now,
              lastAttempt: now,
            };
            transaction.set(docRef, resetData);
            return;
          }
        }

        const firstAttemptMs = data.firstAttempt.toMillis();
        const windowExpired = nowMs - firstAttemptMs > windowMs;

        if (windowExpired) {
          // Window expired - reset counter
          const resetData: RateLimitData = {
            attempts: 1,
            firstAttempt: now,
            lastAttempt: now,
          };
          transaction.set(docRef, resetData);
          return;
        }

        // Within window - check if exceeded
        if (data.attempts >= maxAttempts) {
          // Rate limit exceeded - block for window duration
          const blockedUntil = admin.firestore.Timestamp.fromMillis(nowMs + windowMs);
          const updateData: Partial<RateLimitData> = {
            lastAttempt: now,
            blockedUntil,
          };
          transaction.update(docRef, updateData);

          const remainingMinutes = Math.ceil(windowMs / 60000);
          throw new Error(`Rate limit exceeded. You've made too many attempts. Please try again in ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}.`);
        }

        // Increment attempt counter
        const updateData: Partial<RateLimitData> = {
          attempts: data.attempts + 1,
          lastAttempt: now,
        };
        transaction.update(docRef, updateData);
      });
    } catch (error) {
      // If it's our rate limit error, re-throw it
      if (error instanceof Error && error.message.includes('Rate limit exceeded')) {
        throw error;
      }

      // Log other errors but don't block the request
      console.error('Rate limit check failed:', error);
      // Allow request to proceed if rate limit check fails
    }
  };
}

/**
 * Create rate limiter for authentication endpoints
 * SECURITY: 5 attempts per minute for login/register
 */
export const authRateLimit = rateLimit({
  maxAttempts: 5,
  windowMs: 60 * 1000, // 1 minute
  collection: 'rate_limits',
  message: 'Too many authentication attempts. Please try again in a minute.',
});

/**
 * Create rate limiter for password reset endpoints
 * SECURITY: 3 attempts per hour for password reset
 */
export const passwordResetRateLimit = rateLimit({
  maxAttempts: 3,
  windowMs: 60 * 60 * 1000, // 1 hour
  collection: 'rate_limits_password_reset',
  message: 'Too many password reset attempts. Please try again later.',
});

/**
 * Create rate limiter for email verification
 * SECURITY: 3 attempts per 5 minutes
 */
export const emailVerificationRateLimit = rateLimit({
  maxAttempts: 3,
  windowMs: 5 * 60 * 1000, // 5 minutes
  collection: 'rate_limits_email_verification',
  message: 'Too many verification attempts. Please wait before trying again.',
});

/**
 * Cleanup expired rate limit records
 * Should be run periodically (e.g., daily scheduled function)
 */
export async function cleanupExpiredRateLimits(): Promise<void> {
  const db = admin.firestore();
  const collections = ['rate_limits', 'rate_limits_password_reset', 'rate_limits_email_verification'];

  const now = admin.firestore.Timestamp.now();
  const oneDayAgo = admin.firestore.Timestamp.fromMillis(now.toMillis() - 24 * 60 * 60 * 1000);

  for (const collectionName of collections) {
    const snapshot = await db.collection(collectionName).where('lastAttempt', '<', oneDayAgo).limit(500).get();

    const batch = db.batch();
    let deleteCount = 0;

    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
      deleteCount++;
    });

    if (deleteCount > 0) {
      await batch.commit();
      console.error(`Cleaned up ${deleteCount} expired rate limit records from ${collectionName}`);
    }
  }
}
