/**
 * Language Types
 * Type definitions for language selection and localization
 */

/**
 * Supported language codes following ISO 639-1 standard
 */
export type LanguageCode = 'en' | 'es' | 'hi';

/**
 * Language information for display and selection
 */
export interface Language {
  /** ISO 639-1 language code */
  code: LanguageCode;
  /** English name of the language */
  name: string;
  /** Native name of the language (in the language itself) */
  nativeName: string;
  /** Flag emoji representing the country/region */
  flag: string;
  /** Country or region name in native language */
  description: string;
}

/**
 * Language selection state
 */
export interface LanguageState {
  /** Currently selected language code */
  currentLanguage: LanguageCode;
  /** Available languages for selection */
  availableLanguages: Language[];
}
