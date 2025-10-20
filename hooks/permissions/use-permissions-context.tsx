/**
 * Permissions Context
 * Centralized permissions management
 * 
 * Features:
 * - Real-time permission status tracking
 * - Permission request handlers
 * - Settings navigation
 * - Loading states
 * - Permission change notifications
 */

import type { DEFAULT_PERMISSIONS_STATE, PermissionsContextState, PermissionsStatusMap, PermissionStatus } from '@/types/permission';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import React, { createContext, type PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Linking, Platform } from 'react-native';

export type PermissionType = 'camera' | 'mediaLibrary' | 'location' | 'notifications';

/**
 * Permissions context type
 */
interface PermissionsContextType extends PermissionsContextState {
  /** Request a specific permission */
  requestPermission: (type: PermissionType) => Promise<boolean>;
  /** Request all permissions */
  requestAllPermissions: () => Promise<void>;
  /** Check all permissions status */
  checkAllPermissions: () => Promise<void>;
  /** Open device settings */
  openSettings: () => void;
  /** Check if a specific permission is granted */
  isPermissionGranted: (type: PermissionType) => boolean;
  /** Check if all critical permissions are granted */
  areAllCriticalPermissionsGranted: () => boolean;
  /** Get permission status for a specific permission */
  getPermissionStatus: (type: PermissionType) => PermissionStatus;
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined);

/**
 * Permissions Provider Component
 */
export function PermissionsProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<PermissionsContextState>({
    permissions: {
      camera: { granted: false, canAskAgain: true },
      mediaLibrary: { granted: false, canAskAgain: true },
      location: { granted: false, canAskAgain: true },
      notifications: { granted: false, canAskAgain: true },
    },
    isLoading: false,
    error: null,
    lastCheckedAt: null,
  });

  /**
   * Check all permissions status
   */
  const checkAllPermissions = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const [cameraStatus, mediaLibraryStatus, locationStatus, notificationStatus] = await Promise.all([
        Camera.getCameraPermissionsAsync(),
        ImagePicker.getMediaLibraryPermissionsAsync(),
        Location.getForegroundPermissionsAsync(),
        Notifications.getPermissionsAsync(),
      ]);

      const newPermissions: PermissionsStatusMap = {
        camera: {
          granted: cameraStatus.granted,
          canAskAgain: cameraStatus.canAskAgain,
        },
        mediaLibrary: {
          granted: mediaLibraryStatus.granted,
          canAskAgain: mediaLibraryStatus.canAskAgain,
        },
        location: {
          granted: locationStatus.granted,
          canAskAgain: locationStatus.canAskAgain,
        },
        notifications: {
          granted: notificationStatus.granted,
          canAskAgain: notificationStatus.canAskAgain,
        },
      };

      setState((prev) => ({
        ...prev,
        permissions: newPermissions,
        isLoading: false,
        lastCheckedAt: Date.now(),
      }));

      if (__DEV__) {
        console.error('[PermissionsContext] Permissions checked:', newPermissions);
      }
    } catch (error) {
      console.error('[PermissionsContext] Failed to check permissions:', error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Failed to check permissions',
      }));
    }
  }, []);

  /**
   * Request camera permission
   */
  const requestCameraPermission = useCallback(async (): Promise<boolean> => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const { status, canAskAgain } = await Camera.requestCameraPermissionsAsync();
      const granted = status === 'granted';

      setState((prev) => ({
        ...prev,
        permissions: {
          ...prev.permissions,
          camera: { granted, canAskAgain },
        },
        isLoading: false,
        lastCheckedAt: Date.now(),
      }));

      if (__DEV__) {
        console.error('[PermissionsContext] Camera permission:', granted ? 'GRANTED' : 'DENIED');
      }

      return granted;
    } catch (error) {
      console.error('[PermissionsContext] Failed to request camera permission:', error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Failed to request camera permission',
      }));
      return false;
    }
  }, []);

  /**
   * Request media library permission
   */
  const requestMediaLibraryPermission = useCallback(async (): Promise<boolean> => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const { status, canAskAgain } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      const granted = status === 'granted';

      setState((prev) => ({
        ...prev,
        permissions: {
          ...prev.permissions,
          mediaLibrary: { granted, canAskAgain },
        },
        isLoading: false,
        lastCheckedAt: Date.now(),
      }));

      if (__DEV__) {
        console.error('[PermissionsContext] Media library permission:', granted ? 'GRANTED' : 'DENIED');
      }

      return granted;
    } catch (error) {
      console.error('[PermissionsContext] Failed to request media library permission:', error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Failed to request media library permission',
      }));
      return false;
    }
  }, []);

  /**
   * Request location permission
   */
  const requestLocationPermission = useCallback(async (): Promise<boolean> => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const { status, canAskAgain } = await Location.requestForegroundPermissionsAsync();
      const granted = status === 'granted';

      setState((prev) => ({
        ...prev,
        permissions: {
          ...prev.permissions,
          location: { granted, canAskAgain },
        },
        isLoading: false,
        lastCheckedAt: Date.now(),
      }));

      if (__DEV__) {
        console.error('[PermissionsContext] Location permission:', granted ? 'GRANTED' : 'DENIED');
      }

      return granted;
    } catch (error) {
      console.error('[PermissionsContext] Failed to request location permission:', error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Failed to request location permission',
      }));
      return false;
    }
  }, []);

  /**
   * Request notification permission
   */
  const requestNotificationPermission = useCallback(async (): Promise<boolean> => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const { status, canAskAgain } = await Notifications.requestPermissionsAsync();
      const granted = status === 'granted';

      setState((prev) => ({
        ...prev,
        permissions: {
          ...prev.permissions,
          notifications: { granted, canAskAgain },
        },
        isLoading: false,
        lastCheckedAt: Date.now(),
      }));

      if (__DEV__) {
        console.error('[PermissionsContext] Notification permission:', granted ? 'GRANTED' : 'DENIED');
      }

      return granted;
    } catch (error) {
      console.error('[PermissionsContext] Failed to request notification permission:', error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Failed to request notification permission',
      }));
      return false;
    }
  }, []);

  /**
   * Request a specific permission
   */
  const requestPermission = useCallback(
    async (type: PermissionType): Promise<boolean> => {
      switch (type) {
        case 'camera':
          return requestCameraPermission();
        case 'mediaLibrary':
          return requestMediaLibraryPermission();
        case 'location':
          return requestLocationPermission();
        case 'notifications':
          return requestNotificationPermission();
        default:
          return false;
      }
    },
    [requestCameraPermission, requestMediaLibraryPermission, requestLocationPermission, requestNotificationPermission]
  );

  /**
   * Request all permissions
   */
  const requestAllPermissions = useCallback(async () => {
    await Promise.all([
      requestCameraPermission(),
      requestMediaLibraryPermission(),
      requestLocationPermission(),
      requestNotificationPermission(),
    ]);
  }, [requestCameraPermission, requestMediaLibraryPermission, requestLocationPermission, requestNotificationPermission]);

  /**
   * Open device settings
   */
  const openSettings = useCallback(() => {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:');
    } else {
      Linking.openSettings();
    }
  }, []);

  /**
   * Check if a specific permission is granted
   */
  const isPermissionGranted = useCallback(
    (type: PermissionType): boolean => {
      return state.permissions[type].granted;
    },
    [state.permissions]
  );

  /**
   * Check if all critical permissions are granted
   */
  const areAllCriticalPermissionsGranted = useCallback((): boolean => {
    // Define which permissions are critical for your app
    // For this app, notifications is critical
    return state.permissions.notifications.granted;
  }, [state.permissions]);

  /**
   * Get permission status for a specific permission
   */
  const getPermissionStatus = useCallback(
    (type: PermissionType): PermissionStatus => {
      return state.permissions[type];
    },
    [state.permissions]
  );

  /**
   * Check permissions on mount
   */
  useEffect(() => {
    if (__DEV__) {
      console.error('[PermissionsContext] Initializing permissions check');
    }
    checkAllPermissions();
  }, [checkAllPermissions]);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo<PermissionsContextType>(
    () => ({
      ...state,
      requestPermission,
      requestAllPermissions,
      checkAllPermissions,
      openSettings,
      isPermissionGranted,
      areAllCriticalPermissionsGranted,
      getPermissionStatus,
    }),
    [
      state,
      requestPermission,
      requestAllPermissions,
      checkAllPermissions,
      openSettings,
      isPermissionGranted,
      areAllCriticalPermissionsGranted,
      getPermissionStatus,
    ]
  );

  return <PermissionsContext.Provider value={contextValue}>{children}</PermissionsContext.Provider>;
}

/**
 * Hook to access permissions context
 * @throws Error if used outside PermissionsProvider
 * @example
 * const { permissions, requestPermission } = usePermissions();
 */
export function usePermissions(): PermissionsContextType {
  const context = useContext(PermissionsContext);
  if (!context) {
    throw new Error('usePermissions must be used within a PermissionsProvider');
  }
  return context;
}
