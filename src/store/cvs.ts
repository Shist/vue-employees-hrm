import { defineStore } from "pinia";
import { reactive, Reactive } from "vue";
import { ICVData } from "@/types/cvData";

export const useCVsStore = defineStore("cvs", () => {
  const cvs: Reactive<ICVData[]> = reactive([
    {
      id: 1,
      name: "CV #1",
      description: "Some first CV",
      employee: "Pavel",
    },
    {
      id: 2,
      name: "CV #2",
      description: "Some second CV",
      employee: "Aleksey",
    },
  ]);

  async function getCVById(targetId: number) {
    // if (cvs === null) { await Подтягиваем cv-шки с сервера ... }
    return cvs.find((cv) => cv.id === targetId);
  }

  return { cvs, getCVById };
});
