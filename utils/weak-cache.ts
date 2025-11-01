/**
 * Weak Reference Cache Utility
 * TASK-038: Implement weak references for cached data
 * Allows garbage collector to reclaim memory when needed
 */

import { debugLog, debugWarn } from './debug';

/**
 * Weak cache entry with metadata
 */
interface WeakCacheMetadata {
  key: string;
  createdAt: number;
  accessCount: number;
  lastAccessed: number;
}

/**
 * WeakCache - uses WeakMap for automatic garbage collection
 * Objects stored here can be collected when memory pressure is high
 */
class WeakCache<K extends object, V> {
  private cache: WeakMap<K, V> = new WeakMap();
  private metadata: Map<string, WeakCacheMetadata> = new Map();
  private keyRegistry: Map<string, WeakRef<K>> = new Map();
  private name: string;

  constructor(name: string) {
    this.name = name;
    debugLog(`[WeakCache] 📦 Created weak cache: ${name}`);
  }

  /**
   * Set a value in the weak cache
   */
  set(key: K, value: V, keyId: string): void {
    try {
      // Store in WeakMap
      this.cache.set(key, value);

      // Store weak reference to key
      this.keyRegistry.set(keyId, new WeakRef(key));

      // Update metadata
      const now = Date.now();
      const existing = this.metadata.get(keyId);

      this.metadata.set(keyId, {
        key: keyId,
        createdAt: existing?.createdAt || now,
        accessCount: (existing?.accessCount || 0) + 1,
        lastAccessed: now,
      });

      debugLog(`[WeakCache:${this.name}] ✅ Set: ${keyId}`);
    } catch (_error: unknown) {
      debugWarn(`[WeakCache:${this.name}] Error setting value:`, _error as Error);
    }
  }

  /**
   * Get a value from the weak cache
   */
  get(key: K, keyId: string): V | undefined {
    try {
      const value = this.cache.get(key);

      if (value !== undefined) {
        // Update access metadata
        const meta = this.metadata.get(keyId);
        if (meta) {
          meta.accessCount++;
          meta.lastAccessed = Date.now();
          this.metadata.set(keyId, meta);
        }

        debugLog(`[WeakCache:${this.name}] 🎯 Hit: ${keyId}`);
      } else {
        debugLog(`[WeakCache:${this.name}] ❌ Miss: ${keyId}`);
      }

      return value;
    } catch (_error: unknown) {
      debugWarn(`[WeakCache:${this.name}] Error getting value:`, _error as Error);
      return undefined;
    }
  }

  /**
   * Check if a key exists
   */
  has(key: K): boolean {
    return this.cache.has(key);
  }

  /**
   * Delete a specific entry
   */
  delete(key: K, keyId: string): boolean {
    try {
      const deleted = this.cache.delete(key);

      if (deleted) {
        this.keyRegistry.delete(keyId);
        this.metadata.delete(keyId);
        debugLog(`[WeakCache:${this.name}] 🗑️ Deleted: ${keyId}`);
      }

      return deleted;
    } catch (_error: unknown) {
      debugWarn(`[WeakCache:${this.name}] Error deleting value:`, _error as Error);
      return false;
    }
  }

  /**
   * Clean up stale metadata (for keys that have been garbage collected)
   */
  cleanupMetadata(): number {
    let cleanedCount = 0;

    for (const [keyId, weakRef] of this.keyRegistry.entries()) {
      const key = weakRef.deref();

      // If key has been garbage collected, remove metadata
      if (key === undefined) {
        this.keyRegistry.delete(keyId);
        this.metadata.delete(keyId);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      debugLog(`[WeakCache:${this.name}] 🧹 Cleaned up ${cleanedCount} stale metadata entries`);
    }

    return cleanedCount;
  }

  /**
   * Get cache statistics
   */
  getStats() {
    // Clean up stale metadata first
    this.cleanupMetadata();

    const activeKeys = this.metadata.size;
    const metadataEntries = Array.from(this.metadata.values());

    const totalAccesses = metadataEntries.reduce((sum, meta) => sum + meta.accessCount, 0);
    const avgAccesses = activeKeys > 0 ? totalAccesses / activeKeys : 0;

    return {
      name: this.name,
      activeKeys,
      totalAccesses,
      averageAccesses: Math.round(avgAccesses * 100) / 100,
      oldestEntry: metadataEntries.length > 0 ? Math.min(...metadataEntries.map((m) => m.createdAt)) : null,
    };
  }

  /**
   * Clear all metadata (WeakMap will be cleared by GC)
   */
  clear(): void {
    this.keyRegistry.clear();
    this.metadata.clear();
    debugLog(`[WeakCache:${this.name}] 🧹 Cleared all metadata`);
  }
}

/**
 * Global weak cache registry
 */
class WeakCacheRegistry {
  private caches: Map<string, WeakCache<object, unknown>> = new Map();

  /**
   * Create or get a weak cache
   */
  getCache<K extends object, V>(name: string): WeakCache<K, V> {
    if (!this.caches.has(name)) {
      this.caches.set(name, new WeakCache<K, V>(name));
    }
    return this.caches.get(name) as WeakCache<K, V>;
  }

  /**
   * Get all cache statistics
   */
  getAllStats() {
    return Array.from(this.caches.values()).map((cache) => cache.getStats());
  }

  /**
   * Clean up all caches
   */
  cleanupAll(): number {
    let total = 0;
    for (const cache of this.caches.values()) {
      total += cache.cleanupMetadata();
    }
    return total;
  }

  /**
   * Clear all caches
   */
  clearAll(): void {
    for (const cache of this.caches.values()) {
      cache.clear();
    }
    debugLog('[WeakCacheRegistry] 🧹 Cleared all caches');
  }
}

// Export singleton registry
export const weakCacheRegistry = new WeakCacheRegistry();

// Export WeakCache class for direct use
export { WeakCache };

/**
 * Helper function to create a weak cache
 */
export const createWeakCache = <K extends object, V>(name: string): WeakCache<K, V> => {
  return weakCacheRegistry.getCache<K, V>(name);
};

/**
 * Example usage:
 *
 * // Create a weak cache for user objects
 * const userCache = createWeakCache<User, UserData>('users');
 *
 * // Store data
 * const user = { id: '123', name: 'John' };
 * const userData = { profile: {...}, preferences: {...} };
 * userCache.set(user, userData, user.id);
 *
 * // Retrieve data
 * const data = userCache.get(user, user.id);
 *
 * // When user object is no longer referenced elsewhere,
 * // the garbage collector can reclaim it
 */
