import { ref } from "vue";
import { defineStore } from "pinia";

export const useScrollbarWidth = defineStore("scrollbarWidth", () => {
  const scrollbarWidth = ref<undefined | string>(undefined);

  return { scrollbarWidth };
});
