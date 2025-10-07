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
}

// In-memory cache for immediate access (LOCAL-FIRST)
const memoryCache = new Map<string, CacheEntry>();

// Persistent cache keys
const CACHE_PREFIX = '@LoginX:cache:';
const CACHE_INDEX_KEY = '@LoginX:cache_index';

const CACHE_DURATION = CacheConstants.DEFAULT_DURATION;

// Cache eviction constants
const MAX_CACHE_AGE = 24 * 60 * 60 * 1000; // 24 hours

// Cache statistics for monitoring
let cacheHits = 0;
let cacheMisses = 0;

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
  } catch (error) {
    debugWarn('[Cache] Could not get adaptive cache size, using fallback', error);
  }
  // Fallback to static default if adaptive manager not ready
  return 100;
};

/**
 * Find the oldest (least recently used) cache entry
 * @returns Key of the oldest entry or null if cache is empty
 */
const findOldestEntry = (): string | null => {
  let oldestKey: string | null = null;
  let oldestTime = Date.now();

  for (const [key, entry] of memoryCache.entries()) {
    if (entry.lastAccessed < oldestTime) {
      oldestTime = entry.lastAccessed;
      oldestKey = key;
    }
  }

  return oldestKey;
};

/**
 * Evict old entries from memory cache using LRU strategy
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

    for (const key of entriesToRemove) {
      memoryCache.delete(key);
      debugLog(`[Cache] 🗑️ Evicted expired entry: ${key}`);
    }

    // If still over limit, use LRU to remove oldest
    while (memoryCache.size >= maxSize) {
      const oldestKey = findOldestEntry();
      if (oldestKey) {
        memoryCache.delete(oldestKey);
        debugLog(`[Cache] 🗑️ LRU evicted: ${oldestKey}`);
      } else {
        break;
      }
    }
  } catch (error) {
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
        } catch (error) {
          debugWarn(`[Cache] Failed to preload cache entry: ${key}`, error);
        }
      });

      await Promise.allSettled(loadPromises);
      debugLog(`[Cache] 🏠 LOCAL-FIRST: Preloaded ${memoryCache.size} cache entries`);
    }
  } catch (error) {
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
    };

    // Check if eviction is needed before adding new entry
    if (memoryCache.size >= getMaxCacheSize()) {
      await evictOldEntries();
    }

    // Set in memory cache first (LOCAL-FIRST priority)
    memoryCache.set(key, entry);
    debugLog(`[Cache] 🏠 LOCAL-FIRST: Set in memory cache: ${key}`);

    // Persist to AsyncStorage for long-term storage
    try {
      await AsyncStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(entry));

      // Update cache index
      const cacheIndexStr = await AsyncStorage.getItem(CACHE_INDEX_KEY);
      const cacheIndex: string[] = cacheIndexStr ? JSON.parse(cacheIndexStr) : [];
      if (!cacheIndex.includes(key)) {
        cacheIndex.push(key);
        await AsyncStorage.setItem(CACHE_INDEX_KEY, JSON.stringify(cacheIndex));
      }

      debugLog(`[Cache] 💾 LOCAL-FIRST: Persisted to storage: ${key}`);
    } catch (persistError) {
      debugError(`[Cache] Failed to persist cache entry: ${key}`, persistError);
      // Continue - we still have it in memory
    }
  } catch (error) {
    debugError('[Cache] Error setting cache:', error);
  }
};

/**
 * LOCAL-FIRST: Get a value from cache (memory first, then persistent storage)
 * @param key - Cache key
 * @returns Cached data or null if not found/expired
 */
export const get = async (key: string): Promise<unknown> => {
  try {
    if (!key) {
      debugWarn('[Cache] Attempted to get cache with empty key');
      return null;
    }

    // Try memory cache first (LOCAL-FIRST priority)
    let entry = memoryCache.get(key);

    if (entry) {
      // Update last accessed time for LRU
      entry.lastAccessed = Date.now();
      cacheHits++;
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
            memoryCache.set(key, entry);
            debugLog(`[Cache] 📂 LOCAL-FIRST: Loaded from storage to memory: ${key}`);
          }
        }
      } catch (storageError) {
        debugWarn(`[Cache] Failed to load from storage: ${key}`, storageError);
      }
    }

    if (!entry) {
      return null;
    }

    const isExpired = Date.now() - entry.timestamp > CACHE_DURATION;
    if (isExpired) {
      await invalidate(key);
      return null;
    }

    debugLog(`[Cache] 🏠 LOCAL-FIRST: Cache hit for: ${key} (source: ${entry.source})`);
    return entry.data;
  } catch (error) {
    debugError('[Cache] Error getting cache:', error);
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
  } catch (error) {
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
  } catch (error) {
    debugError('[Cache] Error clearing cache:', error);
  }
};

/**
 * LOCAL-FIRST: Get cache statistics and health info
 */
export const getCacheStats = async () => {
  try {
    const memorySize = memoryCache.size;
    const maxSize = getMaxCacheSize();
    const cacheIndexStr = await AsyncStorage.getItem(CACHE_INDEX_KEY);
    const persistentSize = cacheIndexStr ? JSON.parse(cacheIndexStr).length : 0;
    const totalRequests = cacheHits + cacheMisses;
    const hitRate = totalRequests > 0 ? (cacheHits / totalRequests) * 100 : 0;

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
      syncStatus: 'healthy',
      lastUpdate: Date.now(),
    };
  } catch (error) {
    debugError('[Cache] Error getting cache stats:', error);
    return {
      memoryEntries: 0,
      persistentEntries: 0,
      maxMemorySize: getMaxCacheSize(),
      cacheHits: 0,
      cacheMisses: 0,
      hitRate: '0%',
      syncStatus: 'error',
      lastUpdate: Date.now(),
    };
  }
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
  } catch (error) {
    debugError('[Cache] Error syncing pending changes:', error);
  }
};
