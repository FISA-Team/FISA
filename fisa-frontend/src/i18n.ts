import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import { LANGUAGE } from './variables/localeStoreageKeys';
import { LANGUAGES } from './variables/variables';

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    lng: localStorage.getItem(LANGUAGE) || LANGUAGES[0],
    interpolation: {
      escapeValue: false,
    },
  });
