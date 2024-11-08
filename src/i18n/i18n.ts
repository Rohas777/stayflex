import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import translationEN from "./locales/en.json";
import translationRU from "./locales/ru.json";
import { selectLanguage } from "@/stores/languageSlice";
import { store } from "@/stores/store";

const { language } = selectLanguage(store.getState());

i18n.use(initReactI18next).init({
    resources: {
        en: { translation: translationEN },
        ru: { translation: translationRU },
    },
    lng: language,
    fallbackLng: "ru",
    interpolation: {
        escapeValue: false,
    },
});

export default i18n;
