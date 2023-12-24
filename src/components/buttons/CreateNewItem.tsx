import { Box, Button } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import WestIcon from "@mui/icons-material/West";

type Props = {
  icon?: React.ReactElement;
  name: string;
  url?: string;
  onBack?: () => void;
};

const CreateNewItem: React.FC<Props> = ({ icon, name, url, onBack }) => {
  const navigate = useNavigate();
  return (
    <Box sx={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
      <Button
        variant="contained"
        endIcon={icon || <AddCircleIcon />}
        onClick={() => navigate(url || "new")}
        color="info"
        sx={{ minWidth: "100px" }}
      >
        ایجاد {name} جدید
      </Button>
      {onBack && (
        <Button
          variant="contained"
          endIcon={<WestIcon />}
          onClick={onBack}
          color="secondary"
          sx={{ minWidth: "100px" }}
        >
          برگشت
        </Button>
      )}
    </Box>
  );
};

export default CreateNewItem;
