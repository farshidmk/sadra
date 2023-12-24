import { Box, Grid, Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import ErrorAlert from "components/phoenixAlert/ErrorAlert";
import RenderFormInput from "components/render/formInputs/RenderFormInput";
import * as Yup from "yup";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ISignUp } from "types/login";
import { Link } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { PHONE_NUMBER_REGEX } from "shared/consts";
import LoginForm from "./LoginForm";
import { api } from "services/axios";
import OtpConfirm from "./OtpConfirm";

const validationSchema = Yup.object().shape({
  PhoneNumber: Yup.string()
    .required("شماره موبایل  را وارد نمایید")
    .matches(PHONE_NUMBER_REGEX, "شماره موبایل را به درستی وارد کنید"),
  FirstName: Yup.string().required(" نام را وارد نمایید"),
  LastName: Yup.string().required(" نام خانوادگی را وارد نمایید"),
  NationalCode: Yup.string().required(" کد ملی را وارد نمایید"),
});

const SignUpPage = () => {
  const [step, setStep] = useState<1 | 2>(1);
  const [error, setError] = useState<string[] | undefined>(undefined);
  const [captcha, setCaptcha] = useState("");
  const [otp, setOtp] = useState("");
  const { data, isLoading, mutate } = useMutation({
    mutationFn: loginRequestHandler,
  });

  const {
    handleSubmit,
    formState: { errors },
    control,
    watch,
  } = useForm<ISignUp>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmitHandler = (data: ISignUp) => {
    mutate(
      {
        entity: `Users`,
        method: "post",
        data,
      },
      {
        onSuccess: (response: any) => {
          let result = response.data;
          if (!result.Succeeded) {
            setError(result.ErrorList);
          } else {
            setStep(2);
          }
        },
      }
    );
  };

  return (
    <Box
      component="div"
      sx={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        background: (theme) =>
          `linear-gradient(to bottom, ${theme.palette.primary.light} 0%,white 51%, ${theme.palette.primary.light} 100%)`,
      }}
    >
      {step === 1 ? (
        <LoginForm handleSubmit={handleSubmit(onSubmitHandler)} isLoading={isLoading} isRegister={true}>
          <>
            <Grid container spacing={1}>
              {signUpItems.map((item) => (
                <Grid item key={item.name} xs={12} md={6}>
                  <Controller
                    name={item.name as keyof ISignUp}
                    control={control}
                    defaultValue={""}
                    render={({ field }) => {
                      return <RenderFormInput controllerField={field} errors={errors} {...item} {...field} />;
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          </>
        </LoginForm>
      ) : (
        <OtpConfirm
          captcha={captcha}
          setCaptcha={setCaptcha}
          otp={otp}
          setOtp={setOtp}
          userId={data?.data?.Data}
          isLogin={false}
          phoneNumber={watch("PhoneNumber")}
        />
      )}

      {error && <ErrorAlert text={error} />}
      <Typography variant="body2" sx={{ textDecoration: "none", mt: 2 }}>
        حساب کاربری دارید؟
        <Link to="/login" style={{ textDecoration: "none", marginRight: "4px" }}>
          وارد شوید.
        </Link>
      </Typography>
    </Box>
  );
};

export default SignUpPage;
const signUpItems = [
  { name: "FirstName", inputType: "text", label: "نام" },
  { name: "LastName", inputType: "text", label: "نام خانوادگی" },
  { name: "NationalCode", inputType: "text", label: "شناسه ملی / کد ملی" },
  { name: "PhoneNumber", inputType: "text", label: "شماره موبایل" },
];

export async function loginRequestHandler({ data, entity }: { entity: string; method: string; data: ISignUp }) {
  return api.post(entity, data);
}
