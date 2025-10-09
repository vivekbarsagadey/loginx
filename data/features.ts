/**
 * App Features Data
 * Contains information about app features for:
 * - Onboarding slides
 * - Feature showcases
 * - Marketing materials
 */

export interface Feature {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  category?: 'security' | 'convenience' | 'privacy' | 'social';
}

/**
 * Core app features
 * Note: For i18n support, these should be used as fallbacks
 * and translations should be loaded from i18n files
 */
export const appFeatures: Feature[] = [
  {
    id: 'biometric',
    icon: '👆',
    title: 'Biometric Authentication',
    subtitle: 'Fast & Secure Login',
    description: 'Use Face ID, Touch ID, or fingerprint to access your account quickly and securely.',
    category: 'security',
  },
  {
    id: '2fa',
    icon: '🔐',
    title: 'Two-Factor Authentication',
    subtitle: 'Extra Layer of Security',
    description: 'Protect your account with an additional verification step using authenticator apps or SMS.',
    category: 'security',
  },
  {
    id: 'social-login',
    icon: '🌐',
    title: 'Social Login',
    subtitle: 'Sign in with Your Favorite Accounts',
    description: 'Quick login using your existing Google, Apple, or other social media accounts.',
    category: 'convenience',
  },
  {
    id: 'offline-first',
    icon: '📱',
    title: 'Offline-First',
    subtitle: 'Works Without Internet',
    description: "Access your data and continue working even when you're offline. Changes sync automatically when back online.",
    category: 'convenience',
  },
  {
    id: 'privacy',
    icon: '🔒',
    title: 'Privacy First',
    subtitle: 'Your Data, Your Control',
    description: 'We prioritize your privacy. Your data is encrypted and you have full control over what you share.',
    category: 'privacy',
  },
  {
    id: 'dark-mode',
    icon: '🌙',
    title: 'Dark Mode',
    subtitle: 'Easy on the Eyes',
    description: 'Switch between light and dark themes or let the app follow your system preference.',
    category: 'convenience',
  },
  {
    id: 'multi-language',
    icon: '🌍',
    title: 'Multi-Language Support',
    subtitle: 'Use in Your Preferred Language',
    description: 'Access the app in multiple languages with automatic translation and localization.',
    category: 'convenience',
  },
  {
    id: 'notifications',
    icon: '🔔',
    title: 'Smart Notifications',
    subtitle: 'Stay Updated',
    description: 'Get relevant notifications about account activity, security alerts, and important updates.',
    category: 'security',
  },
];

/**
 * Get features by category
 */
export function getFeaturesByCategory(category: Feature['category']): Feature[] {
  return appFeatures.filter((feature) => feature.category === category);
}

/**
 * Get security-focused features
 */
export function getSecurityFeatures(): Feature[] {
  return getFeaturesByCategory('security');
}

/**
 * Get convenience features
 */
export function getConvenienceFeatures(): Feature[] {
  return getFeaturesByCategory('convenience');
}

/**
 * Get privacy features
 */
export function getPrivacyFeatures(): Feature[] {
  return getFeaturesByCategory('privacy');
}
