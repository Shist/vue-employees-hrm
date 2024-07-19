import VueCookies from "vue-cookies";
import type { App } from "vue"; // Import App type

export default {
  install(app: App) {
    app.config.globalProperties.$cookies = VueCookies.VueCookies;
  },
};
