import { ref } from "vue";
import { handleLogout } from "@/utils/handleErrors";
import {
  NOT_FOUND_CV,
  NOT_FOUND_USER,
  UNAUTHORIZED_ERROR,
  UNEXPECTED_ERROR,
} from "@/constants/errorMessage";

export default function useErrorState() {
  const isLoading = ref(true);
  const isError = ref(false);
  const errorMessage = ref(UNEXPECTED_ERROR);
  const isNotFoundError = ref(false);

  function setErrorValuesToDefault() {
    isError.value = false;
    errorMessage.value = UNEXPECTED_ERROR;
    isNotFoundError.value = false;
  }

  function setErrorValues(error: unknown) {
    isError.value = true;

    if (error instanceof Error) {
      if (error.cause === UNAUTHORIZED_ERROR) {
        handleLogout();
        return;
      }

      errorMessage.value = error.message;

      if (error.message === NOT_FOUND_USER || error.message === NOT_FOUND_CV) {
        isNotFoundError.value = true;
      }
    }
  }

  return {
    isLoading,
    isError,
    errorMessage,
    isNotFoundError,
    setErrorValuesToDefault,
    setErrorValues,
  };
}
