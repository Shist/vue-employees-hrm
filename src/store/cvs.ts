import { defineStore } from "pinia";
import { reactive, Reactive } from "vue";
import { ICV } from "@/types/backend-interfaces/cv";

export const useCVsStore = defineStore("cvs", () => {
  const cvs: Reactive<ICV[]> = reactive([
    {
      id: 1,
      created_at: "01.07.2024",
      name: "CV #1",
      education: undefined,
      description: "Some first CV",
      user: undefined,
      projects: undefined,
      skills: [],
      languages: [],
    },
    {
      id: 2,
      created_at: "02.07.2024",
      name: "CV #2",
      education: undefined,
      description: "Some second CV",
      user: undefined,
      projects: undefined,
      skills: [],
      languages: [],
    },
  ]);

  async function getCVById(targetId: number): Promise<ICV | undefined> {
    // if (cvs === null) { await Подтягиваем cv-шки с сервера ... }
    return cvs.find((cv) => cv.id === targetId);
  }

  return { cvs, getCVById };
});
