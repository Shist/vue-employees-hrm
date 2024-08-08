export interface ILanguagesTableData {
  id: number;
  iso2: string;
  name: string;
  nativeName: string | null;
}

export interface ILanguagesTableServerData {
  id: number;
  iso2: string;
  name: string;
  native_name: string | null;
}
