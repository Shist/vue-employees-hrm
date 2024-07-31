import { computed, nextTick } from "vue";
import { defineStore } from "pinia";
import { useLocale } from "vuetify";
import { useI18n } from "vue-i18n";
import useToast from "@/composables/useToast";
import { getDetailedError } from "@/utils/handleErrors";
import { handleLangLoadErrorMessage } from "@/utils/handleNoLangMessage";

export const useLangStore = defineStore("lang", () => {
  const { t, locale, availableLocales, setLocaleMessage } = useI18n({
    useScope: "global",
  });

  const { setErrorToast } = useToast();

  const { current: vuetifyCurrentLocale } = useLocale();

  async function loadLocaleMessages(newLocale: string) {
    let locale;
    if (newLocale === "Deutsch") {
      locale = "de";
    } else if (newLocale === "Русский") {
      locale = "ru";
    } else {
      locale = "en";
    }

    if (!availableLocales.includes(locale)) {
      const messages = await import(
        /* webpackChunkName: "[request]" */ `@/plugins/i18n/locales/${locale}.json`
      );

      setLocaleMessage(locale, messages.default);
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
      const toastMessage = handleLangLoadErrorMessage();

      setErrorToast(toastMessage);
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
    try {
      await loadLocaleMessages(newLocale);
      if (newLocale === "Deutsch") {
        locale.value = "de";
        vuetifyCurrentLocale.value = "de";
        localStorage.setItem("language", locale.value);
      } else if (newLocale === "Русский") {
        locale.value = "ru";
        vuetifyCurrentLocale.value = "ru";
        localStorage.setItem("language", locale.value);
      } else {
        locale.value = "en";
        vuetifyCurrentLocale.value = "en";
        localStorage.setItem("language", locale.value);
      }
      document.querySelector("html")?.setAttribute("lang", locale.value);
    } catch (error: unknown) {
      if (error instanceof Error) {
        const toastMessage = getDetailedError(error);

        setErrorToast(t(`errors.${toastMessage.message}`));
      }
    }
  };

  return {
    currLang,
    changeCurrLanguage,
    loadInitialLocale,
  };
});
