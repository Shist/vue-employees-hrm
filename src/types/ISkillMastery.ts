export enum Mastery {
  Novice,
  Advanced,
  Completent,
  Proficient,
  Expert,
}

export interface ISkillMastery {
  name: string;
  category: string;
  mastery: Mastery;
}

export type ISkillCategoriesMap = {
  [key: string]: Omit<ISkillMastery, "category">[];
};
