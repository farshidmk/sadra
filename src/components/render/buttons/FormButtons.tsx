import { Box, Button, CircularProgress } from "@mui/material";
import React from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

type Props = {
  onSave?: () => void;
  isLoading?: boolean;
  onBack?: () => void;
};

const FormButtons: React.FC<Props> = ({ onBack, onSave, isLoading }) => {
  return (
    <Box sx={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", mt: 4 }}>
      {onSave && (
        <Button
          disabled={isLoading}
          variant="contained"
          onClick={() => onSave()}
          endIcon={isLoading ? <CircularProgress size={14} /> : <CheckCircleIcon />}
          color="success"
          sx={{ mx: 2, width: "150px" }}
        >
          ذخیره
        </Button>
      )}
      {onBack && (
        <Button
          variant="contained"
          onClick={() => onBack()}
          endIcon={<ArrowBackIosIcon />}
          color="secondary"
          sx={{ mx: 2, width: "150px" }}
        >
          بازگشت
        </Button>
      )}
    </Box>
  );
};

export default FormButtons;
