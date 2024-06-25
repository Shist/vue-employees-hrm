import { createApp } from "vue";
import App from "@/App.vue";
import router from "@/router";
import { createPinia } from "pinia";
import vuetifyConfig from "@/plugins/vuetify";
import Vue3Toasity from "vue3-toastify";
import toastifyConfig from "@/plugins/toastifyConfig";
import "@/assets/styles/reset.css";
import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";

createApp(App)
  .use(router)
  .use(createPinia())
  .use(vuetifyConfig)
  .use(Vue3Toasity, toastifyConfig)
  .mount("#app");
