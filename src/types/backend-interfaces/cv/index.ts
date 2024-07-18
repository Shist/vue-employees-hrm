import { IUser } from "@/types/backend-interfaces/user";
import { ICvProject } from "@/types/backend-interfaces/cv/project";
import { ISkillMastery } from "@/types/backend-interfaces/skill/mastery";
import { ILanguageProficiency } from "@/types/backend-interfaces/language/proficiency";

export interface ICv {
  id: number;
  created_at: string;
  name: string;
  education: string | null;
  description: string;
  user: IUser | null;
  projects: ICvProject[] | null;
  skills: ISkillMastery[];
  languages: ILanguageProficiency[];
}

export interface ICreateCvInput {
  name: string;
  education: string | null;
  description: string;
  userId: number | null;
}

export interface IUpdateCvInput {
  cvId: number;
  name: string;
  education: string | null;
  description: string;
}

export interface IDeleteCvInput {
  cvId: number;
}
