export interface ILanguage {
  id: number;
  created_at: string;
  iso2: string;
  name: string;
  native_name: string | null;
}

export interface ICreateLanguageInput {
  iso2: string;
  name: string;
  native_name: string | null;
}

export interface IUpdateLanguageInput {
  languageId: number;
  iso2: string;
  name: string;
  native_name: string | null;
}

export interface IDeleteLanguageInput {
  languageId: number;
}
