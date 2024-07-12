import { ref } from "vue";
import { defineStore } from "pinia";
import { appTheme } from "@/utils/theme";
import { ITheme } from "@/types/theme";

export const useThemeStore = defineStore("theme", () => {
  const currTheme = ref<ITheme>(appTheme);

  return { currTheme };
});
