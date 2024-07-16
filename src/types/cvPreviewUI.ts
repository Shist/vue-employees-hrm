import { Mastery } from "@/types/backend-interfaces/skill/mastery";
import { Proficiency } from "@/types/backend-interfaces/language/proficiency";

export interface ICVPreviewServerData {
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
  skills: ICVPreviewSkill[];
  languages: ICVPreviewLanguage[];
}

export interface ICVPreviewSkill {
  name: string;
  category: string | null;
  mastery: string | Mastery;
}

export interface ICVPreviewLanguage {
  name: string;
  proficiency: Proficiency;
}
