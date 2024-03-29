import { Box, Typography, alpha } from "@mui/material";
import React from "react";
import "./CustomSpinner.css";

type Props = {
  show: boolean;
  isFullScreen?: boolean;
  loadingText?: string;
};

const CustomSpinner: React.FC<Props> = ({
  show,
  isFullScreen = false,
  loadingText = " لطفا صبر کنید، در حال بارگذاری ...",
}) => {
  return (
    <>
      {show && (
        <Box
          sx={{
            zIndex: 10000,
            position: "absolute",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: (theme) => alpha(theme.palette.common.white, 0.7),
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box component="img" src="/assets/icons/omid-logo.png" className="iconSpinner scale-flicker" alt="خطا" />
          <Typography fontWeight={600} className="animate-flicker">
            {loadingText}
          </Typography>
        </Box>
      )}
    </>
  );
};

export default CustomSpinner;
