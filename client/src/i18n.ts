import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(initReactI18next)
  .use(Backend)
  .use(LanguageDetector)
  .init({
    fallbackLng: "en",
    debug: true,
    resources: {
      en: {
        translation: {
          header: "My application",
          home: "Home",
          board: "Board",
          login: "Login",
          logout: "Logout",
          frontPage: "This is the front page",
          loginPage: "Login",
          registerPage: "Register",
          registrationSuccess: "Registration successful",
          "kanban board": "Kanban board",
          "Add Column": "Add Column",
          "Add Card": "Add Card",
          "Rename column": "Rename column",
          "Move column": "Move column",
          "Remove column": "Remove column",
          "Edit the card": "Edit the card",
          Title: "Title",
          Text: "Text",
          "Time Spent (minutes)": "Time Spent (minutes)",
          "Enter time spent on this task in minutes":
            "Enter time spent on this task in minutes",
          Color: "Color",
          "Save changes": "Save changes",
          Cancel: "Cancel",
          "Remove card": "Remove card",
          "Are you sure you want to remove this card?":
            "Are you sure you want to remove this card?",
          "Failed to save changes": "Failed to save changes",
          "Failed to remove card": "Failed to remove card",
          "Admin Panel": "Admin Panel",
          "All Users": "All Users",
          "Loading...": "Loading...",
          "Access denied. Admin privileges required.":
            "Access denied. Admin privileges required.",
          "Failed to fetch users": "Failed to fetch users",
          Role: "Role",
          Admin: "Admin",
          User: "User",
          "View Board": "View Board",
          "No users found.": "No users found.",
        },
      },
      fi: {
        translation: {
          header: "Meikäläisen applikaatio",
          home: "Etusivu",
          board: "Taulu",
          login: "Kirjaudu",
          register: "Rekisteröidy",
          email: "Sähköposti",
          password: "Salasana",
          logout: "Kirjaudu ulos",
          frontPage: "Tämä on etusivu",
          loginPage: "Kirjaudu/Rekisteröidy sisään",
          registrationSuccess: "Rekisterointi onnistui!",
          "kanban board": "Kanban board",
          "Add Column": "Lisää sarake",
          "Add Card": "Lisää kortti",
          "Rename column": "Nimeä sarake ",
          "Move column": "Siirrä sarake",
          "Remove column": "Poista sarake",
          "Edit the card": "Muokkaa korttia",
          Title: "Otsikko",
          Text: "Teksti",
          "Time Spent (minutes)": "Käytetty aika (minuutteina)",
          "Enter time spent on this task in minutes":
            "Syötä tehtävään käytetty aika minuutteina",
          Color: "Väri",
          "Save changes": "Tallenna muutokset",
          Cancel: "Peruuta",
          "Remove card": "Poista kortti",
          "Are you sure you want to remove this card?":
            "Oletko varma että haluat poistaa tämän kortin?",
          "Failed to save changes": "Muutosten tallentaminen epäonnistui",
          "Failed to remove card": "Kortin poistaminen epäonnistui",
          "Admin Panel": "Ylläpitopaneeli",
          "All Users": "Kaikki käyttäjät",
          "Loading...": "Ladataan...",
          "Access denied. Admin privileges required.":
            "Pääsy evätty. Ylläpito-oikeudet vaaditaan.",
          "Failed to fetch users": "Käyttäjien haku epäonnistui",
          Role: "Rooli",
          Admin: "Ylläpitäjä",
          User: "Käyttäjä",
          "View Board": "Näytä taulu",
          "No users found.": "Käyttäjiä ei löytynyt.",
        },
      },
    },

    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  });

export default i18n;
