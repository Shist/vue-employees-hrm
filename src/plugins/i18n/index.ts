import { createI18n } from "vue-i18n";

const supportedLocales = process.env.VUE_APP_SUPPORTED_LOCALES.split(",");

export const getUserLocale = () => {
  const userLang = localStorage.getItem("language");

  const browserLang = window.navigator.language.split("-")[0];

  if (userLang && supportedLocales.includes(userLang)) {
    return userLang;
  } else if (browserLang && supportedLocales.includes(browserLang)) {
    return browserLang;
  } else {
    return process.env.VUE_APP_DEFAULT_LOCALE;
  }
};

const i18n = createI18n({
  locale: getUserLocale(),
  fallbackLocale: process.env.VUE_APP_FALLBACK_LOCALE,
  legacy: false,
  globalInjection: true,
});

export default i18n;
