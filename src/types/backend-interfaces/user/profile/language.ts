import { Proficiency } from "@/types/backend-interfaces/language/proficiency";

export interface IProfileLanguage {
  name: string;
  proficiency: Proficiency;
}

export interface IAddOrUpdateProfileLanguageInput {
  userId: number;
  name: string;
  proficiency: Proficiency;
}

export interface IDeleteProfileLanguageInput {
  userId: number;
  name: string[];
}
