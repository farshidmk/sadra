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
import { ICustomer, ICustomerTitle, ICustomerType } from "types/customer";
import HailIcon from "@mui/icons-material/Hail";
import RenderGridStatus from "components/dataGrid/RenderGridStatus";

const Customer = () => {
  const Auth = useAuth();
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState<ICustomer | undefined>();

  const {
    data: customerTypes,
    status: customerTypesStatus,
    refetch: customerTypesRefetch,
  } = useQuery({
    queryKey: [`Customer`, "GetCustomerType"],
    queryFn: Auth?.getRequest,
    select: (res): ICustomerType[] => res.Data,
    cacheTime: Infinity,
    staleTime: Infinity,
  });
  const {
    data: customerTitles,
    status: customerTitlesStatus,
    refetch: customerTitlesRefetch,
  } = useQuery({
    queryKey: [`Customer`, "GetCustomerTitle"],
    queryFn: Auth?.getRequest,
    select: (res): ICustomerTitle[] => res.Data,
    cacheTime: Infinity,
    staleTime: Infinity,
  });

  const columns = useMemo(
    (): TGridCol<ICustomer>[] => [
      { field: "treaterCode", headerName: "کد", flex: 0.6 },
      {
        field: "type",
        headerName: "نوع طرف حساب",
        flex: 1,
        renderCell: ({ value }) => (
          <RenderGridStatus
            status={customerTypesStatus}
            refetch={customerTypesRefetch}
            renderValue={<>{customerTypes?.find((ct) => ct.pkfTreaterLRType === value)?.treaterLRType}</>}
          />
        ),
      },
      {
        field: "title",
        headerName: "عنوان",
        flex: 1,
        renderCell: ({ value }) => (
          <RenderGridStatus
            status={customerTitlesStatus}
            refetch={customerTitlesRefetch}
            renderValue={<>{customerTitles?.find((ct) => ct.pkfTitle === value.pkfTitle)?.title}</>}
          />
        ),
      },
      { field: "fullName", headerName: "نام", flex: 1 },
      { field: "economicCode", headerName: "کد اقتصادی", flex: 1 },
      { field: "identityCode", headerName: "شناسه ملی/کدملی", flex: 1 },
      { field: "zipCode", headerName: "کد پستی", flex: 1 },
      {
        headerName: "عملیات",
        field: "action",
        flex: 1,
        renderCell: ({ row }: { row: ICustomer }) => {
          return (
            <Box sx={{ display: "flex" }}>
              <TableActions
                onEdit={() => {
                  navigate(`${row.pkfTreater}`);
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
    queryKey: [`Customer`],
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
        name={selectedItem?.fullName}
        open={!!selectedItem}
        deleteParam={{ refetchKey: "Customer", url: `Customer/${selectedItem?.pkfTreater}` }}
      />
      <CreateNewItem name="مشتری" icon={<HailIcon />} />
      {status === "error" ? (
        <ErrorHandler onRefetch={refetch} />
      ) : status === "loading" ? (
        <Skeleton height={300} />
      ) : status === "success" ? (
        <CustomDataGrid rows={data} columns={columns} getRowId={(row: ICustomer) => row.pkfTreater} />
      ) : null}
    </Box>
  );
};

export default Customer;
