/**
 * Navigation Error Handler
 * Provides safe navigation with error handling and fallbacks
 */

import { router } from 'expo-router';
// Note: Alert.alert replaced with themed useAlert hook in components
// This utility provides the navigation logic, but dialogs should be shown via useAlert
import { showError } from './error';

interface NavigationOptions {
  pathname: string;
  params?: Record<string, string>;
  onError?: () => void;
  fallbackRoute?: string;
}

/**
 * Safe navigation with error handling
 * Catches navigation errors and provides fallback routes
 */
export function safeNavigate(options: NavigationOptions): void {
  const { pathname, params, onError, fallbackRoute } = options;

  try {
    if (params) {
      router.push({ pathname, params } as never);
    } else {
      router.push(pathname as never);
    }
  } catch (error: unknown) {
    // Try fallback route if provided
    if (fallbackRoute) {
      try {
        router.push(fallbackRoute as never);
        return;
      } catch (fallbackError) {
        // Fallback failed - proceed to error handler
      }
    }

    // Call custom error handler if provided
    if (onError) {
      onError();
    } else {
      // Default error handling
      showError(new Error('Navigation failed. Please try again or restart the app.'));
    }
  }
}

/**
 * Safe replace navigation (no back history)
 */
export function safeReplace(options: NavigationOptions): void {
  const { pathname, params, onError, fallbackRoute } = options;

  try {
    if (params) {
      router.replace({ pathname, params } as never);
    } else {
      router.replace(pathname as never);
    }
  } catch (error: unknown) {
    // Try fallback route if provided
    if (fallbackRoute) {
      try {
        router.replace(fallbackRoute as never);
        return;
      } catch (fallbackError) {
        // Fallback failed - proceed to error handler
      }
    }

    // Call custom error handler if provided
    if (onError) {
      onError();
    } else {
      showError(new Error('Navigation failed. Please try again or restart the app.'));
    }
  }
}

/**
 * Safe back navigation with confirmation
 */
/**
 * Safe back navigation with confirmation
 * @param options.confirmMessage - Optional confirmation message
 * @param options.onCancel - Optional cancel callback
 * @param options.showConfirm - Optional callback to show confirmation dialog (use useAlert in component)
 */
export function safeBack(options?: {
  confirmMessage?: string;
  onCancel?: () => void;
  showConfirm?: (config: { title: string; message: string; onConfirm: () => void; onCancel?: () => void }) => void;
}): void {
  const { confirmMessage, onCancel, showConfirm } = options || {};

  try {
    if (confirmMessage && showConfirm) {
      // Use provided showConfirm callback (should be useAlert from component)
      showConfirm({
        title: 'Go Back?',
        message: confirmMessage,
        onConfirm: () => {
          try {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace('/(tabs)/' as never);
            }
          } catch (error: unknown) {
            showError(new Error('Cannot go back. Try closing the app.'));
          }
        },
        onCancel: onCancel,
      });
    } else {
      if (router.canGoBack()) {
        router.back();
      } else {
        // If can't go back, navigate to home
        router.replace('/(tabs)/' as never);
      }
    }
  } catch (error: unknown) {
    showError(new Error('Navigation error. Please restart the app.'));
  }
}

/**
 * Check if a route exists and is valid
 */
export function isValidRoute(pathname: string): boolean {
  try {
    // Basic validation - check if route starts with /
    if (!pathname.startsWith('/')) {
      return false;
    }

    // Additional validation logic can be added here
    return true;
  } catch (error: unknown) {
    return false;
  }
}
