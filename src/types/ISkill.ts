import { Mastery } from "@/types//ISkillMastery";

export interface ISkill {
  id: number;
  createdAt: string;
  name: string;
  category: string;
}

export interface ISkillForModal {
  id: number;
  name: string;
  category: string;
  mastery: Mastery;
}
