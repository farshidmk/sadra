import React from "react";
import { DataGrid, DataGridProps, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { Grid } from "@mui/material";

const CustomDataGrid = (props: DataGridProps) => {
  const { columns } = props;
  // const index: GridColDef = {
  //   field: "index",
  //   headerName: "ردیف",
  //   flex: 0.8,
  //   sortable: false,
  //   renderCell: (item: any) => {
  //     let id = item.id;
  //     return item.api.getSortedRowIds().indexOf(id) + 1 + (filters?.currentPage! - 1) * filters?.pageSize!;
  //   },
  // };
  // let indexedColumns = [...columns];
  // indexedColumns.unshift(index);
  return (
    <Grid container spacing={0}>
      <Grid item xs={12} sx={{ minHeight: "200px" }}>
        <DataGrid
          localeText={{
            toolbarDensity: "اندازه",
            toolbarDensityLabel: "اندازه سطر",
            toolbarDensityCompact: "کوچک",
            toolbarDensityStandard: "متوسط",
            toolbarDensityComfortable: "بزرگ",

            toolbarFilters: "فیلتر",
            toolbarFiltersLabel: "فیلتر",
            toolbarFiltersTooltipHide: "مخفی کردن فیلتر",
            toolbarFiltersTooltipShow: "نمایش فیلتر",

            toolbarExport: "دریافت خروجی",
            toolbarExportCSV: "دریافت فایل CSV",
            toolbarExportPrint: "پرینت",

            toolbarColumns: "ستون ها",
            toolbarColumnsLabel: "ستون ها",

            MuiTablePagination: {
              labelRowsPerPage: "تعداد ردیف",
              lang: "fa",
              dir: "rtl",
              labelDisplayedRows: ({ from, to, count }) => {
                return `${from}–${to} از ${count !== -1 ? count : `نمایش بیشتر ${to}`}`;
              },
            },

            noRowsLabel: "داده ای یافت نشد",
          }}
          pageSizeOptions={[5, 10, 20, 50, 100]}
          disableColumnMenu
          paginationMode="client"
          {...props}
          slots={{
            toolbar: GridToolbar,
            ...props?.slots,
          }}
        />
      </Grid>
    </Grid>
  );
};

export default CustomDataGrid;
