import { Mastery } from "@/types/backend-interfaces/skill/mastery";

export interface IAddCVSkillInput {
  cvId: number;
  name: string;
  category: string | null;
  mastery: Mastery;
}

export interface IUpdateCVSkillInput {
  cvId: number;
  name: string;
  category: string | null;
  mastery: Mastery;
}

export interface IDeleteCVSkillInput {
  cvId: number;
  name: string[];
}
