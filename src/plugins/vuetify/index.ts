import { createVuetify } from "vuetify";
import { appLightTheme } from "@/plugins/vuetify/themeLightConfig";
import { appDarkTheme } from "@/plugins/vuetify/themeDarkConfig";
import { aliases, mdi } from "vuetify/iconsets/mdi";
import components from "@/plugins/vuetify/components";
import appTheme from "@/utils/theme";

export default createVuetify({
  components,
  theme: {
    defaultTheme: appTheme,
    themes: {
      appLight: appLightTheme,
      appDark: appDarkTheme,
    },
  },
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: {
      mdi,
    },
  },
});
