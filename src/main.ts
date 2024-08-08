import { createApp, provide, h } from "vue";
import App from "@/App.vue";
import vueCookies from "@/plugins/vueCookies";
import { DefaultApolloClient } from "@vue/apollo-composable";
import apolloConfig from "@/plugins/apolloConfig";
import vuetifyConfig from "@/plugins/vuetify";
import Vue3Toasity from "vue3-toastify";
import toastifyConfig from "@/plugins/toastifyConfig";
import i18n from "@/plugins/i18n";
import router from "@/router";
import { createPinia } from "pinia";
import appComponents from "@/components/UI";
import appDirectives from "@/directives";

const app = createApp({
  setup() {
    provide(DefaultApolloClient, apolloConfig);
  },

  render: () => h(App),
});

Object.keys(appComponents).forEach((name) => {
  app.component(name, appComponents[name]);
});

Object.keys(appDirectives).forEach((name) => {
  app.directive(name, appDirectives[name]);
});

app
  .use(vueCookies)
  .use(router)
  .use(createPinia())
  .use(vuetifyConfig)
  .use(Vue3Toasity, toastifyConfig)
  .use(i18n);

app.mount("#app");
