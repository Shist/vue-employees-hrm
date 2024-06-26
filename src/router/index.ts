import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import MainPage from "@/pages/MainPage.vue";
import UserPage from "@/pages/UserPage.vue";
import SignInPage from "@/pages/SignInPage.vue";
import SignUpPage from "@/pages/SignUpPage.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/users",
  },
  {
    path: "/users",
    component: MainPage,
    meta: { requiresAuth: true, hasBreadcrumbs: true },
  },
  {
    path: "/users/:id",
    component: UserPage,
    meta: { requiresAuth: true, hasBreadcrumbs: true },
    //   children: [
    //     {
    //       path: "",
    //       component: ProfilePage,
    //       meta: { requiresAuth: true, hasBreadcrumbs: true },
    //     },
    //     {
    //       path: "/skills",
    //       component: SkillsPage,
    //       meta: { requiresAuth: true, hasBreadcrumbs: true },
    //     },
    //     {
    //       path: "/languages",
    //       component: LanguagesPage,
    //       meta: { requiresAuth: true, hasBreadcrumbs: true },
    //     },
    //     {
    //       path: "/cvs",
    //       component: CVsPage,
    //       meta: { requiresAuth: true, hasBreadcrumbs: true },
    //     },
    //   ],
  },
  {
    path: "/sign-in",
    component: SignInPage,
    meta: { requiresAuth: false, hasBreadcrumbs: false },
  },
  {
    path: "/sign-up",
    component: SignUpPage,
    meta: { requiresAuth: false, hasBreadcrumbs: false },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

router.beforeEach((to, from, next) => {
  //const userUid = store.state.userData.userUid;
  const userUid = "we have some not-null id"; // "we have some not-null id"

  if (to.meta.requiresAuth) {
    !userUid ? next("/sign-in") : next();
  } else {
    userUid ? next("/") : next();
  }
});

export default router;
