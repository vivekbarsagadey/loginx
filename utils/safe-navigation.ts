/**
 * Navigation Error Handler
 * Provides safe navigation with error handling and fallbacks
 */

import { router } from 'expo-router';
import { Alert } from 'react-native';
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
  } catch (error) {
    console.error('[Navigation] Failed to navigate:', error);

    // Try fallback route if provided
    if (fallbackRoute) {
      try {
        router.push(fallbackRoute as never);
        return;
      } catch (fallbackError) {
        console.error('[Navigation] Fallback route also failed:', fallbackError);
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
  } catch (error) {
    console.error('[Navigation] Failed to replace:', error);

    // Try fallback route if provided
    if (fallbackRoute) {
      try {
        router.replace(fallbackRoute as never);
        return;
      } catch (fallbackError) {
        console.error('[Navigation] Fallback route also failed:', fallbackError);
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
export function safeBack(options?: { confirmMessage?: string; onCancel?: () => void }): void {
  const { confirmMessage, onCancel } = options || {};

  try {
    if (confirmMessage) {
      Alert.alert(
        'Go Back?',
        confirmMessage,
        [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: onCancel,
          },
          {
            text: 'Go Back',
            style: 'destructive',
            onPress: () => {
              try {
                if (router.canGoBack()) {
                  router.back();
                } else {
                  router.replace('/(tabs)/' as never);
                }
              } catch (error) {
                console.error('[Navigation] Failed to go back:', error);
                showError(new Error('Cannot go back. Try closing the app.'));
              }
            },
          },
        ],
        { cancelable: true }
      );
    } else {
      if (router.canGoBack()) {
        router.back();
      } else {
        // If can't go back, navigate to home
        router.replace('/(tabs)/' as never);
      }
    }
  } catch (error) {
    console.error('[Navigation] Failed to navigate back:', error);
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
      console.warn('[Navigation] Invalid route format:', pathname);
      return false;
    }

    // Additional validation logic can be added here
    return true;
  } catch (error) {
    console.error('[Navigation] Error validating route:', error);
    return false;
  }
}
