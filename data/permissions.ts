/**
 * Permissions Configuration
 * Centralized permission data
 */

import i18n from '@/i18n';
import type { Permission, PermissionType } from '@/types/permission';

/**
 * Get permissions configuration
 * @param handlers - Object containing permission request handlers
 * @returns Array of permission configurations with current translations
 */
export function getPermissions(handlers: {
  requestNotificationPermission: () => Promise<boolean>;
  requestCameraPermission: () => Promise<boolean>;
  requestMediaLibraryPermission: () => Promise<boolean>;
  requestLocationPermission: () => Promise<boolean>;
}): Permission[] {
  return [
    {
      type: 'notifications' as PermissionType,
      icon: 'notifications',
      title: i18n.t('permissions.notifications.title'),
      description: i18n.t('permissions.notifications.description'),
      requestFn: handlers.requestNotificationPermission,
    },
    {
      type: 'camera' as PermissionType,
      icon: 'camera',
      title: i18n.t('permissions.camera.title'),
      description: i18n.t('permissions.camera.description'),
      requestFn: handlers.requestCameraPermission,
    },
    {
      type: 'mediaLibrary' as PermissionType,
      icon: 'images',
      title: i18n.t('permissions.mediaLibrary.title'),
      description: i18n.t('permissions.mediaLibrary.description'),
      requestFn: handlers.requestMediaLibraryPermission,
    },
    {
      type: 'location' as PermissionType,
      icon: 'location',
      title: i18n.t('permissions.location.title'),
      description: i18n.t('permissions.location.description'),
      requestFn: handlers.requestLocationPermission,
    },
  ];
}
