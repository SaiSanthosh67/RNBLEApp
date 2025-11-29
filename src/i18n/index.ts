/**
 * i18n Configuration
 * Sets up internationalization with react-i18next
 * Supports English and Hindi languages
 */

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en.json";
import hi from "./hi.json";

// Language resources
const resources = {
  en: {
    translation: en,
  },
  hi: {
    translation: hi,
  },
};

// Initialize i18next
i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
  compatibilityJSON: "v4",
});

export default i18n;
