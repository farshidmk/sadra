import { Button, CircularProgress, Dialog, DialogActions, DialogContent } from "@mui/material";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useAuth } from "hooks/useAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "hooks/useSnackbar";
import { useState } from "react";
import ErrorAlert from "components/phoenixAlert/ErrorAlert";

type Props = {
  open: boolean;
  title?: string;
  name?: string;
  message?: string;
  handleClose: () => void;
  handleSubmit?: () => void;
  deleteParam?: {
    url?: string;
    refetchKey?: string;
  };
};

export default function DeleteModal({
  open,
  title,
  message,
  name,
  handleClose,
  handleSubmit,
  deleteParam = {},
}: Props) {
  const Auth = useAuth();
  const snackbar = useSnackbar();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string[] | undefined>();

  const dialogTitle = !!name ? `حذف ${name}` : title;
  const dialogMessage = !!name ? `آیا از حذف ${name} اطمینان دارید؟` : message;

  const { url, refetchKey } = deleteParam;

  const { isLoading, mutate } = useMutation({
    mutationFn: Auth?.serverCall,
  });

  return (
    <>
      {open && (
        <Dialog sx={{ minWidth: "400px", minHeight: "200pdx" }} open={open} disablePortal={isLoading}>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogContent>
            <DialogContentText>{dialogMessage}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={
                handleSubmit
                  ? handleSubmit
                  : () => {
                      mutate(
                        {
                          entity: url!,
                          method: "delete",
                        },
                        {
                          onSuccess: (res: any) => {
                            if (!res.Succeeded) {
                              if (setError) {
                                setError(res.ErrorList);
                              }
                            } else {
                              queryClient.refetchQueries({ queryKey: [refetchKey] });
                              snackbar(`${name} با موفقیت حذف شد`, "success");
                              handleClose();
                            }
                          },
                          onError: (res) => snackbar("خطا در انجام عملیات", "error"),
                        }
                      );
                    }
              }
              variant="contained"
              endIcon={isLoading ? <CircularProgress size={12} /> : <DeleteOutlineIcon />}
              color="error"
              sx={{ mx: 2, width: "150px" }}
              autoFocus
              disabled={isLoading}
            >
              حذف
            </Button>
            <Button
              variant="outlined"
              endIcon={<CloseOutlinedIcon />}
              color="warning"
              sx={{ mx: 2, width: "150px" }}
              onClick={handleClose}
              disabled={isLoading}
            >
              بازگشت
            </Button>
            {!!error && <ErrorAlert text={error} />}
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}
