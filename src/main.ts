import { createApp, provide, h } from "vue";
import App from "@/App.vue";
import vueCookies from "@/plugins/vueCookies";
import { DefaultApolloClient } from "@vue/apollo-composable";
import apolloConfig from "@/plugins/apolloConfig";
import vuetifyConfig from "@/plugins/vuetify";
import Vue3Toasity from "vue3-toastify";
import toastifyConfig from "@/plugins/toastifyConfig";
import router from "@/router";
import { createPinia } from "pinia";
import appComponents from "@/components/UI";

const app = createApp({
  setup() {
    provide(DefaultApolloClient, apolloConfig);
  },

  render: () => h(App),
});

appComponents.forEach((component) => {
  if (component.__name) {
    app.component(component.__name, component);
  }
});

app
  .use(vueCookies)
  .use(router)
  .use(createPinia())
  .use(vuetifyConfig)
  .use(Vue3Toasity, toastifyConfig);

app.mount("#app");
