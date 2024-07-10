// Wright errorsHandling method for the app using switch/case and call it in every request to Apollo
// use errorsHandling method in all services

import {
  EMAIL_DUPLICATE_ERROR,
  INVALID_CREDENTIALS,
  NO_NETWORK_CONNECTION,
  UNEXPECTED_ERROR,
} from "@/constants/errorMessage";

// in App.vue call getUserById method to check authorization (if there is a token in Local Storage) and write userData to userStore

// think if we should change router.beforeEach hook
// get rid of checkAuthorization and checkTokenExpiration methods in authStore
// save token only to Local Storage and userData only to authStore
// delete extra methods from main.ts and remove it to App.vue

// + in plugin folder remove folder for apollo and create apolloConfig.ts in plugins folder
// + remove index.ts from pages to router folder. Call it pages.ts
// + remove use ValidationErrors from composables to utils
// + change the structure in graphql folder (make folders for user, department, project etc.)
// + in AppHeader component, UsersPage, ProjectsPage make v-for for dropdownMenu

export default function handleErrors(error: unknown) {
  if (error instanceof Error) {
    console.log(error.message);
    switch (error.message) {
      case "Invalid credentials":
        throw new Error(INVALID_CREDENTIALS);
      case "Failed to fetch":
        throw new Error(NO_NETWORK_CONNECTION);
      case 'duplicate key value violates unique constraint "UQ_e12875dfb3b1d92d7d7c5377e22"':
        throw new Error(EMAIL_DUPLICATE_ERROR);
    }
  }
  throw new Error(UNEXPECTED_ERROR);
}
