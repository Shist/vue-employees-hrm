import { defineStore } from "pinia";
import { ref, Ref } from "vue";
import { ITheme } from "@/types/ITheme";

export const useThemeStore = defineStore("theme", () => {
  const theme: Ref<ITheme> = ref("dark");

  return { theme };
});
