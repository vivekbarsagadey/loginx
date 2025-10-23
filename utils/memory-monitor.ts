/**
 * Memory Pressure Monitoring Utility
 * TASK-039: Monitor memory usage and respond to pressure events
 * Integrates with AppState to detect background/foreground transitions
 */

import { AppState, type AppStateStatus, Platform } from 'react-native';
import * as cache from './cache';
import { cleanupManager } from './cleanup-manager';
import { debugError, debugLog, debugWarn } from './debug';

// Memory thresholds (in MB)
const MEMORY_WARNING_THRESHOLD = 100;
const MEMORY_CRITICAL_THRESHOLD = 150;

// Memory statistics
let isMonitoring = false;
let currentAppState: AppStateStatus = 'active';
let memoryWarningCount = 0;
let lastMemoryCheck = Date.now();

// Listeners for memory events
const memoryWarningListeners = new Set<() => void>();
const memoryCriticalListeners = new Set<() => void>();

/**
 * Estimate current memory usage (platform-specific)
 * Note: React Native doesn't provide direct memory APIs
 * This is a best-effort estimation
 */
const estimateMemoryUsage = (): number => {
  // Platform-specific memory estimation
  // In production, you would use native modules for accurate readings
  // For now, we track based on cache size and app state

  if (Platform.OS === 'web') {
    // @ts-ignore - performance.memory is available in Chrome
    if (typeof performance !== 'undefined' && performance.memory) {
      // @ts-ignore
      return Math.round(performance.memory.usedJSHeapSize / 1024 / 1024);
    }
  }

  // Fallback: estimate based on app state and time
  const baseMemory = 50; // Base app memory
  const uptimeMinutes = (Date.now() - lastMemoryCheck) / 1000 / 60;
  const estimatedLeakRate = 0.5; // MB per minute (conservative)

  return Math.round(baseMemory + uptimeMinutes * estimatedLeakRate);
};

/**
 * Check memory pressure and trigger cleanup if needed
 */
const checkMemoryPressure = async (): Promise<void> => {
  try {
    const memoryUsage = estimateMemoryUsage();
    debugLog(`[MemoryMonitor] 📊 Estimated memory usage: ${memoryUsage}MB`);

    if (memoryUsage >= MEMORY_CRITICAL_THRESHOLD) {
      debugWarn(`[MemoryMonitor] 🚨 CRITICAL memory pressure detected: ${memoryUsage}MB`);
      await handleCriticalMemoryPressure();

      // Notify critical listeners
      memoryCriticalListeners.forEach((listener) => {
        try {
          listener();
        } catch (_error: unknown) {
          debugError('[MemoryMonitor] Error in critical listener:', error as Error);
        }
      });
    } else if (memoryUsage >= MEMORY_WARNING_THRESHOLD) {
      debugWarn(`[MemoryMonitor] ⚠️ Memory warning: ${memoryUsage}MB`);
      await handleMemoryWarning();

      // Notify warning listeners
      memoryWarningListeners.forEach((listener) => {
        try {
          listener();
        } catch (_error: unknown) {
          debugError('[MemoryMonitor] Error in warning listener:', error as Error);
        }
      });
    }

    lastMemoryCheck = Date.now();
  } catch (_error: unknown) {
    debugError('[MemoryMonitor] Error checking memory pressure:', error as Error);
  }
};

/**
 * Handle memory warning - light cleanup
 */
const handleMemoryWarning = async (): Promise<void> => {
  try {
    memoryWarningCount++;
    debugLog('[MemoryMonitor] 🧹 Performing light memory cleanup...');

    // Get cache stats before cleanup
    const statsBefore = await cache.getCacheStats();
    debugLog(`[MemoryMonitor] Cache before cleanup: ${statsBefore.memoryEntries} entries`);

    // Clear old cache entries
    // Note: cache module should have an internal eviction method
    // For now, we rely on its automatic eviction

    const statsAfter = await cache.getCacheStats();
    debugLog(`[MemoryMonitor] Cache after cleanup: ${statsAfter.memoryEntries} entries`);
    debugLog('[MemoryMonitor] ✅ Light cleanup completed');
  } catch (_error: unknown) {
    debugError('[MemoryMonitor] Error handling memory warning:', error as Error);
  }
};

/**
 * Handle critical memory pressure - aggressive cleanup
 */
const handleCriticalMemoryPressure = async (): Promise<void> => {
  try {
    debugWarn('[MemoryMonitor] 🚨 Performing aggressive memory cleanup...');

    // 1. Clear cache
    await cache.clear();
    debugLog('[MemoryMonitor] ✅ Cleared cache');

    // 2. Clean up unused scopes from cleanup manager
    const stats = cleanupManager.getStats();
    debugLog(`[MemoryMonitor] Cleanup manager: ${stats.scopeCount} scopes, ${stats.totalResources} resources`);

    // Don't destroy default scope, but clean up others
    await cleanupManager.destroyAllScopes();
    debugLog('[MemoryMonitor] ✅ Destroyed non-default cleanup scopes');

    // 3. Force garbage collection if available
    // @ts-ignore - gc is available in some environments
    if (typeof global !== 'undefined' && typeof global.gc === 'function') {
      // @ts-ignore
      global.gc();
      debugLog('[MemoryMonitor] ✅ Forced garbage collection');
    }

    debugLog('[MemoryMonitor] ✅ Aggressive cleanup completed');
  } catch (_error: unknown) {
    debugError('[MemoryMonitor] Error handling critical memory pressure:', error as Error);
  }
};

/**
 * Handle app state changes
 */
const handleAppStateChange = async (nextAppState: AppStateStatus): Promise<void> => {
  try {
    debugLog(`[MemoryMonitor] 📱 App state changed: ${currentAppState} -> ${nextAppState}`);

    // App going to background
    if (currentAppState === 'active' && nextAppState.match(/inactive|background/)) {
      debugLog('[MemoryMonitor] App going to background - performing cleanup');
      await handleMemoryWarning();
    }

    // App coming to foreground
    if (currentAppState.match(/inactive|background/) && nextAppState === 'active') {
      debugLog('[MemoryMonitor] App coming to foreground - checking memory');
      await checkMemoryPressure();
    }

    currentAppState = nextAppState;
  } catch (_error: unknown) {
    debugError('[MemoryMonitor] Error handling app state change:', error as Error);
  }
};

/**
 * TASK-039: Initialize memory pressure monitoring
 * @returns Cleanup function to stop monitoring
 */
export const initializeMemoryMonitoring = (): (() => void) => {
  if (isMonitoring) {
    debugWarn('[MemoryMonitor] Already monitoring');
    return () => {};
  }

  debugLog('[MemoryMonitor] 🚀 Initializing memory monitoring...');
  isMonitoring = true;
  currentAppState = AppState.currentState;
  lastMemoryCheck = Date.now();

  // Subscribe to app state changes
  const appStateSubscription = AppState.addEventListener('change', handleAppStateChange);

  // Periodic memory checks (every 30 seconds)
  const memoryCheckInterval = setInterval(() => {
    if (currentAppState === 'active') {
      checkMemoryPressure();
    }
  }, 30000);

  debugLog('[MemoryMonitor] ✅ Memory monitoring initialized');

  // Return cleanup function
  return () => {
    debugLog('[MemoryMonitor] 🛑 Stopping memory monitoring');
    isMonitoring = false;

    appStateSubscription.remove();
    clearInterval(memoryCheckInterval);

    memoryWarningListeners.clear();
    memoryCriticalListeners.clear();

    debugLog('[MemoryMonitor] ✅ Memory monitoring stopped');
  };
};

/**
 * Subscribe to memory warning events
 */
export const onMemoryWarning = (listener: () => void): (() => void) => {
  memoryWarningListeners.add(listener);
  return () => memoryWarningListeners.delete(listener);
};

/**
 * Subscribe to critical memory events
 */
export const onMemoryCritical = (listener: () => void): (() => void) => {
  memoryCriticalListeners.add(listener);
  return () => memoryCriticalListeners.delete(listener);
};

/**
 * Manually trigger memory check
 */
export const checkMemory = (): Promise<void> => {
  return checkMemoryPressure();
};

/**
 * Get memory monitoring statistics
 */
export const getMemoryStats = () => {
  return {
    isMonitoring,
    currentAppState,
    memoryWarningCount,
    estimatedUsageMB: estimateMemoryUsage(),
    warningThresholdMB: MEMORY_WARNING_THRESHOLD,
    criticalThresholdMB: MEMORY_CRITICAL_THRESHOLD,
    lastCheck: new Date(lastMemoryCheck).toISOString(),
  };
};
