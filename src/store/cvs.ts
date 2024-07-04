import { defineStore } from "pinia";
import { reactive, Reactive } from "vue";
import { ICV } from "@/types/backend-interfaces/cv";

export const useCVsStore = defineStore("cvs", () => {
  const cvs: Reactive<ICV[]> = reactive([
    {
      id: 1,
      created_at: "01.07.2024",
      name: "CV #1",
      education: null,
      description: "Some first CV",
      user: null,
      projects: null,
      skills: [],
      languages: [],
    },
    {
      id: 2,
      created_at: "02.07.2024",
      name: "CV #2",
      education: null,
      description: "Some second CV",
      user: null,
      projects: null,
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
