export interface ILanguage {
  id: number;
  created_at: string;
  iso2: string;
  name: string;
  native_name?: string;
}

export interface ICreateLanguageInput {
  iso2: string;
  name: string;
  native_name?: string;
}

export interface IUpdateLanguageInput {
  languageId: number;
  iso2: string;
  name: string;
  native_name?: string;
}

export interface IDeleteLanguageInput {
  languageId: number;
}
