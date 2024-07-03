export interface IPosition {
  id: number;
  created_at: string;
  name: string;
}

export interface ICreatePositionInput {
  name: string;
}

export interface IUpdatePositionInput {
  positionId: number;
  name: string;
}

export interface IDeletePositionInput {
  positionId: number;
}
