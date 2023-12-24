import { Box, Skeleton } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import CreateNewItem from "components/buttons/CreateNewItem";
import CustomDataGrid from "components/dataGrid/CustomDataGrid";
import ErrorHandler from "components/errorHandler/ErrorHandler";
import RenderBoolean from "components/render/booleanValue/RenderBoolean";
import RenderPersianDate from "components/render/persianDate/RenderPersianDate";
import TableActions from "components/table/TableActions";
import { useAuth } from "hooks/useAuth";
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import paramsSerializer from "services/paramsSerializer";
import { PAGINATION_DEFAULT_VALUE } from "shared/paginationValue";
import { ICompany } from "types/company";
import { TGridCol } from "types/grid";
import { IQueryParamFilter } from "types/types";

const CompanySetting = () => {
  const Auth = useAuth();
  const navigate = useNavigate();
  const [filters, setFilters] = useState<IQueryParamFilter<ICompany>>(PAGINATION_DEFAULT_VALUE);

  const columns = useMemo(
    (): TGridCol<ICompany>[] => [
      { field: "Title", headerName: "نام شرکت", flex: 1 },
      { field: "EconomyCode", headerName: "کد اقتصادی", flex: 1 },
      {
        field: "IsDefault",
        headerName: "پیش فرض",
        flex: 1,
        renderCell: ({ value }) => <RenderBoolean value={value} />,
      },

      {
        headerName: "عملیات",
        field: "action",
        flex: 2,
        // renderCell: ({ row }: { row: ICompany }) => {
        //   return (
        //     <Box sx={{ display: "flex" }}>
        //       <TableActions
        //         onEdit={() => {
        //           navigate(`${row.id}`);
        //         }}
        //       />
        //     </Box>
        //   );
        // },
      },
    ],

    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const { data, status, refetch } = useQuery({
    queryKey: [`projects${paramsSerializer(filters)}`],
    queryFn: Auth?.getRequest,
    select: (res) => res.data,
    onSuccess: (res) =>
      setFilters((p) => {
        return {
          ...p,
          currentPage: res.currentPage,
          pageSize: res.pageSize,
          count: res.count,
        };
      }),
  });

  return (
    <Box>
      <CreateNewItem name="پروژه" />
      {status === "error" ? (
        <ErrorHandler onRefetch={refetch} />
      ) : status === "loading" ? (
        <Skeleton height={300} />
      ) : status === "success" ? (
        <CustomDataGrid rows={data} columns={columns} />
      ) : null}
    </Box>
  );
};

export default CompanySetting;
