import { Box, Skeleton } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import CreateNewItem from "components/buttons/CreateNewItem";
import CustomDataGrid from "components/dataGrid/CustomDataGrid";
import ErrorHandler from "components/errorHandler/ErrorHandler";
import TableActions from "components/table/TableActions";
import { useAuth } from "hooks/useAuth";
import React, { useMemo, useState } from "react";
import { TGridCol } from "types/grid";
import { useNavigate } from "react-router-dom";
import DeleteModal from "components/deleteModal/DeleteModal";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import { ICurrencyUnit } from "types/currencyUnit";

const CurrencyUnit = () => {
  const Auth = useAuth();
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState<ICurrencyUnit | undefined>();

  const columns = useMemo(
    (): TGridCol<ICurrencyUnit>[] => [
      { field: "currency", headerName: "واحد پول", flex: 1 },
      { field: "currencyEN", headerName: "واحد پول به لاتین", flex: 1 },
      { field: "isoCode", headerName: "کد ایزو", flex: 1 },
      { field: "currencyCode", headerName: "کد واحد پول", flex: 1 },
      {
        headerName: "عملیات",
        field: "action",
        flex: 1,
        renderCell: ({ row }: { row: ICurrencyUnit }) => {
          return (
            <Box sx={{ display: "flex" }}>
              <TableActions
                onEdit={() => {
                  navigate(`${row.pkfCurrency}`);
                }}
                onDelete={() => setSelectedItem(row)}
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
    queryKey: [`Currency/Get`],
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
      <DeleteModal
        handleClose={() => setSelectedItem(undefined)}
        name={selectedItem?.currency}
        open={!!selectedItem}
        deleteParam={{ refetchKey: "Currency/Get", url: `Currency/${selectedItem?.pkfCurrency}` }}
      />
      <CreateNewItem name="واحد پول" icon={<MonetizationOnIcon />} />
      {status === "error" ? (
        <ErrorHandler onRefetch={refetch} />
      ) : status === "loading" ? (
        <Skeleton height={300} />
      ) : status === "success" ? (
        <CustomDataGrid rows={data} columns={columns} getRowId={(row: ICurrencyUnit) => row.pkfCurrency} />
      ) : null}
    </Box>
  );
};

export default CurrencyUnit;
