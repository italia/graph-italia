import i18next from 'i18next';
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from 'react-i18next';
import translationEn from './locales/en.json';
import translationIt from './locales/it.json';

const resources = {
    en: { translation: translationEn },
    it: { translation: translationIt },
};

i18next
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        //lng: 'en', // if you're using a language detector, do not define the lng option
        debug: import.meta.env.DEV,
        resources,
        supportedLngs: Object.keys(resources),
        nonExplicitSupportedLngs: true,
        fallbackLng: 'it',
        detection: {
            order: ["querystring", "navigator", "htmlTag", "path", "subdomain"],
            lookupQuerystring: "lang",
            lookupCookie: "lang",
            lookupLocalStorage: "lang",
            lookupSessionStorage: "lang",
            caches: [],
        }
    });