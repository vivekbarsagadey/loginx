/**
 * Custom Hooks Library - Main Export
 *
 * This file maintains 100% backward compatibility by re-exporting all hooks
 * from their new organized locations. All existing imports like:
 * `import { useAuth } from "@/hooks/use-auth-provider"`
 * will continue to work without any changes.
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

// Future categories (placeholders)
export * from './adapters';
export * from './storage';
export * from './timing';

