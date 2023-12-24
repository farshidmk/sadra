import { GridColDef } from "@mui/x-data-grid";

export interface ITableColumn {
  en_name: string;
  fa_name: string;
  isVisible: boolean;
  render?: () => void;
}

export type TColumnDef<T> = GridColDef<T> & { field: keyof T | "action" };
