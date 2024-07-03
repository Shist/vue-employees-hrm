export enum Proficiency {
  A1,
  A2,
  B1,
  B2,
  C1,
  C2,
  Native,
}

export interface ILanguageProficiency {
  name: string;
  proficiency: Proficiency;
}

export interface IAddProfileLanguageInput {
  userId: number;
  name: string;
  proficiency: Proficiency;
}

export interface IUpdateProfileLanguageInput {
  userId: number;
  name: string;
  proficiency: Proficiency;
}

export interface IDeleteProfileLanguageInput {
  userId: number;
  name: string[];
}
