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
  } catch (_error: unknown) {
    debugLog('[AuthTest] ❌ Failed to test auth persistence:', _error);
  }
};

/**
 * Log authentication persistence info for debugging
 */
export const logAuthPersistenceInfo = async (): Promise<void> => {
  try {
    const _stats = await getAuthPersistenceStats();
    // Auth persistence logging disabled
  } catch (_error: unknown) {
    console.error('❌ Failed to get auth persistence info:', _error);
  }
};
