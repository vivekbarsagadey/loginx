/**
 * Device API Hooks
 *
 * This module exports hooks for device-level APIs and features:
 * - App state (foreground/background) tracking
 * - Battery level and charging status (optional: expo-battery)
 * - Geolocation with permission handling (optional: expo-location)
 * - Network connectivity status
 * - Accessibility features and settings
 * - Clipboard operations (copy/paste)
 * - Native share functionality
 */

export * from './use-accessibility';
export * from './use-app-state';
export * from './use-battery';
export * from './use-geolocation';
export * from './use-network-status';
export * from './use-clipboard';
export * from './use-share';

