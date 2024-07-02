import { Mastery } from "@/types//ISkillMastery";

export interface ISkill {
  id: number;
  createdAt: string;
  name: string;
  category: string;
}

export interface ISkillForModal {
  name: string;
  category: string;
  mastery: Mastery;
}
