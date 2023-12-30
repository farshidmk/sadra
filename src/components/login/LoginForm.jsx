import React from "react";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import LoginIcon from "@mui/icons-material/Login";

const LoginForm = ({ children, handleSubmit, isLoading, isRegister = false, disabledBtn = false }) => {
  return (
    <Box
      component="form"
      minWidth={400}
      minHeight={300}
      onSubmit={handleSubmit}
      sx={{
        mx: 2,
        maxWidth: "700px",
        p: 3,
        borderRadius: 1,
        border: (theme) => `1px solid ${theme.palette.primary.dark}`,
        boxShadow: (theme) => `0px 0px 16px 1px ${theme.palette.primary.light}`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "white",
      }}
    >
      <Typography
        variant="h4"
        textAlign={"center"}
        fontWeight={700}
        sx={{ color: (theme) => theme.palette.primary.main, mb: 3 }}
      >
        داده گستر
      </Typography>
      {children}
      <Button
        variant="contained"
        sx={{ width: "250px", my: 1.5 }}
        type="submit"
        endIcon={
          isLoading ? (
            <CircularProgress size={20} color="secondary" sx={{ mr: 0.8 }} />
          ) : isRegister ? (
            <HowToRegIcon />
          ) : (
            <LoginIcon />
          )
        }
        disabled={isLoading || disabledBtn}
      >
        {isRegister ? "عضویت" : "ورود"}
      </Button>
    </Box>
  );
};

export default LoginForm;
