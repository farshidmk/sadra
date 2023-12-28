import OTPInput, { ResendOTP } from "otp-input-react";
import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import ErrorAlert from "components/phoenixAlert/ErrorAlert";
import Captcha from "./Captcha";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "hooks/useAuth";
import LoginForm from "./LoginForm";
import { loginRequestHandler } from "./Signup";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "hooks/useSnackbar";

const OtpConfirm = ({ isLogin = true, userId, phoneNumber, captcha, setCaptcha, otp, setOtp }) => {
  const Auth = useAuth();
  const navigate = useNavigate();
  const snackbar = useSnackbar();
  const [error, setError] = useState();
  const { isLoading, mutate } = useMutation({
    mutationFn: loginRequestHandler,
  });

  const { mutate: resendOtpHandler } = useMutation({
    mutationFn: Auth.serverCall,
  });

  const captchaRequest = useQuery({
    queryKey: [`Users/Captcha`],
    queryFn: Auth?.getRequest,
  });

  const { handleSubmit } = useForm();

  const onSubmitOtp = (data) => {
    mutate(
      {
        entity: "Users/VerifyTotpCode",
        data: { TotpCode: otp, UserId: userId, CaptchaKey: captchaRequest?.data?.Data?.Key, CaptchaValue: captcha },
      },
      {
        onSuccess: (response) => {
          let result = response.data;
          if (!result.Succeeded) {
            setError(result.ErrorList);
            captchaRequest.refetch();
            throw new Error(result.ErrorList);
          } else {
            Auth.storeToken(result?.Data?.Token);
            Auth.storeRefreshToken(result?.Data?.RefreshToken);
            snackbar("ورود موفق", "success");
            navigate("/dashboard");
          }
        },
        onError: (err) => {},
      }
    );
  };

  return (
    <LoginForm
      handleSubmit={handleSubmit(onSubmitOtp)}
      isLoading={isLoading}
      isRegister={!isLogin}
      disabledBtn={!otp || !captcha}
    >
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" textAlign="left">
          تایید دو مرحله ای
        </Typography>
        <Typography variant="body2" gutterBottom>
          ما یک کد تایید به موبایل شما ارسال کردیم. کد ارسال شده را در فیلد زیر وارد کنید.
        </Typography>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <OTPInput
          value={otp}
          onChange={setOtp}
          autoFocus
          OTPLength={6}
          otpType="number"
          disabled={false}
          style={{ direction: "ltr" }}
        />
        <Box sx={{ mt: 1.5, display: "flex", justifyContent: "center" }}>
          <ResendOTP
            renderButton={(buttonProps) => (
              <Button variant="outlined" color="info" {...buttonProps}>
                ارسال مجدد کد {buttonProps.remainingTime || ""}
              </Button>
            )}
            onResendClick={() => {
              resendOtpHandler({ entity: "Users/SendTotpCode", method: "post", data: { PhoneNumber: phoneNumber } });
              setOtp("");
            }}
            renderTime={() => <></>}
          />
        </Box>
        <Captcha captchaValue={captcha} setCaptchaValue={setCaptcha} captchaRequest={captchaRequest} />
      </Box>
      {error && <ErrorAlert text={error} />}
    </LoginForm>
  );
};

export default OtpConfirm;
