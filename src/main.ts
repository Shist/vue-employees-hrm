import { createApp, provide, h } from "vue";
import App from "@/App.vue";
import router from "@/router";
import { createPinia } from "pinia";
import vuetifyConfig from "@/plugins/vuetify";
import Vue3Toasity from "vue3-toastify";
import toastifyConfig from "@/plugins/toastifyConfig";
import { DefaultApolloClient } from "@vue/apollo-composable";
import apolloClient from "@/plugins/apolloConfig";
import { useAuthStore } from "@/store/authStore";

const app = createApp({
  setup() {
    provide(DefaultApolloClient, apolloClient);
  },

  render: () => h(App),
});

app
  .use(router)
  .use(createPinia())
  .use(vuetifyConfig)
  .use(Vue3Toasity, toastifyConfig);

app.mount("#app");

const authStore = useAuthStore();

authStore.checkAuthorization();

authStore.fetchUserAuthData();
