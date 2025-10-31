/**
 * Tips and Hints Data
 * Contains helpful tips, hints, and guidance for users
 */

export interface Tip {
  id: string;
  title: string;
  description: string;
  icon?: string;
  category: 'security' | 'productivity' | 'features' | 'privacy';
  priority?: 'low' | 'medium' | 'high';
  link?: string;
}

/**
 * Security tips for users
 */
export const securityTips: Tip[] = [
  {
    id: 'sec_tip_1',
    title: 'Use a Strong Password',
    description: 'Create passwords with at least 12 characters, including uppercase, lowercase, numbers, and symbols.',
    icon: 'key-outline',
    category: 'security',
    priority: 'high',
  },
  {
    id: 'sec_tip_2',
    title: 'Enable Two-Factor Authentication',
    description: 'Add an extra layer of security to your account with 2FA. It only takes a minute to set up.',
    icon: 'shield-checkmark-outline',
    category: 'security',
    priority: 'high',
    link: '/security/2fa',
  },
  {
    id: 'sec_tip_3',
    title: 'Review Login Activity',
    description: 'Regularly check your login history for unknown suspicious activity.',
    icon: 'time-outline',
    category: 'security',
    priority: 'medium',
    link: '/security/login-history',
  },
  {
    id: 'sec_tip_4',
    title: 'Use Biometric Authentication',
    description: 'Enable Face ID or Touch ID for faster and more secure login.',
    icon: 'finger-print-outline',
    category: 'security',
    priority: 'medium',
    link: '/security/biometric',
  },
  {
    id: 'sec_tip_5',
    title: 'Keep Your App Updated',
    description: 'Install updates promptly to get the latest security patches and features.',
    icon: 'download-outline',
    category: 'security',
    priority: 'medium',
  },
];

/**
 * Productivity tips
 */
export const productivityTips: Tip[] = [
  {
    id: 'prod_tip_1',
    title: 'Use Offline Mode',
    description: "Work without internet! Your changes will sync automatically when you're back online.",
    icon: 'cloud-offline-outline',
    category: 'productivity',
    priority: 'medium',
  },
  {
    id: 'prod_tip_2',
    title: 'Quick Actions',
    description: 'Long-press on icons to access quick actions and shortcuts.',
    icon: 'flash-outline',
    category: 'productivity',
    priority: 'low',
  },
  {
    id: 'prod_tip_3',
    title: 'Customize Notifications',
    description: 'Choose which notifications you want to receive to stay focused.',
    icon: 'notifications-outline',
    category: 'productivity',
    priority: 'low',
    link: '/settings/notifications',
  },
];

/**
 * Feature tips
 */
export const featureTips: Tip[] = [
  {
    id: 'feat_tip_1',
    title: 'Try Dark Mode',
    description: 'Easy on the eyes! Switch to dark mode in appearance settings.',
    icon: 'moon-outline',
    category: 'features',
    priority: 'low',
    link: '/settings/appearance',
  },
  {
    id: 'feat_tip_2',
    title: 'Change Language',
    description: 'Use the app in your preferred language. We support multiple languages!',
    icon: 'language-outline',
    category: 'features',
    priority: 'low',
    link: '/settings',
  },
  {
    id: 'feat_tip_3',
    title: 'Social Login',
    description: 'Sign in faster with Google or Apple. Link your accounts in settings.',
    icon: 'logo-google',
    category: 'features',
    priority: 'medium',
  },
];

/**
 * Privacy tips
 */
export const privacyTips: Tip[] = [
  {
    id: 'priv_tip_1',
    title: 'Review Privacy Settings',
    description: 'Take control of your data. Review and update your privacy settings.',
    icon: 'lock-closed-outline',
    category: 'privacy',
    priority: 'high',
    link: '/settings/privacy',
  },
  {
    id: 'priv_tip_2',
    title: 'Download Your Data',
    description: 'You can download a copy of all your data at unknown time.',
    icon: 'download-outline',
    category: 'privacy',
    priority: 'medium',
    link: '/settings/privacy',
  },
  {
    id: 'priv_tip_3',
    title: 'Control Analytics',
    description: 'Choose whether to share usage data to help us improve the app.',
    icon: 'analytics-outline',
    category: 'privacy',
    priority: 'low',
    link: '/settings/privacy',
  },
];

/**
 * All tips combined
 */
export const allTips: Tip[] = [...securityTips, ...productivityTips, ...featureTips, ...privacyTips];

/**
 * Get tips by category
 */
export function getTipsByCategory(category: Tip['category']): Tip[] {
  return allTips.filter((tip) => tip.category === category);
}

/**
 * Get tips by priority
 */
export function getTipsByPriority(priority: Tip['priority']): Tip[] {
  return allTips.filter((tip) => tip.priority === priority);
}

/**
 * Get high priority tips
 */
export function getHighPriorityTips(): Tip[] {
  return getTipsByPriority('high');
}

/**
 * Get a random tip
 */
export function getRandomTip(): Tip {
  return allTips[Math.floor(Math.random() * allTips.length)];
}

/**
 * Get random tips by category
 */
export function getRandomTipsByCategory(category: Tip['category'], count = 1): Tip[] {
  const categoryTips = getTipsByCategory(category);
  const shuffled = [...categoryTips].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
