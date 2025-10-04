/**
 * Authentication Persistence Tester
 * Debug utility to check auth persistence status
 */

import { getAuthPersistenceStats } from './auth-persistence';
import { debugLog } from './debug';

/**
 * Test and log current authentication persistence status
 */
export const testAuthPersistence = async (): Promise<void> => {
  try {
    debugLog('[AuthTest] 🔍 Testing authentication persistence...');

    const stats = await getAuthPersistenceStats();

    debugLog('[AuthTest] 📊 Authentication Persistence Stats:', {
      hasAuthState: stats.hasAuthState,
      isAuthenticated: stats.isAuthenticated,
      userId: stats.userId,
      lastLoginTime: stats.lastLoginTime ? new Date(stats.lastLoginTime).toISOString() : null,
      expiresAt: stats.expiresAt ? new Date(stats.expiresAt).toISOString() : null,
      hasUserInfo: stats.hasUserInfo,
      hasToken: stats.hasToken,
      timeUntilExpiry: stats.timeUntilExpiry > 0 ? `${Math.round(stats.timeUntilExpiry / (1000 * 60 * 60 * 24))} days` : 'Expired',
    });

    if (stats.isAuthenticated) {
      debugLog('[AuthTest] ✅ User should stay logged in');
    } else {
      debugLog('[AuthTest] ❌ User needs to log in again');
    }
  } catch (error) {
    debugLog('[AuthTest] ❌ Failed to test auth persistence:', error);
  }
};

/**
 * Log authentication persistence info for debugging
 */
export const logAuthPersistenceInfo = async (): Promise<void> => {
  try {
    const stats = await getAuthPersistenceStats();

    console.warn('🔐 AUTH PERSISTENCE STATUS:');
    console.warn('├─ Has Auth State:', stats.hasAuthState ? '✅' : '❌');
    console.warn('├─ Is Authenticated:', stats.isAuthenticated ? '✅' : '❌');
    console.warn('├─ User ID:', stats.userId || 'None');
    console.warn('├─ Has User Info:', stats.hasUserInfo ? '✅' : '❌');
    console.warn('├─ Has Token:', stats.hasToken ? '✅' : '❌');
    console.warn('├─ Last Login:', stats.lastLoginTime ? new Date(stats.lastLoginTime).toLocaleString() : 'Never');
    console.warn('├─ Expires At:', stats.expiresAt ? new Date(stats.expiresAt).toLocaleString() : 'N/A');
    console.warn('└─ Time Until Expiry:', stats.timeUntilExpiry > 0 ? `${Math.round(stats.timeUntilExpiry / (1000 * 60 * 60 * 24))} days` : 'Expired');
  } catch (error) {
    console.error('❌ Failed to get auth persistence info:', error);
  }
};
