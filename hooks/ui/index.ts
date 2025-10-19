/**
 * UI & Interaction Hooks
 *
 * This module exports hooks for UI interactions and feedback:
 * - Dialog management
 * - Alert system
 * - Haptic feedback for actions and navigation
 * - Auto-focus management
 * - Form submission handling
 * - Click outside detection (React Native gestures)
 * - Long press with haptic feedback
 * - Keyboard state tracking
 */

export * from './use-alert';
export * from './use-auto-focus';
export * from './use-dialog';
export * from './use-form-submit';
export * from './use-haptic-action';
export * from './use-haptic-navigation';

// Enhanced UI interactions (Phase 5)
export * from './use-click-outside';
export * from './use-keyboard';
export * from './use-long-press';

