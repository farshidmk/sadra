import { Typography } from "@mui/material";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";

export const BOOLEAN_SELECT = [
  { title: "بله", value: true },
  { title: "خیر", value: false },
];
export const STATUS_SELECT = [
  {
    title: (
      <Typography component="span" sx={{ display: "flex", alignItems: "center" }}>
        <CheckCircleOutlineOutlinedIcon color="success" sx={{ mr: 1 }} />
        فعال
      </Typography>
    ),
    value: true,
  },
  {
    title: (
      <Typography component="span" sx={{ display: "flex", alignItems: "center" }}>
        <BlockIcon color="error" sx={{ mr: 1 }} />
        غیر فعال
      </Typography>
    ),
    value: false,
  },
];

export const UNLIMITED_QUERY_PARAM = "currentPage=1&pageSize=1000";

export const PHONE_NUMBER_REGEX = new RegExp("^(\\+98|0)?9\\d{9}$");
