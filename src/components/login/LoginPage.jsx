import { Alert, Box, Button, CircularProgress, TextField, Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { api } from "../../services/axios";
import { useAuth } from "hooks/useAuth";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import { Link } from "react-router-dom";
import { PHONE_NUMBER_REGEX } from "shared/consts";
import LoginForm from "./LoginForm";
import OtpConfirm from "./OtpConfirm";
import { loginRequestHandler } from "./Signup";

const validationSchema = Yup.object().shape({
  phoneNumber: Yup.string()
    .required("شماره موبایل  را وارد نمایید")
    .matches(PHONE_NUMBER_REGEX, "شماره موبایل را به درستی وارد کنید"),
});

const LoginPage = () => {
  const Auth = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [responseError, setResponseError] = useState();
  const [captcha, setCaptcha] = useState("");
  const [otp, setOtp] = useState("");
  const [userId, setUserId] = useState("");

  const { isLoading, mutate, error } = useMutation({
    mutationFn: loginRequestHandler,
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmitPhoneNumber = (data) => {
    let { phoneNumber } = data;
    mutate(
      { entity: "Users/SendTotpCode", data: { phoneNumber } },
      {
        onSuccess: (response) => {
          // if (response.code !== 200) {
          //   throw new Error(response.message);
          // }
          // let { user_id, full_name } = response.result;
          // Auth.storeToken(response?.result?.token);
          // Auth.storeRefreshToken(response?.result?.refresh_token);
          // Auth.setPrivilages(response?.result?.roles?.privileges);
          // Auth.setUserInfo({ user_id, full_name });
          // navigate("/dashboard");
          let result = response.data;
          if (!result.Succeeded) {
            // setResponseError(result.ErrorList);
            throw new Error(result.ErrorList);
          } else {
            setUserId(response.data?.Data);
            setStep(2);
          }
        },
        onError: (err) => {
          setResponseError(err);
        },
      }
    );
  };

  return (
    <Box
      component="div"
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: (theme) =>
          `linear-gradient(to bottom, ${theme.palette.primary.light} 0%,white 51%, ${theme.palette.primary.light} 100%)`,
      }}
    >
      <>
        {step === 1 ? (
          <LoginForm handleSubmit={handleSubmit(onSubmitPhoneNumber)} isLoading={isLoading}>
            <>
              <Controller
                control={control}
                name="phoneNumber"
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="شماره موبایل"
                    size="small"
                    sx={{ width: "400px", backgroundColor: "#ffffffbb", mb: 1 }}
                    error={errors.phoneNumber?.message}
                    helperText={errors.phoneNumber?.message}
                  />
                )}
              />
            </>
          </LoginForm>
        ) : (
          <>
            <OtpConfirm
              captcha={captcha}
              setCaptcha={setCaptcha}
              otp={otp}
              setOtp={setOtp}
              isLogin={true}
              phoneNumber={watch("phoneNumber")}
              userId={userId}
            />
          </>
        )}
        {(error?.message || !!error) && (
          <Alert sx={{ width: "400px" }} severity="error">
            {error?.message || "خطا در برقراری ارتباط با سرور"}
          </Alert>
        )}
      </>
      <Typography variant="body2" sx={{ textDecoration: "none", mt: 3 }}>
        هنوز حساب کاربری ایجاد نکرده اید؟
        <Link to="/sign-up" style={{ textDecoration: "none", marginRight: "4px" }}>
          ثبت نام کنید
        </Link>
      </Typography>
    </Box>
  );
};

export default LoginPage;
