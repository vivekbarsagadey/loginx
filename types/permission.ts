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
