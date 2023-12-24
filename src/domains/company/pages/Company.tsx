import { Box, Skeleton } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import CreateNewItem from "components/buttons/CreateNewItem";
import CustomDataGrid from "components/dataGrid/CustomDataGrid";
import ErrorHandler from "components/errorHandler/ErrorHandler";
import RenderBoolean from "components/render/booleanValue/RenderBoolean";
import TableActions from "components/table/TableActions";
import { useAuth } from "hooks/useAuth";
import React, { useMemo } from "react";
import { ICompany } from "types/company";
import { TGridCol } from "types/grid";
import ApartmentIcon from "@mui/icons-material/Apartment";
import { useNavigate } from "react-router-dom";

const Company = () => {
  const Auth = useAuth();
  const navigate = useNavigate();

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
        renderCell: ({ row }: { row: ICompany }) => {
          return (
            <Box sx={{ display: "flex" }}>
              <TableActions
                onEdit={() => {
                  navigate(`${row.Id}`);
                }}
              />
            </Box>
          );
        },
      },
    ],

    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const { data, status, refetch } = useQuery({
    queryKey: [`Company`],
    queryFn: Auth?.getRequest,
    select: (res) => {
      if (res.Succeeded) {
        return res.Data;
      } else {
        throw new Error(res.ErrorList);
      }
    },
  });

  return (
    <Box>
      <CreateNewItem name="شرکت" icon={<ApartmentIcon />} />
      {status === "error" ? (
        <ErrorHandler onRefetch={refetch} />
      ) : status === "loading" ? (
        <Skeleton height={300} />
      ) : status === "success" ? (
        <CustomDataGrid rows={data} columns={columns} getRowId={(row: ICompany) => row.Id} />
      ) : null}
    </Box>
  );
};

export default Company;
