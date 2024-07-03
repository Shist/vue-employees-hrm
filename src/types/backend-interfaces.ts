export interface IAuthInput {
  email: string;
  password: string;
}

export interface IAuthResult {
  user: IUser;
  access_token: string;
}

export interface IUser {
  id: number;
  created_at: string;
  email: string;
  is_verified: boolean;
  profile: IProfile;
  cvs?: ICV[];
  department?: IDepartment;
  department_name?: string;
  position?: IPosition;
  position_name?: string;
  role: UserRole;
}

export interface IProfile {
  id: number;
  created_at: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  avatar?: string;
  skills: ISkillMastery[];
  languages: ILanguageProficiency[];
}

export interface ISkillMastery {
  name: string;
  category?: string;
  mastery: Mastery;
}

export enum Mastery {
  Novice,
  Advanced,
  Competent,
  Proficient,
  Expert,
}

export interface ILanguageProficiency {
  name: string;
  proficiency: Proficiency;
}

export enum Proficiency {
  A1,
  A2,
  B1,
  B2,
  C1,
  C2,
  Native,
}

export interface ICV {
  id: number;
  created_at: string;
  name: string;
  education?: string;
  description: string;
  user?: IUser;
  projects?: ICVProject[];
  skills: ISkillMastery[];
  languages: ILanguageProficiency[];
}

export interface ICVProject {
  id: number;
  project: IProject;
  name: string;
  internal_name: string;
  description: string;
  domain: string;
  start_date: string;
  end_date?: string;
  team_size: number;
  roles: string[];
  responsibilities: string[];
}

export interface IProject {
  id: number;
  created_at: string;
  name: string;
  internal_name: string;
  description: string;
  domain: string;
  start_date: string;
  end_date?: string;
  team_size: number;
  tech_stack?: ISkill;
}

export interface ISkill {
  id: number;
  created_at: string;
  name: string;
  category?: string;
}

export interface IDepartment {
  id: number;
  created_at: string;
  name: string;
}

export interface IPosition {
  id: number;
  created_at: string;
  name: string;
}

export enum UserRole {
  Employee,
  Admin,
}

export interface ILanguage {
  id: number;
  created_at: string;
  iso2: string;
  name: string;
  native_name?: string;
}

export interface IAddCVProjectInput {
  cvId: number;
  projectId: number;
  start_date: string;
  end_date?: string;
  roles: string[];
  responsibilities: string[];
}

export interface IUpdateCVProjectInput {
  cvId: number;
  projectId: number;
  start_date: string;
  end_date?: string;
  roles: string[];
  responsibilities: string[];
}

export interface IRemoveCVProjectInput {
  cvId: number;
  projectId: number;
}

export interface IAddCVSkillInput {
  cvId: number;
  name: string;
  category?: string;
  mastery: Mastery;
}

export interface IUpdateCVSkillInput {
  cvId: number;
  name: string;
  category?: string;
  mastery: Mastery;
}

export interface IDeleteCVSkillInput {
  cvId: number;
  name: string[];
}

export interface ICreateCVInput {
  name: string;
  education?: string;
  description: string;
  userId?: number;
}

export interface IUpdateCVInput {
  cvId: number;
  name: string;
  education?: string;
  description: string;
}

export interface IDeleteCVInput {
  cvId: number;
}

export interface IDeleteResult {
  affected: number;
}

export interface IExportPDFInput {
  html: string;
  margin?: IMarginInput;
}

export interface IMarginInput {
  top: string;
  bottom: string;
  left: string;
  right: string;
}

export interface ICreateDepartmentInput {
  name: string;
}

export interface IUpdateDepartmentInput {
  departmentId: number;
  name: string;
}

export interface IDeleteDepartmentInput {
  departmentId: number;
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

export interface IVerifyMailInput {
  otp: string;
}

export interface ICreatePositionInput {
  name: string;
}

export interface IUpdatePositionInput {
  positionId: number;
  name: string;
}

export interface IDeletePositionInput {
  positionId: number;
}

export interface IUpdateProfileInput {
  userId: number;
  first_name?: string;
  last_name?: string;
}

export interface IAddProfileSkillInput {
  userId: number;
  name: string;
  category?: string;
  mastery: Mastery;
}

export interface IUpdateProfileSkillInput {
  userId: number;
  name: string;
  category?: string;
  mastery: Mastery;
}

export interface IDeleteProfileSkillInput {
  userId: number;
  name: string[];
}

export interface IAddProfileLanguageInput {
  userId: number;
  name: string;
  proficiency: Proficiency;
}

export interface IUpdateProfileLanguageInput {
  userId: number;
  name: string;
  proficiency: Proficiency;
}

export interface IDeleteProfileLanguageInput {
  userId: number;
  name: string[];
}

export interface IUploadAvatarInput {
  userId: number;
  base64: string;
  size: number;
  type: string;
}

export interface IDeleteAvatarInput {
  userId: number;
}

export interface ICreateProjectInput {
  name: string;
  internal_name?: string;
  description: string;
  domain: string;
  start_date: string;
  end_date?: string;
  team_size: number;
}

export interface IUpdateProjectInput {
  projectId: number;
  name: string;
  internal_name?: string;
  description: string;
  domain: string;
  start_date: string;
  end_date?: string;
  team_size: number;
}

export interface IDeleteProjectInput {
  projectId: number;
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

export interface ICreateUserInput {
  auth: IAuthInput;
  profile: ICreateProfileInput;
  cvsIds: string[];
  departmentId?: number;
  positionId?: number;
  role: UserRole;
}

export interface ICreateProfileInput {
  first_name?: string;
  last_name?: string;
}

export interface IUpdateUserInput {
  userId: number;
  cvsIds?: string[];
  departmentId?: number;
  positionId?: number;
  role?: UserRole;
}
