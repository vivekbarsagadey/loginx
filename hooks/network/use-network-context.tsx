/**
 * Network Context
 * Centralized network status management
 * 
 * Features:
 * - Real-time network status monitoring
 * - Connection type detection
 * - Sync queue status tracking
 * - Network quality indicators
 * - Automatic reconnection handling
 */

import type {
  ConnectionType,
  DEFAULT_NETWORK_CONTEXT_STATE,
  NetworkContextState,
  SyncQueueInfo,
} from '@/types/network';
import { getNetworkStatus, initializeNetworkMonitoring, subscribeToNetworkChanges } from '@/utils/network';
import React, { createContext, type PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from 'react';

/**
 * Network context type
 */
interface NetworkContextType extends NetworkContextState {
  /** Refresh network status */
  refreshStatus: () => Promise<void>;
  /** Update sync queue info */
  updateSyncQueue: (info: Partial<SyncQueueInfo>) => void;
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

/**
 * Network Provider Component
 */
export function NetworkProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<NetworkContextState>({
    isConnected: false,
    connectionType: 'unknown',
    isInternetReachable: null,
    quality: null,
    isAirplaneMode: false,
    syncQueue: {
      pendingCount: 0,
      isSyncing: false,
      lastSyncAt: null,
      failedCount: 0,
    },
    isMonitoring: false,
    error: null,
  });

  /**
   * Refresh network status
   */
  const refreshStatus = useCallback(async () => {
    try {
      const status = await getNetworkStatus();

      setState((prev) => ({
        ...prev,
        isConnected: status.isConnected,
        connectionType: status.connectionType as ConnectionType,
        isInternetReachable: status.isInternetReachable,
        isAirplaneMode: !status.isConnected && status.connectionType === 'none',
        error: null,
      }));

      if (__DEV__) {
        console.log('[NetworkContext] Status refreshed:', status);
      }
    } catch (error) {
      console.error('[NetworkContext] Failed to refresh status:', error);
      setState((prev) => ({
        ...prev,
        error: 'Failed to refresh network status',
      }));
    }
  }, []);

  /**
   * Update sync queue info
   */
  const updateSyncQueue = useCallback((info: Partial<SyncQueueInfo>) => {
    setState((prev) => ({
      ...prev,
      syncQueue: {
        ...prev.syncQueue,
        ...info,
      },
    }));
  }, []);

  /**
   * Handle network status changes
   */
  const handleNetworkChange = useCallback((isOnline: boolean) => {
    if (__DEV__) {
      console.log('[NetworkContext] Network status changed:', isOnline ? 'ONLINE' : 'OFFLINE');
    }

    setState((prev) => ({
      ...prev,
      isConnected: isOnline,
      isInternetReachable: isOnline,
    }));
  }, []);

  /**
   * Initialize network monitoring on mount
   */
  useEffect(() => {
    if (__DEV__) {
      console.log('[NetworkContext] Initializing network monitoring');
    }

    // Initialize monitoring
    const unsubscribeMonitoring = initializeNetworkMonitoring();

    // Subscribe to network changes
    const unsubscribeChanges = subscribeToNetworkChanges(handleNetworkChange);

    // Get initial status
    refreshStatus();

    setState((prev) => ({ ...prev, isMonitoring: true }));

    return () => {
      if (__DEV__) {
        console.log('[NetworkContext] Cleaning up network monitoring');
      }
      unsubscribeMonitoring();
      unsubscribeChanges();
      setState((prev) => ({ ...prev, isMonitoring: false }));
    };
  }, [handleNetworkChange, refreshStatus]);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo<NetworkContextType>(
    () => ({
      ...state,
      refreshStatus,
      updateSyncQueue,
    }),
    [state, refreshStatus, updateSyncQueue]
  );

  return <NetworkContext.Provider value={contextValue}>{children}</NetworkContext.Provider>;
}

/**
 * Hook to access network context
 * @throws Error if used outside NetworkProvider
 * @example
 * const { isConnected, connectionType, syncQueue } = useNetwork();
 */
export function useNetwork(): NetworkContextType {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error('useNetwork must be used within a NetworkProvider');
  }
  return context;
}
