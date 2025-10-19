/**
 * Network Status Type Definitions
 * Types for network connectivity and monitoring
 */

/**
 * Network connection type
 */
export type ConnectionType =
  | 'wifi'
  | 'cellular'
  | 'bluetooth'
  | 'ethernet'
  | 'wimax'
  | 'vpn'
  | 'other'
  | 'unknown'
  | 'none';

/**
 * Network state information
 */
export interface NetworkState {
  /** Whether device is connected to any network */
  isConnected: boolean;
  /** Type of network connection */
  connectionType: ConnectionType;
  /** Whether internet is reachable (can reach external servers) */
  isInternetReachable: boolean | null;
  /** Network quality indicator (0-100) */
  quality: number | null;
  /** Whether device is in airplane mode */
  isAirplaneMode: boolean;
}

/**
 * Sync queue information
 */
export interface SyncQueueInfo {
  /** Number of pending operations */
  pendingCount: number;
  /** Whether sync is currently in progress */
  isSyncing: boolean;
  /** Last successful sync timestamp */
  lastSyncAt: number | null;
  /** Failed operations count */
  failedCount: number;
}

/**
 * Network context state
 */
export interface NetworkContextState extends NetworkState {
  /** Sync queue status */
  syncQueue: SyncQueueInfo;
  /** Whether network monitoring is initialized */
  isMonitoring: boolean;
  /** Error message if network monitoring failed */
  error: string | null;
}

/**
 * Default network state
 */
export const DEFAULT_NETWORK_STATE: NetworkState = {
  isConnected: false,
  connectionType: 'unknown',
  isInternetReachable: null,
  quality: null,
  isAirplaneMode: false,
};

/**
 * Default sync queue info
 */
export const DEFAULT_SYNC_QUEUE_INFO: SyncQueueInfo = {
  pendingCount: 0,
  isSyncing: false,
  lastSyncAt: null,
  failedCount: 0,
};

/**
 * Default network context state
 */
export const DEFAULT_NETWORK_CONTEXT_STATE: NetworkContextState = {
  ...DEFAULT_NETWORK_STATE,
  syncQueue: DEFAULT_SYNC_QUEUE_INFO,
  isMonitoring: false,
  error: null,
};
