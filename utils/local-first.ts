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
import { disableNetwork, doc, enableNetwork, getDoc, setDoc } from 'firebase/firestore';
import * as cache from './cache';
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
}

// Network status tracking
let isOnline = true;
let networkListenersSetup = false;
let networkUnsubscribe: (() => void) | null = null;

// Pending sync queue
const syncQueue = new Map<string, DataEntry>();

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
 */
const backgroundSync = async (options: LocalFirstOptions): Promise<void> => {
  const { collection, id } = options;
  const cacheKey = `${collection}:${id}`;

  try {
    const queueEntry = syncQueue.get(cacheKey);
    if (!queueEntry || !firestore) {
      return;
    }

    debugLog(`[LocalFirst] 🔄 Background syncing: ${cacheKey}`);

    const docRef = doc(firestore, collection, id);
    await setDoc(docRef, queueEntry.data);

    // Mark as synced
    queueEntry.syncStatus = 'synced';
    queueEntry.lastSyncAttempt = Date.now();

    // Update cache
    await cache.set(cacheKey, queueEntry.data, 'remote', 'synced');

    // Remove from sync queue
    syncQueue.delete(cacheKey);

    debugLog(`[LocalFirst] ✅ Background sync completed: ${cacheKey}`);
  } catch (error) {
    debugWarn(`[LocalFirst] Background sync failed for ${cacheKey}:`, error);

    // Update retry count
    const queueEntry = syncQueue.get(cacheKey);
    if (queueEntry) {
      queueEntry.retryCount = (queueEntry.retryCount || 0) + 1;
      queueEntry.lastSyncAttempt = Date.now();
      queueEntry.syncStatus = 'error';

      // Remove from queue if too many retries
      if (queueEntry.retryCount >= (options.maxRetries || 3)) {
        syncQueue.delete(cacheKey);
        debugWarn(`[LocalFirst] Max retries reached for ${cacheKey}, removed from queue`);
      }
    }
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
