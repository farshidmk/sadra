import { GridColDef } from "@mui/x-data-grid";

export type TGridCol<T> = GridColDef & {
  field: keyof T | "action";
};
