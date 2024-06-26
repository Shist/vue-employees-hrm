import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import MainPage from "@/pages/MainPage.vue";
import UserProfilePage from "@/pages/UserProfilePage.vue";
import UserSkillsPage from "@/pages/UserSkillsPage.vue";
import UserLanguagesPage from "@/pages/UserLanguagesPage.vue";
import UserCVsPage from "@/pages/UserCVsPage.vue";
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
    meta: { requiresAuth: true, hasBreadcrumbs: true, hasTabs: false },
  },
  {
    path: "/users/:id",
    children: [
      {
        path: "",
        component: UserProfilePage,
        meta: { requiresAuth: true, hasBreadcrumbs: true, hasTabs: "userTabs" },
      },
      {
        path: "skills",
        component: UserSkillsPage,
        meta: { requiresAuth: true, hasBreadcrumbs: true, hasTabs: "userTabs" },
      },
      {
        path: "languages",
        component: UserLanguagesPage,
        meta: { requiresAuth: true, hasBreadcrumbs: true, hasTabs: "userTabs" },
      },
      {
        path: "cvs",
        component: UserCVsPage,
        meta: { requiresAuth: true, hasBreadcrumbs: true, hasTabs: "userTabs" },
      },
    ],
  },
  {
    path: "/sign-in",
    component: SignInPage,
    meta: { requiresAuth: false, hasBreadcrumbs: false, hasTabs: false },
  },
  {
    path: "/sign-up",
    component: SignUpPage,
    meta: { requiresAuth: false, hasBreadcrumbs: false, hasTabs: false },
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
