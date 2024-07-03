import { IProject } from "@/types/backend-interfaces/project";

export interface ICVProject {
  id: number;
  project: IProject;
  name: string;
  internal_name: string;
  description: string;
  domain: string;
  start_date: string;
  end_date?: string;
  team_size: number;
  roles: string[];
  responsibilities: string[];
}

export interface IAddCVProjectInput {
  cvId: number;
  projectId: number;
  start_date: string;
  end_date?: string;
  roles: string[];
  responsibilities: string[];
}

export interface IUpdateCVProjectInput {
  cvId: number;
  projectId: number;
  start_date: string;
  end_date?: string;
  roles: string[];
  responsibilities: string[];
}

export interface IRemoveCVProjectInput {
  cvId: number;
  projectId: number;
}
