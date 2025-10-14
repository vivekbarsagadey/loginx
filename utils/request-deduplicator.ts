/**
 * TASK-049: Request Deduplicator
 * Singleton to track and coalescence in-flight requests
 * Prevents cache stampede and duplicate network calls
 */

import { debugLog, debugWarn } from './debug';

interface PendingRequest<T> {
  promise: Promise<T>;
  timestamp: number;
  requesters: number;
}

/**
 * Request Deduplicator Class
 * Manages in-flight requests and ensures only one request per key at a time
 */
class RequestDeduplicator {
  private pendingRequests: Map<string, PendingRequest<unknown>>;
  private requestStats: Map<string, { hits: number; misses: number }>;

  constructor() {
    this.pendingRequests = new Map();
    this.requestStats = new Map();
  }

  /**
   * Execute a request with deduplication
   * If a request for this key is already in flight, return the existing promise
   * Otherwise, execute the request and store the promise
   */
  async deduplicate<T>(key: string, requestFn: () => Promise<T>, options: { timeout?: number } = {}): Promise<T> {
    // Check if request is already in flight
    if (this.pendingRequests.has(key)) {
      const pending = this.pendingRequests.get(key) as PendingRequest<T>;
      debugLog(`[RequestDeduplicator] 🔄 Coalescing request: ${key} (${pending.requesters} requesters)`);

      // Increment requester count
      pending.requesters++;

      // Update stats
      const stats = this.requestStats.get(key) || { hits: 0, misses: 0 };
      stats.hits++;
      this.requestStats.set(key, stats);

      return pending.promise as Promise<T>;
    }

    // No pending request - create new one
    debugLog(`[RequestDeduplicator] 🆕 New request: ${key}`);

    // Update stats
    const stats = this.requestStats.get(key) || { hits: 0, misses: 0 };
    stats.misses++;
    this.requestStats.set(key, stats);

    // Create promise with timeout if specified
    let timeoutId: NodeJS.Timeout | undefined;
    const requestPromise = options.timeout
      ? Promise.race([
          requestFn(),
          new Promise<T>((_, reject) => {
            timeoutId = setTimeout(() => reject(new Error(`Request timeout: ${key}`)), options.timeout) as unknown as NodeJS.Timeout;
          }),
        ])
      : requestFn();

    // Store pending request
    const pending: PendingRequest<T> = {
      promise: requestPromise,
      timestamp: Date.now(),
      requesters: 1,
    };
    this.pendingRequests.set(key, pending as PendingRequest<unknown>);

    try {
      const result = await requestPromise;
      debugLog(`[RequestDeduplicator] ✅ Request completed: ${key}`);
      return result;
    } catch (error) {
      debugWarn(`[RequestDeduplicator] ❌ Request failed: ${key}`, error);
      throw error;
    } finally {
      // Clean up
      if (timeoutId) clearTimeout(timeoutId);
      this.pendingRequests.delete(key);
      debugLog(`[RequestDeduplicator] 🧹 Cleaned up: ${key}`);
    }
  }

  /**
   * Check if a request is currently in flight
   */
  isPending(key: string): boolean {
    return this.pendingRequests.has(key);
  }

  /**
   * Cancel a pending request
   */
  cancel(key: string): void {
    if (this.pendingRequests.has(key)) {
      debugLog(`[RequestDeduplicator] 🚫 Cancelled request: ${key}`);
      this.pendingRequests.delete(key);
    }
  }

  /**
   * Cancel all pending requests
   */
  cancelAll(): void {
    debugLog(`[RequestDeduplicator] 🚫 Cancelling all ${this.pendingRequests.size} pending requests`);
    this.pendingRequests.clear();
  }

  /**
   * Get statistics for a specific key
   */
  getStats(key: string): { hits: number; misses: number; hitRate: number } | null {
    const stats = this.requestStats.get(key);
    if (!stats) return null;

    const total = stats.hits + stats.misses;
    const hitRate = total > 0 ? stats.hits / total : 0;

    return {
      hits: stats.hits,
      misses: stats.misses,
      hitRate,
    };
  }

  /**
   * Get all statistics
   */
  getAllStats(): Map<string, { hits: number; misses: number; hitRate: number }> {
    const allStats = new Map<string, { hits: number; misses: number; hitRate: number }>();

    for (const [key, stats] of this.requestStats.entries()) {
      const total = stats.hits + stats.misses;
      const hitRate = total > 0 ? stats.hits / total : 0;
      allStats.set(key, { ...stats, hitRate });
    }

    return allStats;
  }

  /**
   * Get current state
   */
  getState(): {
    pendingCount: number;
    pendingKeys: string[];
    totalHits: number;
    totalMisses: number;
    overallHitRate: number;
  } {
    let totalHits = 0;
    let totalMisses = 0;

    for (const stats of this.requestStats.values()) {
      totalHits += stats.hits;
      totalMisses += stats.misses;
    }

    const total = totalHits + totalMisses;
    const overallHitRate = total > 0 ? totalHits / total : 0;

    return {
      pendingCount: this.pendingRequests.size,
      pendingKeys: Array.from(this.pendingRequests.keys()),
      totalHits,
      totalMisses,
      overallHitRate,
    };
  }

  /**
   * Clear statistics
   */
  clearStats(): void {
    this.requestStats.clear();
    debugLog('[RequestDeduplicator] 📊 Statistics cleared');
  }

  /**
   * Clean up old pending requests (safety mechanism)
   * Removes requests that have been pending for more than maxAge
   */
  cleanupStale(maxAge: number = 60000): void {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, pending] of this.pendingRequests.entries()) {
      if (now - pending.timestamp > maxAge) {
        this.pendingRequests.delete(key);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      debugWarn(`[RequestDeduplicator] 🧹 Cleaned up ${cleaned} stale requests`);
    }
  }
}

// Singleton instance
const requestDeduplicator = new RequestDeduplicator();

// Auto cleanup every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(
    () => {
      requestDeduplicator.cleanupStale();
    },
    5 * 60 * 1000
  );
}

export { requestDeduplicator };
export type { PendingRequest };
