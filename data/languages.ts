/**
 * Available Languages
 * Centralized data for all supported languages in the application
 *
 * To add a new language:
 * 1. Add the language code to LanguageCode type in types/language.ts
 * 2. Add the language object to this array
 * 3. Create translation files in i18n/locales/
 * 4. Update i18n configuration
 */

import type { Language } from '@/types/language';

/**
 * List of all supported languages with their metadata
 * Languages are displayed in the order defined here
 */
export const languages: Language[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    description: 'United States',
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    description: 'España',
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    flag: '🇮🇳',
    description: 'भारत', // Bhārat in Hindi
  },
];

/**
 * Get language by code
 * @param code - ISO 639-1 language code
 * @returns Language object or undefined if not found
 */
export function getLanguageByCode(code: string): Language | undefined {
  return languages.find((lang) => lang.code === code);
}

/**
 * Get default language (first in the list)
 * @returns Default language object
 */
export function getDefaultLanguage(): Language {
  return languages[0];
}

/**
 * Check if language code is supported
 * @param code - ISO 639-1 language code
 * @returns True if language is supported
 */
export function isLanguageSupported(code: string): boolean {
  return languages.some((lang) => lang.code === code);
}

/**
 * Get all available language codes
 * @returns Array of supported language codes
 */
export function getLanguageCodes(): string[] {
  return languages.map((lang) => lang.code);
}
