import i18n from '@/i18n';
import { Href } from "expo-router";

export type SettingsItem =
  | { type: "link"; icon: string; title: string; subtitle?: string; href: Href }
  | { type: "toggle"; icon: string; title: string; subtitle?: string; key: "pushEnabled"|"emailUpdates"|"marketingTips" }
  | { type: "label"; icon: string; title: string; subtitle?: string; value: string }
  | { type: "danger"; icon: string; title: string; subtitle?: string; action: "logout" | "deleteAccount" };

export const settingsSections: { title?: string; items: SettingsItem[] }[] = [
  {
    title: i18n.t('settings.appearance'),
    items: [
      { type: "link", icon: "moon", title: i18n.t('settings.theme'), subtitle: i18n.t('settings.themeSubtitle'), href: "/settings/theme" },
      { type: "link", icon: "globe", title: i18n.t('settings.language'), subtitle: i18n.t('settings.languageSubtitle'), href: "/settings/language" },
      { type: "link", icon: "type", title: i18n.t('settings.textSize'), href: "/settings/text-size" },
    ],
  },
  {
    title: i18n.t('settings.account'),
    items: [
      { type: "link", icon: "user", title: i18n.t('settings.editProfile'), href: "/profile/edit" },
      { type: "link", icon: "bell", title: i18n.t('settings.notifications'), href: "/settings/notifications" },
      { type: "link", icon: "at-sign", title: i18n.t('settings.updateEmail'), href: "/profile/update-email" },
    ],
  },
  {
    title: i18n.t('settings.securityAndPrivacy'),
    items: [
      { type: "link", icon: "key", title: i18n.t('settings.changePassword'), href: "/security/change-password" },
      { type: "link", icon: "smartphone", title: i18n.t('settings.activeSessions'), href: "/security/sessions" },
      { type: "link", icon: "shield", title: i18n.t('settings.twoFactorAuth'), href: "/security/2fa" },
      { type: "link", icon: "lock", title: i18n.t('settings.dataAndPrivacy'), href: "/privacy" },
    ],
  },
  {
    title: i18n.t('settings.helpAndFeedback'),
    items: [
      { type: "link", icon: "help-circle", title: i18n.t('settings.helpCenter'), href: "/help" },
      { type: "link", icon: "message-square", title: i18n.t('settings.giveFeedback'), href: "/feedback" },
      { type: "link", icon: "headphones", title: i18n.t('settings.contactSupport'), href: "/support" },
    ],
  },
  {
    title: i18n.t('settings.about'),
    items: [
      { type: "link", icon: "info", title: i18n.t('settings.whatsNew'), href: "/about/whats-new" },
      { type: "link", icon: "file-text", title: i18n.t('settings.termsOfService'), href: "/legal/terms" },
      { type: "link", icon: "shield-check", title: i18n.t('settings.privacyPolicy'), href: "/legal/privacy" },
      { type: "link", icon: "award", title: i18n.t('settings.license'), href: "/legal/license" },
    ],
  },
];