import { createVuetify } from "vuetify";
import { appLightTheme } from "@/plugins/vuetify/themeLightConfig";
import { appDarkTheme } from "@/plugins/vuetify/themeDarkConfig";
import { aliases, mdi } from "vuetify/iconsets/mdi";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import appTheme from "@/utils/theme";

export default createVuetify({
  components,
  directives,
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
