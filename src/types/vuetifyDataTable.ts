/* eslint-disable @typescript-eslint/no-explicit-any */
import { IUsersTableData } from "@/types/usersTableUI";
import { ICVProjectsTableData } from "@/types/cvProjectsUI";

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

export type ICVProjectsFilterFunction = FilterFunction<ICVProjectsTableData>;
