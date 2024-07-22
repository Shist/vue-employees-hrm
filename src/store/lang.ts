import { computed, nextTick } from "vue";
import { defineStore } from "pinia";
import { useI18n } from "vue-i18n";

export const useLangStore = defineStore("lang", () => {
  const { locale, availableLocales, setLocaleMessage } = useI18n({
    useScope: "global",
  });

  async function loadLocaleMessages(newLocale: string) {
    let locale;
    if (newLocale === "Deutsch" || newLocale === "de") {
      locale = "de";
    } else if (newLocale === "Русский" || newLocale === "ru") {
      locale = "ru";
    } else {
      locale = "en";
    }

    try {
      if (!availableLocales.includes(locale)) {
        const messages = await import(
          /* webpackChunkName: "[request]" */ `@/plugins/i18n/locales/${locale}.json`
        );
        setLocaleMessage(locale, messages.default);
      }
    } catch (error: unknown) {
      console.error("Error loading messages");
    }

    return nextTick();
  }

  async function loadInitialLocale(newLocale: string) {
    try {
      const messages = await import(
        /* webpackChunkName: "[request]" */ `@/plugins/i18n/locales/${newLocale}.json`
      );

      setLocaleMessage(newLocale, messages.default);
    } catch (error: unknown) {
      console.error("Error loading messages");
    }

    return nextTick();
  }

  const currLang = computed(() => {
    if (locale.value === "en") {
      return "English";
    } else if (locale.value === "de") {
      return "Deutsch";
    } else {
      return "Русский";
    }
  });

  const changeCurrLanguage = async (newLocale: string) => {
    await loadLocaleMessages(newLocale);
    if (newLocale === "Deutsch") {
      locale.value = "de";
      localStorage.setItem("language", locale.value);
    } else if (newLocale === "Русский") {
      locale.value = "ru";
      localStorage.setItem("language", locale.value);
    } else {
      locale.value = "en";
      localStorage.setItem("language", locale.value);
    }
    document.querySelector("html")?.setAttribute("lang", locale.value);
  };

  return {
    currLang,
    changeCurrLanguage,
    loadLocaleMessages,
    loadInitialLocale,
  };
});
