import { ref } from "vue";
import { defineStore } from "pinia";

export const useBreadCrumbsStore = defineStore("breadCrumbs", () => {
  const currUserName = ref<string>("");
  const currCVName = ref<string>("");

  return { currUserName, currCVName };
});
