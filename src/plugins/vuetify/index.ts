import { createVuetify } from "vuetify";
import { aliases, mdi } from "vuetify/iconsets/mdi";
import components from "@/plugins/vuetify/components";
import { appTheme, getThemeValue } from "@/utils/theme";
import "vuetify/styles";

export default createVuetify({
  components,
  theme: {
    defaultTheme: getThemeValue(appTheme),
  },
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: {
      mdi,
    },
  },
});
