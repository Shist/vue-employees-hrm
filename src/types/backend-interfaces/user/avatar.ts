export interface IUploadAvatarInput {
  userId: number;
  base64: string;
  size: number;
  type: string;
}

export interface IDeleteAvatarInput {
  userId: number;
}
