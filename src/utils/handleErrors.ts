import { storeToRefs } from "pinia";
import { useAuthStore } from "@/store/authStore";
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
  const { wasAuthErrorToastShown } = storeToRefs(authStore);

  if (authStore.wasAuthErrorToastShown) return;

  const { setErrorToast } = useToast();
  setErrorToast(UNAUTHORIZED_ERROR);

  authStore.logout();

  wasAuthErrorToastShown.value = true;
}