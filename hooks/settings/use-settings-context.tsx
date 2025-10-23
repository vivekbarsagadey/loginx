/**
 * Settings Context
 * Centralized settings management with local-first architecture
 * 
 * Features:
 * - Local storage first (AsyncStorage)
 * - Firestore sync for authenticated users
 * - Optimistic updates for instant UI feedback
 * - Automatic conflict resolution
 * - Loading and error states
 */

import { auth, firestore } from '@/firebase-config';
import {
  type AppPreferences,
  DEFAULT_APP_PREFERENCES,
  DEFAULT_NOTIFICATION_SETTINGS,
  DEFAULT_PRIVACY_SETTINGS,
  DEFAULT_SECURITY_SETTINGS,
  type NotificationSettings,
  type PrivacySettings,
  type SecuritySettings,
  type SettingsState,
} from '@/types/settings';
import { getData, setData } from '@/utils/local-first';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, onSnapshot } from 'firebase/firestore';
import React, { createContext, type PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from 'react';

// Storage keys
const SETTINGS_STORAGE_KEY = '@LoginX:settings';
const SETTINGS_NOTIFICATIONS_KEY = 'settings:notifications';
const SETTINGS_SECURITY_KEY = 'settings:security';
const SETTINGS_APP_KEY = 'settings:app';
const SETTINGS_PRIVACY_KEY = 'settings:privacy';

/**
 * Settings context type
 */
interface SettingsContextType extends SettingsState {
  /** Update notification settings */
  updateNotifications: (updates: Partial<NotificationSettings>) => Promise<void>;
  /** Update security settings */
  updateSecurity: (updates: Partial<SecuritySettings>) => Promise<void>;
  /** Update app preferences */
  updateApp: (updates: Partial<AppPreferences>) => Promise<void>;
  /** Update privacy settings */
  updatePrivacy: (updates: Partial<PrivacySettings>) => Promise<void>;
  /** Refresh all settings from storage */
  refreshSettings: () => Promise<void>;
  /** Reset all settings to defaults */
  resetAllSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

/**
 * Settings Provider Component
 */
export function SettingsProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<SettingsState>({
    notifications: DEFAULT_NOTIFICATION_SETTINGS,
    security: DEFAULT_SECURITY_SETTINGS,
    app: DEFAULT_APP_PREFERENCES,
    privacy: DEFAULT_PRIVACY_SETTINGS,
    isLoading: true,
    error: null,
    lastSyncedAt: null,
  });

  /**
   * Load settings from local storage
   */
  const loadSettings = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const [notifications, security, app, privacy] = await Promise.all([
        getData<NotificationSettings>({ collection: 'settings', id: SETTINGS_NOTIFICATIONS_KEY, syncEnabled: false }),
        getData<SecuritySettings>({ collection: 'settings', id: SETTINGS_SECURITY_KEY, syncEnabled: false }),
        getData<AppPreferences>({ collection: 'settings', id: SETTINGS_APP_KEY, syncEnabled: false }),
        getData<PrivacySettings>({ collection: 'settings', id: SETTINGS_PRIVACY_KEY, syncEnabled: false }),
      ]);

      setState((prev) => ({
        ...prev,
        notifications: notifications || DEFAULT_NOTIFICATION_SETTINGS,
        security: security || DEFAULT_SECURITY_SETTINGS,
        app: app || DEFAULT_APP_PREFERENCES,
        privacy: privacy || DEFAULT_PRIVACY_SETTINGS,
        isLoading: false,
        lastSyncedAt: Date.now(),
      }));

      if (__DEV__) {
        console.error('[SettingsContext] Settings loaded from local storage');
      }
    } catch (error: unknown) {
      console.error('[SettingsContext] Failed to load settings:', error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Failed to load settings',
      }));
    }
  }, []);

  /**
   * Save settings section to storage and sync
   */
  const saveSettingsSection = useCallback(
    async <T extends object>(key: string, collection: string, data: T) => {
      try {
        // Optimistic update - save locally first and sync to Firestore
        const user = auth.currentUser;
        const firestoreCollection = user ? 'userSettings' : 'settings';
        const firestoreId = user ? `${user.uid}_${key}` : key;

        await setData<T>({
          collection: firestoreCollection,
          id: firestoreId,
          data,
          syncEnabled: !!user, // Only sync if user is authenticated
        });

        setState((prev) => ({ ...prev, lastSyncedAt: Date.now() }));

        if (__DEV__) {
          console.error(`[SettingsContext] ${key} saved and synced`);
        }
      } catch (error: unknown) {
        console.error(`[SettingsContext] Failed to save ${key}:`, error);
        throw error;
      }
    },
    []
  );

  /**
   * Update notification settings
   */
  const updateNotifications = useCallback(
    async (updates: Partial<NotificationSettings>) => {
      const newNotifications = { ...state.notifications, ...updates };

      // Optimistic update
      setState((prev) => ({
        ...prev,
        notifications: newNotifications,
      }));

      try {
        await saveSettingsSection(SETTINGS_NOTIFICATIONS_KEY, 'userSettings', newNotifications);
      } catch (error: unknown) {
        // Rollback on error
        setState((prev) => ({
          ...prev,
          notifications: state.notifications,
          error: 'Failed to update notification settings',
        }));
        throw error;
      }
    },
    [state.notifications, saveSettingsSection]
  );

  /**
   * Update security settings
   */
  const updateSecurity = useCallback(
    async (updates: Partial<SecuritySettings>) => {
      const newSecurity = { ...state.security, ...updates };

      // Optimistic update
      setState((prev) => ({
        ...prev,
        security: newSecurity,
      }));

      try {
        await saveSettingsSection(SETTINGS_SECURITY_KEY, 'userSettings', newSecurity);
      } catch (error: unknown) {
        // Rollback on error
        setState((prev) => ({
          ...prev,
          security: state.security,
          error: 'Failed to update security settings',
        }));
        throw error;
      }
    },
    [state.security, saveSettingsSection]
  );

  /**
   * Update app preferences
   */
  const updateApp = useCallback(
    async (updates: Partial<AppPreferences>) => {
      const newApp = { ...state.app, ...updates };

      // Optimistic update
      setState((prev) => ({
        ...prev,
        app: newApp,
      }));

      try {
        await saveSettingsSection(SETTINGS_APP_KEY, 'userSettings', newApp);
      } catch (error: unknown) {
        // Rollback on error
        setState((prev) => ({
          ...prev,
          app: state.app,
          error: 'Failed to update app preferences',
        }));
        throw error;
      }
    },
    [state.app, saveSettingsSection]
  );

  /**
   * Update privacy settings
   */
  const updatePrivacy = useCallback(
    async (updates: Partial<PrivacySettings>) => {
      const newPrivacy = { ...state.privacy, ...updates };

      // Optimistic update
      setState((prev) => ({
        ...prev,
        privacy: newPrivacy,
      }));

      try {
        await saveSettingsSection(SETTINGS_PRIVACY_KEY, 'userSettings', newPrivacy);
      } catch (error: unknown) {
        // Rollback on error
        setState((prev) => ({
          ...prev,
          privacy: state.privacy,
          error: 'Failed to update privacy settings',
        }));
        throw error;
      }
    },
    [state.privacy, saveSettingsSection]
  );

  /**
   * Refresh all settings from storage
   */
  const refreshSettings = useCallback(async () => {
    await loadSettings();
  }, [loadSettings]);

  /**
   * Reset all settings to defaults
   */
  const resetAllSettings = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));

      // Clear local storage
      await Promise.all([
        AsyncStorage.removeItem(SETTINGS_NOTIFICATIONS_KEY),
        AsyncStorage.removeItem(SETTINGS_SECURITY_KEY),
        AsyncStorage.removeItem(SETTINGS_APP_KEY),
        AsyncStorage.removeItem(SETTINGS_PRIVACY_KEY),
      ]);

      // Reset state to defaults
      setState({
        notifications: DEFAULT_NOTIFICATION_SETTINGS,
        security: DEFAULT_SECURITY_SETTINGS,
        app: DEFAULT_APP_PREFERENCES,
        privacy: DEFAULT_PRIVACY_SETTINGS,
        isLoading: false,
        error: null,
        lastSyncedAt: null,
      });

      if (__DEV__) {
        console.error('[SettingsContext] All settings reset to defaults');
      }
    } catch (error: unknown) {
      console.error('[SettingsContext] Failed to reset settings:', error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Failed to reset settings',
      }));
    }
  }, []);

  /**
   * Load settings on mount
   */
  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  /**
   * Set up Firestore real-time sync for authenticated users
   * Note: The local-first architecture handles sync automatically
   * This is just for real-time updates from other devices
   */
  useEffect(() => {
    const user = auth.currentUser;
    if (!user || !firestore) {return;}

    if (__DEV__) {
      console.error('[SettingsContext] Setting up Firestore real-time sync');
    }

    // Create snapshot listeners for each settings section
    const unsubscribers: (() => void)[] = [];

    // Listen to notifications settings
    unsubscribers.push(
      onSnapshot(
        doc(firestore, 'userSettings', `${user.uid}_${SETTINGS_NOTIFICATIONS_KEY}`),
        (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data() as NotificationSettings;
            setState((prev) => ({
              ...prev,
              notifications: data,
              lastSyncedAt: Date.now(),
            }));
          }
        },
        (error) => {
          console.error('[SettingsContext] Notifications sync error:', error);
        }
      )
    );

    // Listen to security settings
    unsubscribers.push(
      onSnapshot(
        doc(firestore, 'userSettings', `${user.uid}_${SETTINGS_SECURITY_KEY}`),
        (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data() as SecuritySettings;
            setState((prev) => ({
              ...prev,
              security: data,
              lastSyncedAt: Date.now(),
            }));
          }
        },
        (error) => {
          console.error('[SettingsContext] Security sync error:', error);
        }
      )
    );

    // Listen to app preferences
    unsubscribers.push(
      onSnapshot(
        doc(firestore, 'userSettings', `${user.uid}_${SETTINGS_APP_KEY}`),
        (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data() as AppPreferences;
            setState((prev) => ({
              ...prev,
              app: data,
              lastSyncedAt: Date.now(),
            }));
          }
        },
        (error) => {
          console.error('[SettingsContext] App sync error:', error);
        }
      )
    );

    // Listen to privacy settings
    unsubscribers.push(
      onSnapshot(
        doc(firestore, 'userSettings', `${user.uid}_${SETTINGS_PRIVACY_KEY}`),
        (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data() as PrivacySettings;
            setState((prev) => ({
              ...prev,
              privacy: data,
              lastSyncedAt: Date.now(),
            }));
          }
        },
        (error) => {
          console.error('[SettingsContext] Privacy sync error:', error);
        }
      )
    );

    return () => {
      if (__DEV__) {
        console.error('[SettingsContext] Cleaning up Firestore sync');
      }
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo<SettingsContextType>(
    () => ({
      ...state,
      updateNotifications,
      updateSecurity,
      updateApp,
      updatePrivacy,
      refreshSettings,
      resetAllSettings,
    }),
    [state, updateNotifications, updateSecurity, updateApp, updatePrivacy, refreshSettings, resetAllSettings]
  );

  return <SettingsContext.Provider value={contextValue}>{children}</SettingsContext.Provider>;
}

/**
 * Hook to access settings context
 * @throws Error if used outside SettingsProvider
 * @example
 * const { notifications, updateNotifications } = useSettings();
 */
export function useSettings(): SettingsContextType {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
