
import { Href } from "expo-router";

export type SettingsItem =
  | { type: "link"; icon: string; title: string; subtitle?: string; href: Href }
  | { type: "toggle"; icon: string; title: string; subtitle?: string; key: "pushEnabled"|"emailUpdates"|"marketingTips" }
  | { type: "label"; icon: string; title: string; subtitle?: string; value: string }
  | { type: "danger"; icon: string; title: string; subtitle?: string; action: "logout" | "deleteAccount" };

export const settingsSections: { title?: string; items: SettingsItem[] }[] = [
  {
    title: "Appearance",
    items: [
      { type: "link", icon: "moon", title: "Theme", subtitle: "System, Light, Dark", href: "/settings/theme" },
      { type: "link", icon: "type", title: "Text size", subtitle: "Default", href: "/settings/text-size" },
    ],
  },
  {
    title: "Notifications",
    items: [
      { type: "toggle", icon: "bell", title: "Push notifications", key: "pushEnabled" },
      { type: "toggle", icon: "mail", title: "Email updates", key: "emailUpdates" },
      { type: "toggle", icon: "megaphone", title: "Marketing tips", key: "marketingTips" },
    ],
  },
  {
    title: "Security & Privacy",
    items: [
      { type: "link", icon: "key", title: "Change password", href: "/security/change-password" },
      { type: "link", icon: "smartphone", title: "Active sessions", href: "/security/sessions" },
      { type: "link", icon: "shield", title: "Two-factor authentication", href: "/security/2fa" },
      { type: "link", icon: "lock", title: "Data & privacy", href: "/privacy" },
    ],
  },
  {
    title: "Help & Feedback",
    items: [
      { type: "link", icon: "help-circle", title: "Help Center", href: "/help" },
      { type: "link", icon: "message-square", title: "Give feedback", href: "/feedback" },
      { type: "link", icon: "headphones", title: "Contact support", href: "/support" },
    ],
  },
  {
    title: "About",
    items: [
      { type: "label", icon: "info", title: "Version", value: "1.0.3 (73)" },
      { type: "link", icon: "gift", title: "What's new", href: "/about/whats-new" },
    ],
  },
  {
    title: "Legal",
    items: [
        { type: "link", icon: "file-text", title: "Terms of Service", href: "/legal/terms" },
        { type: "link", icon: "shield", title: "Privacy Policy", href: "/legal/privacy" },
        { type: "link", icon: "file", title: "License information", href: "/legal/license" },
    ]
  },
  {
    items: [
        { type: "danger", icon: "trash-2", title: "Delete Account", action: "deleteAccount" },
        { type: "danger", icon: "log-out", title: "Log out", action: "logout" }
    ],
  },
];
