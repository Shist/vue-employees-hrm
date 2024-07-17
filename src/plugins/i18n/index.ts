import { createI18n } from "vue-i18n";

const messages = {
  en: {
    signIn: {
      title: "Welcome Back",
      subtitleText: "Hello again! Sign in to continue.",
      buttonText: "SIGN IN",
      linkText: "I DON'T HAVE AN ACCOUNT",
    },
  },
  ru: {
    signIn: {
      title: "С Возвращением",
      subtitleText: "Привет! Войдите, чтобы продолжить.",
      buttonText: "ВОЙТИ",
      linkText: "У МЕНЯ НЕТ АККАУНТА",
    },
  },
};

export default createI18n({
  locale: process.env.VUE_APP_DEFAULT_LOCALE,
  fallbackLocale: process.env.VUE_APP_FALLBACK_LOCALE,
  legacy: false,
  globalInjection: true,
  messages: {
    en: require("./locales/en.json"),
    ru: require("./locales/ru.json"),
  },
});
