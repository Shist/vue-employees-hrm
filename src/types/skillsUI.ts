import { Mastery } from "@/types/backend-interfaces/skill/mastery";

export interface ISkill {
  name: string;
  category: string | null;
  mastery: Mastery;
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

export interface ICVSkillsServerData {
  id: string;
  skills: ISkill[];
  user: {
    id: string;
  } | null;
}
