import i18n from '@/i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import { useCallback, useEffect, useState } from 'react';

export const useLanguage = () => {
  const [language, setLanguage] = useState(Localization.getLocales()[0].languageCode);

  useEffect(() => {
    const getLanguage = async () => {
      const savedLanguage = await AsyncStorage.getItem('language');
      if (savedLanguage) {
        setLanguage(savedLanguage);
        i18n.locale = savedLanguage;
      }
    };
    getLanguage();
  }, []);

  const persistLanguage = useCallback(async (newLanguage: string) => {
    setLanguage(newLanguage);
    i18n.locale = newLanguage;
    await AsyncStorage.setItem('language', newLanguage);
  }, []);

  return { language, persistLanguage };
};
