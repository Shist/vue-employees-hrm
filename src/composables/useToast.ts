import { storeToRefs } from "pinia";
import { toast, Id } from "vue3-toastify";
import { useToastStore } from "@/store/toast";

export default function useToast() {
  const { currToastId } = storeToRefs(useToastStore());

  const setCurrToastId = (newValue: Id | null) => {
    currToastId.value = newValue;
  };

  const removeCurrToast = () => {
    if (currToastId.value) {
      toast.remove(currToastId.value);
      setCurrToastId(null);
    }
  };

  const setLoadingToast = (msg: string) => {
    removeCurrToast();
    const loadingToastId = toast(msg, {
      position: toast.POSITION.BOTTOM_CENTER,
      autoClose: false,
      closeOnClick: false,
      closeButton: false,
    });
    setCurrToastId(loadingToastId);
  };

  const setSuccessToast = (msg: string) => {
    removeCurrToast();
    const successToastId = toast(msg, {
      type: "success",
      position: toast.POSITION.BOTTOM_CENTER,
      closeOnClick: false,
    });
    setCurrToastId(successToastId);
  };

  const setErrorToast = (msg: string) => {
    removeCurrToast();
    const errorToastId = toast(msg, {
      type: "error",
      position: toast.POSITION.BOTTOM_CENTER,
      closeOnClick: false,
    });
    setCurrToastId(errorToastId);
  };

  return { removeCurrToast, setLoadingToast, setSuccessToast, setErrorToast };
}
