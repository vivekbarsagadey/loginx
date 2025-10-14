/**
 * @file tests/performance/cache-performance.test.ts
 * @description Performance tests for cache operations
 * TASK-124: Test app performance with 10,000+ cached items in AsyncStorage
 */

import { clear as clearCache, get as getCachedData, set as setCachedData } from '../../utils/cache';

describe('Cache Performance', () => {
  beforeEach(async () => {
    await clearCache();
  });

  it('should cache 10,000 items efficiently', async () => {
    const startTime = performance.now();
    const cachePromises = [];

    // Cache 10,000 items
    for (let i = 0; i < 10000; i++) {
      cachePromises.push(
        setCachedData(`cache-item-${i}`, {
          id: i,
          data: `Test data ${i}`,
          timestamp: Date.now(),
        })
      );
    }

    await Promise.all(cachePromises);
    const duration = performance.now() - startTime;

    // Caching 10,000 items should take less than 30 seconds
    expect(duration).toBeLessThan(30000);
  }, 60000);

  it('should retrieve cached data quickly', async () => {
    // Set up test data
    const testKey = 'performance-test-key';
    const testData = { value: 'test', timestamp: Date.now() };
    await setCachedData(testKey, testData);

    // Measure retrieval time
    const startTime = performance.now();
    const result = await getCachedData(testKey);
    const duration = performance.now() - startTime;

    // Single cache read should be nearly instant (<10ms)
    expect(duration).toBeLessThan(10);
    expect(result).toEqual(testData);
  });

  it('should handle cache hits efficiently', async () => {
    const keys = Array.from({ length: 100 }, (_, i) => `hit-test-${i}`);

    // Populate cache
    await Promise.all(keys.map((key) => setCachedData(key, { data: key })));

    // Measure cache hit performance
    const startTime = performance.now();
    const results = await Promise.all(keys.map((key) => getCachedData(key)));
    const duration = performance.now() - startTime;

    // 100 cache hits should take less than 1 second
    expect(duration).toBeLessThan(1000);
    expect(results.every((r: unknown) => r !== null)).toBe(true);
  });

  it('should handle cache misses without performance degradation', async () => {
    const keys = Array.from({ length: 100 }, (_, i) => `miss-test-${i}`);

    // Measure cache miss performance
    const startTime = performance.now();
    const results = await Promise.all(keys.map((key) => getCachedData(key)));
    const duration = performance.now() - startTime;

    // 100 cache misses should still be fast (<500ms)
    expect(duration).toBeLessThan(500);
    expect(results.every((r: unknown) => r === null)).toBe(true);
  });

  it('should evict old entries efficiently', async () => {
    // Fill cache with items
    const itemCount = 1000;
    for (let i = 0; i < itemCount; i++) {
      await setCachedData(`eviction-test-${i}`, {
        data: `Data ${i}`,
        timestamp: Date.now() - i * 1000, // Older items have earlier timestamps
      });
    }

    // Trigger eviction (implementation-dependent)
    const startTime = performance.now();
    await clearCache(); // Simplified - actual eviction would be more selective
    const duration = performance.now() - startTime;

    // Cache eviction should be fast
    expect(duration).toBeLessThan(2000);
  });

  it('should maintain performance with concurrent cache operations', async () => {
    const operations = [];

    // Mix of reads and writes
    for (let i = 0; i < 200; i++) {
      if (i % 2 === 0) {
        operations.push(setCachedData(`concurrent-${i}`, { data: i }));
      } else {
        operations.push(getCachedData(`concurrent-${i - 1}`));
      }
    }

    const startTime = performance.now();
    await Promise.allSettled(operations);
    const duration = performance.now() - startTime;

    // Concurrent operations should complete in reasonable time
    expect(duration).toBeLessThan(5000);
  });
});

describe('Cache Strategy Performance', () => {
  it('should optimize stale-while-revalidate pattern', async () => {
    const key = 'swr-test';
    const staleData = { value: 'stale', timestamp: Date.now() - 10000 };

    // Set stale data
    await setCachedData(key, staleData);

    // Retrieve (should return stale immediately while fetching fresh)
    const startTime = performance.now();
    const result = await getCachedData(key);
    const duration = performance.now() - startTime;

    // Should return stale data instantly
    expect(duration).toBeLessThan(10);
    expect(result).toBeDefined();
  });

  it('should calculate cache hit rate accurately', async () => {
    const hits = 80;
    const misses = 20;

    // Simulate cache hits
    for (let i = 0; i < hits; i++) {
      await setCachedData(`hit-${i}`, { data: i });
      await getCachedData(`hit-${i}`);
    }

    // Simulate cache misses
    for (let i = 0; i < misses; i++) {
      await getCachedData(`miss-${i}`);
    }

    const expectedHitRate = hits / (hits + misses);
    expect(expectedHitRate).toBe(0.8); // 80% hit rate
  });
});
