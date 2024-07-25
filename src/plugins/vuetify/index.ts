import { createVuetify } from "vuetify";
import { aliases, mdi } from "vuetify/iconsets/mdi";
import { en, de, ru } from "vuetify/locale";
import components from "@/plugins/vuetify/components";
import { appTheme, getThemeValue } from "@/utils/theme";
import getUserLocale from "@/utils/getUserLocale";
import "vuetify/styles";

export default createVuetify({
  components,
  theme: {
    defaultTheme: getThemeValue(appTheme),
  },
  locale: {
    locale: getUserLocale(),
    fallback: process.env.VUE_APP_FALLBACK_LOCALE,
    messages: { en, de, ru },
  },
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: {
      mdi,
    },
  },
});
