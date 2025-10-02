/**
 * Security Settings Hook
 * Manages security preferences using secure storage
 */
import { debugError, debugLog } from '@/utils/debug';
import { SecurityStorage } from '@/utils/secure-storage';
import { useCallback, useEffect, useState } from 'react';

interface SecuritySettings {
  autoLockEnabled: boolean;
  autoLockTimeout: number; // in minutes
  securityNotifications: boolean;
  loginAttempts: number;
}

interface SecurityState extends SecuritySettings {
  isLoading: boolean;
  error: string | null;
}

interface SecurityActions {
  updateAutoLock: (enabled: boolean, timeout?: number) => Promise<void>;
  updateSecurityNotifications: (enabled: boolean) => Promise<void>;
  incrementLoginAttempts: () => Promise<void>;
  resetLoginAttempts: () => Promise<void>;
  refreshSettings: () => Promise<void>;
  isAccountLocked: () => boolean;
  getTimeUntilUnlock: () => number;
  maxLoginAttempts: number;
  lockoutDuration: number;
  remainingAttempts: number;
  isNearLockout: boolean;
  autoLockTimeoutOptions: { label: string; value: number }[];
  formatTimeout: (minutes: number) => string;
}

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15; // minutes
const DEFAULT_AUTO_LOCK_TIMEOUT = 5; // minutes

export function useSecuritySettings(): SecurityState & SecurityActions {
  const [state, setState] = useState<SecurityState>({
    autoLockEnabled: false,
    autoLockTimeout: DEFAULT_AUTO_LOCK_TIMEOUT,
    securityNotifications: true,
    loginAttempts: 0,
    isLoading: true,
    error: null,
  });

  /**
   * Load security settings from secure storage
   */
  const loadSecuritySettings = useCallback(async (): Promise<void> => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const [autoLockSettings, securityNotifications, loginAttempts] = await Promise.all([
        SecurityStorage.getAutoLockSettings(),
        SecurityStorage.getSecurityNotifications(),
        SecurityStorage.getLoginAttempts(),
      ]);

      setState((prev) => ({
        ...prev,
        autoLockEnabled: autoLockSettings.enabled,
        autoLockTimeout: autoLockSettings.timeout,
        securityNotifications,
        loginAttempts,
        isLoading: false,
      }));

      debugLog(`[SecuritySettings] Loaded settings - Auto-lock: ${autoLockSettings.enabled}, Notifications: ${securityNotifications}, Login attempts: ${loginAttempts}`);
    } catch (error) {
      debugError('[SecuritySettings] Failed to load security settings', error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Failed to load security settings',
      }));
    }
  }, []);

  /**
   * Update auto-lock settings
   */
  const updateAutoLock = async (enabled: boolean, timeout?: number): Promise<void> => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const newTimeout = timeout || state.autoLockTimeout;
      await SecurityStorage.setAutoLock(enabled, newTimeout);

      setState((prev) => ({
        ...prev,
        autoLockEnabled: enabled,
        autoLockTimeout: newTimeout,
        isLoading: false,
      }));

      debugLog(`[SecuritySettings] Updated auto-lock - Enabled: ${enabled}, Timeout: ${newTimeout}min`);
    } catch (error) {
      debugError('[SecuritySettings] Failed to update auto-lock settings', error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Failed to update auto-lock settings',
      }));
    }
  };

  /**
   * Update security notifications preference
   */
  const updateSecurityNotifications = async (enabled: boolean): Promise<void> => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      await SecurityStorage.setSecurityNotifications(enabled);

      setState((prev) => ({
        ...prev,
        securityNotifications: enabled,
        isLoading: false,
      }));

      debugLog(`[SecuritySettings] Updated security notifications: ${enabled}`);
    } catch (error) {
      debugError('[SecuritySettings] Failed to update security notifications', error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Failed to update security notifications',
      }));
    }
  };

  /**
   * Increment failed login attempts
   */
  const incrementLoginAttempts = async (): Promise<void> => {
    try {
      const newAttempts = state.loginAttempts + 1;
      await SecurityStorage.setLoginAttempts(newAttempts);

      setState((prev) => ({
        ...prev,
        loginAttempts: newAttempts,
      }));

      debugLog(`[SecuritySettings] Incremented login attempts to: ${newAttempts}`);
    } catch (error) {
      debugError('[SecuritySettings] Failed to increment login attempts', error);
    }
  };

  /**
   * Reset login attempts (successful login)
   */
  const resetLoginAttempts = async (): Promise<void> => {
    try {
      await SecurityStorage.clearLoginAttempts();

      setState((prev) => ({
        ...prev,
        loginAttempts: 0,
      }));

      debugLog('[SecuritySettings] Reset login attempts');
    } catch (error) {
      debugError('[SecuritySettings] Failed to reset login attempts', error);
    }
  };

  /**
   * Refresh all security settings from storage
   */
  const refreshSettings = async (): Promise<void> => {
    await loadSecuritySettings();
  };

  /**
   * Check if account is locked due to too many failed attempts
   */
  const isAccountLocked = (): boolean => {
    return state.loginAttempts >= MAX_LOGIN_ATTEMPTS;
  };

  /**
   * Get time until account unlock (in minutes)
   * Returns 0 if account is not locked
   */
  const getTimeUntilUnlock = (): number => {
    if (!isAccountLocked()) {
      return 0;
    }
    // In a real implementation, you'd store the lockout timestamp
    // For now, return the full lockout duration
    return LOCKOUT_DURATION;
  };

  /**
   * Get auto-lock timeout options
   */
  const getAutoLockTimeoutOptions = (): { label: string; value: number }[] => {
    return [
      { label: '1 minute', value: 1 },
      { label: '5 minutes', value: 5 },
      { label: '15 minutes', value: 15 },
      { label: '30 minutes', value: 30 },
      { label: '1 hour', value: 60 },
    ];
  };

  /**
   * Format timeout for display
   */
  const formatTimeout = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (remainingMinutes === 0) {
      return `${hours} hour${hours !== 1 ? 's' : ''}`;
    }

    return `${hours}h ${remainingMinutes}m`;
  };

  /**
   * Get remaining login attempts before lockout
   */
  const getRemainingAttempts = (): number => {
    return Math.max(0, MAX_LOGIN_ATTEMPTS - state.loginAttempts);
  };

  /**
   * Check if login attempts are getting high
   */
  const isNearLockout = (): boolean => {
    return state.loginAttempts >= MAX_LOGIN_ATTEMPTS - 2;
  };

  // Load settings on mount
  useEffect(() => {
    loadSecuritySettings();
  }, [loadSecuritySettings]);

  return {
    // State
    ...state,

    // Actions
    updateAutoLock,
    updateSecurityNotifications,
    incrementLoginAttempts,
    resetLoginAttempts,
    refreshSettings,
    isAccountLocked,
    getTimeUntilUnlock,
    maxLoginAttempts: MAX_LOGIN_ATTEMPTS,
    lockoutDuration: LOCKOUT_DURATION,
    remainingAttempts: getRemainingAttempts(),
    isNearLockout: isNearLockout(),
    autoLockTimeoutOptions: getAutoLockTimeoutOptions(),
    formatTimeout,
  };
}
