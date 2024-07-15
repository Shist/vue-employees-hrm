import { Mastery } from "@/types/backend-interfaces/skill/mastery";
import { ICvSkill } from "@/types/backend-interfaces/cv/skill";

export interface ICVSkillsServerData {
  id: string;
  skills: ICvSkill[];
  user: {
    id: string;
  } | null;
}

export interface ICategorySkill {
  name: string;
  mastery: Mastery;
  skillIndex: number;
  isDeleting: boolean;
}

export type ISkillCategoriesMap = {
  [key: string]: ICategorySkill[];
};

export interface ISkillsData {
  id: number;
  name: string;
  category: string;
}
