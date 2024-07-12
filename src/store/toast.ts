import { ref } from "vue";
import { Id } from "vue3-toastify";
import { defineStore } from "pinia";

export const useToastStore = defineStore("toast", () => {
  const currToastId = ref<Id | null>(null);

  return { currToastId };
});
