import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      "Request permission": "In order to use this application you need to grant notification permission.",
    },
  },
};

void i18n.use(initReactI18next).init({
  interpolation: {
    escapeValue: false,
  },
  lng: "en",
  resources,
});

export { default } from "i18next";
