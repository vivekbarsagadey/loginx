/**
 * Two-Factor Authentication Hook
 * Manages 2FA settings and backup codes using secure storage
 */
import { debugError, debugLog } from '@/utils/debug';
import { TwoFactorStorage } from '@/utils/secure-storage';
import { useCallback, useEffect, useState } from 'react';

interface TwoFactorState {
  isEnabled: boolean;
  backupCodes: string[];
  isLoading: boolean;
  error: string | null;
}

interface TwoFactorActions {
  enableTwoFactor: () => Promise<boolean>;
  disableTwoFactor: () => Promise<void>;
  generateBackupCodes: () => Promise<string[]>;
  consumeBackupCode: (code: string) => Promise<boolean>;
  refreshSettings: () => Promise<void>;
  backupCodesCount: number;
  isBackupCodesLow: boolean;
  formatBackupCode: (code: string) => string;
}

/**
 * Generate secure backup codes for 2FA
 */
const generateSecureBackupCodes = (): string[] => {
  const codes: string[] = [];
  for (let i = 0; i < 10; i++) {
    // Generate 8-digit codes
    const code = Math.random().toString().slice(2, 10);
    codes.push(code);
  }
  return codes;
};

export function useTwoFactorAuth(): TwoFactorState & TwoFactorActions {
  const [state, setState] = useState<TwoFactorState>({
    isEnabled: false,
    backupCodes: [],
    isLoading: true,
    error: null,
  });

  /**
   * Load 2FA settings from secure storage
   */
  const loadTwoFactorSettings = useCallback(async (): Promise<void> => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const [isEnabled, backupCodes] = await Promise.all([TwoFactorStorage.getTwoFactorEnabled(), TwoFactorStorage.getBackupCodes()]);

      setState((prev) => ({
        ...prev,
        isEnabled,
        backupCodes,
        isLoading: false,
      }));

      debugLog(`[TwoFactorAuth] Loaded settings - Enabled: ${isEnabled}, Backup codes: ${backupCodes.length}`);
    } catch (error: unknown) {
      debugError('[TwoFactorAuth] Failed to load 2FA settings', error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Failed to load 2FA settings',
      }));
    }
  }, []);

  /**
   * Enable two-factor authentication
   */
  const enableTwoFactor = async (): Promise<boolean> => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      // Generate backup codes
      const newBackupCodes = generateSecureBackupCodes();

      // Save settings to secure storage
      await Promise.all([TwoFactorStorage.setTwoFactorEnabled(true), TwoFactorStorage.setBackupCodes(newBackupCodes)]);

      setState((prev) => ({
        ...prev,
        isEnabled: true,
        backupCodes: newBackupCodes,
        isLoading: false,
      }));

      debugLog('[TwoFactorAuth] 2FA enabled successfully');
      return true;
    } catch (error: unknown) {
      debugError('[TwoFactorAuth] Failed to enable 2FA', error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Failed to enable two-factor authentication',
      }));
      return false;
    }
  };

  /**
   * Disable two-factor authentication
   */
  const disableTwoFactor = async (): Promise<void> => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      // Clear all 2FA data from secure storage
      await TwoFactorStorage.clearTwoFactorSettings();

      setState((prev) => ({
        ...prev,
        isEnabled: false,
        backupCodes: [],
        isLoading: false,
      }));

      debugLog('[TwoFactorAuth] 2FA disabled successfully');
    } catch (error: unknown) {
      debugError('[TwoFactorAuth] Failed to disable 2FA', error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Failed to disable two-factor authentication',
      }));
    }
  };

  /**
   * Generate new backup codes
   */
  const generateBackupCodes = async (): Promise<string[]> => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const newBackupCodes = generateSecureBackupCodes();
      await TwoFactorStorage.setBackupCodes(newBackupCodes);

      setState((prev) => ({
        ...prev,
        backupCodes: newBackupCodes,
        isLoading: false,
      }));

      debugLog('[TwoFactorAuth] Generated new backup codes');
      return newBackupCodes;
    } catch (error: unknown) {
      debugError('[TwoFactorAuth] Failed to generate backup codes', error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Failed to generate backup codes',
      }));
      return [];
    }
  };

  /**
   * Consume a backup code for authentication
   */
  const consumeBackupCode = async (code: string): Promise<boolean> => {
    try {
      // Check if the code exists in our backup codes
      if (!state.backupCodes.includes(code)) {
        setState((prev) => ({
          ...prev,
          error: 'Invalid backup code',
        }));
        return false;
      }

      // Remove the used code from secure storage
      await TwoFactorStorage.consumeBackupCode(code);

      // Update local state
      setState((prev) => ({
        ...prev,
        backupCodes: prev.backupCodes.filter((c) => c !== code),
        error: null,
      }));

      debugLog('[TwoFactorAuth] Backup code used successfully');
      return true;
    } catch (error: unknown) {
      debugError('[TwoFactorAuth] Failed to use backup code', error);
      setState((prev) => ({
        ...prev,
        error: 'Failed to use backup code',
      }));
      return false;
    }
  };

  /**
   * Refresh 2FA settings from storage
   */
  const refreshSettings = async (): Promise<void> => {
    await loadTwoFactorSettings();
  };

  /**
   * Get backup codes count
   */
  const getBackupCodesCount = (): number => {
    return state.backupCodes.length;
  };

  /**
   * Check if backup codes are running low
   */
  const isBackupCodesLow = (): boolean => {
    return state.backupCodes.length <= 3;
  };

  /**
   * Format backup code for display (add spaces for readability)
   */
  const formatBackupCode = (code: string): string => {
    return code.replace(/(.{4})/g, '$1 ').trim();
  };

  // Load settings on mount
  useEffect(() => {
    loadTwoFactorSettings();
  }, [loadTwoFactorSettings]);

  return {
    // State
    ...state,

    // Actions
    enableTwoFactor,
    disableTwoFactor,
    generateBackupCodes,
    consumeBackupCode,
    refreshSettings,
    backupCodesCount: getBackupCodesCount(),
    isBackupCodesLow: isBackupCodesLow(),
    formatBackupCode,
  };
}
