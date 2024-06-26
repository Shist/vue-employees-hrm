import { defineStore } from "pinia";
import { ref } from "vue";

export const useTabsStore = defineStore("tabs", () => {
  const userTabs = ref("profile");
  const cvsTabs = ref("details");

  return { userTabs, cvsTabs };
});
