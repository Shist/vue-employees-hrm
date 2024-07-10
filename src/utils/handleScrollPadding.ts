import { useScrollbarWidth } from "@/store/scrollbarWidth";
import { storeToRefs } from "pinia";

export default function handleScrollPadding(isNeedToBeHidden: boolean) {
  const { scrollbarWidth } = storeToRefs(useScrollbarWidth());

  if (document.body.offsetHeight > window.innerHeight) {
    scrollbarWidth.value = `${
      20 + window.innerWidth - document.body.offsetWidth
    }px`;
  }
  if (isNeedToBeHidden) {
    document.documentElement.style.overflowY = "hidden";
  } else {
    document.documentElement.style.overflowY = "auto";
    scrollbarWidth.value = undefined;
  }
}
