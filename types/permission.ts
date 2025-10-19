/**
 * Permission Types
 * Type definitions for app permissions
 */

import type { Ionicons } from '@expo/vector-icons';
import type React from 'react';

export type PermissionType = 'camera' | 'mediaLibrary' | 'location' | 'notifications';

export interface Permission {
  type: PermissionType;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  title: string;
  description: string;
  requestFn: () => Promise<boolean>;
}

export interface PermissionStatus {
  granted: boolean;
  canAskAgain: boolean;
}

export type PermissionsStatusMap = Record<PermissionType, PermissionStatus>;

export interface PermissionCardProps {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  title: string;
  description: string;
  granted: boolean;
  canAskAgain: boolean;
  onRequest: () => Promise<void>;
  loading: boolean;
  alert: {
    show: (
      title: string,
      message: string,
      buttons?: { text: string; onPress?: () => void; style?: 'default' | 'cancel' | 'destructive' }[],
      options?: { variant?: 'default' | 'success' | 'warning' | 'error' }
    ) => void;
  };
}

/**
 * Permissions Context State
 * Centralized state for all app permissions
 */
export interface PermissionsContextState {
  /** All permission statuses */
  permissions: PermissionsStatusMap;
  /** Whether permissions are currently being checked */
  isLoading: boolean;
  /** Error message if permission check failed */
  error: string | null;
  /** Last time permissions were checked */
  lastCheckedAt: number | null;
}

/**
 * Default permissions state
 */
export const DEFAULT_PERMISSIONS_STATE: PermissionsContextState = {
  permissions: {
    camera: { granted: false, canAskAgain: true },
    mediaLibrary: { granted: false, canAskAgain: true },
    location: { granted: false, canAskAgain: true },
    notifications: { granted: false, canAskAgain: true },
  },
  isLoading: false,
  error: null,
  lastCheckedAt: null,
};
