import { createVuetify, type ThemeDefinition } from "vuetify";
import { aliases, mdi } from "vuetify/iconsets/mdi";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import appTheme from "@/utils/theme";

const appDarkTheme: ThemeDefinition = {
  dark: true,
  colors: {
    background: "#353535",
    surface: "#272727",
    "on-surface-variant": "#ffffff",
    primary: "#C63031",
  },
};

const appLightTheme: ThemeDefinition = {
  dark: false,
  colors: {
    background: "#ffffff",
    surface: "#2e2e2e",
    "on-surface-variant": "#2e2e2e",
    primary: "#C63031",
  },
};

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: appTheme,
    themes: {
      appDark: appDarkTheme,
      appLight: appLightTheme,
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
