import { GridSortDirection } from "@mui/x-data-grid";

export interface ISelectableItem<T> {
  mode: TCrudType;
  item?: T;
}

export type TCrudType = "CREATE" | "VIEW" | "EDIT";

// export interface IQueryParamFilter<T> extends T {}
export interface IQueryParamFilter<T> extends T {
  sortBy?: string; //keyof T;
  sortDir?: GridSortDirection;
  pageSize?: number;
  currentPage?: number;
  count?: number;
}

export interface IBaseData {
  id: number;
  name: string;
  faName: string;
  enName: string;
}

export interface IQueryFilter {
  sortBy?: string;
  sortDir?: GridSortDirection;
  pageSize?: number;
  currentPage?: number;
  count?: number;
}
