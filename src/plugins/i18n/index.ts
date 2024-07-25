import { createI18n } from "vue-i18n";
import getUserLocale from "@/utils/getUserLocale";

const i18n = createI18n({
  locale: getUserLocale(),
  fallbackLocale: process.env.VUE_APP_FALLBACK_LOCALE,
  legacy: false,
  globalInjection: true,
});

export default i18n;
