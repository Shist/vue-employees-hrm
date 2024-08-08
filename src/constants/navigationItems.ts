import { ROUTES } from "@/constants/router";
import { INavigationItem } from "@/types/navigation";

export const NAVIGATION__ITEMS: INavigationItem[] = [
  {
    title: "Employees",
    icon: "mdi-account-multiple",
    link: ROUTES.USERS.PATH,
  },
  {
    title: "Projects",
    icon: "mdi-folder-multiple-outline",
    link: ROUTES.PROJECTS.PATH,
  },
  {
    title: "CVs",
    icon: "mdi-file-account",
    link: ROUTES.CVS.PATH,
  },
  {
    title: "Departments",
    icon: "mdi-domain",
    link: ROUTES.DEPARTMENTS.PATH,
  },
  {
    title: "Positions",
    icon: "mdi-briefcase-outline",
    link: ROUTES.POSITIONS.PATH,
  },
  {
    title: "Skills",
    icon: "mdi-trending-up",
    link: ROUTES.SKILLS.PATH,
  },
  {
    title: "Languages",
    icon: "mdi-translate",
    link: ROUTES.LANGUAGES.PATH,
  },
];
