import i18n from "i18next";
import { initReactI18next } from "react-i18next";

/* 🔹 import translations */
import enHome from "./locales/en/home.json";
import frHome from "./locales/fr/home.json";

import enCommon from "./locales/en/common.json";
import frCommon from "./locales/fr/common.json";

import enAddresses from "./locales/en/addresses.json";
import frAddresses from "./locales/fr/addresses.json";

import enCheckout from "./locales/en/checkout.json";
import frCheckout from "./locales/fr/checkout.json";

import enProduct from "./locales/en/product.json";
import frProduct from "./locales/fr/product.json";

import enSearchResults from "./locales/en/search-results.json";
import frSearchResults from "./locales/fr/search-results.json";

import enProducts from "./locales/en/products.json";
import frProducts from "./locales/fr/products.json";

import enSettings from "./locales/en/settings.json";
import frSettings from "./locales/fr/settings.json";

import enAuth from "./locales/en/auth.json";
import frAuth from "./locales/fr/auth.json";

i18n
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    supportedLngs: ["en", "fr"],
    debug: import.meta.env.DEV,

    ns: ["common", "home", "addresses", "checkout", "product", "search_results", "products", "settings", "auth"],
    defaultNS: "common",

    resources: {
      en: {
        common: enCommon,
        home: enHome,
        addresses: enAddresses,
        checkout: enCheckout,
        product: enProduct,
        search_results: enSearchResults,
        products: enProducts,
        settings: enSettings,
        auth: enAuth
      },
      fr: {
        common: frCommon,
        home: frHome,
        addresses: frAddresses,
        checkout: frCheckout,
        product: frProduct,
        search_results: frSearchResults,
        products: frProducts,
        settings: frSettings,
        auth: frAuth
      },
    },

    interpolation: {
      escapeValue: false,
    },

    react: {
      useSuspense: false,
    },
  });

export default i18n;