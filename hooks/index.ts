/**
 * Custom Hooks Library - Main Export
 *
 * This file maintains 100% backward compatibility by re-exporting all hooks
 * from their new organized locations. All existing imports like:
 * `import { useAuth } from "@/hooks/use-auth-provider"`
 * will continue to work without unknown changes.
 *
 * NEW: Category-based imports are also available:
 * `import { useAuth } from "@/hooks/auth"`
 *
 * Organized Categories:
 * - auth/       - Authentication & Security
 * - async/      - Async Operations
 * - ui/         - UI & Interactions
 * - layout/     - Responsive & Layout
 * - device/     - Device APIs
 * - theme/      - Theme & i18n
 * - lifecycle/  - Lifecycle & Performance
 * - utility/    - General Utilities
 * - storage/    - Storage & Persistence (Phase 3)
 * - timing/     - Timing & Scheduling (Phase 4)
 * - adapters/   - LoginX-Specific Integrations (Phase 8)
 */

// Re-export everything from category folders
export * from './async';
export * from './auth';
export * from './device';
export * from './layout';
export * from './lifecycle';
export * from './theme';
export * from './ui';
export * from './utility';

// Storage hooks (Phase 3 - COMPLETED)
export * from './storage';

// Timing & Scheduling hooks (Phase 4 - COMPLETED)
export * from './timing';

// Future categories will be exported here when implemented:
// export * from './adapters';  // Phase 8: LoginX-Specific Integrations
