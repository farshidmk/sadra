import { Box, Button, Typography } from "@mui/material";
import React from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
type Props = {
  title: string;
  onBack?: () => void;
};

const Title = ({ title, onBack }: Props) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
      <Typography variant="h4" fontWeight={600}>
        {title}
      </Typography>
      {onBack && (
        <Button variant="contained" color="secondary" onClick={onBack} endIcon={<ArrowBackIosIcon />}>
          بازگشت
        </Button>
      )}
    </Box>
  );
};

export default Title;
