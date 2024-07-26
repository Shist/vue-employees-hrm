import { storeToRefs } from "pinia";
import { useScrollbarWidth } from "@/store/scrollbarWidth";

export default function handleScrollPadding(isNeedToBeHidden: boolean) {
  const { scrollbarWidth } = storeToRefs(useScrollbarWidth());

  if (document.body.offsetHeight > window.innerHeight) {
    scrollbarWidth.value = `${window.innerWidth - document.body.offsetWidth}px`;
  }

  if (isNeedToBeHidden) {
    document.documentElement.style.overflowY = "hidden";
  } else {
    document.documentElement.style.overflowY = "auto";
    scrollbarWidth.value = undefined;
  }
}
