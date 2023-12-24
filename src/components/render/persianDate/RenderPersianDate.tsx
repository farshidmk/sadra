import { Box } from "@mui/material";
import React from "react";
import { convertToLocaleDate } from "services/date";
import EventIcon from "@mui/icons-material/Event";

type Props = {
  date: Date;
};

const RenderPersianDate: React.FC<Props> = ({ date }) => {
  const persianDate = convertToLocaleDate(date);
  return (
    <Box
      sx={{
        // background: (theme) => theme.palette.background.default,
        // borderRadius: 1,
        // border: (theme) => `1px solid ${theme.palette.text.primary}`,
        color: (theme) => theme.palette.text.primary,
        // padding: 0.85,
        // minWidth: "80px",
        // transition: "all 0.5s ease",
        display: "flex",
        alignItems: "center",
        fontSize: "12px",
        // ":hover": {
        //   borderRadius: 3,
        //   fontWeight: 700,
        // },
      }}
    >
      <EventIcon sx={{ mr: 0.3, scale: "0.6" }} />
      {persianDate}
    </Box>
  );
};

export default RenderPersianDate;
