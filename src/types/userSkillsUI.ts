import { Mastery } from "@/types/backend-interfaces/skill/mastery";

export interface ICategorySkill {
  name: string;
  mastery: Mastery;
  skillIndex: number;
  isDeleting: boolean;
}

export type ISkillCategoriesMap = {
  [key: string]: ICategorySkill[];
};
