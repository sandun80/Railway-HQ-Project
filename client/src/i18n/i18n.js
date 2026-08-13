import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.js";
import si from "./locales/si.js";
import ta from "./locales/ta.js";

const savedLanguage = localStorage.getItem("language") || "en";

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: en },
            si: { translation: si },
            ta: { translation: ta }
        },
        lng: savedLanguage,
        fallbackLng: "en",
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
