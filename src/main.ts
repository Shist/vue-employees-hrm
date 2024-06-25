import { createApp } from "vue";
import App from "@/App.vue";
import router from "@/router";
import { createPinia } from "pinia";
import "vuetify/styles";
import Vue3Toasity from "vue3-toastify";
import { createVuetify } from "vuetify";
import { aliases, mdi } from "vuetify/iconsets/mdi";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { useThemeStore } from "@/store/useThemeStore";
import "@mdi/font/css/materialdesignicons.css";
import "@/assets/styles/reset.css";

const app = createApp(App).use(router).use(createPinia()).use(Vue3Toasity, {
  clearOnUrlChange: false,
  //theme: store.original.state.theme.currTheme,
});

const { theme } = useThemeStore();

const vuetifyConfig = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: theme,
  },
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: {
      mdi,
    },
  },
});

app.use(vuetifyConfig);

app.mount("#app");
