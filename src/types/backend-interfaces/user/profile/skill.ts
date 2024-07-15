import { Mastery } from "@/types/backend-interfaces/skill/mastery";

export interface IAddOrUpdateProfileSkillInput {
  userId: number;
  name: string;
  category: string | null;
  mastery: Mastery;
}

export interface IDeleteProfileSkillInput {
  userId: number;
  name: string[];
}
