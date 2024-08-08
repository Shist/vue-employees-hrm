import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { handleLogout } from "@/utils/handleErrors";
import { UNAUTHORIZED_ERROR } from "@/constants/errorMessage";

export default function useErrorState() {
  const { t } = useI18n({ useScope: "global" });
  const isLoading = ref(true);
  const isError = ref(false);
  const errorMessageKey = ref("UNEXPECTED_ERROR");

  function setErrorValuesToDefault() {
    isError.value = false;
    errorMessageKey.value = t("errors.UNEXPECTED_ERROR");
  }

  function setErrorValues(error: unknown) {
    isError.value = true;

    if (error instanceof Error) {
      if (error.cause === UNAUTHORIZED_ERROR) {
        handleLogout();
        return;
      }

      errorMessageKey.value = error.message;
    }
  }

  return {
    isLoading,
    isError,
    errorMessageKey,
    setErrorValuesToDefault,
    setErrorValues,
  };
}
