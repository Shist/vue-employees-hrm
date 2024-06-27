import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { ROUTER_NAMES } from "@/constants/routerNames";
import pages from "@/pages";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: ROUTER_NAMES.MAIN,
    redirect: "/users",
  },
  {
    path: "/sign-in",
    name: ROUTER_NAMES.SIGN_IN,
    component: pages.SignInPage,
    meta: { requiresAuth: false, hasBreadcrumbs: false, hasTabs: false },
  },
  {
    path: "/sign-up",
    name: ROUTER_NAMES.SIGN_UP,
    component: pages.SignUpPage,
    meta: { requiresAuth: false, hasBreadcrumbs: false, hasTabs: false },
  },
  {
    path: "/settings",
    name: ROUTER_NAMES.SETTINGS,
    component: pages.SettingsPage,
    meta: { requiresAuth: true, hasBreadcrumbs: true, hasTabs: false },
  },
  {
    path: "/users",
    name: ROUTER_NAMES.USERS,
    component: pages.UsersPage,
    meta: { requiresAuth: true, hasBreadcrumbs: true, hasTabs: false },
  },
  {
    path: "/users/:id",
    name: ROUTER_NAMES.USER_BY_ID,
    children: [
      {
        path: "",
        name: ROUTER_NAMES.USER_PROFILE,
        component: pages.UserProfilePage,
        meta: { requiresAuth: true, hasBreadcrumbs: true, hasTabs: "userTabs" },
      },
      {
        path: "skills",
        name: ROUTER_NAMES.USER_SKILLS,
        component: pages.UserSkillsPage,
        meta: { requiresAuth: true, hasBreadcrumbs: true, hasTabs: "userTabs" },
      },
      {
        path: "languages",
        name: ROUTER_NAMES.USER_LANGUAGES,
        component: pages.UserLanguagesPage,
        meta: { requiresAuth: true, hasBreadcrumbs: true, hasTabs: "userTabs" },
      },
      {
        path: "cvs",
        name: ROUTER_NAMES.USER_CVS,
        component: pages.UserCVsPage,
        meta: { requiresAuth: true, hasBreadcrumbs: true, hasTabs: "userTabs" },
      },
    ],
  },
  {
    path: "/projects",
    name: ROUTER_NAMES.PROJECTS,
    component: pages.ProjectsPage,
    meta: { requiresAuth: true, hasBreadcrumbs: true, hasTabs: false },
  },
  {
    path: "/cvs",
    name: ROUTER_NAMES.CVS,
    component: pages.CVsPage,
    meta: { requiresAuth: true, hasBreadcrumbs: true, hasTabs: false },
  },
  {
    path: "/cvs/:id",
    name: ROUTER_NAMES.CV_BY_ID,
    children: [
      {
        path: "",
        name: ROUTER_NAMES.CVS_DETAILS,
        component: pages.CVDetailsPage,
        meta: { requiresAuth: true, hasBreadcrumbs: true, hasTabs: "cvsTabs" },
      },
      {
        path: "skills",
        name: ROUTER_NAMES.CVS_SKILLS,
        component: pages.CVSkillsPage,
        meta: { requiresAuth: true, hasBreadcrumbs: true, hasTabs: "cvsTabs" },
      },
      {
        path: "projects",
        name: ROUTER_NAMES.CVS_PROJECTS,
        component: pages.CVProjectsPage,
        meta: { requiresAuth: true, hasBreadcrumbs: true, hasTabs: "cvsTabs" },
      },
      {
        path: "preview",
        name: ROUTER_NAMES.CVS_PREVIEW,
        component: pages.CVPreviewPage,
        meta: { requiresAuth: true, hasBreadcrumbs: true, hasTabs: "cvsTabs" },
      },
    ],
  },
  {
    path: "/departments",
    name: ROUTER_NAMES.DEPARTMENTS,
    component: pages.DepartmentsPage,
    meta: { requiresAuth: true, hasBreadcrumbs: true, hasTabs: false },
  },
  {
    path: "/positions",
    name: ROUTER_NAMES.POSITIONS,
    component: pages.PositionsPage,
    meta: { requiresAuth: true, hasBreadcrumbs: true, hasTabs: false },
  },
  {
    path: "/skills",
    name: ROUTER_NAMES.SKILLS,
    component: pages.SkillsPage,
    meta: { requiresAuth: true, hasBreadcrumbs: true, hasTabs: false },
  },
  {
    path: "/languages",
    name: ROUTER_NAMES.LANGUAGES,
    component: pages.LanguagesPage,
    meta: { requiresAuth: true, hasBreadcrumbs: true, hasTabs: false },
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
