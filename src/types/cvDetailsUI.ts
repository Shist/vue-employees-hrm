export interface ICVDetailsServerData {
  id: string;
  name: string;
  education: string | null;
  description: string;
  user: {
    id: string;
  } | null;
}
