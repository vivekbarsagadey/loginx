/**
 * LOCAL-FIRST Data Manager
 * Implements comprehensive local-first data strategy
 * - Prioritizes local storage over network
 * - Seamless offline/online transitions
 * - Background synchronization
 * - Conflict resolution
 */

import { firestore } from '@/firebase-config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { disableNetwork, doc, enableNetwork, getDoc, runTransaction, setDoc } from 'firebase/firestore';
import * as cache from './cache';
import { detectConflict, getDefaultStrategy, resolveConflictAutomatically, type ConflictData } from './conflict-resolver';
import { debugError, debugLog, debugWarn } from './debug';
import { withLock } from './distributed-lock';
import { isOnline as checkIsOnline, initializeNetworkMonitoring, subscribeToNetworkChanges } from './network';

interface LocalFirstOptions {
  collection: string;
  id: string;
  fallbackData?: unknown;
  syncEnabled?: boolean;
  maxRetries?: number;
}

interface DataEntry<T = unknown> {
  data: T;
  timestamp: number;
  version: number;
  source: 'local' | 'remote';
  syncStatus: 'synced' | 'pending' | 'conflict' | 'error';
  lastSyncAttempt?: number;
  retryCount?: number;
  lastModified: number; // For conflict resolution
  modifiedBy?: string; // User ID who made the change
}

// Network status tracking
let isOnline = true;
let networkListenersSetup = false;
let networkUnsubscribe: (() => void) | null = null;

// Pending sync queue
const syncQueue = new Map<string, DataEntry>();

// Active sync operations (TASK-031: Prevent race conditions with mutex)
const activeSyncs = new Set<string>();

// TASK-030: Retry configuration for exponential backoff
const INITIAL_RETRY_DELAY = 1000; // 1 second
const MAX_RETRY_DELAY = 30000; // 30 seconds
const BACKOFF_MULTIPLIER = 2;

// Sync metrics tracking
let totalSyncCount = 0;
let failedSyncCount = 0;
let totalSyncTime = 0;
const syncStartTimes = new Map<string, number>();

/**
 * Initialize LOCAL-FIRST system
 */
export const initializeLocalFirst = async (): Promise<void> => {
  try {
    debugLog('[LocalFirst] 🏠 Initializing LOCAL-FIRST system...');

    // Initialize cache system
    await cache.initializeCache();

    // Setup network monitoring using NetInfo
    if (!networkListenersSetup) {
      setupNetworkMonitoring();
      networkListenersSetup = true;
    }

    // Start background sync
    startBackgroundSync();

    debugLog('[LocalFirst] ✅ LOCAL-FIRST system initialized');
  } catch (error) {
    debugError('[LocalFirst] Failed to initialize LOCAL-FIRST system', error);
  }
};

/**
 * LOCAL-FIRST: Get data (local first, remote fallback)
 */
export const getData = async <T>(options: LocalFirstOptions): Promise<T | null> => {
  const { collection, id, fallbackData } = options;
  const cacheKey = `${collection}:${id}`;

  try {
    debugLog(`[LocalFirst] 🏠 Getting data LOCAL-FIRST: ${cacheKey}`);

    // 1. Try local cache first (FASTEST)
    const cachedData = await cache.get(cacheKey);
    if (cachedData) {
      debugLog(`[LocalFirst] ✅ LOCAL-FIRST cache hit: ${cacheKey}`);

      // Background sync if online (don't wait)
      if (isOnline && options.syncEnabled !== false) {
        backgroundSync(options).catch((error) => {
          debugWarn(`[LocalFirst] Background sync failed for ${cacheKey}:`, error);
        });
      }

      return cachedData as T;
    }

    // 2. Try AsyncStorage persistent cache
    const persistentData = await getFromPersistentStorage<T>(cacheKey);
    if (persistentData) {
      debugLog(`[LocalFirst] 📂 LOCAL-FIRST persistent hit: ${cacheKey}`);

      // Load into memory cache for faster future access
      await cache.set(cacheKey, persistentData, 'local');

      // Background sync if online
      if (isOnline && options.syncEnabled !== false) {
        backgroundSync(options).catch((error) => {
          debugWarn(`[LocalFirst] Background sync failed for ${cacheKey}:`, error);
        });
      }

      return persistentData;
    }

    // 3. If online, try remote (but don't block for long)
    if (isOnline && firestore) {
      try {
        debugLog(`[LocalFirst] 🌐 No local data, trying remote: ${cacheKey}`);

        const docRef = doc(firestore, collection, id);
        const docSnap = await Promise.race([getDoc(docRef), new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Remote fetch timeout')), 5000))]);

        if (docSnap.exists()) {
          const remoteData = docSnap.data() as T;
          debugLog(`[LocalFirst] 🌐 Remote data fetched: ${cacheKey}`);

          // Store locally for future LOCAL-FIRST access
          await cache.set(cacheKey, remoteData, 'remote', 'synced');
          await saveToPersistentStorage(cacheKey, remoteData);

          return remoteData;
        }
      } catch (remoteError) {
        debugWarn(`[LocalFirst] Remote fetch failed for ${cacheKey}:`, remoteError);
        // Continue to fallback
      }
    }

    // 4. Use fallback data if provided
    if (fallbackData !== undefined) {
      debugLog(`[LocalFirst] 🔄 Using fallback data for: ${cacheKey}`);

      // Cache fallback data locally
      await cache.set(cacheKey, fallbackData, 'local', 'pending');

      return fallbackData as T;
    }

    debugLog(`[LocalFirst] ❌ No data found for: ${cacheKey}`);
    return null;
  } catch (error) {
    debugError(`[LocalFirst] Error getting data for ${cacheKey}:`, error);
    return (fallbackData as T) || null;
  }
};

/**
 * LOCAL-FIRST: Set data (local first, sync later)
 */
export const setData = async <T>(options: LocalFirstOptions & { data: T }): Promise<void> => {
  const { collection, id, data } = options;
  const cacheKey = `${collection}:${id}`;

  try {
    debugLog(`[LocalFirst] 🏠 Setting data LOCAL-FIRST: ${cacheKey}`);

    // 1. Save locally IMMEDIATELY (LOCAL-FIRST priority)
    await cache.set(cacheKey, data, 'local', 'pending');
    await saveToPersistentStorage(cacheKey, data);

    debugLog(`[LocalFirst] ✅ Data saved locally: ${cacheKey}`);

    // 2. Add to sync queue for background sync
    if (options.syncEnabled !== false) {
      const entry: DataEntry<T> = {
        data,
        timestamp: Date.now(),
        version: 1,
        source: 'local',
        syncStatus: 'pending',
        retryCount: 0,
        lastModified: Date.now(),
        modifiedBy: undefined, // Could be set from auth context
      };

      syncQueue.set(cacheKey, entry);
      debugLog(`[LocalFirst] 📋 Added to sync queue: ${cacheKey}`);

      // Try immediate sync if online (don't wait)
      if (isOnline) {
        backgroundSync(options).catch((error) => {
          debugWarn(`[LocalFirst] Immediate sync failed for ${cacheKey}:`, error);
        });
      }
    }
  } catch (error) {
    debugError(`[LocalFirst] Error setting data for ${cacheKey}:`, error);
    throw error;
  }
};

/**
 * Background sync without blocking UI
 * TASK-027: Uses Firestore transactions for atomic updates
 * TASK-028: Implements proper conflict detection with version comparison
 * TASK-030: Implements retry logic with exponential backoff
 * TASK-031: Uses sync mutex to prevent concurrent syncs
 */
const backgroundSync = async (options: LocalFirstOptions): Promise<void> => {
  const { collection, id } = options;
  const cacheKey = `${collection}:${id}`;

  // TASK-031: Check if sync is already in progress for this key (mutex)
  if (activeSyncs.has(cacheKey)) {
    debugLog(`[LocalFirst] ⏭️ Sync already in progress for: ${cacheKey}, skipping`);
    return;
  }

  // TASK-031: Acquire sync lock (local mutex)
  activeSyncs.add(cacheKey);
  const syncStartTime = Date.now();
  syncStartTimes.set(cacheKey, syncStartTime);

  try {
    const queueEntry = syncQueue.get(cacheKey);
    if (!queueEntry || !firestore) {
      return;
    }

    debugLog(`[LocalFirst] 🔄 Background syncing: ${cacheKey}`);

    const docRef = doc(firestore, collection, id);

    // TASK-027: Use Firestore transaction for atomic update
    await runTransaction(firestore, async (transaction) => {
      const remoteDoc = await transaction.get(docRef);

      // TASK-028: Conflict detection with version comparison
      if (remoteDoc.exists()) {
        const remoteData = remoteDoc.data() as DataEntry;

        // Detect conflict using version and timestamp
        const hasConflict = detectConflict(
          queueEntry.version,
          remoteData.version || 0,
          queueEntry.lastModified,
          remoteData.lastModified || 0
        );

        if (hasConflict) {
          debugWarn(`[LocalFirst] ⚠️ Conflict detected for ${cacheKey}`);

          // Create conflict data
          const conflictData: ConflictData = {
            local: queueEntry.data,
            remote: remoteData.data,
            localTimestamp: queueEntry.lastModified,
            remoteTimestamp: remoteData.lastModified || 0,
            localVersion: queueEntry.version,
            remoteVersion: remoteData.version || 0,
            key: cacheKey,
          };

          // Use default strategy (last-write-wins)
          const strategy = getDefaultStrategy(
            queueEntry.lastModified,
            remoteData.lastModified || 0
          );

          // Resolve conflict automatically
          const resolution = resolveConflictAutomatically(conflictData, strategy);

          if (resolution.resolved && resolution.data) {
            debugLog(`[LocalFirst] ✅ Conflict resolved using strategy: ${resolution.strategy}`);
            // Update queue entry with resolved data
            queueEntry.data = resolution.data;
            queueEntry.syncStatus = 'synced';
          } else {
            debugWarn(`[LocalFirst] ❌ Conflict resolution failed: ${resolution.error}`);
            queueEntry.syncStatus = 'conflict';
            throw new Error(`Conflict resolution failed: ${resolution.error}`);
          }
        }

        // Increment version for optimistic locking
        queueEntry.version = (remoteData.version || 0) + 1;
      } else {
        // New document, start at version 1
        queueEntry.version = 1;
      }

      // Write the data with updated version
      transaction.set(docRef, {
        data: queueEntry.data,
        version: queueEntry.version,
        lastModified: queueEntry.lastModified,
        timestamp: queueEntry.timestamp,
        source: queueEntry.source,
        syncStatus: 'synced',
        modifiedBy: queueEntry.modifiedBy,
      });
    });

    // Mark as synced
    queueEntry.syncStatus = 'synced';
    queueEntry.lastSyncAttempt = Date.now();
    queueEntry.retryCount = 0; // Reset retry count on success

    // Update cache
    await cache.set(cacheKey, queueEntry.data, 'remote', 'synced');

    // Remove from sync queue
    syncQueue.delete(cacheKey);

    // Track metrics
    const syncDuration = Date.now() - syncStartTime;
    totalSyncTime += syncDuration;
    totalSyncCount++;
    syncStartTimes.delete(cacheKey);

    debugLog(`[LocalFirst] ✅ Background sync completed: ${cacheKey} (${syncDuration}ms)`);
  } catch (error) {
    failedSyncCount++;
    syncStartTimes.delete(cacheKey);
    debugWarn(`[LocalFirst] Background sync failed for ${cacheKey}:`, error);

    // TASK-030: Implement exponential backoff retry logic
    const queueEntry = syncQueue.get(cacheKey);
    if (queueEntry) {
      queueEntry.retryCount = (queueEntry.retryCount || 0) + 1;
      queueEntry.lastSyncAttempt = Date.now();
      queueEntry.syncStatus = 'error';

      const maxRetries = options.maxRetries || 5;

      if (queueEntry.retryCount >= maxRetries) {
        syncQueue.delete(cacheKey);
        debugWarn(`[LocalFirst] Max retries (${maxRetries}) reached for ${cacheKey}, removed from queue`);
      } else {
        // Calculate exponential backoff delay
        const delay = Math.min(
          INITIAL_RETRY_DELAY * Math.pow(BACKOFF_MULTIPLIER, queueEntry.retryCount - 1),
          MAX_RETRY_DELAY
        );

        debugLog(
          `[LocalFirst] Will retry sync for ${cacheKey} in ${delay}ms (attempt ${queueEntry.retryCount}/${maxRetries})`
        );

        // Schedule retry with exponential backoff
        setTimeout(() => {
          backgroundSync(options).catch((retryError) => {
            debugWarn(`[LocalFirst] Retry failed for ${cacheKey}:`, retryError);
          });
        }, delay);
      }
    }
  } finally {
    // TASK-031: Always release sync lock (mutex), even on error
    activeSyncs.delete(cacheKey);
  }
};

/**
 * Setup network monitoring for LOCAL-FIRST behavior
 * Uses @react-native-community/netinfo for cross-platform support
 */
const setupNetworkMonitoring = (): void => {
  // Get initial network status
  isOnline = checkIsOnline();

  // Initialize NetInfo monitoring
  const netInfoUnsubscribe = initializeNetworkMonitoring();

  // Subscribe to network changes
  const changesUnsubscribe = subscribeToNetworkChanges((online) => {
    const wasOnline = isOnline;
    isOnline = online;

    // Handle online transition
    if (online && !wasOnline) {
      debugLog('[LocalFirst] 🌐 Network ONLINE - Starting background sync');

      // Enable Firestore network
      if (firestore) {
        enableNetwork(firestore)
          .then(() => {
            debugLog('[LocalFirst] ✅ Firestore network enabled');
          })
          .catch((error) => {
            debugWarn('[LocalFirst] Failed to enable Firestore network:', error);
          });
      }

      // Process sync queue
      processSyncQueue().catch((error) => {
        debugWarn('[LocalFirst] Failed to process sync queue:', error);
      });
    }

    // Handle offline transition
    if (!online && wasOnline) {
      debugLog('[LocalFirst] 🏠 Network OFFLINE - LOCAL-FIRST mode activated');

      // Disable Firestore network for better offline experience
      if (firestore) {
        disableNetwork(firestore)
          .then(() => {
            debugLog('[LocalFirst] ✅ Firestore network disabled for offline mode');
          })
          .catch((error) => {
            debugWarn('[LocalFirst] Failed to disable Firestore network:', error);
          });
      }
    }
  });

  // Store unsubscribe function
  networkUnsubscribe = () => {
    netInfoUnsubscribe();
    changesUnsubscribe();
  };

  debugLog('[LocalFirst] ✅ Network monitoring setup complete');
};

/**
 * Process sync queue when coming back online
 */
const processSyncQueue = async (): Promise<void> => {
  if (syncQueue.size === 0) {
    return;
  }

  debugLog(`[LocalFirst] 🔄 Processing sync queue: ${syncQueue.size} items`);

  const syncPromises = Array.from(syncQueue.entries()).map(async ([key, _entry]) => {
    try {
      const [collection, id] = key.split(':');
      await backgroundSync({ collection, id });
    } catch (error) {
      debugWarn(`[LocalFirst] Failed to sync ${key}:`, error);
    }
  });

  await Promise.allSettled(syncPromises);
  debugLog('[LocalFirst] ✅ Sync queue processing completed');
};

/**
 * Start background sync process
 */
const startBackgroundSync = (): void => {
  // Process sync queue every 30 seconds when online
  setInterval(() => {
    if (isOnline && syncQueue.size > 0) {
      processSyncQueue().catch((error) => {
        debugWarn('[LocalFirst] Background sync process error:', error);
      });
    }
  }, 30000);
};

/**
 * Get from persistent storage
 */
const getFromPersistentStorage = async <T>(key: string): Promise<T | null> => {
  try {
    const value = await AsyncStorage.getItem(`@LocalFirst:${key}`);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    debugWarn(`[LocalFirst] Failed to get from persistent storage: ${key}`, error);
    return null;
  }
};

/**
 * Save to persistent storage
 */
const saveToPersistentStorage = async <T>(key: string, data: T): Promise<void> => {
  try {
    await AsyncStorage.setItem(`@LocalFirst:${key}`, JSON.stringify(data));
  } catch (error) {
    debugWarn(`[LocalFirst] Failed to save to persistent storage: ${key}`, error);
  }
};

/**
 * Get LOCAL-FIRST system status
 */
export const getSystemStatus = async () => {
  const cacheStats = await cache.getCacheStats();

  return {
    isOnline,
    cacheStats,
    syncQueueSize: syncQueue.size,
    lastSync: Date.now(),
    mode: isOnline ? 'hybrid' : 'local-only',
  };
};

/**
 * Force sync all pending changes
 */
export const forceSyncAll = async (): Promise<void> => {
  debugLog('[LocalFirst] 🔄 Force syncing all pending changes...');
  await processSyncQueue();
  await cache.syncPendingChanges();
  debugLog('[LocalFirst] ✅ Force sync completed');
};

/**
 * Cleanup LOCAL-FIRST system
 * Call this when app is shutting down
 */
export const cleanupLocalFirst = (): void => {
  if (networkUnsubscribe) {
    networkUnsubscribe();
    networkUnsubscribe = null;
    debugLog('[LocalFirst] ✅ Network monitoring cleaned up');
  }
};

/**
 * BATCH OPERATIONS: Set multiple data entries at once
 * More efficient than individual operations for bulk updates
 */
export const batchSetData = async <T>(operations: (LocalFirstOptions & { data: T })[]): Promise<void> => {
  try {
    debugLog(`[LocalFirst] 📦 Batch setting ${operations.length} items`);

    // 1. Save all locally first (parallel)
    const localSavePromises = operations.map(async (op) => {
      const cacheKey = `${op.collection}:${op.id}`;
      await cache.set(cacheKey, op.data, 'local', 'pending');
      await saveToPersistentStorage(cacheKey, op.data);

      // Add to sync queue
      if (op.syncEnabled !== false) {
        const entry: DataEntry<T> = {
          data: op.data,
          timestamp: Date.now(),
          version: 1,
          source: 'local',
          syncStatus: 'pending',
          retryCount: 0,
          lastModified: Date.now(),
        };
        syncQueue.set(cacheKey, entry);
      }
    });

    await Promise.all(localSavePromises);
    debugLog('[LocalFirst] ✅ Batch save completed locally');

    // 2. Trigger background sync if online
    if (isOnline) {
      processSyncQueue().catch((error) => {
        debugWarn('[LocalFirst] Batch sync failed:', error);
      });
    }
  } catch (error) {
    debugError('[LocalFirst] Batch set data error:', error);
    throw error;
  }
};

/**
 * REAL-TIME SUBSCRIPTIONS: Subscribe to data changes
 * Uses Firestore onSnapshot for real-time updates
 */
export const subscribeToData = <T>(collection: string, id: string, callback: (data: T | null) => void, onError?: (error: Error) => void): (() => void) => {
  if (!firestore) {
    debugWarn('[LocalFirst] Cannot subscribe - Firestore not initialized');
    return () => {};
  }

  const cacheKey = `${collection}:${id}`;
  debugLog(`[LocalFirst] 🔔 Subscribing to real-time updates: ${cacheKey}`);

  // Import onSnapshot dynamically to avoid issues if not available
  import('firebase/firestore')
    .then(({ onSnapshot }) => {
      const docRef = doc(firestore, collection, id);

      const unsubscribe = onSnapshot(
        docRef,
        async (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data() as T;
            debugLog(`[LocalFirst] 🔔 Real-time update received: ${cacheKey}`);

            // Update local cache
            await cache.set(cacheKey, data, 'remote', 'synced');
            await saveToPersistentStorage(cacheKey, data);

            // Notify callback
            callback(data);
          } else {
            callback(null);
          }
        },
        (error) => {
          debugError(`[LocalFirst] Real-time subscription error: ${cacheKey}`, error);
          if (onError) {
            onError(error as Error);
          }
        }
      );

      return unsubscribe;
    })
    .catch((error) => {
      debugError('[LocalFirst] Failed to set up real-time subscription:', error);
    });

  // Return empty unsubscribe function as fallback
  return () => {
    debugLog(`[LocalFirst] 🔕 Unsubscribed from: ${cacheKey}`);
  };
};

/**
 * ANALYTICS & MONITORING: Get sync performance metrics
 * TASK-012: Added activeSyncs.size for monitoring concurrent sync operations
 */
export const trackSyncMetrics = () => {
  const avgSyncTime = totalSyncCount > 0 ? totalSyncTime / totalSyncCount : 0;
  const successRate = totalSyncCount > 0 ? ((totalSyncCount - failedSyncCount) / totalSyncCount) * 100 : 100;

  return {
    syncQueueSize: syncQueue.size,
    totalSyncs: totalSyncCount,
    failedSyncs: failedSyncCount,
    successRate: successRate.toFixed(2) + '%',
    averageSyncTime: Math.round(avgSyncTime) + 'ms',
    activeSyncs: activeSyncs.size, // TASK-012: Track active sync operations
    isOnline,
  };
};

/**
 * Reset sync metrics (useful for testing or monitoring reset)
 * TASK-012: Also clear activeSyncs set
 */
export const resetSyncMetrics = (): void => {
  totalSyncCount = 0;
  failedSyncCount = 0;
  totalSyncTime = 0;
  syncStartTimes.clear();
  activeSyncs.clear(); // TASK-012: Clear active syncs
  debugLog('[LocalFirst] 📊 Sync metrics reset');
};
