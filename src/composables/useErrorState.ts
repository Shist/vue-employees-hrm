import { ref } from "vue";
import { handleLogout } from "@/utils/handleErrors";
import { UNAUTHORIZED_ERROR, UNEXPECTED_ERROR } from "@/constants/errorMessage";

export default function useErrorState() {
  const isLoading = ref(true);
  const isError = ref(false);
  const errorMessage = ref(UNEXPECTED_ERROR);

  function setErrorValuesToDefault() {
    isError.value = false;
    errorMessage.value = UNEXPECTED_ERROR;
  }

  function setErrorValues(error: unknown) {
    isError.value = true;

    if (error instanceof Error) {
      if (error.cause === UNAUTHORIZED_ERROR) {
        handleLogout();
        return;
      }

      errorMessage.value = error.message;
    }
  }

  return {
    isLoading,
    isError,
    errorMessage,
    setErrorValuesToDefault,
    setErrorValues,
  };
}
