/**
 * Frequently Asked Questions Data
 * Contains FAQ items for help and support sections
 */

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'account' | 'security' | 'privacy' | 'technical' | 'billing' | 'general';
  tags?: string[];
}

/**
 * FAQ items organized by category
 */
export const faqData: FAQItem[] = [
  // Account Questions
  {
    id: 'acc_1',
    question: 'How do I create an account?',
    answer: 'You can create an account by tapping "Sign Up" on the welcome screen. You can register using your email, phone number, or by signing in with Google or Apple.',
    category: 'account',
    tags: ['signup', 'registration', 'create account'],
  },
  {
    id: 'acc_2',
    question: 'How do I reset my password?',
    answer: 'On the login screen, tap "Forgot Password?" and follow the instructions. You\'ll receive a password reset link via email or SMS depending on your registration method.',
    category: 'account',
    tags: ['password', 'reset', 'forgot password'],
  },
  {
    id: 'acc_3',
    question: 'Can I change my email address?',
    answer: "Yes! Go to Settings > Profile > Email Address. You'll need to verify your new email address before the change takes effect.",
    category: 'account',
    tags: ['email', 'change email', 'update email'],
  },
  {
    id: 'acc_4',
    question: 'How do I delete my account?',
    answer: 'Go to Settings > Security > Delete Account. Please note that this action is permanent and cannot be undone. All your data will be permanently deleted.',
    category: 'account',
    tags: ['delete', 'remove account', 'close account'],
  },

  // Security Questions
  {
    id: 'sec_1',
    question: 'What is two-factor authentication (2FA)?',
    answer: '2FA adds an extra layer of security by requiring a second verification step when logging in. This can be a code from an authenticator app, SMS, or email.',
    category: 'security',
    tags: ['2fa', 'security', 'authentication'],
  },
  {
    id: 'sec_2',
    question: 'How do I enable biometric authentication?',
    answer: 'Go to Settings > Security > Biometric Login. Make sure you have Face ID, Touch ID, or fingerprint enabled on your device first.',
    category: 'security',
    tags: ['biometric', 'face id', 'touch id', 'fingerprint'],
  },
  {
    id: 'sec_3',
    question: 'Is my data encrypted?',
    answer: 'Yes! All your data is encrypted both in transit (using HTTPS) and at rest (using AES-256 encryption). We take security very seriously.',
    category: 'security',
    tags: ['encryption', 'security', 'data protection'],
  },
  {
    id: 'sec_4',
    question: 'What should I do if I notice suspicious activity?',
    answer: 'Immediately change your password, enable 2FA if not already active, and review your recent login activity in Settings > Security > Login History. Contact support if needed.',
    category: 'security',
    tags: ['suspicious', 'hacked', 'security breach'],
  },

  // Privacy Questions
  {
    id: 'priv_1',
    question: 'What data do you collect?',
    answer: 'We collect only the data necessary to provide our services: email/phone, profile information, and usage analytics. See our Privacy Policy for details.',
    category: 'privacy',
    tags: ['data', 'privacy', 'collection'],
  },
  {
    id: 'priv_2',
    question: 'Do you share my data with third parties?',
    answer: 'We do not sell your data. We only share data with service providers necessary to operate the app (like authentication services) and only as described in our Privacy Policy.',
    category: 'privacy',
    tags: ['sharing', 'third party', 'privacy'],
  },
  {
    id: 'priv_3',
    question: 'How can I download my data?',
    answer: "Go to Settings > Privacy > Download My Data. We'll prepare an archive of all your data and send you a download link.",
    category: 'privacy',
    tags: ['data export', 'download', 'gdpr'],
  },
  {
    id: 'priv_4',
    question: 'Can I opt out of analytics?',
    answer: 'Yes! Go to Settings > Privacy > Analytics and disable "Share Usage Data". This won\'t affect app functionality.',
    category: 'privacy',
    tags: ['analytics', 'tracking', 'opt out'],
  },

  // Technical Questions
  {
    id: 'tech_1',
    question: 'Does the app work offline?',
    answer: "Yes! The app uses an offline-first architecture. You can access your data and make changes offline, which will sync automatically when you're back online.",
    category: 'technical',
    tags: ['offline', 'sync', 'connectivity'],
  },
  {
    id: 'tech_2',
    question: "Why isn't the app syncing?",
    answer: "Check your internet connection. If you're online, try pulling down to refresh. Pending changes are queued and will sync automatically when connection is restored.",
    category: 'technical',
    tags: ['sync', 'connectivity', 'troubleshooting'],
  },
  {
    id: 'tech_3',
    question: 'How do I update the app?',
    answer: 'Visit the App Store (iOS) or Google Play Store (Android) and check for updates. Enable automatic updates to always have the latest version.',
    category: 'technical',
    tags: ['update', 'version', 'app store'],
  },
  {
    id: 'tech_4',
    question: 'The app is crashing. What should I do?',
    answer: 'Try restarting the app. If it persists, clear the app cache in Settings > General > Clear Cache. As a last resort, uninstall and reinstall the app.',
    category: 'technical',
    tags: ['crash', 'bug', 'troubleshooting'],
  },

  // General Questions
  {
    id: 'gen_1',
    question: 'Is the app free?',
    answer: 'Yes! LoginX is completely free to use with all core features available at no cost.',
    category: 'general',
    tags: ['free', 'pricing', 'cost'],
  },
  {
    id: 'gen_2',
    question: 'What platforms are supported?',
    answer: 'LoginX is available on iOS (iPhone and iPad) and Android devices. Both platforms receive updates simultaneously.',
    category: 'general',
    tags: ['platform', 'ios', 'android'],
  },
  {
    id: 'gen_3',
    question: 'How do I contact support?',
    answer: 'Go to Settings > Help & Support > Contact Us. You can reach us via email, or use the in-app chat feature.',
    category: 'general',
    tags: ['support', 'contact', 'help'],
  },
  {
    id: 'gen_4',
    question: 'Can I use the app in multiple languages?',
    answer: 'Yes! We support multiple languages. Go to Settings > Language to change your preferred language.',
    category: 'general',
    tags: ['language', 'translation', 'localization'],
  },
];

/**
 * Get FAQs by category
 */
export function getFAQsByCategory(category: FAQItem['category']): FAQItem[] {
  return faqData.filter((faq) => faq.category === category);
}

/**
 * Search FAQs by keyword
 */
export function searchFAQs(query: string): FAQItem[] {
  const lowerQuery = query.toLowerCase();
  return faqData.filter((faq) => faq.question.toLowerCase().includes(lowerQuery) || faq.answer.toLowerCase().includes(lowerQuery) || faq.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery)));
}

/**
 * Get FAQ by ID
 */
export function getFAQById(id: string): FAQItem | undefined {
  return faqData.find((faq) => faq.id === id);
}
