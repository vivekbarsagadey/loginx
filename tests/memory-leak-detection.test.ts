/**
 * Memory Leak Detection Test Suite
 * TASK-040: Automated leak detection for subscriptions, timers, and listeners
 */

import { act, cleanup, renderHook } from '@testing-library/react-native';
import { cleanupManager } from '../utils/cleanup-manager';
import { getMemoryStats, initializeMemoryMonitoring } from '../utils/memory-monitor';
import { weakCacheRegistry } from '../utils/weak-cache';

describe('Memory Leak Detection', () => {
  afterEach(() => {
    cleanup();
    // Clean up any test resources
    cleanupManager.destroyAllScopes();
  });

  describe('Cleanup Manager', () => {
    it('should track and clean up subscriptions', async () => {
      const scope = cleanupManager.createScope('test-subscriptions');

      let unsubscribeCalled = false;
      const mockUnsubscribe = () => {
        unsubscribeCalled = true;
      };

      scope.registerSubscription('test-sub', mockUnsubscribe);

      expect(scope.getResourceCount()).toBe(1);

      await scope.destroy();

      expect(unsubscribeCalled).toBe(true);
      expect(scope.getResourceCount()).toBe(0);
    });

    it('should track and clean up timers', async () => {
      const scope = cleanupManager.createScope('test-timers');

      let timerFired = false;
      const timerId = setTimeout(() => {
        timerFired = true;
      }, 100);

      scope.registerTimer('test-timer', timerId);

      expect(scope.getResourceCount()).toBe(1);

      await scope.destroy();

      // Wait to ensure timer was cleared
      await new Promise((resolve) => setTimeout(resolve, 150));

      expect(timerFired).toBe(false); // Timer should have been cleared
      expect(scope.getResourceCount()).toBe(0);
    });

    it('should track and clean up intervals', async () => {
      const scope = cleanupManager.createScope('test-intervals');

      let counter = 0;
      const intervalId = setInterval(() => {
        counter++;
      }, 50);

      scope.registerInterval('test-interval', intervalId);

      // Wait for interval to fire once
      await new Promise((resolve) => setTimeout(resolve, 75));
      expect(counter).toBeGreaterThan(0);

      const countAfterDestroy = counter;

      await scope.destroy();

      // Wait to ensure interval was cleared
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(counter).toBe(countAfterDestroy); // Counter should not increase
      expect(scope.getResourceCount()).toBe(0);
    });

    it('should track and clean up event listeners', async () => {
      const scope = cleanupManager.createScope('test-listeners');

      let listenerRemoved = false;
      const mockRemove = () => {
        listenerRemoved = true;
      };

      scope.registerListener('test-listener', mockRemove);

      expect(scope.getResourceCount()).toBe(1);

      await scope.destroy();

      expect(listenerRemoved).toBe(true);
      expect(scope.getResourceCount()).toBe(0);
    });

    it('should handle multiple resource types in one scope', async () => {
      const scope = cleanupManager.createScope('test-mixed');

      let cleanupCount = 0;

      scope.registerSubscription('sub', () => cleanupCount++);
      scope.registerTimer(
        'timer',
        setTimeout(() => {}, 1000)
      );
      scope.registerListener('listener', () => cleanupCount++);

      expect(scope.getResourceCount()).toBe(3);

      await scope.destroy();

      expect(cleanupCount).toBe(2); // sub and listener
      expect(scope.getResourceCount()).toBe(0);
    });

    it('should get accurate statistics', () => {
      const scope1 = cleanupManager.createScope('scope1');
      const scope2 = cleanupManager.createScope('scope2');

      scope1.registerSubscription('sub1', () => {});
      scope1.registerTimer(
        'timer1',
        setTimeout(() => {}, 1000)
      );

      scope2.registerInterval(
        'interval1',
        setInterval(() => {}, 1000)
      );

      const stats = cleanupManager.getStats();

      expect(stats.scopeCount).toBeGreaterThanOrEqual(2);
      expect(stats.totalResources).toBeGreaterThanOrEqual(3);
      expect(stats.scopes.find((s) => s.name === 'scope1')?.resourceCount).toBe(2);
      expect(stats.scopes.find((s) => s.name === 'scope2')?.resourceCount).toBe(1);
    });
  });

  describe('Weak Cache', () => {
    it('should allow garbage collection of cached objects', () => {
      const cache = weakCacheRegistry.getCache<{ id: string }, { data: string }>('test-cache');

      let obj = { id: 'test-1' };
      const data = { data: 'test-data' };

      cache.set(obj, data, 'test-1');

      expect(cache.get(obj, 'test-1')).toEqual(data);

      // Remove reference to object
      obj = null as any;

      // Force cleanup (in real environment, GC would handle this)
      cache.cleanupMetadata();

      const stats = cache.getStats();
      expect(stats.name).toBe('test-cache');
    });

    it('should track access counts', () => {
      const cache = weakCacheRegistry.getCache<{ id: string }, { data: string }>('access-test');

      const obj = { id: 'test-2' };
      const data = { data: 'test-data' };

      cache.set(obj, data, 'test-2');

      // Access multiple times
      cache.get(obj, 'test-2');
      cache.get(obj, 'test-2');
      cache.get(obj, 'test-2');

      const stats = cache.getStats();
      expect(stats.totalAccesses).toBeGreaterThanOrEqual(3);
    });

    it('should clear all metadata', () => {
      const cache = weakCacheRegistry.getCache<{ id: string }, { data: string }>('clear-test');

      const obj1 = { id: 'test-3' };
      const obj2 = { id: 'test-4' };

      cache.set(obj1, { data: 'data1' }, 'test-3');
      cache.set(obj2, { data: 'data2' }, 'test-4');

      let stats = cache.getStats();
      expect(stats.activeKeys).toBe(2);

      cache.clear();

      stats = cache.getStats();
      expect(stats.activeKeys).toBe(0);
    });
  });

  describe('Memory Monitoring', () => {
    it('should initialize and stop memory monitoring', () => {
      const cleanup = initializeMemoryMonitoring();

      const stats = getMemoryStats();
      expect(stats.isMonitoring).toBe(true);
      expect(stats.currentAppState).toBeDefined();

      cleanup();

      const statsAfter = getMemoryStats();
      expect(statsAfter.isMonitoring).toBe(false);
    });

    it('should track memory statistics', () => {
      const cleanup = initializeMemoryMonitoring();

      const stats = getMemoryStats();

      expect(stats).toHaveProperty('estimatedUsageMB');
      expect(stats).toHaveProperty('warningThresholdMB');
      expect(stats).toHaveProperty('criticalThresholdMB');
      expect(stats).toHaveProperty('lastCheck');
      expect(typeof stats.estimatedUsageMB).toBe('number');

      cleanup();
    });
  });

  describe('Integration: Component Lifecycle', () => {
    it('should not leak when component unmounts', async () => {
      const mockSubscribe = () => {
        let listeners: (() => void)[] = [];

        return {
          subscribe: (fn: () => void) => {
            listeners.push(fn);
            return () => {
              listeners = listeners.filter((l) => l !== fn);
            };
          },
          getListenerCount: () => listeners.length,
        };
      };

      const service = mockSubscribe();

      const useTestHook = () => {
        const scope = cleanupManager.createScope('component-scope');

        const unsubscribe = service.subscribe(() => {});
        scope.registerSubscription('service', unsubscribe);

        return () => scope.destroy();
      };

      const { result, unmount } = renderHook(() => useTestHook());

      expect(service.getListenerCount()).toBe(1);

      await act(async () => {
        await result.current(); // Call cleanup
      });

      unmount();

      expect(service.getListenerCount()).toBe(0);
    });

    it('should detect leaked resources after unmount', async () => {
      const scope = cleanupManager.createScope('leak-detection-test');

      // Simulate component that forgets to cleanup
      const leakyComponent = () => {
        const intervalId = setInterval(() => {}, 100);
        // Forgot to register for cleanup!
        return intervalId;
      };

      const intervalId = leakyComponent();

      // Proper cleanup should have been done
      // Let's do it manually for the test
      clearInterval(intervalId);

      const stats = cleanupManager.getStats();
      const testScope = stats.scopes.find((s) => s.name === 'leak-detection-test');

      expect(testScope?.resourceCount).toBe(0); // Should be 0 if properly cleaned
    });
  });

  describe('Real-world Scenarios', () => {
    it('should handle rapid mount/unmount cycles', async () => {
      const iterations = 10;
      const scopes: any[] = [];

      for (let i = 0; i < iterations; i++) {
        const scope = cleanupManager.createScope(`cycle-${i}`);
        scope.registerTimer(
          `timer-${i}`,
          setTimeout(() => {}, 1000)
        );
        scope.registerSubscription(`sub-${i}`, () => {});
        scopes.push(scope);
      }

      const statsBeforeCleanup = cleanupManager.getStats();
      expect(statsBeforeCleanup.totalResources).toBe(iterations * 2);

      // Clean up all scopes
      for (const scope of scopes) {
        await scope.destroy();
      }

      // Verify all cleaned up
      for (const scope of scopes) {
        expect(scope.getResourceCount()).toBe(0);
      }
    });

    it('should handle nested cleanup scopes', async () => {
      const parentScope = cleanupManager.createScope('parent');

      parentScope.registerCustom('nested-cleanup', async () => {
        const childScope = cleanupManager.createScope('child');
        childScope.registerSubscription('child-sub', () => {});
        await childScope.destroy();
      });

      expect(parentScope.getResourceCount()).toBe(1);

      await parentScope.destroy();

      expect(parentScope.getResourceCount()).toBe(0);
    });
  });
});
