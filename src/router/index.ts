import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import pages from "@/router/pages";
import useCookies from "@/composables/useCookies";
import useToast from "@/composables/useToast";
import { ROUTES } from "@/constants/router";
import { TAB_NAMES } from "@/constants/tabs";
import { handleUnauthorizedMessage } from "@/utils/handleNoLangMessage";

const routes: Array<RouteRecordRaw> = [
  {
    path: ROUTES.MAIN.PATH,
    name: ROUTES.MAIN.NAME,
    redirect: ROUTES.USERS.PATH,
  },
  {
    path: ROUTES.SIGN_IN.PATH,
    name: ROUTES.SIGN_IN.NAME,
    component: pages.SignInPage,
    meta: { requiresAuth: false, hasBreadcrumbs: false, hasTabs: false },
  },
  {
    path: ROUTES.SIGN_UP.PATH,
    name: ROUTES.SIGN_UP.NAME,
    component: pages.SignUpPage,
    meta: { requiresAuth: false, hasBreadcrumbs: false, hasTabs: false },
  },
  {
    path: ROUTES.SETTINGS.PATH,
    name: ROUTES.SETTINGS.NAME,
    component: pages.SettingsPage,
    meta: { requiresAuth: true, hasBreadcrumbs: true, hasTabs: false },
  },
  {
    path: ROUTES.USERS.PATH,
    name: ROUTES.USERS.NAME,
    component: pages.UsersPage,
    meta: { requiresAuth: true, hasBreadcrumbs: true, hasTabs: false },
  },
  {
    path: ROUTES.USER_BY_ID.PATH,
    name: ROUTES.USER_BY_ID.NAME,
    redirect: (to) => `${to.fullPath}/${ROUTES.USER_PROFILE.PATH}`,
    children: [
      {
        path: ROUTES.USER_PROFILE.PATH,
        name: ROUTES.USER_PROFILE.NAME,
        component: pages.UserProfilePage,
        meta: {
          requiresAuth: true,
          hasBreadcrumbs: true,
          hasTabs: TAB_NAMES.USER,
        },
      },
      {
        path: ROUTES.USER_SKILLS.PATH,
        name: ROUTES.USER_SKILLS.NAME,
        component: pages.UserSkillsPage,
        meta: {
          requiresAuth: true,
          hasBreadcrumbs: true,
          hasTabs: TAB_NAMES.USER,
        },
      },
      {
        path: ROUTES.USER_LANGUAGES.PATH,
        name: ROUTES.USER_LANGUAGES.NAME,
        component: pages.UserLanguagesPage,
        meta: {
          requiresAuth: true,
          hasBreadcrumbs: true,
          hasTabs: TAB_NAMES.USER,
        },
      },
      {
        path: ROUTES.USER_CVS.PATH,
        name: ROUTES.USER_CVS.NAME,
        component: pages.UserCvsPage,
        meta: {
          requiresAuth: true,
          hasBreadcrumbs: true,
          hasTabs: TAB_NAMES.USER,
        },
      },
    ],
  },
  {
    path: ROUTES.PROJECTS.PATH,
    name: ROUTES.PROJECTS.NAME,
    component: pages.ProjectsPage,
    meta: { requiresAuth: true, hasBreadcrumbs: true, hasTabs: false },
  },
  {
    path: ROUTES.CVS.PATH,
    name: ROUTES.CVS.NAME,
    component: pages.CvsPage,
    meta: { requiresAuth: true, hasBreadcrumbs: true, hasTabs: false },
  },
  {
    path: ROUTES.CV_BY_ID.PATH,
    name: ROUTES.CV_BY_ID.NAME,
    redirect: (to) => `${to.fullPath}/${ROUTES.CV_DETAILS.PATH}`,
    children: [
      {
        path: ROUTES.CV_DETAILS.PATH,
        name: ROUTES.CV_DETAILS.NAME,
        component: pages.CvDetailsPage,
        meta: {
          requiresAuth: true,
          hasBreadcrumbs: true,
          hasTabs: TAB_NAMES.CV,
        },
      },
      {
        path: ROUTES.CV_SKILLS.PATH,
        name: ROUTES.CV_SKILLS.NAME,
        component: pages.CvSkillsPage,
        meta: {
          requiresAuth: true,
          hasBreadcrumbs: true,
          hasTabs: TAB_NAMES.CV,
        },
      },
      {
        path: ROUTES.CV_PROJECTS.PATH,
        name: ROUTES.CV_PROJECTS.NAME,
        component: pages.CvProjectsPage,
        meta: {
          requiresAuth: true,
          hasBreadcrumbs: true,
          hasTabs: TAB_NAMES.CV,
        },
      },
      {
        path: ROUTES.CV_PREVIEW.PATH,
        name: ROUTES.CV_PREVIEW.NAME,
        component: pages.CvPreviewPage,
        meta: {
          requiresAuth: true,
          hasBreadcrumbs: true,
          hasTabs: TAB_NAMES.CV,
        },
      },
    ],
  },
  {
    path: ROUTES.DEPARTMENTS.PATH,
    name: ROUTES.DEPARTMENTS.NAME,
    component: pages.DepartmentsPage,
    meta: { requiresAuth: true, hasBreadcrumbs: true, hasTabs: false },
  },
  {
    path: ROUTES.POSITIONS.PATH,
    name: ROUTES.POSITIONS.NAME,
    component: pages.PositionsPage,
    meta: { requiresAuth: true, hasBreadcrumbs: true, hasTabs: false },
  },
  {
    path: ROUTES.SKILLS.PATH,
    name: ROUTES.SKILLS.NAME,
    component: pages.SkillsPage,
    meta: { requiresAuth: true, hasBreadcrumbs: true, hasTabs: false },
  },
  {
    path: ROUTES.LANGUAGES.PATH,
    name: ROUTES.LANGUAGES.NAME,
    component: pages.LanguagesPage,
    meta: { requiresAuth: true, hasBreadcrumbs: true, hasTabs: false },
  },
  {
    path: ROUTES.NOT_FOUND.PATH,
    name: ROUTES.NOT_FOUND.NAME,
    component: pages.NotFoundPage,
    meta: { notFound: true, hasBreadcrumbs: false, hasTabs: false },
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
  const { getToken } = useCookies();

  const areAllTokensExpired =
    !getToken("accessToken") && !getToken("refreshToken");

  if (to.name === ROUTES.NOT_FOUND.NAME) {
    next();
  } else if (to.meta.requiresAuth) {
    if (areAllTokensExpired) {
      const toastMessage = handleUnauthorizedMessage();

      const { setErrorToast } = useToast();
      setErrorToast(toastMessage);

      next(ROUTES.SIGN_IN.PATH);
    } else {
      next();
    }
  } else {
    areAllTokensExpired ? next() : next(ROUTES.USERS.PATH);
  }
});

export default router;
