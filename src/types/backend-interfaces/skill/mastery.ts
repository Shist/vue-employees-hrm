export enum Mastery {
  Novice = "Novice",
  Advanced = "Advanced",
  Competent = "Competent",
  Proficient = "Proficient",
  Expert = "Expert",
}

export interface ISkillMastery {
  name: string;
  category: string | null;
  mastery: Mastery;
}
