import { ref } from "vue";
import { defineStore } from "pinia";
import { ITheme } from "@/types/theme";
import { appTheme } from "@/utils/theme";

export const useThemeStore = defineStore("theme", () => {
  const currTheme = ref<ITheme>(appTheme);

  return { currTheme };
});
