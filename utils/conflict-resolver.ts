/**
 * Conflict Resolution Utility
 * TASK-029: Handles data sync conflicts with user choice
 * Provides conflict detection and resolution strategies
 */

import { logger } from './logger-production';

export interface ConflictData<T = unknown> {
  local: T;
  remote: T;
  localTimestamp: number;
  remoteTimestamp: number;
  localVersion: number;
  remoteVersion: number;
  key: string;
}

export type ConflictResolutionStrategy =
  | 'use-local' // Keep local changes
  | 'use-remote' // Accept remote changes
  | 'merge' // Attempt to merge changes
  | 'manual'; // User must decide

export interface ConflictResolutionResult<T = unknown> {
  resolved: boolean;
  data: T | null;
  strategy: ConflictResolutionStrategy;
  error?: string;
}

/**
 * Detect if there's a conflict between local and remote data
 * @param localVersion - Local data version
 * @param remoteVersion - Remote data version
 * @param localTimestamp - Local modification timestamp
 * @param remoteTimestamp - Remote modification timestamp
 * @returns True if conflict detected
 */
export function detectConflict(localVersion: number, remoteVersion: number, localTimestamp: number, remoteTimestamp: number): boolean {
  // Conflict exists if:
  // 1. Versions differ AND
  // 2. Both have been modified (timestamps differ from sync time)
  if (localVersion === remoteVersion) {
    return false;
  }

  // If remote is newer and has higher version, no conflict
  if (remoteTimestamp > localTimestamp && remoteVersion > localVersion) {
    return false;
  }

  // If local is newer and has higher version, no conflict
  if (localTimestamp > remoteTimestamp && localVersion > remoteVersion) {
    return false;
  }

  // Otherwise, we have a conflict
  return true;
}

/**
 * Resolve conflict automatically using a strategy
 * @param conflict - Conflict data
 * @param strategy - Resolution strategy
 * @returns Resolution result
 */
export function resolveConflictAutomatically<T>(conflict: ConflictData<T>, strategy: ConflictResolutionStrategy): ConflictResolutionResult<T> {
  logger.info(`[ConflictResolver] Resolving conflict for ${conflict.key} using strategy: ${strategy}`);

  switch (strategy) {
    case 'use-local':
      return {
        resolved: true,
        data: conflict.local,
        strategy,
      };

    case 'use-remote':
      return {
        resolved: true,
        data: conflict.remote,
        strategy,
      };

    case 'merge':
      // Attempt automatic merge for simple objects
      const merged = attemptAutoMerge(conflict.local, conflict.remote);
      if (merged) {
        return {
          resolved: true,
          data: merged,
          strategy,
        };
      }
      // Merge failed, fall back to manual
      return {
        resolved: false,
        data: null,
        strategy: 'manual',
        error: 'Automatic merge failed, manual resolution required',
      };

    case 'manual':
    default:
      return {
        resolved: false,
        data: null,
        strategy: 'manual',
        error: 'Manual resolution required',
      };
  }
}

/**
 * Attempt to automatically merge two data objects
 * @param local - Local data
 * @param remote - Remote data
 * @returns Merged data or null if merge not possible
 */
function attemptAutoMerge<T>(local: T, remote: T): T | null {
  // Only attempt merge for plain objects
  if (typeof local !== 'object' || typeof remote !== 'object' || local === null || remote === null) {
    return null;
  }

  try {
    const merged = { ...remote }; // Start with remote as base

    // Overlay local changes that don't conflict
    for (const key in local) {
      if (Object.prototype.hasOwnProperty.call(local, key)) {
        const localValue = local[key];
        const remoteValue = (remote as unknown)[key];

        // If values are identical, no conflict
        if (JSON.stringify(localValue) === JSON.stringify(remoteValue)) {
          continue;
        }

        // If remote doesn't have this key, use local
        if (!(key in remote)) {
          (merged as unknown)[key] = localValue;
          continue;
        }

        // If values differ, we can't auto-merge
        logger.warn(`[ConflictResolver] Cannot auto-merge conflicting key: ${key}`);
        return null;
      }
    }

    return merged;
  } catch (_error: unknown) {
    logger.error('[ConflictResolver] Error during auto-merge:', _error as Error);
    return null;
  }
}

/**
 * Get default resolution strategy based on timestamps
 * Last-write-wins strategy
 * @param localTimestamp - Local modification timestamp
 * @param remoteTimestamp - Remote modification timestamp
 * @returns Recommended strategy
 */
export function getDefaultStrategy(localTimestamp: number, remoteTimestamp: number): ConflictResolutionStrategy {
  // Last-write-wins: use the most recently modified version
  if (localTimestamp > remoteTimestamp) {
    return 'use-local';
  }
  if (remoteTimestamp > localTimestamp) {
    return 'use-remote';
  }
  // If timestamps are equal, prefer remote (server authority)
  return 'use-remote';
}

/**
 * Format conflict for user display
 * @param conflict - Conflict data
 * @returns Formatted conflict description
 */
export function formatConflictDescription(conflict: ConflictData): string {
  const localDate = new Date(conflict.localTimestamp).toLocaleString();
  const remoteDate = new Date(conflict.remoteTimestamp).toLocaleString();

  return `A sync conflict was detected for "${conflict.key}".

Local version (modified ${localDate}):
Version ${conflict.localVersion}

Remote version (modified ${remoteDate}):
Version ${conflict.remoteVersion}

Please choose which version to keep.`;
}

/**
 * Conflict resolution hook data (for React components)
 */
export interface ConflictResolutionPrompt<T = unknown> {
  conflict: ConflictData<T>;
  resolve: (strategy: ConflictResolutionStrategy) => void;
  cancel: () => void;
}

// Global conflict queue for UI prompts
const conflictQueue: ConflictResolutionPrompt[] = [];
let conflictResolver: ((prompt: ConflictResolutionPrompt) => void) | null = null;

/**
 * Register a conflict resolver UI handler
 * @param handler - Function to handle conflict resolution prompts
 */
export function registerConflictResolver(handler: (prompt: ConflictResolutionPrompt) => void): void {
  conflictResolver = handler;
  // Process unknown queued conflicts
  while (conflictQueue.length > 0 && conflictResolver) {
    const prompt = conflictQueue.shift();
    if (prompt) {
      conflictResolver(prompt);
    }
  }
}

/**
 * Request manual conflict resolution from user
 * @param conflict - Conflict data
 * @returns Promise that resolves with the chosen strategy
 */
export async function requestManualResolution<T>(conflict: ConflictData<T>): Promise<ConflictResolutionStrategy> {
  return new Promise((resolve, reject) => {
    const prompt: ConflictResolutionPrompt<T> = {
      conflict,
      resolve: (strategy: ConflictResolutionStrategy) => {
        resolve(strategy);
      },
      cancel: () => {
        reject(new Error('Conflict resolution cancelled'));
      },
    };

    if (conflictResolver) {
      conflictResolver(prompt);
    } else {
      // Queue for later if no resolver registered
      conflictQueue.push(prompt);
      logger.warn('[ConflictResolver] No resolver registered, conflict queued');
    }
  });
}
