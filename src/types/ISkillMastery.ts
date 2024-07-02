export enum Mastery {
  Novice,
  Advanced,
  Completent,
  Proficient,
  Expert,
}

export interface ISkillMastery {
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
