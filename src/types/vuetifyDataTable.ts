/* eslint-disable @typescript-eslint/no-explicit-any */
import { IUsersTableData } from "@/types/usersTableUI";
import { IProjectsTableData } from "@/types/projectsTableUI";
import { ICvsTableData } from "@/types/cvsTableUI";
import { IDepartmentsTableData } from "@/types/departmentsTableUI";
import { IPositionsTableData } from "@/types/positionsTableUI";
import { ISkillsTableData } from "@/types/skillsTableUI";
import { ILanguagesTableData } from "@/types/languagesTableUI";
import { ICvProjectsTableData } from "@/types/cvProjectsUI";

type FilterMatch = boolean | number | [number, number] | [number, number][];

interface InternalItem<T> {
  value: any;
  raw: T;
}

type FilterFunction<T> = (
  value: string,
  query: string,
  item?: InternalItem<T>
) => FilterMatch;

export type IUsersFilterFunction = FilterFunction<IUsersTableData>;

export type IProjectsFilterFunction = FilterFunction<IProjectsTableData>;

export type ICvsFilterFunction = FilterFunction<ICvsTableData>;

export type IDepartmentsFilterFunction = FilterFunction<IDepartmentsTableData>;

export type IPositionsFilterFunction = FilterFunction<IPositionsTableData>;

export type ISkillsFilterFunction = FilterFunction<ISkillsTableData>;

export type ILanguagesFilterFunction = FilterFunction<ILanguagesTableData>;

export type ICvProjectsFilterFunction = FilterFunction<ICvProjectsTableData>;
