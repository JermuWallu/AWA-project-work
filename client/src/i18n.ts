import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n.use(initReactI18next)
.use(Backend)
.use(LanguageDetector)
.init({
  fallbackLng: "en",
  debug: true,
  resources: {
    en: {
      "translation": {
        "header": "My application",
        "home": "Home",
        "board": "Board",
        "login": "Login",
        "logout": "Logout",
        "frontPage": "This is the front page",
        "loginPage": "Login",
        "registerPage": "Register",
        "registrationSuccess": "Registration successful",
        "kanban board": "Kanban board",
        "Add Column": "Add Column",
        "Add Card": "Add Card",
        "Rename column": "Rename column",
        "Move column": "Move column",
        "Remove column": "Remove column",
      }
    },
    fi: {
      "translation": {
        "header": "Meikäläisen applikaatio",
        "home": "Etusivu",
        "board": "Taulu",
        "login": "Kirjaudu",
        "register": "Rekisteröidy",
        "email": "Sähköposti",
        "password": "Salasana",
        "logout": "Kirjaudu ulos",
        "frontPage": "Tämä on etusivu",
        "loginPage": "Kirjaudu/Rekisteröidy sisään",
        "registrationSuccess": "Rekisterointi onnistui!",
        "kanban board": "Kanban board",
        "Add Column": "Lisää sarake",
        "Add Card": "Lisää kortti",
        "Rename column": "Nimeä sarake ",
        "Move column": "Siirrä sarake",
        "Remove column": "Poista sarake",
      }
    },
  },

  interpolation: {
    escapeValue: false, // not needed for react as it escapes by default
  },
});

export default i18n;
