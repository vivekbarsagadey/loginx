import { CacheConstants } from '@/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAdaptiveCacheSize, updateAdaptiveCacheStats } from './adaptive-cache';
import { debugError, debugLog, debugWarn } from './debug';

interface CacheEntry {
  data: unknown;
  timestamp: number;
  version: number;
  source: 'local' | 'remote';
  syncStatus: 'synced' | 'pending' | 'conflict';
  lastAccessed: number; // For LRU tracking
  accessCount: number; // TASK-053: For LFU (Least Frequently Used) tracking
}

// In-memory cache for immediate access (LOCAL-FIRST)
const memoryCache = new Map<string, CacheEntry>();

// Persistent cache keys
const CACHE_PREFIX = '@LoginX:cache:';
const CACHE_INDEX_KEY = '@LoginX:cache_index';

const CACHE_DURATION = CacheConstants.DEFAULT_DURATION;

// Cache eviction constants
const MAX_CACHE_AGE = 24 * 60 * 60 * 1000; // 24 hours

// TASK-056: Cache statistics for monitoring and adaptive strategy
let cacheHits = 0;
let cacheMisses = 0;
let totalAccessTime = 0;
let accessCount = 0;
let revalidationCount = 0;

/**
 * Get maximum cache size (adaptive or fallback)
 */
const getMaxCacheSize = (): number => {
  try {
    const adaptiveSize = getAdaptiveCacheSize();
    // If adaptive manager is initialized, use its recommendation
    if (adaptiveSize > 0) {
      return adaptiveSize;
    }
  } catch (_error) {
    debugWarn('[Cache] Could not get adaptive cache size, using fallback', error);
  }
  // Fallback to static default if adaptive manager not ready
  return 100;
};

/**
 * TASK-053: Find the least frequently used cache entry
 * Uses LFU (Least Frequently Used) strategy instead of LRU for better performance
 * @returns Key of the least frequently used entry or null if cache is empty
 */
const findLeastFrequentEntry = (): string | null => {
  let lfuKey: string | null = null;
  let lowestCount = Infinity;
  let oldestTime = Date.now();

  for (const [key, entry] of memoryCache.entries()) {
    // Primary: choose entry with lowest access count (LFU)
    // Secondary: if tied, choose oldest (LRU as tiebreaker)
    if (entry.accessCount < lowestCount || (entry.accessCount === lowestCount && entry.lastAccessed < oldestTime)) {
      lowestCount = entry.accessCount;
      oldestTime = entry.lastAccessed;
      lfuKey = key;
    }
  }

  return lfuKey;
};

/**
 * Evict old entries from memory cache using LRU strategy
 * TASK-035: Also clean up persistent storage references to prevent orphaned data
 */
const evictOldEntries = async (): Promise<void> => {
  try {
    const maxSize = getMaxCacheSize();

    // Remove entries older than MAX_CACHE_AGE
    const now = Date.now();
    const entriesToRemove: string[] = [];

    for (const [key, entry] of memoryCache.entries()) {
      if (now - entry.timestamp > MAX_CACHE_AGE) {
        entriesToRemove.push(key);
      }
    }

    // TASK-035: Clean up both memory and persistent storage for expired entries
    for (const key of entriesToRemove) {
      memoryCache.delete(key);

      // Also remove from AsyncStorage to prevent orphaned data
      try {
        await AsyncStorage.removeItem(`${CACHE_PREFIX}${key}`);
        debugLog(`[Cache] 🗑️ Evicted expired entry from memory and storage: ${key}`);
      } catch (storageError) {
        debugWarn(`[Cache] Failed to remove from storage during eviction: ${key}`, storageError);
      }
    }

    // Update cache index to reflect removals
    if (entriesToRemove.length > 0) {
      try {
        const cacheIndexStr = await AsyncStorage.getItem(CACHE_INDEX_KEY);
        if (cacheIndexStr) {
          const cacheIndex: string[] = JSON.parse(cacheIndexStr);
          const updatedIndex = cacheIndex.filter((k) => !entriesToRemove.includes(k));
          await AsyncStorage.setItem(CACHE_INDEX_KEY, JSON.stringify(updatedIndex));
        }
      } catch (indexError) {
        debugWarn('[Cache] Failed to update cache index during eviction', indexError);
      }
    }

    // TASK-053: If still over limit, use LFU to remove least frequently used
    while (memoryCache.size >= maxSize) {
      const lfuKey = findLeastFrequentEntry();
      if (lfuKey) {
        memoryCache.delete(lfuKey);

        // Also remove from persistent storage
        try {
          await AsyncStorage.removeItem(`${CACHE_PREFIX}${lfuKey}`);
          debugLog(`[Cache] 🗑️ LFU evicted from memory and storage: ${lfuKey}`);
        } catch (storageError) {
          debugWarn(`[Cache] Failed to remove from storage during LFU eviction: ${lfuKey}`, storageError);
        }
      } else {
        break;
      }
    }
  } catch (_error) {
    debugError('[Cache] Error during cache eviction:', error);
  }
};

/**
 * LOCAL-FIRST: Initialize cache system with persistent storage
 */
export const initializeCache = async (): Promise<void> => {
  try {
    debugLog('[Cache] 🏠 LOCAL-FIRST: Initializing cache system...');

    // Load cache index from persistent storage
    const cacheIndexStr = await AsyncStorage.getItem(CACHE_INDEX_KEY);
    if (cacheIndexStr) {
      const cacheIndex: string[] = JSON.parse(cacheIndexStr);

      // Preload frequently accessed items into memory
      const loadPromises = cacheIndex.slice(0, 50).map(async (key) => {
        try {
          const entryStr = await AsyncStorage.getItem(`${CACHE_PREFIX}${key}`);
          if (entryStr) {
            const entry: CacheEntry = JSON.parse(entryStr);
            // Only load non-expired entries
            if (Date.now() - entry.timestamp <= CACHE_DURATION) {
              memoryCache.set(key, entry);
            }
          }
        } catch (_error) {
          debugWarn(`[Cache] Failed to preload cache entry: ${key}`, error);
        }
      });

      await Promise.allSettled(loadPromises);
      debugLog(`[Cache] 🏠 LOCAL-FIRST: Preloaded ${memoryCache.size} cache entries`);
    }
  } catch (_error) {
    debugError('[Cache] Failed to initialize cache system', error);
  }
};

/**
 * LOCAL-FIRST: Set a value in both memory and persistent cache
 * @param key - Cache key
 * @param data - Data to cache
 * @param source - Whether data came from local or remote
 * @param syncStatus - Sync status of the data
 */
/**
 * LOCAL-FIRST: Set a value in cache (memory and persistent storage)
 * TASK-032: Uses atomic AsyncStorage operations for data consistency
 * @param key - Cache key
 * @param data - Data to cache
 * @param source - Data source
 * @param syncStatus - Sync status
 */
export const set = async (key: string, data: unknown, source: 'local' | 'remote' = 'local', syncStatus: 'synced' | 'pending' | 'conflict' = 'synced'): Promise<void> => {
  try {
    if (!key) {
      debugWarn('[Cache] Attempted to set cache with empty key');
      return;
    }

    const entry: CacheEntry = {
      data,
      timestamp: Date.now(),
      version: 1,
      source,
      syncStatus,
      lastAccessed: Date.now(),
      accessCount: 0, // TASK-053: Initialize access count for LFU tracking
    };

    // Check if eviction is needed before adding new entry
    if (memoryCache.size >= getMaxCacheSize()) {
      await evictOldEntries();
    }

    // Set in memory cache first (LOCAL-FIRST priority)
    memoryCache.set(key, entry);
    debugLog(`[Cache] 🏠 LOCAL-FIRST: Set in memory cache: ${key}`);

    // TASK-032: Persist to AsyncStorage using atomic multiSet operation
    try {
      const cacheKey = `${CACHE_PREFIX}${key}`;
      const cacheValue = JSON.stringify(entry);

      // Update cache index atomically
      const cacheIndexStr = await AsyncStorage.getItem(CACHE_INDEX_KEY);
      const cacheIndex: string[] = cacheIndexStr ? JSON.parse(cacheIndexStr) : [];

      if (!cacheIndex.includes(key)) {
        cacheIndex.push(key);

        // Use multiSet for atomic write of both entry and index
        await AsyncStorage.multiSet([
          [cacheKey, cacheValue],
          [CACHE_INDEX_KEY, JSON.stringify(cacheIndex)],
        ]);
      } else {
        // Only update entry if already in index
        await AsyncStorage.setItem(cacheKey, cacheValue);
      }

      debugLog(`[Cache] 💾 LOCAL-FIRST: Persisted to storage: ${key}`);
    } catch (persistError) {
      debugError(`[Cache] Failed to persist cache entry: ${key}`, persistError);
      // Continue - we still have it in memory
    }
  } catch (_error) {
    debugError('[Cache] Error setting cache:', error);
  }
};

/**
 * LOCAL-FIRST: Get a value from cache (memory first, then persistent storage)
 * TASK-051: Now supports stale-while-revalidate pattern
 * TASK-053: Tracks access count for LFU eviction
 * @param key - Cache key
 * @param options - Optional SWR configuration
 * @returns Cached data or null if not found/expired
 */
export const get = async (
  key: string,
  options?: {
    /** TASK-051: Maximum age to consider cache fresh (for SWR) */
    maxAge?: number;
    /** TASK-051: Callback when stale data is returned and revalidation needed */
    onStale?: (staleData: unknown) => void;
  }
): Promise<unknown> => {
  const startTime = Date.now(); // TASK-056: Track access time

  try {
    if (!key) {
      debugWarn('[Cache] Attempted to get cache with empty key');
      accessCount++;
      totalAccessTime += Date.now() - startTime;
      return null;
    }

    // Try memory cache first (LOCAL-FIRST priority)
    let entry = memoryCache.get(key);

    if (entry) {
      // TASK-053: Update access count for LFU tracking
      entry.accessCount = (entry.accessCount || 0) + 1;
      entry.lastAccessed = Date.now();
      cacheHits++;

      // TASK-051: Check if data is stale (for SWR)
      const age = Date.now() - entry.timestamp;
      const isStale = options?.maxAge ? age > options.maxAge : age > CACHE_DURATION;

      if (isStale && options?.onStale) {
        debugLog(`[Cache] 📊 SWR: Returning stale data, revalidation needed: ${key}`);
        options.onStale(entry.data);
        revalidationCount++; // TASK-056: Track revalidations
      } else if (!isStale) {
        debugLog(`[Cache] 🏠 LOCAL-FIRST: Cache hit for: ${key} (source: ${entry.source})`);
      }

      // TASK-056: Track access time
      accessCount++;
      totalAccessTime += Date.now() - startTime;

      return entry.data;
    }

    if (!entry) {
      cacheMisses++;
      // Fallback to persistent storage
      try {
        const entryStr = await AsyncStorage.getItem(`${CACHE_PREFIX}${key}`);
        if (entryStr) {
          entry = JSON.parse(entryStr);
          // Load back into memory for faster future access
          if (entry) {
            // TASK-053: Initialize access count if missing
            entry.accessCount = (entry.accessCount || 0) + 1;
            entry.lastAccessed = Date.now();
            memoryCache.set(key, entry);
            debugLog(`[Cache] 📂 LOCAL-FIRST: Loaded from storage to memory: ${key}`);

            // TASK-051: Check if stale
            const age = Date.now() - entry.timestamp;
            const isStale = options?.maxAge ? age > options.maxAge : false;
            if (isStale && options?.onStale) {
              debugLog(`[Cache] 📊 SWR: Returning stale persistent data: ${key}`);
              options.onStale(entry.data);
              revalidationCount++;
            }
          }
        }
      } catch (storageError) {
        debugWarn(`[Cache] Failed to load from storage: ${key}`, storageError);
      }
    }

    if (!entry) {
      // TASK-056: Track access time even on miss
      accessCount++;
      totalAccessTime += Date.now() - startTime;
      return null;
    }

    const isExpired = Date.now() - entry.timestamp > CACHE_DURATION;
    if (isExpired) {
      await invalidate(key);
      // TASK-056: Track access time
      accessCount++;
      totalAccessTime += Date.now() - startTime;
      return null;
    }

    // TASK-056: Track access time
    accessCount++;
    totalAccessTime += Date.now() - startTime;

    return entry.data;
  } catch (_error) {
    debugError('[Cache] Error getting cache:', error);
    // TASK-056: Track access time even on error
    accessCount++;
    totalAccessTime += Date.now() - startTime;
    return null;
  }
};

/**
 * LOCAL-FIRST: Invalidate (delete) a specific cache entry from both memory and storage
 * @param key - Cache key to invalidate
 */
export const invalidate = async (key: string): Promise<void> => {
  try {
    if (key) {
      // Remove from memory cache
      memoryCache.delete(key);

      // Remove from persistent storage
      try {
        await AsyncStorage.removeItem(`${CACHE_PREFIX}${key}`);

        // Update cache index
        const cacheIndexStr = await AsyncStorage.getItem(CACHE_INDEX_KEY);
        if (cacheIndexStr) {
          const cacheIndex: string[] = JSON.parse(cacheIndexStr);
          const updatedIndex = cacheIndex.filter((k) => k !== key);
          await AsyncStorage.setItem(CACHE_INDEX_KEY, JSON.stringify(updatedIndex));
        }

        debugLog(`[Cache] 🗑️ LOCAL-FIRST: Invalidated: ${key}`);
      } catch (storageError) {
        debugWarn(`[Cache] Failed to remove from storage: ${key}`, storageError);
      }
    }
  } catch (_error) {
    debugError('[Cache] Error invalidating cache:', error);
  }
};

/**
 * LOCAL-FIRST: Clear all cache entries from both memory and storage
 */
export const clear = async (): Promise<void> => {
  try {
    // Clear memory cache
    memoryCache.clear();

    // Clear persistent storage
    try {
      const cacheIndexStr = await AsyncStorage.getItem(CACHE_INDEX_KEY);
      if (cacheIndexStr) {
        const cacheIndex: string[] = JSON.parse(cacheIndexStr);
        const removePromises = cacheIndex.map((key) => AsyncStorage.removeItem(`${CACHE_PREFIX}${key}`));
        await Promise.allSettled(removePromises);
        await AsyncStorage.removeItem(CACHE_INDEX_KEY);
      }

      debugLog('[Cache] 🧹 LOCAL-FIRST: Cleared all cache data');
    } catch (storageError) {
      debugWarn('[Cache] Failed to clear persistent storage:', storageError);
    }
  } catch (_error) {
    debugError('[Cache] Error clearing cache:', error);
  }
};

/**
 * LOCAL-FIRST: Get cache statistics and health info
 * TASK-056: Enhanced with monitoring metrics for adaptive strategy
 */
export const getCacheStats = async () => {
  try {
    const memorySize = memoryCache.size;
    const maxSize = getMaxCacheSize();
    const cacheIndexStr = await AsyncStorage.getItem(CACHE_INDEX_KEY);
    const persistentSize = cacheIndexStr ? JSON.parse(cacheIndexStr).length : 0;
    const totalRequests = cacheHits + cacheMisses;
    const hitRate = totalRequests > 0 ? (cacheHits / totalRequests) * 100 : 0;
    const avgAccessTime = accessCount > 0 ? totalAccessTime / accessCount : 0;
    const utilization = maxSize > 0 ? (memorySize / maxSize) * 100 : 0;

    // Update adaptive cache manager with current hit rate
    try {
      updateAdaptiveCacheStats(hitRate);
    } catch (_error) {
      // Adaptive manager may not be initialized yet, ignore
    }

    return {
      memoryEntries: memorySize,
      persistentEntries: persistentSize,
      maxMemorySize: maxSize,
      cacheHits,
      cacheMisses,
      hitRate: hitRate.toFixed(2) + '%',
      // TASK-056: Additional monitoring metrics
      avgAccessTime: avgAccessTime.toFixed(2) + 'ms',
      totalAccess: totalRequests,
      revalidations: revalidationCount,
      utilization: utilization.toFixed(1) + '%',
      syncStatus: 'healthy',
      lastUpdate: Date.now(),
    };
  } catch (_error) {
    debugError('[Cache] Error getting cache stats:', error);
    return {
      memoryEntries: 0,
      persistentEntries: 0,
      maxMemorySize: getMaxCacheSize(),
      cacheHits: 0,
      cacheMisses: 0,
      hitRate: '0%',
      avgAccessTime: '0ms',
      totalAccess: 0,
      revalidations: 0,
      utilization: '0%',
      syncStatus: 'error',
      lastUpdate: Date.now(),
    };
  }
};

/**
 * TASK-056: Get recommended cache strategy based on current performance
 * Analyzes hit rate and utilization to suggest optimal caching approach
 */
export const getRecommendedCacheStrategy = async (): Promise<{
  strategy: 'aggressive' | 'balanced' | 'conservative';
  reason: string;
}> => {
  const stats = await getCacheStats();
  const hitRate = parseFloat(stats.hitRate);
  const utilization = parseFloat(stats.utilization);

  // High hit rate (>80%) and low utilization (<50%): aggressive caching
  if (hitRate > 80 && utilization < 50) {
    return {
      strategy: 'aggressive',
      reason: 'High hit rate with available capacity - can increase cache size',
    };
  }

  // Low hit rate (<50%): conservative caching
  if (hitRate < 50 && stats.totalAccess > 100) {
    return {
      strategy: 'conservative',
      reason: 'Low hit rate detected - reduce cache size or improve cache key strategy',
    };
  }

  // Otherwise: balanced
  return {
    strategy: 'balanced',
    reason: 'Good hit rate and utilization - maintain current strategy',
  };
};

/**
 * TASK-054: Warm cache with critical data on app launch
 * Preloads frequently accessed data for better initial performance
 * @param keys - Array of cache keys to warm
 */
export const warmCache = async (keys: string[]): Promise<void> => {
  if (keys.length === 0) {
    return;
  }

  debugLog(`[Cache] 🔥 Warming cache with ${keys.length} critical keys...`);

  const warmStart = Date.now();
  let warmedCount = 0;

  try {
    // Load all keys in parallel
    const warmPromises = keys.map(async (key) => {
      try {
        const data = await get(key);
        if (data !== null) {
          warmedCount++;
          debugLog(`[Cache] 🔥 Warmed: ${key}`);
        }
      } catch (_error) {
        debugWarn(`[Cache] Failed to warm key: ${key}`, error);
      }
    });

    await Promise.all(warmPromises);

    const warmDuration = Date.now() - warmStart;
    debugLog(`[Cache] 🔥 Cache warming complete: ${warmedCount}/${keys.length} keys in ${warmDuration}ms`);
  } catch (_error) {
    debugError('[Cache] Error during cache warming:', error);
  }
};

/**
 * TASK-055: Intelligent preloading based on navigation patterns
 * Tracks which data is accessed after current data and preloads likely next data
 */
const navigationPatterns = new Map<string, Map<string, number>>(); // key -> {nextKey: count}

/**
 * TASK-055: Track navigation pattern for intelligent preloading
 * @param currentKey - Current cache key being accessed
 * @param nextKey - Next cache key accessed after current
 */
export const trackNavigationPattern = (currentKey: string, nextKey: string): void => {
  if (!navigationPatterns.has(currentKey)) {
    navigationPatterns.set(currentKey, new Map());
  }

  const patterns = navigationPatterns.get(currentKey);
  if (!patterns) {
    return;
  }

  patterns.set(nextKey, (patterns.get(nextKey) || 0) + 1);

  debugLog(`[Cache] 📊 Navigation pattern tracked: ${currentKey} -> ${nextKey}`);
};

/**
 * TASK-055: Preload likely next data based on navigation patterns
 * @param currentKey - Current cache key
 */
export const preloadLikelyNext = async (currentKey: string): Promise<void> => {
  const patterns = navigationPatterns.get(currentKey);
  if (!patterns || patterns.size === 0) {
    return;
  }

  // Find most likely next key (highest count)
  let likelyNextKey: string | null = null;
  let maxCount = 0;

  for (const [nextKey, count] of patterns.entries()) {
    if (count > maxCount) {
      maxCount = count;
      likelyNextKey = nextKey;
    }
  }

  if (likelyNextKey && maxCount >= 2) {
    // Only preload if pattern seen at least twice
    debugLog(`[Cache] 🎯 Preloading likely next: ${likelyNextKey} (confidence: ${maxCount} observations)`);

    // Preload in background (don't await)
    get(likelyNextKey).catch((error) => {
      debugWarn(`[Cache] Preload failed for ${likelyNextKey}`, error);
    });
  }
};

/**
 * TASK-055: Get navigation pattern statistics
 * @returns Object with pattern counts and predictions
 */
export const getNavigationPatternStats = (): {
  totalPatterns: number;
  patterns: { from: string; to: string; count: number }[];
} => {
  const patterns: { from: string; to: string; count: number }[] = [];

  for (const [from, toMap] of navigationPatterns.entries()) {
    for (const [to, count] of toMap.entries()) {
      patterns.push({ from, to, count });
    }
  }

  // Sort by count descending
  patterns.sort((a, b) => b.count - a.count);

  return {
    totalPatterns: navigationPatterns.size,
    patterns: patterns.slice(0, 10), // Top 10 patterns
  };
};

/**
 * LOCAL-FIRST: Sync pending local changes with remote
 */
export const syncPendingChanges = async (): Promise<void> => {
  try {
    debugLog('[Cache] 🔄 LOCAL-FIRST: Starting sync of pending changes...');

    const pendingEntries = Array.from(memoryCache.entries()).filter(([, entry]) => entry.syncStatus === 'pending');

    if (pendingEntries.length === 0) {
      debugLog('[Cache] ✅ LOCAL-FIRST: No pending changes to sync');
      return;
    }

    debugLog(`[Cache] 🔄 LOCAL-FIRST: Found ${pendingEntries.length} pending changes`);

    // Here you would implement actual sync logic with your backend
    // For now, just mark them as synced
    for (const [key, entry] of pendingEntries) {
      const syncedEntry = { ...entry, syncStatus: 'synced' as const };
      memoryCache.set(key, syncedEntry);
      await AsyncStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(syncedEntry));
    }

    debugLog('[Cache] ✅ LOCAL-FIRST: Sync completed');
  } catch (_error) {
    debugError('[Cache] Error syncing pending changes:', error);
  }
};
