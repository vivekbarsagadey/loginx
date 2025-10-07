/**
 * Adaptive Cache Manager
 * Dynamically adjusts cache size based on device capabilities and usage patterns
 */

import { debugError, debugLog, debugWarn } from './debug';
import { DeviceCapabilities, getDeviceCapabilities, getDeviceDescription } from './device-info';

interface CacheAdjustmentHistory {
  timestamp: number;
  oldSize: number;
  newSize: number;
  reason: string;
  hitRate: number;
}

class AdaptiveCacheManager {
  private currentCacheSize: number = 100; // Default fallback
  private deviceCapabilities: DeviceCapabilities | null = null;
  private cacheHitRateHistory: number[] = [];
  private memoryPressureLevel: 'low' | 'medium' | 'high' = 'low';
  private adjustmentHistory: CacheAdjustmentHistory[] = [];
  private monitoringInterval: ReturnType<typeof setInterval> | null = null;
  private isInitialized: boolean = false;

  // Configuration
  private readonly MIN_CACHE_SIZE = 30;
  private readonly MAX_CACHE_SIZE = 250;
  private readonly MONITORING_INTERVAL_MS = 60000; // 1 minute
  private readonly HISTORY_SIZE = 10; // Keep last 10 hit rate samples

  /**
   * Initialize adaptive cache manager
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      debugWarn('[AdaptiveCache] Already initialized');
      return;
    }

    try {
      // Get device capabilities
      this.deviceCapabilities = await getDeviceCapabilities();
      this.currentCacheSize = this.deviceCapabilities.recommendedCacheSize;

      debugLog('[AdaptiveCache] 🎯 Initialized adaptive cache manager');
      debugLog(`[AdaptiveCache] ${getDeviceDescription(this.deviceCapabilities)}`);

      // Start monitoring
      this.startMonitoring();

      this.isInitialized = true;
    } catch (error) {
      debugError('[AdaptiveCache] Failed to initialize, using default size:', error);
      this.currentCacheSize = 100; // Fallback to static default
      this.isInitialized = true; // Still mark as initialized to prevent retries
    }
  }

  /**
   * Get current cache size
   */
  getCurrentCacheSize(): number {
    return this.currentCacheSize;
  }

  /**
   * Get device capabilities
   */
  getDeviceCapabilities(): DeviceCapabilities | null {
    return this.deviceCapabilities;
  }

  /**
   * Check if manager is initialized
   */
  isReady(): boolean {
    return this.isInitialized;
  }

  /**
   * Manually update cache statistics for evaluation
   */
  updateCacheStats(hitRate: number): void {
    this.cacheHitRateHistory.push(hitRate);

    // Keep only recent history
    if (this.cacheHitRateHistory.length > this.HISTORY_SIZE) {
      this.cacheHitRateHistory.shift();
    }
  }

  /**
   * Set memory pressure level (can be called by external monitor)
   */
  setMemoryPressure(level: 'low' | 'medium' | 'high'): void {
    if (this.memoryPressureLevel !== level) {
      debugLog(`[AdaptiveCache] 🔥 Memory pressure changed: ${this.memoryPressureLevel} → ${level}`);
      this.memoryPressureLevel = level;

      // Immediate adjustment if high pressure
      if (level === 'high') {
        this.adjustCacheSize('high-memory-pressure');
      }
    }
  }

  /**
   * Start monitoring and automatic adjustment
   */
  private startMonitoring(): void {
    if (this.monitoringInterval) {
      return;
    }

    this.monitoringInterval = setInterval(() => {
      this.evaluateAndAdjust();
    }, this.MONITORING_INTERVAL_MS);

    debugLog('[AdaptiveCache] 📊 Started monitoring (interval: 1 minute)');
  }

  /**
   * Stop monitoring
   */
  stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
      debugLog('[AdaptiveCache] 🛑 Stopped monitoring');
    }
  }

  /**
   * Evaluate cache performance and adjust size if needed
   */
  private evaluateAndAdjust(): void {
    if (!this.deviceCapabilities) {
      return;
    }

    // Need at least 3 samples to make a decision
    if (this.cacheHitRateHistory.length < 3) {
      return;
    }

    // Calculate average hit rate
    const avgHitRate = this.cacheHitRateHistory.reduce((a, b) => a + b, 0) / this.cacheHitRateHistory.length;

    debugLog(`[AdaptiveCache] 📊 Evaluation: Hit rate ${avgHitRate.toFixed(1)}%, ` + `Size ${this.currentCacheSize}, Pressure ${this.memoryPressureLevel}`);

    // Decide if adjustment is needed
    let reason: string | null = null;

    // High memory pressure - reduce cache size
    if (this.memoryPressureLevel === 'high') {
      reason = 'high-memory-pressure';
    } else if (avgHitRate < 70 && this.memoryPressureLevel === 'low') {
      // Low hit rate - increase cache size (if memory allows)
      reason = 'low-hit-rate';
    } else if (avgHitRate > 95 && this.currentCacheSize > this.deviceCapabilities.recommendedCacheSize) {
      // Very high hit rate - can reduce cache size
      reason = 'very-high-hit-rate';
    }

    if (reason) {
      this.adjustCacheSize(reason, avgHitRate);
    }
  }

  /**
   * Adjust cache size based on reason
   */
  private adjustCacheSize(reason: string, avgHitRate?: number): void {
    if (!this.deviceCapabilities) {
      return;
    }

    const oldSize = this.currentCacheSize;
    let newSize = oldSize;
    const recommendedSize = this.deviceCapabilities.recommendedCacheSize;

    switch (reason) {
      case 'high-memory-pressure': {
        // Reduce by 20% or to recommended size, whichever is lower
        newSize = Math.max(Math.floor(oldSize * 0.8), Math.floor(recommendedSize * 0.7), this.MIN_CACHE_SIZE);
        break;
      }
      case 'low-hit-rate': {
        // Increase by 20% up to max or device recommendation
        newSize = Math.min(Math.ceil(oldSize * 1.2), recommendedSize, this.MAX_CACHE_SIZE);
        break;
      }
      case 'very-high-hit-rate': {
        // Can reduce by 10% if above recommended
        if (oldSize > recommendedSize) {
          newSize = Math.max(Math.floor(oldSize * 0.9), recommendedSize, this.MIN_CACHE_SIZE);
        }
        break;
      }
    }

    // Only adjust if change is significant (at least 5 entries)
    if (Math.abs(newSize - oldSize) < 5) {
      return;
    }

    // Apply adjustment
    this.currentCacheSize = newSize;

    // Record in history
    this.adjustmentHistory.push({
      timestamp: Date.now(),
      oldSize,
      newSize,
      reason,
      hitRate: avgHitRate || 0,
    });

    // Keep only recent history (last 20 adjustments)
    if (this.adjustmentHistory.length > 20) {
      this.adjustmentHistory.shift();
    }

    debugLog(`[AdaptiveCache] 🔄 Cache size adjusted: ${oldSize} → ${newSize} ` + `(reason: ${reason}, hit rate: ${avgHitRate?.toFixed(1) || 'N/A'}%)`);
  }

  /**
   * Get current statistics and status
   */
  getStats() {
    const avgHitRate = this.cacheHitRateHistory.length ? this.cacheHitRateHistory.reduce((a, b) => a + b, 0) / this.cacheHitRateHistory.length : 0;

    return {
      isInitialized: this.isInitialized,
      currentCacheSize: this.currentCacheSize,
      deviceCapabilities: this.deviceCapabilities,
      averageHitRate: avgHitRate,
      hitRateSamples: this.cacheHitRateHistory.length,
      memoryPressure: this.memoryPressureLevel,
      adjustmentHistory: this.adjustmentHistory.slice(-5), // Last 5 adjustments
      isMonitoring: this.monitoringInterval !== null,
    };
  }

  /**
   * Force reset to device-recommended size
   */
  resetToRecommended(): void {
    if (!this.deviceCapabilities) {
      debugWarn('[AdaptiveCache] Cannot reset - device capabilities not loaded');
      return;
    }

    const oldSize = this.currentCacheSize;
    const newSize = this.deviceCapabilities.recommendedCacheSize;

    if (oldSize !== newSize) {
      this.currentCacheSize = newSize;

      this.adjustmentHistory.push({
        timestamp: Date.now(),
        oldSize,
        newSize,
        reason: 'manual-reset',
        hitRate: 0,
      });

      debugLog(`[AdaptiveCache] 🔄 Reset to recommended: ${oldSize} → ${newSize}`);
    }
  }

  /**
   * Cleanup - stop monitoring
   */
  cleanup(): void {
    this.stopMonitoring();
    debugLog('[AdaptiveCache] 🧹 Cleaned up');
  }
}

// Export singleton instance
export const adaptiveCacheManager = new AdaptiveCacheManager();

/**
 * Initialize adaptive cache manager
 * Call this during app startup
 */
export const initializeAdaptiveCache = async (): Promise<void> => {
  await adaptiveCacheManager.initialize();
};

/**
 * Get current cache size
 */
export const getAdaptiveCacheSize = (): number => {
  return adaptiveCacheManager.getCurrentCacheSize();
};

/**
 * Update cache statistics for adaptive adjustments
 */
export const updateAdaptiveCacheStats = (hitRate: number): void => {
  adaptiveCacheManager.updateCacheStats(hitRate);
};

/**
 * Get adaptive cache statistics
 */
export const getAdaptiveCacheStats = () => {
  return adaptiveCacheManager.getStats();
};

/**
 * Cleanup adaptive cache manager
 */
export const cleanupAdaptiveCache = (): void => {
  adaptiveCacheManager.cleanup();
};
