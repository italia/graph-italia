import i18next from 'i18next';
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from 'react-i18next';
import translationEn from './locales/en.json';
import translationIt from './locales/it.json';

const resources = {
    en: { translationEn },
    it: { translationIt },
} as const;

i18next
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        //lng: 'en', // if you're using a language detector, do not define the lng option
        debug: true,
        resources,
        supportedLngs: Object.keys(resources),
        fallbackLng: 'it',
        detection: {
            order: ["querystring", "navigator", "htmlTag", "path", "subdomain"],
            lookupQuerystring: "lang",
            lookupCookie: "lang",
            lookupLocalStorage: "lang",
            lookupSessionStorage: "lang",
            caches: [],
        }
        // if you see an error like: "Argument of type 'DefaultTFuncReturn' is not assignable to parameter of type xyz"
        // set returnNull to false (and also in the i18next.d.ts options)
        // returnNull: false,
    });