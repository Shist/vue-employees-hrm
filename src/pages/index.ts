import SignInPage from "@/pages/SignInPage.vue";
import SignUpPage from "@/pages/SignUpPage.vue";
import SettingsPage from "@/pages//SettingsPage.vue";
import usersPages from "@/pages/users";
import ProjectsPage from "@/pages/ProjectsPage.vue";
import cvsPages from "@/pages/cvs";
import DepartmentsPage from "@/pages/DepartmentsPage.vue";
import PositionsPage from "@/pages/PositionsPage.vue";
import SkillsPage from "@/pages/SkillsPage.vue";
import LanguagesPage from "@/pages/LanguagesPage.vue";

export default {
  SignInPage,
  SignUpPage,
  SettingsPage,
  ...usersPages,
  ProjectsPage,
  ...cvsPages,
  DepartmentsPage,
  PositionsPage,
  SkillsPage,
  LanguagesPage,
};
