/**
 * Authentication Persistence Manager
 * Handles persistent login state using secure storage
 * SECURITY: Uses SecureStore for tokens, AsyncStorage for non-sensitive state
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { type User } from 'firebase/auth';
import { debugError, debugLog, debugWarn } from './debug';
import { securelyDeleteItem, securelyGetItem, securelySetItem } from './secure-storage';

const AUTH_STORAGE_KEY = '@LoginX:auth_state';
const AUTH_TOKEN_KEY_SECURE = 'auth_token'; // Stored in SecureStore (encrypted)
const AUTH_USER_KEY = '@LoginX:auth_user';

interface PersistedAuthState {
  isAuthenticated: boolean;
  userId: string | null;
  lastLoginTime: number;
  expiresAt: number;
}

/**
 * Save authentication state to persistent storage
 */
export const saveAuthState = async (user: User | null): Promise<void> => {
  try {
    if (user) {
      const authState: PersistedAuthState = {
        isAuthenticated: true,
        userId: user.uid,
        lastLoginTime: Date.now(),
        expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
      };

      // Save auth state
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authState));

      // Save user info (non-sensitive)
      const userInfo = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
      };
      await AsyncStorage.setItem(AUTH_USER_KEY, JSON.stringify(userInfo));

      // Get and save auth token if available - SECURELY in SecureStore
      try {
        const token = await user.getIdToken();
        await securelySetItem(AUTH_TOKEN_KEY_SECURE, token);
        debugLog('[AuthPersistence] ✅ Auth state and token saved securely in SecureStore');
      } catch (tokenError) {
        debugWarn('[AuthPersistence] Failed to save auth token:', tokenError);
        // Continue - we still have the user state
      }
    } else {
      // Clear all auth data on logout
      await clearAuthState();
      debugLog('[AuthPersistence] ✅ Auth state cleared');
    }
  } catch (_error) {
    debugError('[AuthPersistence] Failed to save auth state:', error);
  }
};

/**
 * Load authentication state from persistent storage
 */
export const loadAuthState = async (): Promise<PersistedAuthState | null> => {
  try {
    const stateStr = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
    if (!stateStr) {
      debugLog('[AuthPersistence] No saved auth state found');
      return null;
    }

    const authState: PersistedAuthState = JSON.parse(stateStr);

    // Check if auth state has expired
    if (Date.now() > authState.expiresAt) {
      debugLog('[AuthPersistence] Auth state expired, clearing');
      await clearAuthState();
      return null;
    }

    debugLog('[AuthPersistence] ✅ Loaded valid auth state for user:', authState.userId);
    return authState;
  } catch (_error) {
    debugError('[AuthPersistence] Failed to load auth state:', error);
    return null;
  }
};

interface SavedUserInfo {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}

/**
 * Load saved user info
 */
export const loadSavedUserInfo = async (): Promise<SavedUserInfo | null> => {
  try {
    const userStr = await AsyncStorage.getItem(AUTH_USER_KEY);
    if (!userStr) {
      return null;
    }

    const userInfo = JSON.parse(userStr);
    debugLog('[AuthPersistence] ✅ Loaded saved user info for:', userInfo.uid);
    return userInfo;
  } catch (_error) {
    debugError('[AuthPersistence] Failed to load user info:', error);
    return null;
  }
};

/**
 * Load saved auth token from SecureStore (encrypted storage)
 */
export const loadSavedAuthToken = async (): Promise<string | null> => {
  try {
    const token = await securelyGetItem(AUTH_TOKEN_KEY_SECURE);
    if (token) {
      debugLog('[AuthPersistence] ✅ Loaded saved auth token from SecureStore');
    }
    return token;
  } catch (_error) {
    debugError('[AuthPersistence] Failed to load auth token:', error);
    return null;
  }
};

/**
 * Clear all authentication data
 * SECURITY: Clears both AsyncStorage (state) and SecureStore (token)
 */
export const clearAuthState = async (): Promise<void> => {
  try {
    await Promise.all([
      AsyncStorage.removeItem(AUTH_STORAGE_KEY),
      securelyDeleteItem(AUTH_TOKEN_KEY_SECURE), // Clear encrypted token
      AsyncStorage.removeItem(AUTH_USER_KEY),
    ]);
    debugLog('[AuthPersistence] ✅ All auth data cleared (including encrypted token)');
  } catch (_error) {
    debugError('[AuthPersistence] Failed to clear auth data:', error);
  }
};

/**
 * Check if user should stay logged in
 */
export const shouldRestoreAuth = async (): Promise<boolean> => {
  const authState = await loadAuthState();
  return authState?.isAuthenticated === true;
};

/**
 * Update last login time
 */
export const updateLastLoginTime = async (): Promise<void> => {
  try {
    const authState = await loadAuthState();
    if (authState) {
      authState.lastLoginTime = Date.now();
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authState));
      debugLog('[AuthPersistence] ✅ Updated last login time');
    }
  } catch (_error) {
    debugError('[AuthPersistence] Failed to update last login time:', error);
  }
};

/**
 * Get auth persistence stats
 */
export const getAuthPersistenceStats = async () => {
  try {
    const authState = await loadAuthState();
    const userInfo = await loadSavedUserInfo();
    const hasToken = !!(await loadSavedAuthToken());

    return {
      hasAuthState: !!authState,
      isAuthenticated: authState?.isAuthenticated || false,
      userId: authState?.userId || null,
      lastLoginTime: authState?.lastLoginTime || null,
      expiresAt: authState?.expiresAt || null,
      hasUserInfo: !!userInfo,
      hasToken,
      timeUntilExpiry: authState ? authState.expiresAt - Date.now() : 0,
    };
  } catch (_error) {
    debugError('[AuthPersistence] Failed to get stats:', error);
    return {
      hasAuthState: false,
      isAuthenticated: false,
      userId: null,
      lastLoginTime: null,
      expiresAt: null,
      hasUserInfo: false,
      hasToken: false,
      timeUntilExpiry: 0,
    };
  }
};
