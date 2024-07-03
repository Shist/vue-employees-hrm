export enum Mastery {
  Novice,
  Advanced,
  Completent,
  Proficient,
  Expert,
}

export interface ISkill {
  id: number;
  createdAt: string;
  name: string;
  category: string;
}

export interface ISkillForModal {
  id: number;
  name: string;
  category: string;
  mastery: Mastery;
}

export interface ICategorySkill {
  id: number;
  name: string;
  mastery: Mastery;
  skillIndex: number;
  isDeleting: boolean;
}

export type ISkillCategoriesMap = {
  [key: string]: ICategorySkill[];
};
