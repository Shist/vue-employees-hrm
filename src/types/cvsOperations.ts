export interface ICreateCvInput {
  name: string;
  education: string | null;
  description: string;
  userId: number | null;
}

export interface IUpdateCvInput {
  cvId: number;
  name: string;
  education: string | null;
  description: string;
}

export interface IDeleteCvInput {
  cvId: number;
}
