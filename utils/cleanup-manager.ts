/**
 * Cleanup Manager Utility
 * TASK-037: Centralized registry for managing subscriptions, timers, and event listeners
 * Prevents memory leaks by tracking and cleaning up resources systematically
 */

import { debugLog, debugWarn } from './debug';

/**
 * Types of cleanup resources we track
 */
type CleanupResource =
  | { type: 'subscription'; unsubscribe: () => void; id: string }
  | { type: 'timer'; timerId: ReturnType<typeof setTimeout>; id: string }
  | { type: 'interval'; intervalId: ReturnType<typeof setInterval>; id: string }
  | { type: 'listener'; remove: () => void; id: string }
  | { type: 'custom'; cleanup: () => void | Promise<void>; id: string };

/**
 * Cleanup scope - groups related resources for batch cleanup
 */
class CleanupScope {
  private resources: Map<string, CleanupResource> = new Map();
  private scopeName: string;
  private isDestroyed = false;

  constructor(scopeName: string) {
    this.scopeName = scopeName;
    debugLog(`[CleanupManager] 📦 Created scope: ${scopeName}`);
  }

  /**
   * Register a subscription for cleanup
   */
  registerSubscription(id: string, unsubscribe: () => void): void {
    if (this.isDestroyed) {
      debugWarn(`[CleanupManager] Cannot register to destroyed scope: ${this.scopeName}`);
      return;
    }

    this.resources.set(id, { type: 'subscription', unsubscribe, id });
    debugLog(`[CleanupManager] 📝 Registered subscription: ${id} in ${this.scopeName}`);
  }

  /**
   * Register a timer (setTimeout) for cleanup
   */
  registerTimer(id: string, timerId: ReturnType<typeof setTimeout>): void {
    if (this.isDestroyed) {
      debugWarn(`[CleanupManager] Cannot register to destroyed scope: ${this.scopeName}`);
      return;
    }

    this.resources.set(id, { type: 'timer', timerId, id });
    debugLog(`[CleanupManager] ⏱️ Registered timer: ${id} in ${this.scopeName}`);
  }

  /**
   * Register an interval (setInterval) for cleanup
   */
  registerInterval(id: string, intervalId: ReturnType<typeof setInterval>): void {
    if (this.isDestroyed) {
      debugWarn(`[CleanupManager] Cannot register to destroyed scope: ${this.scopeName}`);
      return;
    }

    this.resources.set(id, { type: 'interval', intervalId, id });
    debugLog(`[CleanupManager] 🔁 Registered interval: ${id} in ${this.scopeName}`);
  }

  /**
   * Register an event listener for cleanup
   */
  registerListener(id: string, remove: () => void): void {
    if (this.isDestroyed) {
      debugWarn(`[CleanupManager] Cannot register to destroyed scope: ${this.scopeName}`);
      return;
    }

    this.resources.set(id, { type: 'listener', remove, id });
    debugLog(`[CleanupManager] 👂 Registered listener: ${id} in ${this.scopeName}`);
  }

  /**
   * Register a custom cleanup function
   */
  registerCustom(id: string, cleanup: () => void | Promise<void>): void {
    if (this.isDestroyed) {
      debugWarn(`[CleanupManager] Cannot register to destroyed scope: ${this.scopeName}`);
      return;
    }

    this.resources.set(id, { type: 'custom', cleanup, id });
    debugLog(`[CleanupManager] 🛠️ Registered custom cleanup: ${id} in ${this.scopeName}`);
  }

  /**
   * Unregister a specific resource (when manually cleaned up)
   */
  unregister(id: string): boolean {
    const existed = this.resources.delete(id);
    if (existed) {
      debugLog(`[CleanupManager] ✅ Unregistered: ${id} from ${this.scopeName}`);
    }
    return existed;
  }

  /**
   * Get count of registered resources
   */
  getResourceCount(): number {
    return this.resources.size;
  }

  /**
   * Get list of resource IDs
   */
  getResourceIds(): string[] {
    return Array.from(this.resources.keys());
  }

  /**
   * Check if scope is destroyed
   */
  isDestroyed_(): boolean {
    return this.isDestroyed;
  }

  /**
   * Clean up all resources in this scope
   */
  async destroy(): Promise<void> {
    if (this.isDestroyed) {
      debugWarn(`[CleanupManager] Scope already destroyed: ${this.scopeName}`);
      return;
    }

    debugLog(`[CleanupManager] 🧹 Destroying scope: ${this.scopeName} (${this.resources.size} resources)`);

    const cleanupPromises: Promise<void>[] = [];

    for (const [id, resource] of this.resources.entries()) {
      try {
        switch (resource.type) {
          case 'subscription':
            resource.unsubscribe();
            debugLog(`[CleanupManager] ✅ Unsubscribed: ${id}`);
            break;

          case 'timer':
            clearTimeout(resource.timerId);
            debugLog(`[CleanupManager] ✅ Cleared timer: ${id}`);
            break;

          case 'interval':
            clearInterval(resource.intervalId);
            debugLog(`[CleanupManager] ✅ Cleared interval: ${id}`);
            break;

          case 'listener':
            resource.remove();
            debugLog(`[CleanupManager] ✅ Removed listener: ${id}`);
            break;

          case 'custom':
            const cleanupResult = resource.cleanup();
            if (cleanupResult instanceof Promise) {
              cleanupPromises.push(cleanupResult);
            }
            debugLog(`[CleanupManager] ✅ Executed custom cleanup: ${id}`);
            break;
        }
      } catch (_error: unknown) {
        debugWarn(`[CleanupManager] Error cleaning up ${id}:`, _error as Error);
      }
    }

    // Wait for all async cleanup operations
    if (cleanupPromises.length > 0) {
      await Promise.allSettled(cleanupPromises);
    }

    this.resources.clear();
    this.isDestroyed = true;

    debugLog(`[CleanupManager] ✅ Scope destroyed: ${this.scopeName}`);
  }
}

/**
 * Global cleanup manager singleton
 */
class CleanupManager {
  private scopes: Map<string, CleanupScope> = new Map();
  private defaultScope: CleanupScope;

  constructor() {
    this.defaultScope = new CleanupScope('default');
    this.scopes.set('default', this.defaultScope);
    debugLog('[CleanupManager] 🚀 Initialized with default scope');
  }

  /**
   * Create a new cleanup scope
   */
  createScope(scopeName: string): CleanupScope {
    if (this.scopes.has(scopeName)) {
      debugWarn(`[CleanupManager] Scope already exists: ${scopeName}`);
      return this.scopes.get(scopeName)!;
    }

    const scope = new CleanupScope(scopeName);
    this.scopes.set(scopeName, scope);
    return scope;
  }

  /**
   * Get an existing scope
   */
  getScope(scopeName = 'default'): CleanupScope | undefined {
    return this.scopes.get(scopeName);
  }

  /**
   * Get or create a scope
   */
  ensureScope(scopeName: string): CleanupScope {
    return this.scopes.get(scopeName) || this.createScope(scopeName);
  }

  /**
   * Destroy a specific scope and clean up its resources
   */
  async destroyScope(scopeName: string): Promise<void> {
    const scope = this.scopes.get(scopeName);
    if (!scope) {
      debugWarn(`[CleanupManager] Scope not found: ${scopeName}`);
      return;
    }

    await scope.destroy();
    this.scopes.delete(scopeName);
    debugLog(`[CleanupManager] 🗑️ Removed scope: ${scopeName}`);
  }

  /**
   * Destroy all scopes except default
   */
  async destroyAllScopes(): Promise<void> {
    debugLog(`[CleanupManager] 🧹 Destroying all scopes (${this.scopes.size})`);

    const destroyPromises: Promise<void>[] = [];

    for (const [scopeName, scope] of this.scopes.entries()) {
      if (scopeName !== 'default') {
        destroyPromises.push(scope.destroy());
      }
    }

    await Promise.allSettled(destroyPromises);

    // Clear all non-default scopes
    for (const scopeName of this.scopes.keys()) {
      if (scopeName !== 'default') {
        this.scopes.delete(scopeName);
      }
    }

    debugLog('[CleanupManager] ✅ All scopes destroyed');
  }

  /**
   * Get statistics about all scopes
   */
  getStats(): {
    scopeCount: number;
    totalResources: number;
    scopes: { name: string; resourceCount: number; resources: string[] }[];
  } {
    const scopeStats = Array.from(this.scopes.entries()).map(([name, scope]) => ({
      name,
      resourceCount: scope.getResourceCount(),
      resources: scope.getResourceIds(),
    }));

    return {
      scopeCount: this.scopes.size,
      totalResources: scopeStats.reduce((sum, s) => sum + s.resourceCount, 0),
      scopes: scopeStats,
    };
  }

  /**
   * Quick access to default scope for simple use cases
   */
  get default(): CleanupScope {
    return this.defaultScope;
  }
}

// Export singleton instance
export const cleanupManager = new CleanupManager();

// Export CleanupScope class for typing
export type { CleanupScope };

/**
 * Helper hook pattern for React components
 * Usage in useEffect:
 *
 * useEffect(() => {
 *   const scope = cleanupManager.createScope('MyComponent');
 *
 *   const unsubscribe = someSubscription();
 *   scope.registerSubscription('mySubscription', unsubscribe);
 *
 *   const timerId = setTimeout(() => {}, 1000);
 *   scope.registerTimer('myTimer', timerId);
 *
 *   return () => scope.destroy();
 * }, []);
 */

/**
 * Create a cleanup scope for a React component
 * Returns a cleanup function to use in useEffect return
 */
export const createCleanupScope = (scopeName: string): (() => Promise<void>) => {
  const scope = cleanupManager.createScope(scopeName);
  return () => scope.destroy();
};

/**
 * Helper to wrap a subscription with automatic registration
 */
export const withCleanup = <T extends () => void>(scopeName: string, id: string, subscribe: () => T): T => {
  const scope = cleanupManager.ensureScope(scopeName);
  const unsubscribe = subscribe();
  scope.registerSubscription(id, unsubscribe);
  return unsubscribe;
};
