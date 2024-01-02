import React, { Dispatch, SetStateAction, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid, GridToolbarContainer } from "@mui/x-data-grid";
import { TGridCol } from "types/grid";
import { ISmGood, TModalValue } from "types/sale";
import ReceiptCrudModal from "./ReceiptCrudModal";
import TableActions from "components/table/TableActions";

interface EditToolbarProps {
  onClick?: () => void;
}

function EditToolbar({ onClick }: EditToolbarProps) {
  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={onClick}>
        اضافه کردن به لیست
      </Button>
    </GridToolbarContainer>
  );
}

type Props = {
  data: ISmGood[];
  setDate: Dispatch<SetStateAction<ISmGood[]>>;
};

export default function GoodsReceipts({ data, setDate }: Props) {
  const [modalValue, setModalValue] = useState<TModalValue | undefined>(undefined);
  const [modalKey, setModalKey] = useState(1);

  const columns: TGridCol<ISmGood>[] = [
    { field: "goodCode", headerName: "کد کالا ", flex: 1 },
    { field: "goodName", headerName: "نام کالا", flex: 1 },
    { field: "amount", headerName: "مقدار ", flex: 1 },
    { field: "fee", headerName: "قیمت واحد ", flex: 1 },
    {
      field: "discount",
      headerName: "تخفیف",
      flex: 1,
    },
    {
      field: "vatPrice",
      headerName: "ارزش افزوده",
      flex: 1,
    },
    {
      field: "finalPrice",
      headerName: "مبلغ نهایی",
      flex: 1,
    },
    {
      field: "action",
      headerName: "عملیات",
      width: 100,
      renderCell: ({ row }) => {
        return <TableActions onEdit={() => null} onDelete={() => null} />;
      },
    },
  ];
  return (
    <>
      <ReceiptCrudModal
        handleClose={() => {
          setModalKey((p) => p + 1);
          setModalValue(undefined);
        }}
        modalValue={modalValue}
        setData={setDate}
        key={modalKey}
      />
      <Box
        sx={{
          minHeight: 200,
          width: "100%",
          "& .actions": {
            color: "text.secondary",
          },
          "& .textPrimary": {
            color: "text.primary",
          },
        }}
      >
        <DataGrid
          rows={data}
          columns={columns}
          editMode="row"
          slots={{
            toolbar: EditToolbar,
          }}
          slotProps={{
            toolbar: {
              onClick: () => setModalValue({ mode: "CREATE" }),
            },
          }}
          getRowId={(row: ISmGood) => row.pkfSmGood || JSON.stringify(row)}
        />
      </Box>
    </>
  );
}
