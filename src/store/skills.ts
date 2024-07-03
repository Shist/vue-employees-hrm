import { defineStore } from "pinia";
import { reactive, Reactive } from "vue";
import { ISkill } from "@/types/userSkillsUI";

export const useSkillsStore = defineStore("skills", () => {
  const skills: Reactive<ISkill[]> = reactive([
    {
      id: 1,
      createdAt: "02.07.2024",
      name: "JavaScript",
      category: "Programming technologies",
    },
    {
      id: 2,
      createdAt: "01.07.2024",
      name: "MongoDB",
      category: "Database management system",
    },
    {
      id: 3,
      createdAt: "30.06.2024",
      name: "Vue",
      category: "Programming technologies",
    },
    {
      id: 4,
      createdAt: "29.06.2024",
      name: "Typescript",
      category: "Programming technologies",
    },
  ]);

  const skillCategories: Reactive<string[]> = reactive([
    "Programming technologies",
    "Database management system",
    "Source control systems",
  ]);

  async function getSkillById(targetId: number) {
    // if (skills === null) { await Подтягиваем скилы с сервера ... }
    return skills.find((skill) => skill.id === targetId);
  }

  function getCategoryBySkill(skillName: string) {
    return skills.find((skill) => skill.name === skillName)?.category;
  }

  return { skills, skillCategories, getSkillById, getCategoryBySkill };
});
