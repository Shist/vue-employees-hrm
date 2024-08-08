export default function getUserLocale() {
  const supportedLocales = process.env.VUE_APP_SUPPORTED_LOCALES.split(",");

  const userLang = localStorage.getItem("language");

  const browserLang = window.navigator.language.split("-")[0];

  if (userLang && supportedLocales.includes(userLang)) {
    return userLang;
  } else if (browserLang && supportedLocales.includes(browserLang)) {
    return browserLang;
  } else {
    return process.env.VUE_APP_DEFAULT_LOCALE;
  }
}
