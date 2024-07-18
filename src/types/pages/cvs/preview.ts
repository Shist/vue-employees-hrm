import { Mastery, Proficiency } from "@/types/enums";

export interface ICvPreviewServerData {
  id: string;
  name: string;
  education: string | null;
  description: string;
  user: {
    id: string;
    email: string;
    profile: {
      id: string;
      first_name: string | null;
      last_name: string | null;
      full_name: string | null;
    };
    position_name: string | null;
  } | null;
  projects: ICvPreviewProject[];
  skills: ICvPreviewSkill[];
  languages: ICvPreviewLanguage[];
}

export interface ICvPreviewProject {
  name: string;
  start_date: string;
  end_date: string | null;
  roles: string[];
  responsibilities: string[];
}

export interface ICvPreviewSkill {
  name: string;
  category: string | null;
  mastery: Mastery;
}

export interface ICvPreviewLanguage {
  name: string;
  proficiency: Proficiency;
}

export interface IExportPDFInput {
  html: string;
  margin: IMarginInput | null;
}

export interface IMarginInput {
  top: string;
  bottom: string;
  left: string;
  right: string;
}

export type IPreviewSkillCategoriesMap = {
  [key: string]: string[];
};
