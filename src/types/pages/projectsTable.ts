export interface IProjectsTableData {
  id: number;
  name: string;
  internalName: string;
  domain: string;
  startDate: string;
  endDate: string;
  teamSize: number;
  description: string;
}

export interface IProjectsTableServerData {
  id: number;
  name: string;
  internal_name: string;
  domain: string;
  start_date: string;
  end_date: string;
  team_size: number;
  description: string;
}
