/**
 * Flow Persistence Hook
 * 
 * Handles saving and loading flow state to/from AsyncStorage
 */

import { useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { type FlowConfig, type FlowState } from '@/types/flow';

/**
 * Default storage key prefix
 */
const STORAGE_KEY_PREFIX = '@loginx:flow:';

/**
 * Create storage key for a flow
 */
function getStorageKey(flowId: string, customKey?: string): string {
  if (customKey) {
    return `${STORAGE_KEY_PREFIX}${customKey}`;
  }
  return `${STORAGE_KEY_PREFIX}${flowId}`;
}

/**
 * Serialize flow state for storage
 */
function serializeState(state: FlowState): string {
  const serializable = {
    ...state,
    startedAt: state.startedAt.toISOString(),
    lastUpdatedAt: state.lastUpdatedAt.toISOString(),
    completedAt: state.completedAt?.toISOString(),
  };
  return JSON.stringify(serializable);
}

/**
 * Deserialize flow state from storage
 */
function deserializeState(json: string): FlowState {
  const parsed = JSON.parse(json);
  return {
    ...parsed,
    startedAt: new Date(parsed.startedAt),
    lastUpdatedAt: new Date(parsed.lastUpdatedAt),
    completedAt: parsed.completedAt ? new Date(parsed.completedAt) : undefined,
  };
}

/**
 * Hook for flow state persistence
 */
export function useFlowPersistence(
  config: FlowConfig,
  state: FlowState,
  enabled = true
) {
  const storageKey = getStorageKey(config.id, config.persistenceKey);

  /**
   * Save current state to storage
   */
  const saveState = useCallback(async (): Promise<void> => {
    if (!enabled) {
      return;
    }

    try {
      const serialized = serializeState(state);
      await AsyncStorage.setItem(storageKey, serialized);
    } catch (error: unknown) {
      console.error('Failed to save flow state:', error);
      throw error;
    }
  }, [enabled, state, storageKey]);

  /**
   * Load state from storage
   */
  const loadState = useCallback(async (): Promise<FlowState | null> => {
    if (!enabled) {
      return null;
    }

    try {
      const serialized = await AsyncStorage.getItem(storageKey);
      
      if (!serialized) {
        return null;
      }

      const deserialized = deserializeState(serialized);
      
      // Verify flow ID and version match
      if (deserialized.flowId !== config.id) {
        console.warn('Saved state is for a different flow, ignoring');
        return null;
      }

      if (deserialized.flowVersion !== config.version) {
        console.warn('Saved state is for a different flow version, ignoring');
        return null;
      }

      return deserialized;
    } catch (error: unknown) {
      console.error('Failed to load flow state:', error);
      return null;
    }
  }, [enabled, storageKey, config.id, config.version]);

  /**
   * Clear saved state from storage
   */
  const clearState = useCallback(async (): Promise<void> => {
    if (!enabled) {
      return;
    }

    try {
      await AsyncStorage.removeItem(storageKey);
    } catch (error: unknown) {
      console.error('Failed to clear flow state:', error);
      throw error;
    }
  }, [enabled, storageKey]);

  /**
   * Check if saved state exists
   */
  const hasState = useCallback(async (): Promise<boolean> => {
    if (!enabled) {
      return false;
    }

    try {
      const serialized = await AsyncStorage.getItem(storageKey);
      return serialized !== null;
    } catch (error: unknown) {
      console.error('Failed to check for saved state:', error);
      return false;
    }
  }, [enabled, storageKey]);

  return {
    saveState,
    loadState,
    clearState,
    hasState,
  };
}
