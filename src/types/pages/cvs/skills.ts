import { Mastery } from "@/types/enums";

export interface IAddOrUpdateCvSkillInput {
  cvId: number;
  name: string;
  category: string | null;
  mastery: Mastery | string;
}

export interface IDeleteCvSkillInput {
  cvId: number;
  name: string[];
}
