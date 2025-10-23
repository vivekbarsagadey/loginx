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
import { disableNetwork, doc, enableNetwork, getDoc, runTransaction } from 'firebase/firestore';
import * as cache from './cache';
import { type ConflictData, detectConflict, getDefaultStrategy, resolveConflictAutomatically } from './conflict-resolver';
import { debugError, debugLog, debugWarn } from './debug';
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

// Storage keys
const _PENDING_OPERATIONS_KEY = '@LoginX:pendingOperations';
// TASK-065: Queue persistence storage key
const SYNC_QUEUE_STORAGE_KEY = '@LoginX:syncQueue';

// TASK-071: Priority levels for queue operations
type OperationPriority = 'HIGH' | 'NORMAL' | 'LOW';

// TASK-071: Enhanced QueuedOperation with priority and all sync fields
interface QueuedOperation {
  id: string;
  collection: string;
  docId: string;
  operation: 'set' | 'update' | 'delete';
  data?: Record<string, unknown>;
  timestamp: number;
  retries: number;
  priority: OperationPriority; // TASK-071: Priority level
  // Additional fields for sync compatibility
  version?: number;
  source?: 'local' | 'remote';
  syncStatus?: 'synced' | 'pending' | 'conflict' | 'error';
  lastModified?: number;
  lastSyncAttempt?: number;
  modifiedBy?: string;
}

// Network status tracking
let isOnline = true;
let networkListenersSetup = false;
let networkUnsubscribe: (() => void) | null = null;

// TASK-043: Fallback mode flag (memory-only cache when Firestore unavailable)
let fallbackMode = false;

// Pending sync queue - now typed as QueuedOperation
const syncQueue = new Map<string, QueuedOperation>();

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

// TASK-068: Debounced queue persistence
let queueSaveTimeout: ReturnType<typeof setTimeout> | null = null;
const QUEUE_SAVE_DEBOUNCE_MS = 2000; // 2 seconds

// TASK-070: Queue size monitoring
let queueSizeWarnings = 0;
let queueSizeCritical = 0;
const QUEUE_SIZE_WARNING_THRESHOLD = 100;
const QUEUE_SIZE_CRITICAL_THRESHOLD = 500;

/**
 * TASK-066: Save sync queue to AsyncStorage for persistence
 * Serializes the current sync queue to JSON and saves to storage
 */
const saveSyncQueue = async (): Promise<void> => {
  try {
    // Convert Map to array for JSON serialization
    const queueArray = Array.from(syncQueue.entries()).map(([key, operation]) => ({
      key,
      operation,
    }));

    await AsyncStorage.setItem(SYNC_QUEUE_STORAGE_KEY, JSON.stringify(queueArray));
    debugLog(`[LocalFirst] 💾 Saved sync queue: ${queueArray.length} operations`);
  } catch (_error: unknown) {
    debugError('[LocalFirst] Failed to save sync queue:', _error);
  }
};

/**
 * TASK-068: Debounced sync queue persistence
 * Debounces saveSyncQueue() calls to prevent excessive AsyncStorage writes
 */
const debouncedSaveQueue = (): void => {
  if (queueSaveTimeout) {
    clearTimeout(queueSaveTimeout);
  }

  queueSaveTimeout = setTimeout(() => {
    saveSyncQueue().catch((_error) => {
      debugError('[LocalFirst] Debounced queue save failed:', _error);
    });
  }, QUEUE_SAVE_DEBOUNCE_MS);
};

/**
 * TASK-067: Load sync queue from AsyncStorage on app init
 * Deserializes the persisted queue and restores it to memory
 */
const loadSyncQueue = async (): Promise<void> => {
  try {
    const queueData = await AsyncStorage.getItem(SYNC_QUEUE_STORAGE_KEY);
    if (!queueData) {
      debugLog('[LocalFirst] No persisted sync queue found');
      return;
    }

    const queueArray: { key: string; operation: QueuedOperation }[] = JSON.parse(queueData);

    // Validate and restore queue items
    let loadedCount = 0;
    let invalidCount = 0;

    for (const { key, operation } of queueArray) {
      // Validate operation structure
      if (typeof operation === 'object' && operation.id && operation.collection && operation.docId && operation.operation && typeof operation.timestamp === 'number') {
        // Ensure priority exists (for backward compatibility)
        if (!operation.priority) {
          operation.priority = 'NORMAL';
        }
        syncQueue.set(key, operation);
        loadedCount++;
      } else {
        invalidCount++;
        debugWarn('[LocalFirst] Invalid queue operation skipped:', operation);
      }
    }

    debugLog(`[LocalFirst] 📂 Loaded sync queue: ${loadedCount} operations (${invalidCount} invalid)`);

    // Clear corrupted data if too many invalid entries
    if (invalidCount > loadedCount) {
      debugWarn('[LocalFirst] Too many invalid entries, clearing corrupted queue');
      await AsyncStorage.removeItem(SYNC_QUEUE_STORAGE_KEY);
      syncQueue.clear();
    }
  } catch (_error: unknown) {
    debugError('[LocalFirst] Failed to load sync queue:', _error);
    // Clear corrupted data
    try {
      await AsyncStorage.removeItem(SYNC_QUEUE_STORAGE_KEY);
    } catch (clearError) {
      debugError('[LocalFirst] Failed to clear corrupted queue:', clearError);
    }
  }
};

/**
 * TASK-069: Queue cleanup after sync
 * Removes synced items from queue and persists the updated queue
 */
const cleanupSyncedOperations = async (syncedKeys: string[]): Promise<void> => {
  try {
    let removedCount = 0;

    for (const key of syncedKeys) {
      if (syncQueue.delete(key)) {
        removedCount++;
      }
    }

    if (removedCount > 0) {
      debugLog(`[LocalFirst] 🧹 Cleaned up ${removedCount} synced operations`);
      // Save updated queue immediately (don't debounce cleanup)
      await saveSyncQueue();
    }
  } catch (_error: unknown) {
    debugError('[LocalFirst] Failed to cleanup synced operations:', _error);
  }
};

/**
 * TASK-070: Monitor queue size and log warnings
 * Tracks queue size and alerts if thresholds are exceeded
 */
const monitorQueueSize = (): void => {
  const size = syncQueue.size;

  if (size >= QUEUE_SIZE_CRITICAL_THRESHOLD) {
    queueSizeCritical++;
    debugError(`[LocalFirst] 🚨 CRITICAL: Queue size is ${size} (threshold: ${QUEUE_SIZE_CRITICAL_THRESHOLD})`);
  } else if (size >= QUEUE_SIZE_WARNING_THRESHOLD) {
    queueSizeWarnings++;
    debugWarn(`[LocalFirst] ⚠️ WARNING: Queue size is ${size} (threshold: ${QUEUE_SIZE_WARNING_THRESHOLD})`);
  }
};

/**
 * TASK-070: Get queue statistics
 * Returns current queue size and monitoring metrics
 */
export const getQueueStats = () => {
  return {
    queueSize: syncQueue.size,
    warningCount: queueSizeWarnings,
    criticalCount: queueSizeCritical,
    warningThreshold: QUEUE_SIZE_WARNING_THRESHOLD,
    criticalThreshold: QUEUE_SIZE_CRITICAL_THRESHOLD,
    isHealthy: syncQueue.size < QUEUE_SIZE_WARNING_THRESHOLD,
  };
};

/**
 * TASK-072: Clear all pending operations from sync queue
 * Used for manual queue management and recovery
 */
export const clearSyncQueue = async (): Promise<void> => {
  try {
    syncQueue.clear();
    await saveSyncQueue();
    debugWarn('[LocalFirst] Sync queue cleared manually');
  } catch (_error: unknown) {
    debugError('[LocalFirst] Failed to clear sync queue:', _error);
    throw _error;
  }
};

/**
 * TASK-071: Sort queue by priority before sync
 * Returns array of queue entries sorted by priority (HIGH > NORMAL > LOW)
 * Within same priority, sorts by timestamp (oldest first)
 *
 * TASK-072: Export for use in SyncQueuePanel component
 */
export const getSortedQueueOperations = (): [string, QueuedOperation][] => {
  const priorityOrder = { HIGH: 0, NORMAL: 1, LOW: 2 };

  return Array.from(syncQueue.entries()).sort((a, b) => {
    const [, opA] = a;
    const [, opB] = b;

    // Primary sort: by priority
    const priorityDiff = priorityOrder[opA.priority] - priorityOrder[opB.priority];
    if (priorityDiff !== 0) {
      return priorityDiff;
    }

    // Secondary sort: by timestamp (oldest first)
    return opA.timestamp - opB.timestamp;
  });
};

/**
 * TASK-071: Determine operation priority based on collection type
 * HIGH: auth, payment, security
 * NORMAL: user data, settings
 * LOW: analytics, logs
 */
const determineOperationPriority = (collection: string): OperationPriority => {
  const highPriorityCollections = ['auth', 'users', 'accounts', 'payments', 'security', 'sessions'];
  const lowPriorityCollections = ['analytics', 'logs', 'events', 'metrics'];

  if (highPriorityCollections.includes(collection.toLowerCase())) {
    return 'HIGH';
  }
  if (lowPriorityCollections.includes(collection.toLowerCase())) {
    return 'LOW';
  }
  return 'NORMAL';
};

/**
 * Initialize LOCAL-FIRST system
 */
export const initializeLocalFirst = async (): Promise<void> => {
  try {
    debugLog('[LocalFirst] 🏠 Initializing LOCAL-FIRST system...');

    // Initialize cache system
    await cache.initializeCache();

    // TASK-067: Load persisted sync queue from AsyncStorage
    await loadSyncQueue();

    // TASK-043: Check if Firestore is available
    try {
      if (firestore) {
        // Test Firestore connection
        await enableNetwork(firestore);
        fallbackMode = false;
        debugLog('[LocalFirst] ✅ Firestore available, full sync enabled');
      } else {
        throw new Error('Firestore not initialized');
      }
    } catch (firestoreError) {
      // TASK-043: Enable fallback mode (memory-only cache)
      fallbackMode = true;
      debugWarn('[LocalFirst] ⚠️ Firestore unavailable, using fallback mode (memory-only cache)', firestoreError);
    }

    // Setup network monitoring using NetInfo
    if (!networkListenersSetup) {
      setupNetworkMonitoring();
      networkListenersSetup = true;
    }

    // Start background sync only if not in fallback mode
    if (!fallbackMode) {
      startBackgroundSync();
    }

    debugLog('[LocalFirst] ✅ LOCAL-FIRST system initialized', fallbackMode ? '(FALLBACK MODE)' : '(FULL MODE)');
  } catch (_error: unknown) {
    debugError('[LocalFirst] Failed to initialize LOCAL-FIRST system', _error);
    // Even on _error, enable fallback mode to keep app functional
    fallbackMode = true;
  }
};

/**
 * LOCAL-FIRST: Get data (local first, remote fallback)
 * TASK-050: Request coalescing using request deduplicator
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

      // TASK-043: Skip background sync if in fallback mode
      if (!fallbackMode && isOnline && options.syncEnabled !== false) {
        backgroundSync(options).catch((_error) => {
          debugWarn(`[LocalFirst] Background sync failed for ${cacheKey}:`, _error);
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

      // TASK-043: Skip background sync if in fallback mode
      if (!fallbackMode && isOnline && options.syncEnabled !== false) {
        backgroundSync(options).catch((_error) => {
          debugWarn(`[LocalFirst] Background sync failed for ${cacheKey}:`, _error);
        });
      }

      return persistentData;
    }

    // TASK-043: If in fallback mode, return fallback data (no remote fetch)
    if (fallbackMode) {
      debugWarn(`[LocalFirst] ⚠️ Fallback mode active, returning fallback data for ${cacheKey}`);
      return (fallbackData as T) || null;
    }

    // TASK-050: Use request deduplicator to prevent duplicate in-flight requests
    const { requestDeduplicator } = await import('./request-deduplicator');

    const result = await requestDeduplicator.deduplicate(
      cacheKey,
      async (): Promise<T | null> => {
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

        // 4. Return fallback data if provided
        if (fallbackData !== undefined) {
          debugLog(`[LocalFirst] 📋 Using fallback data for ${cacheKey}`);
          return fallbackData as T;
        }

        debugWarn(`[LocalFirst] ⚠️ No data available for ${cacheKey}`);
        return null;
      },
      { timeout: 6000 } // 6 second timeout for entire operation
    );

    return result as T | null;

    // 4. Use fallback data if provided
    if (fallbackData !== undefined) {
      debugLog(`[LocalFirst] 🔄 Using fallback data for: ${cacheKey}`);

      // Cache fallback data locally
      await cache.set(cacheKey, fallbackData, 'local', 'pending');

      return fallbackData as T;
    }

    debugLog(`[LocalFirst] ❌ No data found for: ${cacheKey}`);
    return null;
  } catch (_error: unknown) {
    debugError(`[LocalFirst] Error getting data for ${cacheKey}:`, _error);
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
      // TASK-071: Determine operation priority
      const priority = determineOperationPriority(collection);

      const operation: QueuedOperation = {
        id: `${cacheKey}-${Date.now()}`,
        collection,
        docId: id,
        operation: 'set',
        data: data as Record<string, unknown>,
        timestamp: Date.now(),
        retries: 0,
        priority,
        version: 1,
        source: 'local',
        syncStatus: 'pending',
        lastModified: Date.now(),
      };

      syncQueue.set(cacheKey, operation);
      debugLog(`[LocalFirst] 📋 Added to sync queue [${priority}]: ${cacheKey}`);

      // TASK-068: Debounced queue persistence
      debouncedSaveQueue();

      // TASK-070: Monitor queue size
      monitorQueueSize();

      // Try immediate sync if online (don't wait)
      if (isOnline) {
        backgroundSync(options).catch((_error) => {
          debugWarn(`[LocalFirst] Immediate sync failed for ${cacheKey}:`, _error);
        });
      }
    }
  } catch (_error: unknown) {
    debugError(`[LocalFirst] Error setting data for ${cacheKey}:`, _error);
    throw _error;
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
        const hasConflict = detectConflict(queueEntry.version ?? 1, remoteData.version || 0, queueEntry.lastModified ?? Date.now(), remoteData.lastModified || 0);

        if (hasConflict) {
          debugWarn(`[LocalFirst] ⚠️ Conflict detected for ${cacheKey}`);

          // Create conflict data
          const conflictData: ConflictData = {
            local: queueEntry.data,
            remote: remoteData.data,
            localTimestamp: queueEntry.lastModified ?? Date.now(),
            remoteTimestamp: remoteData.lastModified || 0,
            localVersion: queueEntry.version ?? 1,
            remoteVersion: remoteData.version || 0,
            key: cacheKey,
          };

          // Use default strategy (last-write-wins)
          const strategy = getDefaultStrategy(queueEntry.lastModified ?? Date.now(), remoteData.lastModified || 0);

          // Resolve conflict automatically
          const resolution = resolveConflictAutomatically(conflictData, strategy);

          if (resolution.resolved && resolution.data) {
            debugLog(`[LocalFirst] ✅ Conflict resolved using strategy: ${resolution.strategy}`);
            // Update queue entry with resolved data
            queueEntry.data = resolution.data as Record<string, unknown>;
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
    queueEntry.retries = 0; // Reset retry count on success

    // Update cache
    await cache.set(cacheKey, queueEntry.data, 'remote', 'synced');

    // Remove from sync queue
    syncQueue.delete(cacheKey);

    // TASK-069: Cleanup synced operations and save queue
    await cleanupSyncedOperations([cacheKey]);

    // Track metrics
    const syncDuration = Date.now() - syncStartTime;
    totalSyncTime += syncDuration;
    totalSyncCount++;
    syncStartTimes.delete(cacheKey);

    debugLog(`[LocalFirst] ✅ Background sync completed: ${cacheKey} (${syncDuration}ms)`);
  } catch (_error: unknown) {
    failedSyncCount++;
    syncStartTimes.delete(cacheKey);
    debugWarn(`[LocalFirst] Background sync failed for ${cacheKey}:`, _error);

    // TASK-030: Implement exponential backoff retry logic
    const queueEntry = syncQueue.get(cacheKey);
    if (queueEntry) {
      queueEntry.retries = (queueEntry.retries || 0) + 1;
      queueEntry.lastSyncAttempt = Date.now();
      queueEntry.syncStatus = '_error';

      const maxRetries = options.maxRetries || 5;

      if (queueEntry.retries >= maxRetries) {
        syncQueue.delete(cacheKey);
        debugWarn(`[LocalFirst] Max retries (${maxRetries}) reached for ${cacheKey}, removed from queue`);
      } else {
        // Calculate exponential backoff delay
        const delay = Math.min(INITIAL_RETRY_DELAY * Math.pow(BACKOFF_MULTIPLIER, queueEntry.retries - 1), MAX_RETRY_DELAY);

        debugLog(`[LocalFirst] Will retry sync for ${cacheKey} in ${delay}ms (attempt ${queueEntry.retries}/${maxRetries})`);

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
          .catch((_error) => {
            debugWarn('[LocalFirst] Failed to enable Firestore network:', _error);
          });
      }

      // Process sync queue
      processSyncQueue().catch((_error) => {
        debugWarn('[LocalFirst] Failed to process sync queue:', _error);
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
          .catch((_error) => {
            debugWarn('[LocalFirst] Failed to disable Firestore network:', _error);
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
/**
 * Process sync queue with priority-based ordering
 * TASK-071: Uses getSortedQueueOperations to prioritize HIGH operations
 */
const processSyncQueue = async (): Promise<void> => {
  if (syncQueue.size === 0) {
    return;
  }

  debugLog(`[LocalFirst] 🔄 Processing sync queue: ${syncQueue.size} items`);

  // TASK-071: Get sorted operations by priority (HIGH > NORMAL > LOW)
  const sortedOperations = getSortedQueueOperations();

  const syncPromises = sortedOperations.map(async ([key, operation]) => {
    try {
      await backgroundSync({ collection: operation.collection, id: operation.docId });
    } catch (_error: unknown) {
      debugWarn(`[LocalFirst] Failed to sync ${key} [${operation.priority}]:`, _error);
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
      processSyncQueue().catch((_error) => {
        debugWarn('[LocalFirst] Background sync process _error:', _error);
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
  } catch (_error: unknown) {
    debugWarn(`[LocalFirst] Failed to get from persistent storage: ${key}`, _error);
    return null;
  }
};

/**
 * Save to persistent storage
 */
const saveToPersistentStorage = async <T>(key: string, data: T): Promise<void> => {
  try {
    await AsyncStorage.setItem(`@LocalFirst:${key}`, JSON.stringify(data));
  } catch (_error: unknown) {
    debugWarn(`[LocalFirst] Failed to save to persistent storage: ${key}`, _error);
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
        const priority = determineOperationPriority(op.collection);
        const operation: QueuedOperation = {
          id: `${cacheKey}-${Date.now()}`,
          collection: op.collection,
          docId: op.id,
          operation: 'set',
          data: op.data as Record<string, unknown>,
          timestamp: Date.now(),
          retries: 0,
          priority,
        };
        syncQueue.set(cacheKey, operation);
        // Debounced save
        debouncedSaveQueue();
      }
    });

    await Promise.all(localSavePromises);
    debugLog('[LocalFirst] ✅ Batch save completed locally');

    // 2. Trigger background sync if online
    if (isOnline) {
      processSyncQueue().catch((_error) => {
        debugWarn('[LocalFirst] Batch sync failed:', _error);
      });
    }
  } catch (_error: unknown) {
    debugError('[LocalFirst] Batch set data _error:', _error);
    throw _error;
  }
};

/**
 * REAL-TIME SUBSCRIPTIONS: Subscribe to data changes
 * Uses Firestore onSnapshot for real-time updates
 * TASK-036: Properly returns unsubscribe function for cleanup
 */
export const subscribeToData = <T>(collection: string, id: string, callback: (data: T | null) => void, onError?: (error: Error) => void): (() => void) => {
  if (!firestore) {
    debugWarn('[LocalFirst] Cannot subscribe - Firestore not initialized');
    // TASK-036: Return no-op unsubscribe function
    return () => {
      debugLog('[LocalFirst] No-op unsubscribe (Firestore not initialized)');
    };
  }

  const cacheKey = `${collection}:${id}`;
  debugLog(`[LocalFirst] 🔔 Subscribing to real-time updates: ${cacheKey}`);

  // TASK-036: Store unsubscribe function in closure
  let unsubscribeRef: (() => void) | null = null;

  // Import onSnapshot dynamically to avoid issues if not available
  import('firebase/firestore')
    .then(({ onSnapshot }) => {
      const docRef = doc(firestore, collection, id);

      const firestoreUnsubscribe = onSnapshot(
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
        (_error) => {
          debugError(`[LocalFirst] Real-time subscription error: ${cacheKey}`, _error);
          if (onError) {
            onError(_error as Error);
          }
        }
      );

      // TASK-036: Store the actual unsubscribe function
      unsubscribeRef = firestoreUnsubscribe;
    })
    .catch((_error) => {
      debugError('[LocalFirst] Failed to set up real-time subscription:', _error);
    });

  // TASK-036: Return wrapper that calls stored unsubscribe function
  return () => {
    debugLog(`[LocalFirst] 🔕 Unsubscribing from: ${cacheKey}`);
    if (unsubscribeRef) {
      unsubscribeRef();
    }
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

/**
 * Get LOCAL-FIRST system status
 * TASK-043: Includes fallbackMode status
 */
export const getLocalFirstStatus = () => ({
  isOnline,
  fallbackMode, // TASK-043: Memory-only cache mode
  syncQueueSize: syncQueue.size,
  activeSyncsCount: activeSyncs.size,
  metrics: {
    totalSyncs: totalSyncCount,
    failedSyncs: failedSyncCount,
    avgSyncTime: totalSyncCount > 0 ? totalSyncTime / totalSyncCount : 0,
  },
});
