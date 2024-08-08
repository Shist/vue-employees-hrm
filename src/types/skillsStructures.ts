import { Mastery } from "@/types/enums";

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

export interface ISkillsData {
  id: number;
  name: string;
  category: string;
}

export interface ICvSkillsServerData {
  id: string;
  skills: ISkill[];
  user: {
    id: string;
  } | null;
}
