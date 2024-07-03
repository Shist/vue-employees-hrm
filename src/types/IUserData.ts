import { ISkillMastery } from "@/types/ISkillMastery";

export default interface IUserData {
  id: number;
  email: string;
  avatar: string | null;
  firstName: string | null;
  lastName: string | null;
  department: string | null;
  position: string | null;
  skills: ISkillMastery[];
}
