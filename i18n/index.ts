import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';

const i18n = new I18n({
  en: require('./locales/en.json'),
  es: require('./locales/es.json'),
  hi: require('./locales/hi.json'),
});

i18n.locale = Localization.getLocales()[0].languageCode || 'en';
i18n.enableFallback = true;
i18n.defaultSeparator = '.';

export default i18n;
