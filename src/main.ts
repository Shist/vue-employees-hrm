import { createApp } from "vue";
import App from "@/App.vue";
import router from "@/router";
import Vue3Toasity from "vue3-toastify";
import "@/assets/styles/reset.css";

createApp(App)
  .use(router)
  .use(Vue3Toasity, {
    clearOnUrlChange: false,
    //theme: store.original.state.theme.currTheme,
  })
  .mount("#app");
