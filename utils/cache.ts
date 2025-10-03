import { CacheConstants } from '@/constants';

interface CacheEntry {
  data: unknown;
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();

const CACHE_DURATION = CacheConstants.DEFAULT_DURATION;

/**
 * Set a value in the cache with current timestamp
 * @param key - Cache key
 * @param data - Data to cache (can be null to invalidate)
 */
export const set = (key: string, data: unknown): void => {
  try {
    if (!key) {
      console.warn('[Cache] Attempted to set cache with empty key');
      return;
    }

    const entry: CacheEntry = {
      data,
      timestamp: Date.now(),
    };
    cache.set(key, entry);
  } catch (error) {
    console.error('[Cache] Error setting cache:', error);
  }
};

/**
 * Get a value from the cache if not expired
 * @param key - Cache key
 * @returns Cached data or null if not found/expired
 */
export const get = (key: string): unknown => {
  try {
    if (!key) {
      console.warn('[Cache] Attempted to get cache with empty key');
      return null;
    }

    const entry = cache.get(key);
    if (!entry) {
      return null;
    }

    const isExpired = Date.now() - entry.timestamp > CACHE_DURATION;
    if (isExpired) {
      cache.delete(key);
      return null;
    }

    return entry.data;
  } catch (error) {
    console.error('[Cache] Error getting cache:', error);
    return null;
  }
};

/**
 * Invalidate (delete) a specific cache entry
 * @param key - Cache key to invalidate
 */
export const invalidate = (key: string): void => {
  try {
    if (key) {
      cache.delete(key);
    }
  } catch (error) {
    console.error('[Cache] Error invalidating cache:', error);
  }
};

/**
 * Clear all cache entries
 */
export const clear = (): void => {
  try {
    cache.clear();
  } catch (error) {
    console.error('[Cache] Error clearing cache:', error);
  }
};
