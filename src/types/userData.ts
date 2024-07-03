import { ISkillForModal } from "@/types/userSkillsUI";

export interface IUserData {
  id: number;
  avatar: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  position: string;
  skills: ISkillForModal[];
}
