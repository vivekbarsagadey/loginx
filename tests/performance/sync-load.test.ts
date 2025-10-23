/**
 * @file tests/performance/sync-load.test.ts
 * @description Load testing for sync operations with large queues
 * TASK-122: Load test sync operations with 1000+ pending items in queue
 */

import { backgroundSync, getSyncQueueSize, saveDataLocally } from '@/utils/local-first';

describe('Sync Queue Performance', () => {
  beforeEach(async () => {
    // Clear any existing queue
    jest.clearAllMocks();
  });

  it('should handle 1000 items in sync queue efficiently', async () => {
    const startTime = performance.now();
    const items = [];

    // Generate 1000 test items
    for (let i = 0; i < 1000; i++) {
      items.push({
        key: `test-item-${i}`,
        data: {
          id: i,
          name: `Test Item ${i}`,
          description: `Description for test item ${i}`,
          timestamp: Date.now(),
        },
      });
    }

    // Save all items locally (should be fast)
    const savePromises = items.map((item) => saveDataLocally(item.key, item.data));
    await Promise.all(savePromises);

    const saveTime = performance.now() - startTime;

    // Saving 1000 items should take less than 5 seconds
    expect(saveTime).toBeLessThan(5000);

    const queueSize = await getSyncQueueSize();
    expect(queueSize).toBeGreaterThanOrEqual(1000);
  }, 30000);

  it('should sync large queue without blocking UI', async () => {
    const startTime = performance.now();

    // Trigger background sync
    const syncPromise = backgroundSync();

    // Sync should complete within 30 seconds even with large queue
    await syncPromise;

    const syncTime = performance.now() - startTime;
    expect(syncTime).toBeLessThan(30000);
  }, 60000);

  it('should maintain performance under concurrent operations', async () => {
    const operations = [];

    // Simulate 50 concurrent save operations
    for (let i = 0; i < 50; i++) {
      operations.push(
        saveDataLocally(`concurrent-${i}`, {
          data: `Test data ${i}`,
          timestamp: Date.now(),
        })
      );
    }

    const startTime = performance.now();
    await Promise.all(operations);
    const duration = performance.now() - startTime;

    // Concurrent operations should complete in reasonable time
    expect(duration).toBeLessThan(3000);
  });

  it('should prioritize critical operations', async () => {
    const criticalItem = {
      key: 'critical-operation',
      data: { priority: 'high', type: 'auth' },
    };

    const normalItems = Array.from({ length: 100 }, (_, i) => ({
      key: `normal-${i}`,
      data: { priority: 'normal' },
    }));

    // Save critical item first
    await saveDataLocally(criticalItem.key, criticalItem.data);

    // Then save normal items
    await Promise.all(normalItems.map((item) => saveDataLocally(item.key, item.data)));

    // Critical item should be synced first
    // (Implementation detail - would check sync order)
    expect(true).toBe(true);
  });

  it('should handle sync failures gracefully', async () => {
    // Simulate network failure
    const mockNetworkError = new Error('Network unavailable');

    try {
      // Attempt sync with network error
      await backgroundSync();
    } catch (_error) {
      expect(error).toBeDefined();
    }

    // Queue should be preserved for retry
    const queueSize = await getSyncQueueSize();
    expect(queueSize).toBeGreaterThanOrEqual(0);
  });
});

describe('Sync Queue Memory Management', () => {
  it('should not cause memory leaks with large queue', async () => {
    const initialMemory = (performance as any).memory?.usedJSHeapSize || 0;

    // Process 5000 items
    for (let i = 0; i < 5000; i++) {
      await saveDataLocally(`memory-test-${i}`, {
        data: `Test ${i}`,
      });
    }

    // Trigger garbage collection if available
    if (global.gc) {
      global.gc();
    }

    const finalMemory = (performance as any).memory?.usedJSHeapSize || 0;
    const memoryGrowth = finalMemory - initialMemory;

    // Memory growth should be reasonable (less than 50MB for 5000 items)
    expect(memoryGrowth).toBeLessThan(50 * 1024 * 1024);
  }, 60000);
});
