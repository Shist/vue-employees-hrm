import { Proficiency } from "@/types/languageProficiency";

export interface ILanguagesNamesData {
  id: number;
  name: string;
}

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
