export interface ICVProjectsTableData {
  projectID: string;
  name: string;
  internalName: string;
  domain: string;
  startDate: string;
  endDate: string | null;
}

export interface ICVProject {
  project: {
    id: number;
  };
  name: string;
  internal_name: string;
  domain: string;
  start_date: string;
  end_date: string | null;
}

export interface ICVProjectsTableServerData {
  user: {
    id: string;
  } | null;
  projects: ICVProject[] | null;
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
