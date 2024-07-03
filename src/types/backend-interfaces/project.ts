import { ISkill } from "@/types/backend-interfaces/skill";

export interface IProject {
  id: number;
  created_at: string;
  name: string;
  internal_name: string;
  description: string;
  domain: string;
  start_date: string;
  end_date?: string;
  team_size: number;
  tech_stack?: ISkill;
}

export interface ICreateProjectInput {
  name: string;
  internal_name?: string;
  description: string;
  domain: string;
  start_date: string;
  end_date?: string;
  team_size: number;
}

export interface IUpdateProjectInput {
  projectId: number;
  name: string;
  internal_name?: string;
  description: string;
  domain: string;
  start_date: string;
  end_date?: string;
  team_size: number;
}

export interface IDeleteProjectInput {
  projectId: number;
}
