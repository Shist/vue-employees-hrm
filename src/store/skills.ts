import { defineStore } from "pinia";
import { reactive, Reactive } from "vue";
import { ISkill } from "@/types/backend-interfaces/skill";

export const useSkillsStore = defineStore("skills", () => {
  const skills: Reactive<ISkill[]> = reactive([
    {
      id: 1,
      created_at: "02.07.2024",
      name: "JavaScript",
      category: "Programming technologies",
    },
    {
      id: 2,
      created_at: "01.07.2024",
      name: "MongoDB",
      category: "Database management system",
    },
    {
      id: 3,
      created_at: "30.06.2024",
      name: "Vue",
      category: "Programming technologies",
    },
    {
      id: 4,
      created_at: "29.06.2024",
      name: "Typescript",
      category: "Programming technologies",
    },
  ]);

  const skillCategories: Reactive<string[]> = reactive([
    "Programming technologies",
    "Database management system",
    "Source control systems",
  ]);

  async function getSkillById(targetId: number): Promise<ISkill | undefined> {
    // if (skills === null) { await Подтягиваем скилы с сервера ... }
    return skills.find((skill) => skill.id === targetId);
  }

  function getCategoryBySkill(skillName: string) {
    return skills.find((skill) => skill.name === skillName)?.category;
  }

  return { skills, skillCategories, getSkillById, getCategoryBySkill };
});
