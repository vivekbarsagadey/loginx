/**
 * Settings Context Tests
 * Test suite for SettingsProvider and useSettings hook
 */

import { SettingsProvider, useSettings } from '@/hooks/settings/use-settings-context';
import { DEFAULT_APP_PREFERENCES, DEFAULT_NOTIFICATION_SETTINGS, DEFAULT_PRIVACY_SETTINGS, DEFAULT_SECURITY_SETTINGS } from '@/types/settings';
import { renderHook, waitFor } from '@testing-library/react-native';
import React from 'react';

// Mock dependencies
jest.mock('@/firebase-config', () => ({
  auth: { currentUser: null },
  firestore: null,
}));

jest.mock('@/utils/local-first', () => ({
  getData: jest.fn(() => Promise.resolve(null)),
  setData: jest.fn(() => Promise.resolve()),
}));

const wrapper = ({ children }: { children: React.ReactNode }) => <SettingsProvider>{children}</SettingsProvider>;

describe('SettingsProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Initialization', () => {
    it('should initialize with default settings', async () => {
      const { result } = renderHook(() => useSettings(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.notifications).toEqual(DEFAULT_NOTIFICATION_SETTINGS);
      expect(result.current.security).toEqual(DEFAULT_SECURITY_SETTINGS);
      expect(result.current.app).toEqual(DEFAULT_APP_PREFERENCES);
      expect(result.current.privacy).toEqual(DEFAULT_PRIVACY_SETTINGS);
      expect(result.current.error).toBeNull();
    });
  });

  describe('Notification Settings', () => {
    it('should update notification settings optimistically', async () => {
      const { result } = renderHook(() => useSettings(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const updates = { pushEnabled: true };

      // Call update
      await result.current.updateNotifications(updates);

      // Check optimistic update
      expect(result.current.notifications.pushEnabled).toBe(true);
    });
  });

  describe('Security Settings', () => {
    it('should update security settings optimistically', async () => {
      const { result } = renderHook(() => useSettings(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const updates = { biometricEnabled: true };

      await result.current.updateSecurity(updates);

      expect(result.current.security.biometricEnabled).toBe(true);
    });
  });

  describe('App Preferences', () => {
    it('should update app preferences', async () => {
      const { result } = renderHook(() => useSettings(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const updates = { textSize: 'large' as const };

      await result.current.updateApp(updates);

      expect(result.current.app.textSize).toBe('large');
    });
  });

  describe('Privacy Settings', () => {
    it('should update privacy settings', async () => {
      const { result } = renderHook(() => useSettings(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const updates = { shareUsageData: false };

      await result.current.updatePrivacy(updates);

      expect(result.current.privacy.shareUsageData).toBe(false);
    });
  });

  describe('Reset Settings', () => {
    it('should reset all settings to defaults', async () => {
      const { result } = renderHook(() => useSettings(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Update some settings
      await result.current.updateNotifications({ pushEnabled: true });
      await result.current.updateSecurity({ biometricEnabled: true });

      // Reset all
      await result.current.resetAllSettings();

      expect(result.current.notifications).toEqual(DEFAULT_NOTIFICATION_SETTINGS);
      expect(result.current.security).toEqual(DEFAULT_SECURITY_SETTINGS);
      expect(result.current.app).toEqual(DEFAULT_APP_PREFERENCES);
      expect(result.current.privacy).toEqual(DEFAULT_PRIVACY_SETTINGS);
    });
  });

  describe('Error Handling', () => {
    it('should throw error if useSettings is used outside provider', () => {
      // Suppress console.error for this test
      const originalError = console.error;
      console.error = jest.fn();

      expect(() => {
        renderHook(() => useSettings());
      }).toThrow('useSettings must be used within a SettingsProvider');

      console.error = originalError;
    });
  });
});
