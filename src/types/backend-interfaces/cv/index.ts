import { IUser } from "@/types/backend-interfaces/user";
import { ICVProject } from "@/types/backend-interfaces/cv/project";
import { ISkillMastery } from "@/types/backend-interfaces/skill/mastery";
import { ILanguageProficiency } from "@/types/backend-interfaces/language/proficiency";

export interface ICV {
  id: number;
  created_at: string;
  name: string;
  education?: string;
  description: string;
  user?: IUser;
  projects?: ICVProject[];
  skills: ISkillMastery[];
  languages: ILanguageProficiency[];
}

export interface ICreateCVInput {
  name: string;
  education?: string;
  description: string;
  userId?: number;
}

export interface IUpdateCVInput {
  cvId: number;
  name: string;
  education?: string;
  description: string;
}

export interface IDeleteCVInput {
  cvId: number;
}
