/**
 * Notification Settings Configuration
 * Centralized notification settings data
 */

import i18n from '@/i18n';
import type { NotificationSetting, NotificationSettingKey } from '@/types/notification-settings';

/**
 * Get notification settings configuration
 * @returns Array of notification settings with current translations
 */
export function getNotificationSettings(): NotificationSetting[] {
  return [
    {
      key: 'pushEnabled' as NotificationSettingKey,
      icon: 'bell' as const,
      title: i18n.t('screens.settings.notifications.items.pushEnabled.title'),
      description: i18n.t('screens.settings.notifications.items.pushEnabled.description'),
    },
    {
      key: 'emailUpdates' as NotificationSettingKey,
      icon: 'mail' as const,
      title: i18n.t('screens.settings.notifications.items.emailUpdates.title'),
      description: i18n.t('screens.settings.notifications.items.emailUpdates.description'),
    },
    {
      key: 'marketingTips' as NotificationSettingKey,
      icon: 'trending-up' as const,
      title: i18n.t('screens.settings.notifications.items.marketingTips.title'),
      description: i18n.t('screens.settings.notifications.items.marketingTips.description'),
    },
  ];
}

/**
 * Default notification settings
 */
export const DEFAULT_NOTIFICATION_SETTINGS = {
  pushEnabled: false,
  emailUpdates: false,
  marketingTips: false,
};
