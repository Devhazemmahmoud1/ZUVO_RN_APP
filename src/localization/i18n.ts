// i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { resources } from './translator';

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  compatibilityJSON: 'v4',
  interpolation: { escapeValue: false },
  returnNull: false,
});

export default i18n;
