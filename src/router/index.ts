import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import MainPage from "@/pages//MainPage.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: MainPage,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
