/**
 * Theme & Internationalization Hooks
 *
 * This module exports hooks for theme management and i18n:
 * - Theme context and provider
 * - Theme color utilities
 * - Color scheme detection (light/dark)
 * - Language selection and provider
 * - Internationalization support
 * - Localized date formatting
 */

export * from './use-color-scheme';
export * from './use-theme-color';
export * from './use-theme-colors';
export * from './use-theme-context';
// Note: Both use-language and use-language-provider export useLanguage
// use-language-provider is the main provider, use-language is standalone
export { LanguageProvider, useLanguage } from './use-language-provider';
export * from './use-localized-date';

