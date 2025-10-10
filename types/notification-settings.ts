/**
 * Notification Settings Types
 * Type definitions for notification preferences
 */

import type { Feather } from '@expo/vector-icons';
import type { ComponentProps } from 'react';

export type NotificationSettingKey = 'pushEnabled' | 'emailUpdates' | 'marketingTips';

export interface NotificationSetting {
  key: NotificationSettingKey;
  icon: ComponentProps<typeof Feather>['name'];
  title: string;
  description: string;
}

export interface NotificationSettings {
  pushEnabled: boolean;
  emailUpdates: boolean;
  marketingTips: boolean;
}
