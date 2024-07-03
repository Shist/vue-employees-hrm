import { ISkillMastery } from "@/types/backend-interfaces/skill/mastery";
import { ILanguageProficiency } from "@/types/backend-interfaces/language/proficiency";

export interface IProfile {
  id: number;
  created_at: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  avatar?: string;
  skills: ISkillMastery[];
  languages: ILanguageProficiency[];
}

export interface ICreateProfileInput {
  first_name?: string;
  last_name?: string;
}

export interface IUpdateProfileInput {
  userId: number;
  first_name?: string;
  last_name?: string;
}
