/**
 * Network Utilities
 * Cross-platform network connectivity monitoring
 * Works on iOS, Android, and Web
 */

import NetInfo, { type NetInfoState } from '@react-native-community/netinfo';
import { debugLog, debugWarn } from './debug';

// Network status state
let isConnected = true;
let isInternetReachable = true;
let connectionType = 'unknown';

// Listeners for network changes
const networkListeners = new Set<(isOnline: boolean) => void>();

/**
 * Initialize network monitoring
 */
export const initializeNetworkMonitoring = (): (() => void) => {
  debugLog('[Network] 🌐 Initializing network monitoring...');

  // Subscribe to network state changes
  const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
    const wasConnected = isConnected;

    isConnected = state.isConnected ?? false;
    isInternetReachable = state.isInternetReachable ?? false;
    connectionType = state.type;

    const isOnline = isConnected && isInternetReachable;

    debugLog(`[Network] Status changed: ${isOnline ? '🌐 ONLINE' : '🏠 OFFLINE'} (${connectionType})`);

    // Notify all listeners if status changed
    if (wasConnected !== isConnected) {
      networkListeners.forEach((listener) => {
        try {
          listener(isOnline);
        } catch (_error) {
          debugWarn('[Network] Error in network listener:', error);
        }
      });
    }
  });

  // Get initial state
  NetInfo.fetch()
    .then((state: NetInfoState) => {
      isConnected = state.isConnected ?? false;
      isInternetReachable = state.isInternetReachable ?? false;
      connectionType = state.type;

      const isOnline = isConnected && isInternetReachable;
      debugLog(`[Network] Initial status: ${isOnline ? '🌐 ONLINE' : '🏠 OFFLINE'} (${connectionType})`);
    })
    .catch((error) => {
      debugWarn('[Network] Failed to fetch initial network state:', error);
    });

  debugLog('[Network] ✅ Network monitoring initialized');

  return unsubscribe;
};

/**
 * Get current network status
 */
export const getNetworkStatus = async (): Promise<{
  isOnline: boolean;
  isConnected: boolean;
  isInternetReachable: boolean;
  connectionType: string;
}> => {
  try {
    const state = await NetInfo.fetch();
    return {
      isOnline: (state.isConnected ?? false) && (state.isInternetReachable ?? false),
      isConnected: state.isConnected ?? false,
      isInternetReachable: state.isInternetReachable ?? false,
      connectionType: state.type,
    };
  } catch (_error) {
    debugWarn('[Network] Failed to fetch network status:', error);
    return {
      isOnline: false,
      isConnected: false,
      isInternetReachable: false,
      connectionType: 'unknown',
    };
  }
};

/**
 * Check if device is online (synchronous)
 * Uses cached value from NetInfo listener
 */
export const isOnline = (): boolean => {
  return isConnected && isInternetReachable;
};

/**
 * Check if device is offline (synchronous)
 */
export const isOffline = (): boolean => {
  return !isOnline();
};

/**
 * Subscribe to network status changes
 * @param listener - Callback function that receives online status
 * @returns Unsubscribe function
 *
 * SECURITY FIX (TASK-004): Ensure proper cleanup to prevent memory leaks.
 * The returned unsubscribe function properly removes the listener from the Set.
 */
export const subscribeToNetworkChanges = (listener: (isOnline: boolean) => void): (() => void) => {
  networkListeners.add(listener);

  // Return unsubscribe function that properly removes listener
  return () => {
    const removed = networkListeners.delete(listener);
    if (__DEV__ && !removed) {
      debugWarn('[Network] Attempted to remove non-existent listener');
    }
  };
};

/**
 * Wait for network connection
 * @param timeout - Maximum time to wait in milliseconds (default: 30000)
 * @returns Promise that resolves when online, rejects on timeout
 */
export const waitForConnection = (timeout = 30000): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if already online
    if (isOnline()) {
      resolve();
      return;
    }

    const timeoutId = setTimeout(() => {
      unsubscribe();
      reject(new Error('Network connection timeout'));
    }, timeout);

    const unsubscribe = subscribeToNetworkChanges((online) => {
      if (online) {
        clearTimeout(timeoutId);
        unsubscribe();
        resolve();
      }
    });
  });
};

/**
 * Execute a function when online, or queue it for later
 * @param fn - Function to execute
 * @param immediate - If true, execute immediately even if offline
 */
export const executeWhenOnline = async <T>(fn: () => Promise<T>, immediate = false): Promise<T> => {
  if (isOnline() || immediate) {
    return fn();
  }

  debugLog('[Network] Waiting for connection before executing...');
  await waitForConnection();
  return fn();
};

/**
 * Refresh network status
 * Forces a fresh check of network connectivity
 */
export const refreshNetworkStatus = async (): Promise<void> => {
  try {
    const state = await NetInfo.refresh();
    isConnected = state.isConnected ?? false;
    isInternetReachable = state.isInternetReachable ?? false;
    connectionType = state.type;

    const online = isConnected && isInternetReachable;
    debugLog(`[Network] Refreshed status: ${online ? '🌐 ONLINE' : '🏠 OFFLINE'} (${connectionType})`);
  } catch (_error) {
    debugWarn('[Network] Failed to refresh network status:', error);
  }
};

/**
 * Get detailed connection info
 */
export const getConnectionInfo = async () => {
  try {
    const state = await NetInfo.fetch();
    return {
      type: state.type,
      isConnected: state.isConnected,
      isInternetReachable: state.isInternetReachable,
      details: state.details,
    };
  } catch (_error) {
    debugWarn('[Network] Failed to get connection info:', error);
    return null;
  }
};
