import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "@/messages/en.json";
import km from "@/messages/km.json";

export const locales = ["en", "km"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      km: { translation: km },
    },
    fallbackLng: defaultLocale,
    supportedLngs: locales,
    interpolation: {
      escapeValue: false, // React already escapes
    },
    detection: {
      order: ["path", "localStorage", "navigator"],
      lookupFromPathIndex: 0,
      caches: ["localStorage"],
    },
  });

export default i18n;
