import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { useCallback, useEffect, useState } from 'react';
import { Linking, Platform } from 'react-native';

export type PermissionType = 'camera' | 'mediaLibrary' | 'location' | 'notifications';

export interface PermissionStatus {
  granted: boolean;
  canAskAgain: boolean;
  status: 'granted' | 'denied' | 'undetermined';
}

export interface AllPermissionsStatus {
  camera: PermissionStatus;
  mediaLibrary: PermissionStatus;
  location: PermissionStatus;
  notifications: PermissionStatus;
}

export interface UsePermissionsReturn {
  permissionsStatus: AllPermissionsStatus;
  loading: boolean;
  requestPermission: (type: PermissionType) => Promise<boolean>;
  requestAllPermissions: () => Promise<AllPermissionsStatus>;
  requestCameraPermission: () => Promise<boolean>;
  requestMediaLibraryPermission: () => Promise<boolean>;
  requestLocationPermission: () => Promise<boolean>;
  requestNotificationPermission: () => Promise<boolean>;
  checkAllPermissions: () => Promise<void>;
  openSettings: () => void;
  showPermissionAlert: (permissionName: string, permissionDescription: string, onConfirm?: () => void) => {
    title: string;
    message: string;
    buttons: { text: string; style?: 'cancel'; onPress?: () => void }[];
  };
  isPermissionGranted: (type: PermissionType) => boolean;
  areAllCriticalPermissionsGranted: () => boolean;
  getPermissionStatus: (type: PermissionType) => PermissionStatus;
}

/**
 * Hook for managing app permissions
 * Provides methods to check, request, and track permission states
 */
export function usePermissions(): UsePermissionsReturn {
  const [permissionsStatus, setPermissionsStatus] = useState<AllPermissionsStatus>({
    camera: { granted: false, canAskAgain: true, status: 'undetermined' },
    mediaLibrary: { granted: false, canAskAgain: true, status: 'undetermined' },
    location: { granted: false, canAskAgain: true, status: 'undetermined' },
    notifications: { granted: false, canAskAgain: true, status: 'undetermined' },
  });

  const [loading, setLoading] = useState(false);

  /**
   * Check all permissions status
   */
  const checkAllPermissions = useCallback(async () => {
    try {
      const [cameraStatus, mediaLibraryStatus, locationStatus, notificationStatus] = await Promise.all([
        Camera.getCameraPermissionsAsync(),
        ImagePicker.getMediaLibraryPermissionsAsync(),
        Location.getForegroundPermissionsAsync(),
        Notifications.getPermissionsAsync(),
      ]);

      setPermissionsStatus({
        camera: {
          granted: cameraStatus.granted,
          canAskAgain: cameraStatus.canAskAgain,
          status: cameraStatus.granted ? 'granted' : cameraStatus.canAskAgain ? 'undetermined' : 'denied',
        },
        mediaLibrary: {
          granted: mediaLibraryStatus.granted,
          canAskAgain: mediaLibraryStatus.canAskAgain,
          status: mediaLibraryStatus.granted ? 'granted' : mediaLibraryStatus.canAskAgain ? 'undetermined' : 'denied',
        },
        location: {
          granted: locationStatus.granted,
          canAskAgain: locationStatus.canAskAgain,
          status: locationStatus.granted ? 'granted' : locationStatus.canAskAgain ? 'undetermined' : 'denied',
        },
        notifications: {
          granted: notificationStatus.granted,
          canAskAgain: notificationStatus.canAskAgain,
          status: notificationStatus.granted ? 'granted' : notificationStatus.canAskAgain ? 'undetermined' : 'denied',
        },
      });
    } catch (error) {
      console.error('Error checking permissions:', error);
    }
  }, []);

  /**
   * Request camera permission
   */
  const requestCameraPermission = useCallback(async (): Promise<boolean> => {
    try {
      setLoading(true);
      const { status, canAskAgain } = await Camera.requestCameraPermissionsAsync();
      const granted = status === 'granted';

      setPermissionsStatus((prev) => ({
        ...prev,
        camera: {
          granted,
          canAskAgain,
          status: granted ? 'granted' : canAskAgain ? 'undetermined' : 'denied',
        },
      }));

      return granted;
    } catch (error) {
      console.error('Error requesting camera permission:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Request media library permission
   */
  const requestMediaLibraryPermission = useCallback(async (): Promise<boolean> => {
    try {
      setLoading(true);
      const { status, canAskAgain } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      const granted = status === 'granted';

      setPermissionsStatus((prev) => ({
        ...prev,
        mediaLibrary: {
          granted,
          canAskAgain,
          status: granted ? 'granted' : canAskAgain ? 'undetermined' : 'denied',
        },
      }));

      return granted;
    } catch (error) {
      console.error('Error requesting media library permission:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Request location permission
   */
  const requestLocationPermission = useCallback(async (): Promise<boolean> => {
    try {
      setLoading(true);
      const { status, canAskAgain } = await Location.requestForegroundPermissionsAsync();
      const granted = status === 'granted';

      setPermissionsStatus((prev) => ({
        ...prev,
        location: {
          granted,
          canAskAgain,
          status: granted ? 'granted' : canAskAgain ? 'undetermined' : 'denied',
        },
      }));

      return granted;
    } catch (error) {
      console.error('Error requesting location permission:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Request notification permission
   */
  const requestNotificationPermission = useCallback(async (): Promise<boolean> => {
    try {
      setLoading(true);
      const { status, canAskAgain } = await Notifications.requestPermissionsAsync();
      const granted = status === 'granted';

      setPermissionsStatus((prev) => ({
        ...prev,
        notifications: {
          granted,
          canAskAgain,
          status: granted ? 'granted' : canAskAgain ? 'undetermined' : 'denied',
        },
      }));

      return granted;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    } finally {
      setLoading(false);
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
  const requestAllPermissions = useCallback(async (): Promise<AllPermissionsStatus> => {
    await Promise.all([requestCameraPermission(), requestMediaLibraryPermission(), requestLocationPermission(), requestNotificationPermission()]);

    return permissionsStatus;
  }, [requestCameraPermission, requestMediaLibraryPermission, requestLocationPermission, requestNotificationPermission, permissionsStatus]);

  /**
   * Open app settings
   */
  const openSettings = useCallback(() => {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:');
    } else {
      Linking.openSettings();
    }
  }, []);

  /**
   * Show alert for denied permission with option to open settings
   * Note: This returns JSX that must be rendered by the parent component
   */
  const showPermissionAlert = useCallback(
    (permissionName: string, permissionDescription: string, onConfirm?: () => void) => {
      // Return a configuration object that parent can use with useAlert
      return {
        title: `${permissionName} Permission Required`,
        message: `${permissionDescription}\n\nPlease enable this permission in your device settings.`,
        buttons: [
          { text: 'Cancel', style: 'cancel' as const },
          { text: 'Open Settings', onPress: onConfirm || openSettings },
        ],
      };
    },
    [openSettings]
  );

  /**
   * Check if a specific permission is granted
   */
  const isPermissionGranted = useCallback(
    (type: PermissionType): boolean => {
      return permissionsStatus[type].granted;
    },
    [permissionsStatus]
  );

  /**
   * Check if all critical permissions are granted
   */
  const areAllCriticalPermissionsGranted = useCallback((): boolean => {
    // Define which permissions are critical for your app
    // For this app, notifications is critical
    return permissionsStatus.notifications.granted;
  }, [permissionsStatus]);

  /**
   * Get permission status for a specific permission
   */
  const getPermissionStatus = useCallback(
    (type: PermissionType): PermissionStatus => {
      return permissionsStatus[type];
    },
    [permissionsStatus]
  );

  // Check permissions on mount
  useEffect(() => {
    checkAllPermissions();
  }, [checkAllPermissions]);

  return {
    permissionsStatus,
    loading,
    requestPermission,
    requestAllPermissions,
    requestCameraPermission,
    requestMediaLibraryPermission,
    requestLocationPermission,
    requestNotificationPermission,
    checkAllPermissions,
    openSettings,
    showPermissionAlert,
    isPermissionGranted,
    areAllCriticalPermissionsGranted,
    getPermissionStatus,
  };
}
