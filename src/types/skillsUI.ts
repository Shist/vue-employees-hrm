import { Mastery } from "@/types/backend-interfaces/skill/mastery";

export interface ISkill {
  name: string;
  category: string | null;
  mastery: Mastery;
}

export interface ICategorySkillData {
  name: string;
  mastery: Mastery;
  skillIndex: number;
}

export interface ICategorySkill extends ICategorySkillData {
  isDeleting: boolean;
}

export type ISkillCategoriesMap = {
  [key: string]: ICategorySkill[];
};

export type IPreviewSkillCategoriesMap = {
  [key: string]: string[];
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
