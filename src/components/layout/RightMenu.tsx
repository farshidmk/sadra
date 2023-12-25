import React from "react";
import { styled, Theme, CSSObject } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { DRAWER_WIDTH, DrawerHeader } from "./Layout";
import { Link, NavLink } from "react-router-dom";
import { Box, Icon, Typography } from "@mui/material";
import ApartmentIcon from "@mui/icons-material/Apartment";
import HailIcon from "@mui/icons-material/Hail";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import StraightenIcon from "@mui/icons-material/Straighten";
import CategoryIcon from "@mui/icons-material/Category";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SellIcon from "@mui/icons-material/Sell";
import PriceChangeIcon from "@mui/icons-material/PriceChange";

const openedMixin = (theme: Theme): CSSObject => ({
  width: DRAWER_WIDTH,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== "open" })(({ theme, open }) => ({
  width: DRAWER_WIDTH,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

type Props = {
  open: boolean;
  handleDrawerClose: () => void;
};

const RightMenu: React.FC<Props> = ({ open, handleDrawerClose }) => {
  return (
    <Drawer variant="permanent" open={open}>
      <DrawerHeader sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "static" }}>
        <Link
          to={"/dashboard"}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
              transition: "transform 0.3s linear",
              ":hover": {
                transform: "scale(1.02)",
              },
            }}
          >
            <Box
              component="img"
              sx={{
                height: "42px",
                width: "auto",
              }}
              src={`${process.env.PUBLIC_URL}/assets/images/logo-2.png`}
            />
            <Box
              sx={{
                display: "flex",
                alignItems: "start",
                justifyContent: "center",
                textDecoration: "none",
                flexDirection: "column",
                ml: 1,
              }}
            >
              <Typography variant="h6" noWrap fontWeight={800} sx={{ color: (theme) => theme.palette.primary.main }}>
                صدرا افزار
              </Typography>
              <Typography variant="caption" fontSize={10} sx={{ color: (theme) => theme.palette.primary.main }}>
                سامانه پرداخت مالیات و حسابرسی
              </Typography>
            </Box>
          </Box>
        </Link>
        <IconButton onClick={handleDrawerClose}>
          <ChevronRightIcon />
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List>
        {MENU_ITEMS.map((menu) => (
          <RenderMenu key={menu.url} title={menu.title} icon={menu.icon} url={menu.url} open={open} />
        ))}
      </List>
    </Drawer>
  );
};

export default RightMenu;

type TRenderMenu = {
  title: string;
  icon: React.ReactElement;
  url: string;
};

type RenderMenuProps = TRenderMenu & { open: boolean };
const RenderMenu: React.FC<RenderMenuProps> = ({ title, icon, url, open }) => {
  return (
    <NavLink to={url} style={{ textDecoration: "none", transition: "all 0.2s linear" }}>
      {({ isActive, isPending }) => (
        <Box
          sx={{
            fontWeight: isActive ? 700 : 400,
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
            background: isActive ? (theme) => theme.palette.primary.light : "none",
            p: 1,
            m: 1,
            fontSize: "18px",
            color: (theme) => (isActive ? theme.palette.common.white : theme.palette.text.primary),
            // color: (theme) => theme.palette.text.primary,
          }}
        >
          <Icon sx={{ mr: 2 }}>{icon}</Icon>
          <Typography
            sx={{
              fontWeight: isActive ? 700 : 400,
              opacity: open ? 1 : 0,
            }}
          >
            {title}
          </Typography>
        </Box>
      )}
    </NavLink>
  );
};

const MENU_ITEMS: TRenderMenu[] = [
  { title: "تنظیمات شرکت", url: "company-setting", icon: <ApartmentIcon /> },
  { title: "مشتریان", url: "customers", icon: <HailIcon /> },
  { title: "واحد پول", url: "currency-unit", icon: <MonetizationOnIcon /> },
  { title: "واحد اندازه گیری", url: "measurement-unit", icon: <StraightenIcon /> },
  { title: "کالاها", url: "products", icon: <CategoryIcon /> },
  { title: "Import Data", url: "import-data", icon: <CloudUploadIcon /> },
  { title: "ثبت فروش ارزی", url: "foreign-sell", icon: <SellIcon color="warning" /> },
  { title: "ثبت فروش داخلی", url: "indoor-sell", icon: <SellIcon color="info" /> },
  { title: "سامانه مودیان", url: "taxpayers", icon: <PriceChangeIcon /> },
];
