import { DirectiveBinding, ObjectDirective } from "vue";
import { IVLongPressElement } from "@/types/longPressDirective";

const longPress: ObjectDirective<HTMLElement> = {
  beforeMount(el, binding: DirectiveBinding) {
    let pressTimer: number | null = null;

    const start = (event: TouchEvent) => {
      if (pressTimer === null) {
        pressTimer = window.setTimeout(() => {
          handler(event);
        }, 800);
      }
    };

    const cancel = () => {
      if (pressTimer !== null) {
        clearTimeout(pressTimer);
        pressTimer = null;
      }
    };

    const handler = (event: TouchEvent) => {
      binding.value(event);
    };

    (el as IVLongPressElement).__longPressStart = start;
    (el as IVLongPressElement).__longPressCancel = cancel;

    el.addEventListener("touchstart", start);
    el.addEventListener("touchend", cancel);
    el.addEventListener("touchcancel", cancel);
  },

  unmounted(el) {
    const start = (el as IVLongPressElement).__longPressStart;
    const cancel = (el as IVLongPressElement).__longPressCancel;

    if (start && cancel) {
      el.removeEventListener("touchstart", start);
      el.removeEventListener("touchend", cancel);
      el.removeEventListener("touchcancel", cancel);
    }

    delete (el as IVLongPressElement).__longPressStart;
    delete (el as IVLongPressElement).__longPressCancel;
  },
};

export default longPress;
