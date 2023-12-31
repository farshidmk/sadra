import { Box, Button, Skeleton } from "@mui/material";
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
import CategoryIcon from "@mui/icons-material/Category";
import { IProduct } from "types/product";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import UploadProduct from "../components/UploadProduct";

const Products = () => {
  const Auth = useAuth();
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState<IProduct | undefined>();

  const [showUploadModal, setShowUploadModal] = useState(false);

  const columns = useMemo(
    (): TGridCol<IProduct>[] => [
      { field: "goodCode", headerName: "کد کالا", flex: 1 },
      { field: "goodName", headerName: "نام کالا", flex: 1 },
      //@ts-ignore
      { field: "unit1.unitName", headerName: "واحد", flex: 1 },
      { field: "vatTax", headerName: "درصد مالیات بر ارزش افزوده ", flex: 1 },
      { field: "goodCodeSM", headerName: "کد کالاسامانه مودیان", flex: 1 },

      {
        headerName: "عملیات",
        field: "action",
        flex: 1,
        renderCell: ({ row }: { row: IProduct }) => {
          return (
            <Box sx={{ display: "flex" }}>
              <TableActions
                onEdit={() => {
                  navigate(`${row.pkfGood}`);
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
    queryKey: [`Product/Get`],
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
        name={selectedItem?.goodName}
        open={!!selectedItem}
        deleteParam={{ refetchKey: "Product/Get", url: `Product/${selectedItem?.pkfGood}` }}
      />
      <UploadProduct open={showUploadModal} handleClose={() => setShowUploadModal(false)} />
      <Box sx={{ mb: 2, mt: 3, display: "flex", alignItems: "center" }}>
        <Button
          variant="contained"
          endIcon={<CategoryIcon />}
          onClick={() => navigate("new")}
          color="info"
          sx={{ minWidth: "100px", mr: 3 }}
        >
          ایجاد کالای جدید
        </Button>
        <Button
          variant="outlined"
          endIcon={<CloudUploadIcon />}
          onClick={() => setShowUploadModal(true)}
          color="primary"
          sx={{ minWidth: "100px" }}
        >
          بارگذاری دسته ای کالا
        </Button>
      </Box>
      {status === "error" ? (
        <ErrorHandler onRefetch={refetch} />
      ) : status === "loading" ? (
        <Skeleton height={300} />
      ) : status === "success" ? (
        <CustomDataGrid rows={data} columns={columns} getRowId={(row: IProduct) => row.pkfGood} />
      ) : null}
    </Box>
  );
};

export default Products;
