/**
 * Distributed Locking Mechanism
 * TASK-026: Implements distributed locks using Firestore transactions
 * Prevents race conditions in multi-device sync scenarios
 */

import { firestore } from '@/firebase-config';
import { deleteDoc, doc, getDoc, runTransaction, serverTimestamp, setDoc } from 'firebase/firestore';
import { logger } from './logger-production';

interface LockInfo {
  lockId: string;
  ownerId: string;
  acquiredAt: any; // Firestore Timestamp
  expiresAt: number; // Unix timestamp
}

const LOCK_COLLECTION = 'distributed_locks';
const DEFAULT_LOCK_TIMEOUT = 30000; // 30 seconds
const MAX_ACQUIRE_ATTEMPTS = 3;
const ACQUIRE_RETRY_DELAY = 1000; // 1 second

/**
 * Acquire a distributed lock
 * @param lockKey - Unique identifier for the lock
 * @param ownerId - Identifier of the lock owner (e.g., user ID + device ID)
 * @param timeoutMs - Lock timeout in milliseconds
 * @returns Lock ID if successful, null if lock acquisition failed
 */
export async function acquireLock(
  lockKey: string,
  ownerId: string,
  timeoutMs: number = DEFAULT_LOCK_TIMEOUT
): Promise<string | null> {
  if (!firestore) {
    logger.warn('[DistributedLock] Firestore not initialized, lock acquisition skipped');
    return null;
  }

  const lockId = `${ownerId}_${Date.now()}`;
  const lockRef = doc(firestore, LOCK_COLLECTION, lockKey);
  const expiresAt = Date.now() + timeoutMs;

  for (let attempt = 0; attempt < MAX_ACQUIRE_ATTEMPTS; attempt++) {
    try {
      const acquired = await runTransaction(firestore, async (transaction) => {
        const lockDoc = await transaction.get(lockRef);

        if (!lockDoc.exists()) {
          // No lock exists, acquire it
          transaction.set(lockRef, {
            lockId,
            ownerId,
            acquiredAt: serverTimestamp(),
            expiresAt,
          });
          return true;
        }

        const lockData = lockDoc.data() as LockInfo;

        // Check if lock has expired
        if (lockData.expiresAt < Date.now()) {
          // Lock expired, acquire it
          transaction.set(lockRef, {
            lockId,
            ownerId,
            acquiredAt: serverTimestamp(),
            expiresAt,
          });
          return true;
        }

        // Check if we already own this lock
        if (lockData.ownerId === ownerId) {
          // Extend the lock
          transaction.update(lockRef, {
            lockId,
            expiresAt,
          });
          return true;
        }

        // Lock is held by someone else
        return false;
      });

      if (acquired) {
        logger.debug(`[DistributedLock] Lock acquired: ${lockKey} by ${ownerId}`);
        return lockId;
      }

      // Lock acquisition failed, retry with exponential backoff
      if (attempt < MAX_ACQUIRE_ATTEMPTS - 1) {
        const delay = ACQUIRE_RETRY_DELAY * Math.pow(2, attempt);
        logger.debug(`[DistributedLock] Lock busy: ${lockKey}, retrying in ${delay}ms`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    } catch (error: unknown) {
      logger.error(`[DistributedLock] Error acquiring lock ${lockKey}:`, error as Error);
      if (attempt === MAX_ACQUIRE_ATTEMPTS - 1) {
        throw error;
      }
    }
  }

  logger.warn(`[DistributedLock] Failed to acquire lock after ${MAX_ACQUIRE_ATTEMPTS} attempts: ${lockKey}`);
  return null;
}

/**
 * Release a distributed lock
 * @param lockKey - Unique identifier for the lock
 * @param lockId - Lock ID returned from acquireLock
 */
export async function releaseLock(lockKey: string, lockId: string): Promise<void> {
  if (!firestore) {
    return;
  }

  try {
    const lockRef = doc(firestore, LOCK_COLLECTION, lockKey);
    const lockDoc = await getDoc(lockRef);

    if (!lockDoc.exists()) {
      logger.debug(`[DistributedLock] Lock already released: ${lockKey}`);
      return;
    }

    const lockData = lockDoc.data() as LockInfo;

    // Only release if we own the lock
    if (lockData.lockId === lockId) {
      await deleteDoc(lockRef);
      logger.debug(`[DistributedLock] Lock released: ${lockKey}`);
    } else {
      logger.warn(`[DistributedLock] Attempted to release lock owned by someone else: ${lockKey}`);
    }
  } catch (error: unknown) {
    logger.error(`[DistributedLock] Error releasing lock ${lockKey}:`, error as Error);
  }
}

/**
 * Execute a function with a distributed lock
 * @param lockKey - Unique identifier for the lock
 * @param ownerId - Identifier of the lock owner
 * @param fn - Function to execute while holding the lock
 * @param timeoutMs - Lock timeout in milliseconds
 * @returns Result of the function
 */
export async function withLock<T>(
  lockKey: string,
  ownerId: string,
  fn: () => Promise<T>,
  timeoutMs: number = DEFAULT_LOCK_TIMEOUT
): Promise<T | null> {
  const lockId = await acquireLock(lockKey, ownerId, timeoutMs);

  if (!lockId) {
    logger.warn(`[DistributedLock] Could not acquire lock: ${lockKey}`);
    return null;
  }

  try {
    return await fn();
  } finally {
    await releaseLock(lockKey, lockId);
  }
}

/**
 * Check if a lock is currently held
 * @param lockKey - Unique identifier for the lock
 * @returns True if lock is held and not expired
 */
export async function isLockHeld(lockKey: string): Promise<boolean> {
  if (!firestore) {
    return false;
  }

  try {
    const lockRef = doc(firestore, LOCK_COLLECTION, lockKey);
    const lockDoc = await getDoc(lockRef);

    if (!lockDoc.exists()) {
      return false;
    }

    const lockData = lockDoc.data() as LockInfo;
    return lockData.expiresAt > Date.now();
  } catch (error: unknown) {
    logger.error(`[DistributedLock] Error checking lock status ${lockKey}:`, error as Error);
    return false;
  }
}

/**
 * Clean up expired locks (should be called periodically)
 */
export async function cleanupExpiredLocks(): Promise<void> {
  if (!firestore) {
    return;
  }

  try {
    const { collection, getDocs, query, where } = await import('firebase/firestore');
    const locksRef = collection(firestore, LOCK_COLLECTION);
    const q = query(locksRef, where('expiresAt', '<', Date.now()));
    const snapshot = await getDocs(q);

    const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref));
    await Promise.all(deletePromises);

    if (snapshot.size > 0) {
      logger.debug(`[DistributedLock] Cleaned up ${snapshot.size} expired locks`);
    }
  } catch (error: unknown) {
    logger.error('[DistributedLock] Error cleaning up expired locks:', error as Error);
  }
}
