export interface IDepartment {
  id: number;
  created_at: string;
  name: string;
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
