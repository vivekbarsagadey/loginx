/**
 * Notification Settings Types
 * Type definitions for notification preferences
 */

export type NotificationSettingKey = 'pushEnabled' | 'emailUpdates' | 'marketingTips';

export interface NotificationSetting {
  key: NotificationSettingKey;
  icon: string;
  title: string;
  description: string;
}

export interface NotificationSettings {
  pushEnabled: boolean;
  emailUpdates: boolean;
  marketingTips: boolean;
}
