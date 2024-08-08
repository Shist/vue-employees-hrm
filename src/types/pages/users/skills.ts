import { Mastery } from "@/types/enums";

export interface IAddOrUpdateProfileSkillInput {
  userId: number;
  name: string;
  category: string | null;
  mastery: Mastery | string;
}

export interface IDeleteProfileSkillInput {
  userId: number;
  name: string[];
}
