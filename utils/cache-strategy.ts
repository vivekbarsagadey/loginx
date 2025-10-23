/**
 * TASK-052: Cache Strategy System
 * Configurable caching strategies for optimal performance
 * Supports: Stale-While-Revalidate, Cache-First, Network-First, Network-Only
 */

import * as cache from './cache';
import { debugError, debugLog } from './debug';

/**
 * Available cache strategies
 */
export enum CacheStrategy {
  /** Return cached data while fetching fresh data in background */
  STALE_WHILE_REVALIDATE = 'stale-while-revalidate',
  /** Return cached data if available, otherwise fetch from network */
  CACHE_FIRST = 'cache-first',
  /** Always fetch from network, fall back to cache on error */
  NETWORK_FIRST = 'network-first',
  /** Always fetch from network, never use cache */
  NETWORK_ONLY = 'network-only',
  /** Only use cache, never fetch from network */
  CACHE_ONLY = 'cache-only',
}

/**
 * Options for cache strategy execution
 */
export interface CacheStrategyOptions<T> {
  /** Cache key */
  key: string;
  /** Function to fetch fresh data */
  fetchFn: () => Promise<T>;
  /** Cache strategy to use */
  strategy?: CacheStrategy;
  /** Time-to-live for cache (ms) */
  ttl?: number;
  /** Maximum age to consider cache fresh (ms) */
  maxAge?: number;
  /** Callback when data is revalidated */
  onRevalidate?: (data: T) => void;
  /** Callback on error */
  onError?: (error: unknown) => void;
}

/**
 * Result from cache strategy execution
 */
export interface CacheStrategyResult<T> {
  /** The data */
  data: T | null;
  /** Whether data came from cache */
  fromCache: boolean;
  /** Whether data is stale */
  isStale: boolean;
  /** Whether revalidation is in progress */
  revalidating: boolean;
}

/**
 * Execute cache strategy: Stale-While-Revalidate
 * Returns cached data immediately (if available) and revalidates in background
 */
async function staleWhileRevalidate<T>({ key, fetchFn, ttl, maxAge = 60000, onRevalidate, onError }: CacheStrategyOptions<T>): Promise<CacheStrategyResult<T>> {
  // Try to get cached data
  const cachedData = await cache.get(key);
  const cacheAge = cachedData ? Date.now() - (cachedData as { timestamp?: number }).timestamp! : Infinity;
  const isStale = cacheAge > maxAge;

  debugLog(`[CacheStrategy] SWR: ${key}, cached: ${!!cachedData}, stale: ${isStale}`);

  // If we have cached data, return it immediately
  if (cachedData) {
    // Start background revalidation if stale
    if (isStale) {
      debugLog(`[CacheStrategy] SWR: Revalidating ${key} in background`);
      fetchFn()
        .then((freshData) => {
          cache.set(key, freshData).catch((_error) => {
            debugError('[CacheStrategy] Failed to update cache', _error);
          });
          onRevalidate?.(freshData);
        })
        .catch((_error) => {
          debugError('[CacheStrategy] Revalidation failed', _error);
          onError?.(_error);
        });
    }

    return {
      data: cachedData as T,
      fromCache: true,
      isStale,
      revalidating: isStale,
    };
  }

  // No cache - fetch from network
  try {
    const freshData = await fetchFn();
    await cache.set(key, freshData);
    return {
      data: freshData,
      fromCache: false,
      isStale: false,
      revalidating: false,
    };
  } catch (_error: unknown) {
    debugError('[CacheStrategy] SWR: Fetch failed', _error);
    onError?.(_error);
    throw _error;
  }
}

/**
 * Execute cache strategy: Cache-First
 * Returns cached data if available, otherwise fetches from network
 */
async function cacheFirst<T>({ key, fetchFn, ttl, maxAge, onError }: CacheStrategyOptions<T>): Promise<CacheStrategyResult<T>> {
  // Try cache first
  const cachedData = await cache.get(key);
  const cacheAge = cachedData ? Date.now() - (cachedData as { timestamp?: number }).timestamp! : Infinity;
  const isStale = maxAge ? cacheAge > maxAge : false;

  debugLog(`[CacheStrategy] Cache-First: ${key}, cached: ${!!cachedData}, stale: ${isStale}`);

  // Return cached data if fresh enough
  if (cachedData && (!maxAge || !isStale)) {
    return {
      data: cachedData as T,
      fromCache: true,
      isStale,
      revalidating: false,
    };
  }

  // Fetch from network
  try {
    const freshData = await fetchFn();
    await cache.set(key, freshData);
    return {
      data: freshData,
      fromCache: false,
      isStale: false,
      revalidating: false,
    };
  } catch (_error: unknown) {
    debugError('[CacheStrategy] Cache-First: Fetch failed', _error);
    onError?.(_error);

    // Fall back to stale cache if available
    if (cachedData) {
      debugLog('[CacheStrategy] Cache-First: Falling back to stale cache');
      return {
        data: cachedData as T,
        fromCache: true,
        isStale: true,
        revalidating: false,
      };
    }

    throw _error;
  }
}

/**
 * Execute cache strategy: Network-First
 * Always tries network first, falls back to cache on error
 */
async function networkFirst<T>({ key, fetchFn, ttl, onError }: CacheStrategyOptions<T>): Promise<CacheStrategyResult<T>> {
  debugLog(`[CacheStrategy] Network-First: ${key}`);

  try {
    // Try network first
    const freshData = await fetchFn();
    await cache.set(key, freshData);
    return {
      data: freshData,
      fromCache: false,
      isStale: false,
      revalidating: false,
    };
  } catch (_error: unknown) {
    debugError('[CacheStrategy] Network-First: Fetch failed', _error);
    onError?.(_error);

    // Fall back to cache
    const cachedData = await cache.get(key);
    if (cachedData) {
      debugLog('[CacheStrategy] Network-First: Falling back to cache');
      return {
        data: cachedData as T,
        fromCache: true,
        isStale: true,
        revalidating: false,
      };
    }

    throw _error;
  }
}

/**
 * Execute cache strategy: Network-Only
 * Always fetches from network, never uses cache
 */
async function networkOnly<T>({ fetchFn, onError }: CacheStrategyOptions<T>): Promise<CacheStrategyResult<T>> {
  debugLog('[CacheStrategy] Network-Only');

  try {
    const freshData = await fetchFn();
    return {
      data: freshData,
      fromCache: false,
      isStale: false,
      revalidating: false,
    };
  } catch (_error: unknown) {
    debugError('[CacheStrategy] Network-Only: Fetch failed', _error);
    onError?.(_error);
    throw _error;
  }
}

/**
 * Execute cache strategy: Cache-Only
 * Only returns cached data, never fetches from network
 */
async function cacheOnly<T>({ key }: CacheStrategyOptions<T>): Promise<CacheStrategyResult<T>> {
  debugLog(`[CacheStrategy] Cache-Only: ${key}`);

  const cachedData = await cache.get(key);
  const cacheAge = cachedData ? Date.now() - (cachedData as { timestamp?: number }).timestamp! : Infinity;

  return {
    data: (cachedData as T) || null,
    fromCache: true,
    isStale: cacheAge > 60000, // Consider stale after 1 minute
    revalidating: false,
  };
}

/**
 * Execute cache strategy
 * Main entry point for cache strategy execution
 */
export async function executeCacheStrategy<T>(options: CacheStrategyOptions<T>): Promise<CacheStrategyResult<T>> {
  const strategy = options.strategy || CacheStrategy.CACHE_FIRST;

  switch (strategy) {
    case CacheStrategy.STALE_WHILE_REVALIDATE:
      return staleWhileRevalidate(options);
    case CacheStrategy.CACHE_FIRST:
      return cacheFirst(options);
    case CacheStrategy.NETWORK_FIRST:
      return networkFirst(options);
    case CacheStrategy.NETWORK_ONLY:
      return networkOnly(options);
    case CacheStrategy.CACHE_ONLY:
      return cacheOnly(options);
    default:
      debugError(`[CacheStrategy] Unknown strategy: ${strategy}`);
      return cacheFirst(options);
  }
}

/**
 * Get recommended strategy based on data characteristics
 */
export function getRecommendedStrategy(options: {
  /** Is data critical for app functionality? */
  critical?: boolean;
  /** How frequently does data change? */
  changeFrequency?: 'high' | 'medium' | 'low';
  /** Is data expensive to fetch? */
  expensive?: boolean;
  /** Network quality */
  networkQuality?: 'good' | 'poor' | 'offline';
}): CacheStrategy {
  const { critical, changeFrequency, expensive, networkQuality } = options;

  // Offline: cache-only
  if (networkQuality === 'offline') {
    return CacheStrategy.CACHE_ONLY;
  }

  // Critical data with poor network: cache-first
  if (critical && networkQuality === 'poor') {
    return CacheStrategy.CACHE_FIRST;
  }

  // High change frequency: network-first
  if (changeFrequency === 'high') {
    return CacheStrategy.NETWORK_FIRST;
  }

  // Expensive + medium/low change: stale-while-revalidate
  if (expensive) {
    return CacheStrategy.STALE_WHILE_REVALIDATE;
  }

  // Default: cache-first
  return CacheStrategy.CACHE_FIRST;
}
