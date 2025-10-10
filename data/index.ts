/**
 * Data Module Index
 * Central export point for all data files
 *
 * This module provides easy access to all static data used throughout the app:
 * - Sample notifications
 * - App features
 * - FAQs and help content
 * - Menu structures
 * - Tips and hints
 * - Example/demo data
 * - Available languages
 *
 * Usage:
 * ```typescript
 * import { sampleNotifications, appFeatures, faqData, languages } from '@/data';
 * import { getSampleNotifications, getLanguageByCode } from '@/data';
 * ```
 */

// Notifications
export { createNotification, getSampleNotifications, sampleNotifications } from './notifications';

// Features
export { appFeatures, getConvenienceFeatures, getFeaturesByCategory, getPrivacyFeatures, getSecurityFeatures } from './features';
export type { Feature } from './features';

// FAQs
export { faqData, getFAQById, getFAQsByCategory, searchFAQs } from './faq';
export type { FAQItem } from './faq';

// Menu Items
export { getAllMenuItems, getMenuItem, getMenuSection, profileMenu, securityMenu, settingsMenu } from './menu-items';
export type { MenuItem, MenuSection } from './menu-items';

// Tips
export { allTips, featureTips, getHighPriorityTips, getRandomTip, getRandomTipsByCategory, getTipsByCategory, getTipsByPriority, privacyTips, productivityTips, securityTips } from './tips';
export type { Tip } from './tips';

// Examples
export { getSampleData, sampleActivityLog, sampleItems, sampleUsers } from './examples';
export type { ActivityLogEntry, SampleItem, SampleUser } from './examples';

// Languages
export { getDefaultLanguage, getLanguageByCode, getLanguageCodes, isLanguageSupported, languages } from './languages';
