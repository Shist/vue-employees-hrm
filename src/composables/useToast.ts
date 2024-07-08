import { storeToRefs } from "pinia";
import { toast } from "vue3-toastify";
import { useToastStore } from "@/store/toast";

export default function useToast() {
  const { currToastId } = storeToRefs(useToastStore());

  const removeCurrToast = () => {
    if (currToastId.value) {
      toast.remove(currToastId.value);
      currToastId.value = null;
    }
  };

  const setSuccessToast = (msg: string) => {
    removeCurrToast();
    const successToastId = toast(msg, {
      type: "success",
      position: toast.POSITION.BOTTOM_CENTER,
      closeOnClick: false,
    });
    currToastId.value = successToastId;
  };

  const setErrorToast = (msg: string) => {
    removeCurrToast();
    const errorToastId = toast(msg, {
      type: "error",
      position: toast.POSITION.BOTTOM_CENTER,
      closeOnClick: false,
    });
    currToastId.value = errorToastId;
  };

  return { removeCurrToast, setSuccessToast, setErrorToast };
}
