import { createI18n } from "vue-i18n";
import en from "@/plugins/i18n/locales/en.json";
import ru from "@/plugins/i18n/locales/ru.json";
import de from "@/plugins/i18n/locales/de.json";

const localStorageLang = localStorage.getItem("language");

const i18n = createI18n({
  locale: localStorageLang || process.env.VUE_APP_DEFAULT_LOCALE,
  fallbackLocale: process.env.VUE_APP_FALLBACK_LOCALE,
  legacy: false,
  globalInjection: true,
  messages: { en, ru, de },
});

export default i18n;
