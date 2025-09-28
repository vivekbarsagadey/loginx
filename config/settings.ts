
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
      { type: "link", icon: "type", title: i18n.t('settings.textSize'), subtitle: i18n.t('settings.textSizeSubtitle'), href: "/settings/text-size" },
    ],
  },
  {
    title: i18n.t('settings.notifications'),
    items: [
      { type: "toggle", icon: "bell", title: i18n.t('settings.pushNotifications'), key: "pushEnabled" },
      { type: "toggle", icon: "mail", title: i18n.t('settings.emailUpdates'), key: "emailUpdates" },
      { type: "toggle", icon: "megaphone", title: i18n.t('settings.marketingTips'), key: "marketingTips" },
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
      { type: "label", icon: "info", title: i18n.t('settings.version'), value: "1.0.3 (73)" },
      { type: "link", icon: "gift", title: i18n.t('settings.whatsNew'), href: "/about/whats-new" },
    ],
  },
  {
    title: i18n.t('settings.legal'),
    items: [
        { type: "link", icon: "file-text", title: i18n.t('settings.termsOfService'), href: "/legal/terms" },
        { type: "link", icon: "shield", title: i18n.t('settings.privacyPolicy'), href: "/legal/privacy" },
        { type: "link", icon: "file", title: i18n.t('settings.licenseInformation'), href: "/legal/license" },
    ]
  },
  {
    items: [
        { type: "danger", icon: "trash-2", title: i18n.t('settings.deleteAccount'), action: "deleteAccount" },
        { type: "danger", icon: "log-out", title: i18n.t('settings.logOut'), action: "logout" }
    ],
  },
];
