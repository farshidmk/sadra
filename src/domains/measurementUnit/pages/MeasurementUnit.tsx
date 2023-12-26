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
import { IUnit } from "types/unit";
import DeleteModal from "components/deleteModal/DeleteModal";
import StraightenIcon from "@mui/icons-material/Straighten";

const MeasurementUnit = () => {
  const Auth = useAuth();
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState<IUnit | undefined>();

  const columns = useMemo(
    (): TGridCol<IUnit>[] => [
      { field: "unitName", headerName: "نام واحد", flex: 1 },
      { field: "unitNameEN", headerName: "نام واحد به لاتین", flex: 1 },
      { field: "unitCode", headerName: "کد واحد", flex: 1 },
      { field: "unitCodeSM", headerName: "کد واحد سامانه مودیان", flex: 1 },
      {
        headerName: "عملیات",
        field: "action",
        flex: 1,
        renderCell: ({ row }: { row: IUnit }) => {
          return (
            <Box sx={{ display: "flex" }}>
              <TableActions
                onEdit={() => {
                  navigate(`${row.Id}`);
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
    queryKey: [`Unit/Get`],
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
        name={selectedItem?.unitName}
        open={!!selectedItem}
        deleteParam={{ refetchKey: "Unit", url: `Unit/${selectedItem?.pkfUnit}` }}
      />
      <CreateNewItem name="واحد اندازه گیری" icon={<StraightenIcon />} />
      {status === "error" ? (
        <ErrorHandler onRefetch={refetch} />
      ) : status === "loading" ? (
        <Skeleton height={300} />
      ) : status === "success" ? (
        <CustomDataGrid rows={data} columns={columns} getRowId={(row: IUnit) => row.pkfUnit} />
      ) : null}
    </Box>
  );
};

export default MeasurementUnit;
