import React, { useEffect, useMemo, useState } from "react";
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, Box, Typography } from "@mui/material";
import DialogTitle from "@mui/material/DialogTitle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useMutation } from "@tanstack/react-query";
import ErrorAlert from "components/phoenixAlert/ErrorAlert";

import Persian from "@uppy/locales/lib/fa_IR";
import Uppy from "@uppy/core";
import { Dashboard } from "@uppy/react";
import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";
import { useAuth } from "hooks/useAuth";
import { useSnackbar } from "hooks/useSnackbar";

const UploadProduct = ({ open, handleClose }) => {
  const Auth = useAuth();
  const snackbar = useSnackbar();
  const [error, setError] = useState();
  const [uploadedFile, setUploadedFile] = useState();

  const { isLoading, mutate } = useMutation({
    mutationFn: Auth?.serverCall,
  });

  const [uppy] = useState(
    () =>
      new Uppy({
        allowMultipleUploadBatches: false,
        restrictions: {
          allowedFileTypes: [".XLS", ".XLSX"],
        },
        locale: Persian,
        autoProceed: false,
      })
  );

  // useMemo(() => {
  //   uppy.on("upload", (data) => {
  //     console.log({ data });
  //     const form = new FormData();
  //     form.append("data", data?.fileIDs[0]);
  //     mutate(
  //       {
  //         entity: `ImportSale`,
  //         method: "post",
  //         data: data?.fileIDs[0],
  //       },
  //       {
  //         onSuccess: (res) => {
  //           if (!res.Succeeded) {
  //             setError(res.ErrorList);
  //           } else {
  //             snackbar("عملیات با موفقیت انجام شد", "success");
  //             handleClose();
  //           }
  //         },
  //         onError: (res) => snackbar("خطا در انجام عملیات", "error"),
  //       }
  //     );
  //   });

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  return (
    <>
      {open && (
        <Dialog sx={{ minWidth: "600px", minHeight: "200pdx" }} open={open} disablePortal={true}>
          <DialogTitle>بارگزاری فایل</DialogTitle>
          <DialogContent>
            <Box>
              <Typography variant="body1">
                برای بارگزاری دسته ای فایل آن را به داخل فرم بیاندازید یا مسیر آنرا مشخص کنید.
              </Typography>
              <Dashboard uppy={uppy} height={500} hideUploadButton />
            </Box>
          </DialogContent>
          <DialogActions>
            {
              <Button onClick={handleClose} variant="contained" color="secondary" endIcon={<CancelIcon />}>
                خروج
              </Button>
            }
          </DialogActions>

          {error && <ErrorAlert text={error} />}
        </Dialog>
      )}
    </>
  );
};

export default UploadProduct;
