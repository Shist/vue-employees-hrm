import { IUser } from "@/types/backend-interfaces/user";
import { ICVProject } from "@/types/backend-interfaces/cv/project";
import { ISkillMastery } from "@/types/backend-interfaces/skill/mastery";
import { ILanguageProficiency } from "@/types/backend-interfaces/language/proficiency";

export interface ICV {
  id: number;
  created_at: string;
  name: string;
  education: string | null;
  description: string;
  user: IUser | null;
  projects: ICVProject[] | null;
  skills: ISkillMastery[];
  languages: ILanguageProficiency[];
}

export interface ICreateCVInput {
  name: string;
  education: string | null;
  description: string;
  userId: number | null;
}

export interface IUpdateCVInput {
  cvId: number;
  name: string;
  education: string | null;
  description: string;
}

export interface IDeleteCVInput {
  cvId: number;
}
