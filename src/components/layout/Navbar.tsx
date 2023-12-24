import { Box, IconButton, Toolbar, Typography, Button } from "@mui/material";
import React from "react";
import { styled } from "@mui/material/styles";
import MuiAppBar from "@mui/material/AppBar";
import { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import MenuIcon from "@mui/icons-material/Menu";
import { Logout } from "@mui/icons-material";
import { DRAWER_WIDTH } from "./Layout";
import { useAuth } from "hooks/useAuth";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";
import { ColorModeContext } from "App";
import Popover from "@mui/material/Popover";
import Switch from "@mui/material/Switch";
import "./Navbar.css";
import ApartmentIcon from "@mui/icons-material/Apartment";

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: DRAWER_WIDTH,
    width: `calc(100% - ${DRAWER_WIDTH}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

type Props = {
  open: boolean;
  handleDrawerOpen: () => void;
};

const Navbar: React.FC<Props> = ({ open, handleDrawerOpen }) => {
  const Auth = useAuth();
  const navigate = useNavigate();
  // const { pathname } = useLocation();
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const isOpenUserMenu = Boolean(anchorEl);

  const colorMode = React.useContext(ColorModeContext);
  return (
    <>
      <Popover
        open={isOpenUserMenu}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }} className="account-menu">
          <Button
            className="account-menu-btn"
            endIcon={<AccountCircleIcon />}
            onClick={() => {
              setAnchorEl(null);
              navigate("/profile");
            }}
            variant="contained"
            color="info"
            sx={{ color: (theme) => theme.palette.text.primary }}
            fullWidth
          >
            پروفایل
          </Button>
          <Button
            className="account-menu-btn"
            endIcon={<ApartmentIcon />}
            onClick={() => {
              setAnchorEl(null);
              navigate("/company");
            }}
            variant="contained"
            color="info"
            sx={{ color: (theme) => theme.palette.text.primary }}
            fullWidth
          >
            شرکت ها
          </Button>
          <Box className="account-menu-btn" sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="button">روشنایی</Typography>
            <MaterialUISwitch
              sx={{ m: 1 }}
              onChange={() => colorMode.toggleColorMode()}
              checked={colorMode.mode === "dark"}
            />
          </Box>

          <Button
            className="account-menu-btn"
            sx={{ mt: 1, color: (theme) => theme.palette.text.primary }}
            color="warning"
            variant="contained"
            endIcon={<Logout />}
            onClick={Auth?.logout}
          >
            خروج از سیستم
          </Button>
        </Box>
      </Popover>
      <AppBar
        position="fixed"
        open={open}
        sx={
          {
            // background:
            //   "linear-gradient(90deg, rgba(2,62,138,0.8856136204481793) 6%, rgba(35,159,255,0.7343531162464986) 84%)",
            // backgroundImage: "url(/assets/images/pattern.png)",
            // backgroundSize: "780px",
            // background: rgb(0,145,153);
            // background: (theme) =>
            //   `linear-gradient(20deg, ${theme.palette.primary.main} 70%, ${theme.palette.secondary.main} 100%)`,
            // boxShadow: (theme) => `1px 1px 16px 0px ${theme.palette.secondary.main}`,
          }
        }
      >
        <Toolbar sx={{ display: "flex", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{
                marginRight: 5,
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Box
              component="img"
              sx={{ height: "48px", width: "auto" }}
              src={`${process.env.PUBLIC_URL}/assets/images/logo.png`}
            />
          </Box>
          {/* <Box sx={{ flexGrow: 1 }}></Box>
          <Box sx={{ flexGrow: 1, textAlign: "center" }}>{pathname}</Box> */}
          <Box sx={{ flexGrow: 1 }}></Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <IconButton color="inherit" onClick={handleClick}>
              <AccountCircleIcon sx={{ fontSize: "28px" }} color="inherit" />
            </IconButton>
            <Typography variant="body2" color="inherit" fontWeight={600}>
              {Auth?.userInfo?.full_name}
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Navbar;

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  margin: "0 -15px 0 0 !important",
  transform: "scale(.75)",
  "& .MuiSwitch-switchBase": {
    margin: 1,
    padding: 0,
    transform: "translateX(6px)",
    "&.Mui-checked": {
      color: "#fff",
      transform: "translateX(22px)",
      "& .MuiSwitch-thumb:before": {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          "#ccc"
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
      },
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    backgroundColor: theme.palette.mode === "dark" ? "#000" : "#fff",
    border: `1px solid ${theme.palette.mode === "dark" ? "#000" : "#757575"}`,
    width: 32,
    height: 32,
    "&:before": {
      content: "''",
      position: "absolute",
      width: "100%",
      height: "100%",
      left: 0,
      top: 0,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        "#757575"
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
    },
  },
  "& .MuiSwitch-track": {
    opacity: 1,
    backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
    borderRadius: 20 / 2,
  },
}));
