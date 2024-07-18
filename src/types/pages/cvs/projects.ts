export interface ICvProjectsTableData {
  projectId: string;
  name: string;
  internalName: string;
  domain: string;
  startDate: string;
  endDate: string | null;
}

export interface ICvProjectsTableServerData {
  user: {
    id: string;
  } | null;
  projects: ICvProject[] | null;
}

export interface ICvProject {
  project: {
    id: number;
  };
  name: string;
  internal_name: string;
  domain: string;
  start_date: string;
  end_date: string | null;
}

export interface IProjectsData {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
}

export interface IProjectsServerData {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
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
