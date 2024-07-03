import { Mastery } from "@/types/backend-interfaces/skill/mastery";

export interface IProfileSkill {
  name: string;
  category?: string;
  mastery: Mastery;
}

export interface IAddProfileSkillInput {
  userId: number;
  name: string;
  category?: string;
  mastery: Mastery;
}

export interface IUpdateProfileSkillInput {
  userId: number;
  name: string;
  category?: string;
  mastery: Mastery;
}

export interface IDeleteProfileSkillInput {
  userId: number;
  name: string[];
}
