import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en';
import it from './locales/it';

const resources = { en, it };

/** Read the persisted language from the zustand settings store before React mounts. */
function getStoredLanguage(): string {
    try {
        const raw = localStorage.getItem('dataviz-settings');
        if (raw) {
            const parsed = JSON.parse(raw);
            const lang = parsed?.state?.settings?.preferredLanguage;
            if (lang && Object.keys(resources).includes(lang)) return lang;
        }
    } catch {
        // localStorage unavailable or JSON invalid – fall through to default
    }
    return 'it';
}

i18next
    .use(initReactI18next)
    .init({
        lng: getStoredLanguage(),
        debug: import.meta.env.DEV,
        resources,
        supportedLngs: Object.keys(resources),
        fallbackLng: 'it',
        interpolation: {
            escapeValue: false, // React already escapes
        },
    });
