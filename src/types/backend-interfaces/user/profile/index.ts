import { ISkillMastery } from "@/types/backend-interfaces/skill/mastery";
import { ILanguageProficiency } from "@/types/backend-interfaces/language/proficiency";

export interface IProfile {
  id: number;
  created_at: string;
  first_name: string | null;
  last_name: string | null;
  full_name: string | null;
  avatar: string | null;
  skills: ISkillMastery[];
  languages: ILanguageProficiency[];
}

export interface ICreateProfileInput {
  first_name: string | null;
  last_name: string | null;
}

export interface IUpdateProfileInput {
  userId: number;
  first_name: string | null;
  last_name: string | null;
}
