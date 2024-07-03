export interface ISkill {
  id: number;
  created_at: string;
  name: string;
  category?: string;
}

export interface ICreateSkillInput {
  name: string;
  category?: string;
}

export interface IUpdateSkillInput {
  skillId: number;
  name: string;
  category?: string;
}

export interface IDeleteSkillInput {
  skillId: number;
}
