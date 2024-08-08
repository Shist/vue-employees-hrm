export const ROUTES_IDS = {
  USER: ":userId",
  CV: ":cvId",
};

export const ROUTES = {
  MAIN: {
    PATH: "/",
    NAME: "main",
  },
  SIGN_IN: {
    PATH: "/sign-in",
    NAME: "login",
  },
  SIGN_UP: {
    PATH: "/sign-up",
    NAME: "register",
  },
  SETTINGS: {
    PATH: "/settings",
    NAME: "settings",
  },
  USERS: {
    PATH: "/users",
    NAME: "users",
  },
  USER_BY_ID: {
    PATH: `/users/${ROUTES_IDS.USER}`,
    NAME: "user-by-id",
  },
  USER_PROFILE: {
    PATH: "profile",
    NAME: "user-profile",
  },
  USER_SKILLS: {
    PATH: "skills",
    NAME: "user-skills",
  },
  USER_LANGUAGES: {
    PATH: "languages",
    NAME: "user-languages",
  },
  USER_CVS: {
    PATH: "cvs",
    NAME: "user-cvs",
  },
  PROJECTS: {
    PATH: "/projects",
    NAME: "projects",
  },
  CVS: {
    PATH: "/cvs",
    NAME: "cvs",
  },
  CV_BY_ID: {
    PATH: `/cvs/${ROUTES_IDS.CV}`,
    NAME: "cv-by-id",
  },
  CV_DETAILS: {
    PATH: "details",
    NAME: "cv-details",
  },
  CV_SKILLS: {
    PATH: "skills",
    NAME: "cv-skills",
  },
  CV_PROJECTS: {
    PATH: "projects",
    NAME: "cv-projects",
  },
  CV_PREVIEW: {
    PATH: "preview",
    NAME: "cv-preview",
  },
  DEPARTMENTS: {
    PATH: "/departments",
    NAME: "departments",
  },
  POSITIONS: {
    PATH: "/positions",
    NAME: "positions",
  },
  SKILLS: {
    PATH: "/skills",
    NAME: "skills",
  },
  LANGUAGES: {
    PATH: "/languages",
    NAME: "languages",
  },
  NOT_FOUND: {
    PATH: "/:pathMatch(.*)*",
    NAME: "not-found",
  },
};
