/**
 * Secure Storage Utilities
 * Provides encrypted storage for sensitive data using Expo SecureStore
 */
import { SecureStorageKeys } from '@/constants';
import * as SecureStore from 'expo-secure-store';
import { debugError, debugLog, debugWarn } from './debug';

/**
 * Securely save a string value to encrypted storage
 * @param key - Storage key
 * @param value - Value to store
 * @returns Promise that resolves when value is saved
 */
export const securelySetItem = async (key: string, value: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(key, value);
    debugLog(`[SecureStore] Successfully saved item: ${key}`);
  } catch (error: unknown) {
    debugError(`[SecureStore] Failed to save item: ${key}`, error);
    throw new Error(`Failed to save secure item: ${key}`);
  }
};

/**
 * Securely retrieve a string value from encrypted storage
 * @param key - Storage key
 * @returns Promise that resolves to the stored value or null if not found
 */
export const securelyGetItem = async (key: string): Promise<string | null> => {
  try {
    const value = await SecureStore.getItemAsync(key);
    debugLog(`[SecureStore] Successfully retrieved item: ${key}`);
    return value;
  } catch (error: unknown) {
    debugError(`[SecureStore] Failed to retrieve item: ${key}`, error);
    return null;
  }
};

/**
 * Securely delete a value from encrypted storage
 * @param key - Storage key
 * @returns Promise that resolves when value is deleted
 */
export const securelyDeleteItem = async (key: string): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(key);
    debugLog(`[SecureStore] Successfully deleted item: ${key}`);
  } catch (error: unknown) {
    debugError(`[SecureStore] Failed to delete item: ${key}`, error);
    throw new Error(`Failed to delete secure item: ${key}`);
  }
};

/**
 * Securely save a boolean value
 * @param key - Storage key
 * @param value - Boolean value to store
 */
export const securelySetBoolean = async (key: string, value: boolean): Promise<void> => {
  await securelySetItem(key, value.toString());
};

/**
 * Securely retrieve a boolean value
 * @param key - Storage key
 * @param defaultValue - Default value if key doesn't exist
 * @returns Promise that resolves to the boolean value
 */
export const securelyGetBoolean = async (key: string, defaultValue = false): Promise<boolean> => {
  const value = await securelyGetItem(key);
  if (value === null) {
    return defaultValue;
  }
  return value === 'true';
};

/**
 * Securely save a number value
 * @param key - Storage key
 * @param value - Number value to store
 */
export const securelySetNumber = async (key: string, value: number): Promise<void> => {
  await securelySetItem(key, value.toString());
};

/**
 * Securely retrieve a number value
 * @param key - Storage key
 * @param defaultValue - Default value if key doesn't exist
 * @returns Promise that resolves to the number value
 */
export const securelyGetNumber = async (key: string, defaultValue = 0): Promise<number> => {
  const value = await securelyGetItem(key);
  if (value === null) {
    return defaultValue;
  }
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
};

/**
 * Securely save a JSON object
 * @param key - Storage key
 * @param value - Object to store
 */
export const securelySetObject = async <T>(key: string, value: T): Promise<void> => {
  await securelySetItem(key, JSON.stringify(value));
};

/**
 * Securely retrieve a JSON object
 * @param key - Storage key
 * @param defaultValue - Default value if key doesn't exist
 * @returns Promise that resolves to the parsed object
 */
export const securelyGetObject = async <T>(key: string, defaultValue: T | null = null): Promise<T | null> => {
  const value = await securelyGetItem(key);
  if (value === null) {
    return defaultValue;
  }

  try {
    return JSON.parse(value) as T;
  } catch (error: unknown) {
    debugError("[SecureStore] Error:", error);
    return defaultValue;
  }
};

/**
 * Check if SecureStore is available on this platform
 * @returns True if SecureStore is available
 */
export const isSecureStoreAvailable = async (): Promise<boolean> => {
  try {
    // Try to perform a simple operation to check availability
    await SecureStore.isAvailableAsync();
    return true;
  } catch (error: unknown) {
    debugWarn('[SecureStore] SecureStore is not available on this platform');
    return false;
  }
};

/**
 * Clear all secure storage (useful for logout or reset)
 * @param keys - Optional array of specific keys to clear. If not provided, clears all known keys
 */
export const clearSecureStorage = async (keys?: string[]): Promise<void> => {
  const keysToDelete = keys || Object.values(SecureStorageKeys);

  try {
    await Promise.all(keysToDelete.map((key) => securelyDeleteItem(key)));
    debugLog('[SecureStore] Successfully cleared secure storage');
  } catch (error: unknown) {
    debugError('[SecureStore] Failed to clear some secure storage items', error);
    throw new Error('Failed to clear secure storage');
  }
};

/**
 * Biometric preferences helper functions
 * SECURITY: Stores user credentials encrypted in SecureStore for biometric re-authentication
 */
export const BiometricStorage = {
  /**
   * Save biometric authentication preference
   * @param enabled - Whether biometric auth is enabled
   * @param type - Type of biometric auth (fingerprint, face, etc.)
   */
  setBiometricEnabled: async (enabled: boolean, type?: string): Promise<void> => {
    await securelySetBoolean(SecureStorageKeys.BIOMETRIC_ENABLED, enabled);
    if (type) {
      await securelySetItem(SecureStorageKeys.BIOMETRIC_TYPE, type);
    }
    debugLog(`[BiometricStorage] Biometric auth ${enabled ? 'enabled' : 'disabled'}${type ? ` with type: ${type}` : ''}`);
  },

  /**
   * Get biometric authentication preference
   * @returns Promise that resolves to biometric settings
   */
  getBiometricSettings: async (): Promise<{ enabled: boolean; type?: string }> => {
    const enabled = await securelyGetBoolean(SecureStorageKeys.BIOMETRIC_ENABLED);
    const type = await securelyGetItem(SecureStorageKeys.BIOMETRIC_TYPE);
    return { enabled, type: type || undefined };
  },

  /**
   * Clear biometric preferences
   */
  clearBiometricSettings: async (): Promise<void> => {
    await securelyDeleteItem(SecureStorageKeys.BIOMETRIC_ENABLED);
    await securelyDeleteItem(SecureStorageKeys.BIOMETRIC_TYPE);
    debugLog('[BiometricStorage] Cleared biometric settings');
  },

  /**
   * Save user email for biometric re-authentication
   * SECURITY: Email stored encrypted in SecureStore for Firebase re-auth
   * @param email - User's email address
   */
  setBiometricCredentials: async (email: string): Promise<void> => {
    await securelySetItem('biometric_user_email', email);
    debugLog('[BiometricStorage] Saved biometric credentials (email only)');
  },

  /**
   * Get saved email for biometric re-authentication
   * @returns Saved email or null
   */
  getBiometricCredentials: async (): Promise<{ email: string | null }> => {
    const email = await securelyGetItem('biometric_user_email');
    return { email };
  },

  /**
   * Clear biometric credentials
   * Called on logout or when biometric is disabled
   */
  clearBiometricCredentials: async (): Promise<void> => {
    await securelyDeleteItem('biometric_user_email');
    debugLog('[BiometricStorage] Cleared biometric credentials');
  },

  /**
   * Track failed biometric attempts for security
   * @param attempts - Number of failed attempts
   */
  setBiometricAttempts: async (attempts: number): Promise<void> => {
    await securelySetNumber('biometric_failed_attempts', attempts);
  },

  /**
   * Get failed biometric attempts count
   * @returns Number of failed attempts
   */
  getBiometricAttempts: async (): Promise<number> => {
    return await securelyGetNumber('biometric_failed_attempts', 0);
  },

  /**
   * Clear biometric attempts counter (after successful auth)
   */
  clearBiometricAttempts: async (): Promise<void> => {
    await securelyDeleteItem('biometric_failed_attempts');
  },
};

/**
 * Two-Factor Authentication storage helper functions
 */
export const TwoFactorStorage = {
  /**
   * Save 2FA enabled status
   * @param enabled - Whether 2FA is enabled
   */
  setTwoFactorEnabled: async (enabled: boolean): Promise<void> => {
    await securelySetBoolean(SecureStorageKeys.TWO_FA_ENABLED, enabled);
    debugLog(`[TwoFactorStorage] 2FA ${enabled ? 'enabled' : 'disabled'}`);
  },

  /**
   * Get 2FA enabled status
   * @returns Promise that resolves to whether 2FA is enabled
   */
  getTwoFactorEnabled: async (): Promise<boolean> => {
    return await securelyGetBoolean(SecureStorageKeys.TWO_FA_ENABLED);
  },

  /**
   * Save 2FA backup codes
   * @param codes - Array of backup codes
   */
  setBackupCodes: async (codes: string[]): Promise<void> => {
    await securelySetObject(SecureStorageKeys.TWO_FA_BACKUP_CODES, codes);
    debugLog(`[TwoFactorStorage] Saved ${codes.length} backup codes`);
  },

  /**
   * Get 2FA backup codes
   * @returns Promise that resolves to array of backup codes
   */
  getBackupCodes: async (): Promise<string[]> => {
    const codes = await securelyGetObject<string[]>(SecureStorageKeys.TWO_FA_BACKUP_CODES, []);
    return codes || [];
  },

  /**
   * Consume a backup code (removes it from the list)
   * @param code - The backup code that was consumed
   */
  consumeBackupCode: async (code: string): Promise<void> => {
    const codes = await TwoFactorStorage.getBackupCodes();
    const updatedCodes = codes.filter((c) => c !== code);
    await securelySetObject(SecureStorageKeys.TWO_FA_BACKUP_CODES, updatedCodes);
    debugLog(`[TwoFactorStorage] Consumed backup code, ${updatedCodes.length} codes remaining`);
  },

  /**
   * Clear all 2FA data
   */
  clearTwoFactorSettings: async (): Promise<void> => {
    await securelyDeleteItem(SecureStorageKeys.TWO_FA_ENABLED);
    await securelyDeleteItem(SecureStorageKeys.TWO_FA_BACKUP_CODES);
    debugLog('[TwoFactorStorage] Cleared 2FA settings');
  },
};

/**
 * Security preferences helper functions
 */
export const SecurityStorage = {
  /**
   * Save auto-lock settings
   * @param enabled - Whether auto-lock is enabled
   * @param timeout - Timeout in minutes
   */
  setAutoLock: async (enabled: boolean, timeout?: number): Promise<void> => {
    await securelySetBoolean(SecureStorageKeys.AUTO_LOCK_ENABLED, enabled);
    if (timeout !== undefined) {
      await securelySetNumber(SecureStorageKeys.AUTO_LOCK_TIMEOUT, timeout);
    }
    debugLog(`[SecurityStorage] Auto-lock ${enabled ? 'enabled' : 'disabled'}${timeout ? ` with ${timeout}min timeout` : ''}`);
  },

  /**
   * Get auto-lock settings
   * @returns Promise that resolves to auto-lock settings
   */
  getAutoLockSettings: async (): Promise<{ enabled: boolean; timeout: number }> => {
    const enabled = await securelyGetBoolean(SecureStorageKeys.AUTO_LOCK_ENABLED);
    const timeout = await securelyGetNumber(SecureStorageKeys.AUTO_LOCK_TIMEOUT, 5); // Default 5 minutes
    return { enabled, timeout };
  },

  /**
   * Save security notifications preference
   * @param enabled - Whether security notifications are enabled
   */
  setSecurityNotifications: async (enabled: boolean): Promise<void> => {
    await securelySetBoolean(SecureStorageKeys.SECURITY_NOTIFICATIONS, enabled);
    debugLog(`[SecurityStorage] Security notifications ${enabled ? 'enabled' : 'disabled'}`);
  },

  /**
   * Get security notifications preference
   * @returns Promise that resolves to whether security notifications are enabled
   */
  getSecurityNotifications: async (): Promise<boolean> => {
    return await securelyGetBoolean(SecureStorageKeys.SECURITY_NOTIFICATIONS, true); // Default enabled
  },

  /**
   * Track login attempts for security
   * @param attempts - Number of failed login attempts
   */
  setLoginAttempts: async (attempts: number): Promise<void> => {
    await securelySetNumber(SecureStorageKeys.LOGIN_ATTEMPTS, attempts);
  },

  /**
   * Get login attempts count
   * @returns Promise that resolves to number of failed login attempts
   */
  getLoginAttempts: async (): Promise<number> => {
    return await securelyGetNumber(SecureStorageKeys.LOGIN_ATTEMPTS, 0);
  },

  /**
   * Clear login attempts (successful login)
   */
  clearLoginAttempts: async (): Promise<void> => {
    await securelyDeleteItem(SecureStorageKeys.LOGIN_ATTEMPTS);
  },

  /**
   * Generic secure item storage (TASK-009: Rate limiting support)
   * @param key - Storage key
   * @param value - Value to store (will be stringified)
   */
  setItem: async (key: string, value: string): Promise<void> => {
    await SecureStore.setItemAsync(key, value);
  },

  /**
   * Generic secure item retrieval (TASK-009: Rate limiting support)
   * @param key - Storage key
   * @returns Promise that resolves to the stored value or null
   */
  getItem: async (key: string): Promise<string | null> => {
    return await SecureStore.getItemAsync(key);
  },
};
