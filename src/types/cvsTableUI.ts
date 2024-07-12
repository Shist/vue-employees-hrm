export interface ICvsTableData {
  id: number;
  name: string;
  description: string;
  education: string;
  email: string;
}

export interface ICvsTableServerData {
  id: number;
  name: string;
  description: string;
  education: string;
  user: {
    email: string;
  };
}
