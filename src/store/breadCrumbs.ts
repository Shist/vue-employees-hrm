import { ref } from "vue";
import { defineStore } from "pinia";

export const useBreadCrumbsStore = defineStore("breadCrumbs", () => {
  const newEnityName = ref<string | null>(null);

  return { newEnityName };
});
