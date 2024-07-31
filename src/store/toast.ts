import { ref } from "vue";
import { defineStore } from "pinia";
import { Id } from "vue3-toastify";

export const useToastStore = defineStore("toast", () => {
  const currToastId = ref<Id | null>(null);

  return { currToastId };
});
