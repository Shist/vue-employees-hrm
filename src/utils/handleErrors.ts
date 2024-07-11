// Wright errorsHandling method for the app using switch/case and call it in every request to Apollo
// use errorsHandling method in all services

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

import useToast from "@/composables/useToast";
import {
  EMAIL_DUPLICATE_ERROR,
  INVALID_CREDENTIALS,
  NO_NETWORK_CONNECTION,
  NOT_FOUND_CV,
  NOT_FOUND_USER,
  UNAUTHORIZED_ERROR,
  UNEXPECTED_ERROR,
} from "@/constants/errorMessage";
import { useAuthStore } from "@/store/authStore";

export function checkUserID(id: string) {
  if (!Number.isInteger(Number(id)) || BigInt(id) > 2147483647n) {
    throw new Error(NOT_FOUND_USER);
  }
}

export function checkCvID(id: string) {
  if (!Number.isInteger(Number(id)) || BigInt(id) > 2147483647n) {
    throw new Error(NOT_FOUND_CV);
  }
}

export function getDetailedError(error: unknown) {
  if (error instanceof Error) {
    switch (error.message) {
      case "Invalid credentials":
        return new Error(INVALID_CREDENTIALS);
      case "Failed to fetch":
        return new Error(NO_NETWORK_CONNECTION);
      case 'duplicate key value violates unique constraint "UQ_e12875dfb3b1d92d7d7c5377e22"':
        return new Error(EMAIL_DUPLICATE_ERROR);
      case "Cannot return null for non-nullable field Query.user.":
        return new Error(NOT_FOUND_USER);
      case "Cannot return null for non-nullable field Query.cv.":
        return new Error(NOT_FOUND_CV);
      case NOT_FOUND_USER:
        return new Error(NOT_FOUND_USER);
      case NOT_FOUND_CV:
        return new Error(NOT_FOUND_CV);
      case "Unauthorized":
        return new Error(UNAUTHORIZED_ERROR, { cause: UNAUTHORIZED_ERROR });
    }
  }
  return new Error(UNEXPECTED_ERROR);
}

export function handleLogout() {
  const authStore = useAuthStore();
  const { setErrorToast } = useToast();

  setErrorToast(UNAUTHORIZED_ERROR);
  authStore.logout();
}
