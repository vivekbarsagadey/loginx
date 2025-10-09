/**
 * Menu Items and Navigation Data
 * Contains menu structures for various sections of the app
 */

import type { Routes } from '@/constants/routes';

export interface MenuItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: string;
  iconFamily?: 'Ionicons' | 'MaterialIcons' | 'Feather' | 'FontAwesome';
  route?: keyof typeof Routes | string;
  action?: string;
  badge?: string | number;
  showChevron?: boolean;
  destructive?: boolean;
  disabled?: boolean;
}

export interface MenuSection {
  id: string;
  title?: string;
  items: MenuItem[];
}

/**
 * Settings menu structure
 */
export const settingsMenu: MenuSection[] = [
  {
    id: 'account',
    title: 'Account',
    items: [
      {
        id: 'profile',
        title: 'Profile',
        subtitle: 'Name, photo, and personal info',
        icon: 'person-outline',
        iconFamily: 'Ionicons',
        route: '/profile',
        showChevron: true,
      },
      {
        id: 'email-phone',
        title: 'Email & Phone',
        subtitle: 'Manage your contact information',
        icon: 'mail-outline',
        iconFamily: 'Ionicons',
        route: '/profile/contact',
        showChevron: true,
      },
      {
        id: 'preferences',
        title: 'Preferences',
        subtitle: 'Customize your experience',
        icon: 'settings-outline',
        iconFamily: 'Ionicons',
        route: '/settings/preferences',
        showChevron: true,
      },
    ],
  },
  {
    id: 'security',
    title: 'Security & Privacy',
    items: [
      {
        id: 'security',
        title: 'Security',
        subtitle: 'Password, 2FA, and biometric login',
        icon: 'shield-checkmark-outline',
        iconFamily: 'Ionicons',
        route: '/security',
        showChevron: true,
      },
      {
        id: 'privacy',
        title: 'Privacy',
        subtitle: 'Control your data and privacy',
        icon: 'lock-closed-outline',
        iconFamily: 'Ionicons',
        route: '/settings/privacy',
        showChevron: true,
      },
      {
        id: 'login-history',
        title: 'Login History',
        subtitle: 'Recent account activity',
        icon: 'time-outline',
        iconFamily: 'Ionicons',
        route: '/security/login-history',
        showChevron: true,
      },
    ],
  },
  {
    id: 'app',
    title: 'App Settings',
    items: [
      {
        id: 'notifications',
        title: 'Notifications',
        subtitle: 'Manage notification preferences',
        icon: 'notifications-outline',
        iconFamily: 'Ionicons',
        route: '/settings/notifications',
        showChevron: true,
      },
      {
        id: 'appearance',
        title: 'Appearance',
        subtitle: 'Theme and display options',
        icon: 'color-palette-outline',
        iconFamily: 'Ionicons',
        route: '/settings/appearance',
        showChevron: true,
      },
      {
        id: 'language',
        title: 'Language',
        subtitle: 'English',
        icon: 'language-outline',
        iconFamily: 'Ionicons',
        action: 'change-language',
        showChevron: true,
      },
      {
        id: 'storage',
        title: 'Storage',
        subtitle: 'Manage app data and cache',
        icon: 'server-outline',
        iconFamily: 'Ionicons',
        route: '/settings/storage',
        showChevron: true,
      },
    ],
  },
  {
    id: 'support',
    title: 'Help & Support',
    items: [
      {
        id: 'help',
        title: 'Help Center',
        subtitle: 'Get answers to your questions',
        icon: 'help-circle-outline',
        iconFamily: 'Ionicons',
        route: '/help',
        showChevron: true,
      },
      {
        id: 'feedback',
        title: 'Send Feedback',
        subtitle: 'Share your thoughts',
        icon: 'chatbubble-outline',
        iconFamily: 'Ionicons',
        route: '/feedback',
        showChevron: true,
      },
      {
        id: 'rate',
        title: 'Rate App',
        subtitle: 'Enjoying LoginX? Rate us!',
        icon: 'star-outline',
        iconFamily: 'Ionicons',
        route: '/rate-app',
        showChevron: true,
      },
      {
        id: 'support',
        title: 'Contact Support',
        subtitle: 'Get help from our team',
        icon: 'headset-outline',
        iconFamily: 'Ionicons',
        route: '/support',
        showChevron: true,
      },
    ],
  },
  {
    id: 'about',
    title: 'About',
    items: [
      {
        id: 'about',
        title: 'About LoginX',
        subtitle: 'Version 1.0.0',
        icon: 'information-circle-outline',
        iconFamily: 'Ionicons',
        route: '/about',
        showChevron: true,
      },
      {
        id: 'privacy-policy',
        title: 'Privacy Policy',
        icon: 'document-text-outline',
        iconFamily: 'Ionicons',
        route: '/legal/privacy',
        showChevron: true,
      },
      {
        id: 'terms',
        title: 'Terms of Service',
        icon: 'document-text-outline',
        iconFamily: 'Ionicons',
        route: '/legal/terms',
        showChevron: true,
      },
      {
        id: 'licenses',
        title: 'Open Source Licenses',
        icon: 'code-outline',
        iconFamily: 'Ionicons',
        route: '/legal/licenses',
        showChevron: true,
      },
    ],
  },
  {
    id: 'account-actions',
    items: [
      {
        id: 'logout',
        title: 'Log Out',
        icon: 'log-out-outline',
        iconFamily: 'Ionicons',
        action: 'logout',
        showChevron: false,
      },
      {
        id: 'delete-account',
        title: 'Delete Account',
        icon: 'trash-outline',
        iconFamily: 'Ionicons',
        action: 'delete-account',
        destructive: true,
        showChevron: false,
      },
    ],
  },
];

/**
 * Profile menu structure
 */
export const profileMenu: MenuSection[] = [
  {
    id: 'personal',
    title: 'Personal Information',
    items: [
      {
        id: 'edit-profile',
        title: 'Edit Profile',
        subtitle: 'Update your name and photo',
        icon: 'person-outline',
        iconFamily: 'Ionicons',
        route: '/profile/edit',
        showChevron: true,
      },
      {
        id: 'bio',
        title: 'Bio',
        subtitle: 'Tell us about yourself',
        icon: 'document-text-outline',
        iconFamily: 'Ionicons',
        route: '/profile/bio',
        showChevron: true,
      },
    ],
  },
  {
    id: 'contact',
    title: 'Contact Information',
    items: [
      {
        id: 'email',
        title: 'Email',
        icon: 'mail-outline',
        iconFamily: 'Ionicons',
        route: '/profile/email',
        showChevron: true,
      },
      {
        id: 'phone',
        title: 'Phone',
        icon: 'call-outline',
        iconFamily: 'Ionicons',
        route: '/profile/phone',
        showChevron: true,
      },
    ],
  },
];

/**
 * Security menu structure
 */
export const securityMenu: MenuSection[] = [
  {
    id: 'authentication',
    title: 'Authentication',
    items: [
      {
        id: 'password',
        title: 'Change Password',
        subtitle: 'Update your login password',
        icon: 'key-outline',
        iconFamily: 'Ionicons',
        route: '/security/password',
        showChevron: true,
      },
      {
        id: '2fa',
        title: 'Two-Factor Authentication',
        subtitle: 'Add extra security to your account',
        icon: 'shield-checkmark-outline',
        iconFamily: 'Ionicons',
        route: '/security/2fa',
        showChevron: true,
      },
      {
        id: 'biometric',
        title: 'Biometric Login',
        subtitle: 'Use Face ID or Touch ID',
        icon: 'finger-print-outline',
        iconFamily: 'Ionicons',
        route: '/security/biometric',
        showChevron: true,
      },
    ],
  },
  {
    id: 'activity',
    title: 'Account Activity',
    items: [
      {
        id: 'login-history',
        title: 'Login History',
        subtitle: 'Recent login attempts',
        icon: 'time-outline',
        iconFamily: 'Ionicons',
        route: '/security/login-history',
        showChevron: true,
      },
      {
        id: 'devices',
        title: 'Trusted Devices',
        subtitle: 'Manage your devices',
        icon: 'phone-portrait-outline',
        iconFamily: 'Ionicons',
        route: '/security/devices',
        showChevron: true,
      },
    ],
  },
];

/**
 * Get menu section by ID
 */
export function getMenuSection(menu: MenuSection[], sectionId: string): MenuSection | undefined {
  return menu.find((section) => section.id === sectionId);
}

/**
 * Get menu item by ID
 */
export function getMenuItem(menu: MenuSection[], itemId: string): MenuItem | undefined {
  for (const section of menu) {
    const item = section.items.find((item) => item.id === itemId);
    if (item) {
      return item;
    }
  }
  return undefined;
}

/**
 * Flatten menu structure to get all items
 */
export function getAllMenuItems(menu: MenuSection[]): MenuItem[] {
  return menu.flatMap((section) => section.items);
}
