import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Importa las traducciones
import translationEN from './app/translations/en.json';
import translationES from './app/translations/es.json';

const resources = {
  en: {
    translation: translationEN
  },
  es: {
    translation: translationES
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    keySeparator: false,
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;