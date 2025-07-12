import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import vi from './locales/vi.json';
import ru from './locales/ru.json';
import fr from './locales/fr.json';
import de from './locales/de.json';
import es from './locales/es.json';
import ja from './locales/ja.json';
import zh from './locales/zh.json';
import th from './locales/th.json';

const resources = {
  en: {
    translation: en
  },
  vi: {
    translation: vi
  },
  ru: {
    translation: ru
  },
  fr: {
    translation: fr
  },
  de: {
    translation: de
  },
  es: {
    translation: es
  },
  ja: {
    translation: ja
  },
  zh: {
    translation: zh
  },
  th: {
    translation: th
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,

    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    }
  });

export default i18n; 