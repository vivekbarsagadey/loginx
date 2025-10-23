/**
 * RE-AUTHENTICATION UTILITY
 * TASK-073: Biometric and password re-authentication service
 * TASK-079: Session timeout - require re-auth after 15 minutes
 * TASK-080: Store last authentication timestamp in secure storage
 *
 * Provides methods to:
 * - Require biometric authentication before sensitive operations
 * - Fallback to password input if biometric fails
 * - Track session timeout and require re-auth
 * - Store authentication timestamps securely
 */

import * as LocalAuthentication from 'expo-local-authentication';
import { debugError, debugLog, debugWarn } from './debug';
import { securelyGetItem, securelySetItem } from './secure-storage'; // Fixed import names

// TASK-079: Session timeout constant - 15 minutes
const SESSION_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes
const LAST_AUTH_TIMESTAMP_KEY = 'lastAuthTimestamp';

/**
 * Re-authentication result
 */
export interface ReAuthResult {
  success: boolean;
  method?: 'biometric' | 'password' | 'skip';
  error?: string;
}

/**
 * Re-authentication options
 */
export interface ReAuthOptions {
  /** Reason for re-authentication shown to user */
  reason?: string;
  /** Allow password fallback if biometric fails */
  allowPasswordFallback?: boolean;
  /** Skip re-auth if recently authenticated (within session timeout) */
  checkSessionTimeout?: boolean;
  /** Custom session timeout in milliseconds (overrides default) */
  customTimeout?: number;
}

/**
 * Check if biometric authentication is available on device
 * @returns Promise resolving to true if biometric is available and enrolled
 */
export const isBiometricAvailable = async (): Promise<boolean> => {
  try {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    if (!compatible) {
      debugLog('[ReAuth] Device does not support biometric authentication');
      return false;
    }

    const enrolled = await LocalAuthentication.isEnrolledAsync();
    if (!enrolled) {
      debugLog('[ReAuth] No biometric credentials enrolled on device');
      return false;
    }

    const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
    debugLog('[ReAuth] Supported biometric types:', types);

    return true;
  } catch (_error) {
    debugError('[ReAuth] Error checking biometric availability:', error);
    return false;
  }
};

/**
 * Get supported biometric types as human-readable string
 * @returns Promise resolving to string describing available biometric methods
 */
export const getBiometricType = async (): Promise<string> => {
  try {
    const types = await LocalAuthentication.supportedAuthenticationTypesAsync();

    if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
      return 'Face ID';
    }
    if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
      return 'Touch ID / Fingerprint';
    }
    if (types.includes(LocalAuthentication.AuthenticationType.IRIS)) {
      return 'Iris Recognition';
    }

    return 'Biometric Authentication';
  } catch (_error) {
    debugError('[ReAuth] Error getting biometric type:', error);
    return 'Biometric Authentication';
  }
};

/**
 * TASK-080: Get last authentication timestamp from secure storage
 * @returns Promise resolving to timestamp (0 if not found)
 */
export const getLastAuthTimestamp = async (): Promise<number> => {
  try {
    const timestamp = await securelyGetItem(LAST_AUTH_TIMESTAMP_KEY);
    return timestamp ? parseInt(timestamp, 10) : 0;
  } catch (_error) {
    debugError('[ReAuth] Error getting last auth timestamp:', error);
    return 0;
  }
};

/**
 * TASK-080: Save authentication timestamp to secure storage
 * @param timestamp - Timestamp to save (defaults to current time)
 */
export const saveAuthTimestamp = async (timestamp: number = Date.now()): Promise<void> => {
  try {
    await securelySetItem(LAST_AUTH_TIMESTAMP_KEY, timestamp.toString());
    debugLog('[ReAuth] Saved auth timestamp:', new Date(timestamp).toISOString());
  } catch (_error) {
    debugError('[ReAuth] Error saving auth timestamp:', error);
  }
};

/**
 * TASK-118: Synchronous session validity check for testing
 * @param lastAuthTimestamp - Timestamp of last authentication
 * @param timeout - Session timeout in milliseconds
 * @returns True if session is still valid, false if expired
 */
export const isSessionValid = (lastAuthTimestamp: number, timeout: number): boolean => {
  if (!lastAuthTimestamp) {
    return false;
  }
  const now = Date.now();
  const timeSinceAuth = now - lastAuthTimestamp;
  return timeSinceAuth < timeout;
};

/**
 * TASK-079: Check if session has timed out
 * @param customTimeout - Optional custom timeout in milliseconds
 * @returns Promise resolving to true if session has expired
 */
export const isSessionExpired = async (customTimeout?: number): Promise<boolean> => {
  try {
    const lastAuth = await getLastAuthTimestamp();
    if (lastAuth === 0) {
      debugLog('[ReAuth] No previous authentication found, session expired');
      return true;
    }

    const timeout = customTimeout || SESSION_TIMEOUT_MS;
    const elapsed = Date.now() - lastAuth;
    const expired = elapsed > timeout;

    debugLog('[ReAuth] Session check:', {
      lastAuth: new Date(lastAuth).toISOString(),
      elapsed: `${Math.floor(elapsed / 1000)}s`,
      timeout: `${Math.floor(timeout / 1000)}s`,
      expired,
    });

    return expired;
  } catch (_error) {
    debugError('[ReAuth] Error checking session expiration:', error);
    return true; // Fail safe - require re-auth on error
  }
};

/**
 * TASK-073: Prompt for biometric authentication
 * @param options - Re-authentication options
 * @returns Promise resolving to authentication result
 */
export const promptBiometric = async (options: ReAuthOptions = {}): Promise<ReAuthResult> => {
  try {
    const { reason = 'Please authenticate to continue', checkSessionTimeout = true, customTimeout } = options;

    // TASK-079: Check session timeout first
    if (checkSessionTimeout) {
      const expired = await isSessionExpired(customTimeout);
      if (!expired) {
        debugLog('[ReAuth] Session still valid, skipping re-authentication');
        return { success: true, method: 'skip' };
      }
    }

    // Check if biometric is available
    const available = await isBiometricAvailable();
    if (!available) {
      debugWarn('[ReAuth] Biometric not available, authentication failed');
      return {
        success: false,
        error: 'Biometric authentication is not available on this device',
      };
    }

    // Get biometric type for better UX
    const biometricType = await getBiometricType();
    debugLog('[ReAuth] Prompting for biometric authentication:', biometricType);

    // Prompt for biometric authentication
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: reason,
      cancelLabel: 'Cancel',
      disableDeviceFallback: false, // Allow device passcode as fallback
      fallbackLabel: 'Use Passcode',
    });

    if (result.success) {
      debugLog('[ReAuth] Biometric authentication successful');
      // TASK-080: Save authentication timestamp
      await saveAuthTimestamp();
      return { success: true, method: 'biometric' };
    }

    debugWarn('[ReAuth] Biometric authentication failed:', result.error);
    return {
      success: false,
      error: result.error || 'Biometric authentication failed',
    };
  } catch (_error) {
    debugError('[ReAuth] Biometric authentication error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Authentication failed',
    };
  }
};

/**
 * TASK-073: Main re-authentication function
 * Requires biometric authentication before sensitive operations
 *
 * @param options - Re-authentication options
 * @returns Promise resolving to authentication result
 *
 * @example
 * ```typescript
 * const result = await requireAuth({
 *   reason: 'Authenticate to change password',
 *   allowPasswordFallback: true,
 *   checkSessionTimeout: true,
 * });
 *
 * if (result.success) {
 *   // Proceed with sensitive operation
 * } else {
 *   // Show error or deny operation
 * }
 * ```
 */
export const requireAuth = async (options: ReAuthOptions = {}): Promise<ReAuthResult> => {
  try {
    debugLog('[ReAuth] Re-authentication required');

    // Try biometric authentication first
    const biometricResult = await promptBiometric(options);

    if (biometricResult.success) {
      return biometricResult;
    }

    // TASK-078: Fallback to password if enabled and biometric failed
    if (options.allowPasswordFallback) {
      debugLog('[ReAuth] Biometric failed, password fallback needed');
      // Password fallback is handled by the UI component (ReAuthPrompt)
      // This just indicates that password input is needed
      return {
        success: false,
        method: 'password',
        error: 'Biometric authentication failed. Password required.',
      };
    }

    return biometricResult;
  } catch (_error) {
    debugError('[ReAuth] Re-authentication error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Authentication failed',
    };
  }
};

/**
 * TASK-078: Verify password for fallback authentication
 * This is called by UI components when password fallback is needed
 *
 * @param password - User's password
 * @param userEmail - User's email for re-authentication
 * @returns Promise resolving to authentication result
 */
export const verifyPasswordFallback = async (password: string, userEmail: string): Promise<ReAuthResult> => {
  try {
    debugLog('[ReAuth] Verifying password fallback');

    // Dynamic import to avoid circular dependencies
    const { auth } = await import('@/firebase-config');
    const { EmailAuthProvider, reauthenticateWithCredential } = await import('firebase/auth');

    const user = auth.currentUser;
    if (!user || !userEmail) {
      throw new Error('No authenticated user found');
    }

    // Reauthenticate with password
    const credential = EmailAuthProvider.credential(userEmail, password);
    await reauthenticateWithCredential(user, credential);

    debugLog('[ReAuth] Password fallback authentication successful');

    // TASK-080: Save authentication timestamp
    await saveAuthTimestamp();

    return { success: true, method: 'password' };
  } catch (_error) {
    debugError('[ReAuth] Password fallback failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Password verification failed',
    };
  }
};

/**
 * Clear authentication timestamp (used on logout)
 */
export const clearAuthTimestamp = async (): Promise<void> => {
  try {
    await securelySetItem(LAST_AUTH_TIMESTAMP_KEY, '');
    debugLog('[ReAuth] Cleared auth timestamp');
  } catch (_error) {
    debugError('[ReAuth] Error clearing auth timestamp:', error);
  }
};

/**
 * Get time until session expires
 * @returns Milliseconds until session expires, or 0 if already expired
 */
export const getTimeUntilSessionExpires = async (): Promise<number> => {
  try {
    const lastAuth = await getLastAuthTimestamp();
    if (lastAuth === 0) {
      return 0;
    }

    const elapsed = Date.now() - lastAuth;
    const remaining = Math.max(0, SESSION_TIMEOUT_MS - elapsed);

    return remaining;
  } catch (_error) {
    debugError('[ReAuth] Error calculating session expiry:', error);
    return 0;
  }
};
