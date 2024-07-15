import { Mastery } from "@/types/backend-interfaces/skill/mastery";

export interface ICvSkill {
  name: string;
  category: string | null;
  mastery: Mastery;
}

export interface IAddOrUpdateCvSkillInput {
  cvId: number;
  name: string;
  category: string | null;
  mastery: Mastery;
}

export interface IDeleteCvSkillInput {
  cvId: number;
  name: string[];
}
