import { IProject } from "@/types/backend-interfaces/project";

export interface ICvProject {
  id: number;
  project: IProject;
  name: string;
  internal_name: string;
  description: string;
  domain: string;
  start_date: string;
  end_date: string | null;
  team_size: number;
  roles: string[];
  responsibilities: string[];
}

export interface IAddOrUpdateCvProjectInput {
  cvId: number;
  projectId: number;
  start_date: string;
  end_date: string | null;
  roles: string[];
  responsibilities: string[];
}

export interface IRemoveCvProjectInput {
  cvId: number;
  projectId: number;
}
