export interface ICvsTableData {
  id: number;
  name: string;
  description: string;
  education: string;
  email: string;
  userID: number | null;
}

export interface ICvsTableServerData {
  id: number;
  name: string;
  description: string;
  education: string;
  user: {
    id: number;
    email: string;
  };
}
