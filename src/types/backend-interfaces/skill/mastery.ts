export enum Mastery {
  Novice,
  Advanced,
  Competent,
  Proficient,
  Expert,
}

export interface ISkillMastery {
  name: string;
  category: string | null;
  mastery: Mastery;
}
