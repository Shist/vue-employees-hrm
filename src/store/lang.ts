import { computed } from "vue";
import { defineStore } from "pinia";
import { useI18n } from "vue-i18n";

export const useLangStore = defineStore("lang", () => {
  const { locale } = useI18n({ useScope: "global" });

  const currLang = computed(() => {
    if (locale.value === "en") {
      return "English";
    } else if (locale.value === "de") {
      return "Deutsch";
    } else {
      return "Русский";
    }
  });

  return { currLang };
});
