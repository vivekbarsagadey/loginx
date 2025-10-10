/**
 * Share Option Configurations
 * Centralized share option data with handlers
 */

import i18n from '@/i18n';
import { WHATSAPP_COLOR } from './share-options';

/**
 * Get share options configuration
 * @param handlers - Object containing share action handlers
 * @param primaryColor - Primary theme color
 * @returns Array of share option configurations with current translations
 */
export function getShareOptionConfigs(
  handlers: {
    handleShareWhatsApp: () => Promise<void>;
    handleShareSMS: () => Promise<void>;
    handleShareEmail: () => Promise<void>;
    handleNativeShare: () => Promise<void>;
  },
  primaryColor: string
) {
  return [
    {
      id: 'whatsapp',
      icon: 'message-circle' as const,
      title: i18n.t('shareApp.options.whatsapp', { defaultValue: 'Share via WhatsApp' }),
      subtitle: i18n.t('shareApp.options.whatsappSubtitle', {
        defaultValue: 'Share your referral link with friends on WhatsApp',
      }),
      onPress: handlers.handleShareWhatsApp,
      color: WHATSAPP_COLOR,
    },
    {
      id: 'sms',
      icon: 'message-square' as const,
      title: i18n.t('shareApp.options.sms', { defaultValue: 'Share via SMS' }),
      subtitle: i18n.t('shareApp.options.smsSubtitle', {
        defaultValue: 'Send your referral link via text message',
      }),
      onPress: handlers.handleShareSMS,
      color: primaryColor,
    },
    {
      id: 'email',
      icon: 'mail' as const,
      title: i18n.t('shareApp.options.email', { defaultValue: 'Share via Email' }),
      subtitle: i18n.t('shareApp.options.emailSubtitle', {
        defaultValue: 'Send your referral link via email',
      }),
      onPress: handlers.handleShareEmail,
      color: primaryColor,
    },
    {
      id: 'more',
      icon: 'share-2' as const,
      title: i18n.t('shareApp.options.more', { defaultValue: 'More Options' }),
      subtitle: i18n.t('shareApp.options.moreSubtitle', {
        defaultValue: 'Share via other apps and platforms',
      }),
      onPress: handlers.handleNativeShare,
      color: primaryColor,
    },
  ];
}
