/* eslint-disable @typescript-eslint/no-explicit-any */
import { IUsersTableData } from "@/types/pages/users/table";
import { IProjectsTableData } from "@/types/pages/projectsTable";
import { ICvsTableData } from "@/types/pages/cvs/table";
import { IDepartmentsTableData } from "@/types/pages/departmentsTable";
import { IPositionsTableData } from "@/types/pages/positionsTable";
import { ISkillsTableData } from "@/types/pages/skillsTable";
import { ILanguagesTableData } from "@/types/pages/languagesTable";
import { ICvProjectsTableData } from "@/types/pages/cvs/projects";

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
