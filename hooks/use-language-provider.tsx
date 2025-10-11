import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import type { PropsWithChildren } from 'react';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import i18n from '../i18n';

interface LanguageContextType {
  language: string;
  persistLanguage: (newLanguage: string) => Promise<void>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: PropsWithChildren) {
  const [language, setLanguage] = useState(Localization.getLocales()[0].languageCode || 'en');

  useEffect(() => {
    const getLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('language');
        if (savedLanguage) {
          setLanguage(savedLanguage);
          i18n.locale = savedLanguage;
        } else {
          // Set default locale
          const defaultLocale = Localization.getLocales()[0].languageCode || 'en';
          i18n.locale = defaultLocale;
        }
      } catch (error) {
        // Fall back to default language
      }
    };
    getLanguage();
  }, []);

  const persistLanguage = useCallback(async (newLanguage: string) => {
    try {
      setLanguage(newLanguage);
      i18n.locale = newLanguage;
      await AsyncStorage.setItem('language', newLanguage);
    } catch (error) {
      // Silently fail - not critical
    }
  }, []);

  return <LanguageContext.Provider value={{ language, persistLanguage }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
