import { ROUTES } from "@/constants/router";

export const SECTIONS_NAMES = {
  [ROUTES.SETTINGS.PATH.slice(1)]: "Settings",
  [ROUTES.USERS.PATH.slice(1)]: "Employees",
  [ROUTES.PROJECTS.PATH.slice(1)]: "Projects",
  [ROUTES.CVS.PATH.slice(1)]: "CVs",
  [ROUTES.DEPARTMENTS.PATH.slice(1)]: "Departments",
  [ROUTES.POSITIONS.PATH.slice(1)]: "Positions",
  [ROUTES.SKILLS.PATH.slice(1)]: "Skills",
  [ROUTES.LANGUAGES.PATH.slice(1)]: "Languages",
};

export const SECTIONS_ICONS = {
  HOME: "home-outline",
  [ROUTES.USERS.PATH.slice(1)]: "account-outline",
  [ROUTES.CVS.PATH.slice(1)]: "file-account",
};

export const TABS_NAMES = {
  [ROUTES.USER_PROFILE.PATH]: "Profile",
  [ROUTES.USER_SKILLS.PATH]: "Skills",
  [ROUTES.USER_LANGUAGES.PATH]: "Languages",
  [ROUTES.USER_CVS.PATH]: "CVs",
  [ROUTES.CV_DETAILS.PATH]: "Details",
  [ROUTES.CV_SKILLS.PATH]: "Skills",
  [ROUTES.CV_PROJECTS.PATH]: "Projects",
  [ROUTES.CV_PREVIEW.PATH]: "Preview",
};
