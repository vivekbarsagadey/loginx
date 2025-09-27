
import { useState, useEffect } from 'react';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../i18n';

export const useLanguage = () => {
  const [language, setLanguage] = useState(Localization.locale.split('-')[0]);

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

  const persistLanguage = async (newLanguage: string) => {
    setLanguage(newLanguage);
    i18n.locale = newLanguage;
    await AsyncStorage.setItem('language', newLanguage);
  };

  return { language, persistLanguage };
};
