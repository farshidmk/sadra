import { Box, IconButton, Skeleton, TextField } from "@mui/material";

import RefreshIcon from "@mui/icons-material/Refresh";
import React from "react";
import { UseQueryResult } from "@tanstack/react-query";

type Props = {
  captchaValue: string;
  setCaptchaValue: any;
  captchaRequest: UseQueryResult<any, unknown>;
};

const Captcha = ({ captchaValue, setCaptchaValue, captchaRequest }: Props) => {
  const { data: captchaImg, status: captchaImgStatus, refetch: captchaImgRefetch } = captchaRequest;

  return (
    <Box sx={{ mt: 2, display: "flex", alignItems: "center" }}>
      {captchaImgStatus === "loading" ? (
        <Skeleton width={150} height={50} sx={{ mr: 1 }} />
      ) : captchaImgStatus === "error" ? (
        <IconButton onClick={() => captchaImgRefetch} color="error">
          <RefreshIcon />
        </IconButton>
      ) : (
        <Box sx={{ display: "flex", mr: 2 }}>
          <IconButton onClick={() => captchaImgRefetch()} color="primary">
            <RefreshIcon />
          </IconButton>
          <Box component="img" src={`${captchaImg.Data?.Image}`} />
        </Box>
      )}
      <TextField
        value={captchaValue}
        onChange={(e) => setCaptchaValue(e.target.value)}
        variant="outlined"
        label="کد امنیتی"
      />
    </Box>
  );
};

export default Captcha;
