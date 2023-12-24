import { Alert, Box, Container, Divider, Grid, LinearProgress, Typography } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import ErrorHandler from "components/errorHandler/ErrorHandler";
import RenderFormInput from "components/render/formInputs/RenderFormInput";
import { useAuth } from "hooks/useAuth";
import React, { useMemo, useState } from "react";
import { IUser } from "types/user";
import FormButtons from "components/render/buttons/FormButtons";
import ErrorAlert from "components/phoenixAlert/ErrorAlert";

type IPasswordChange = {
  oldPassword: string;
  newPassword: string;
  confirmedNewPassword: string;
};

const Profile = () => {
  const Auth = useAuth();
  const { user_id } = Auth?.userInfo!;
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const { isLoading, mutate } = useMutation({
    mutationFn: Auth?.serverCall,
  });
  const { data, status, refetch } = useQuery({
    queryKey: ["user", `personal_info/${user_id}`],
    queryFn: Auth?.getRequest,
    select: (res) => res.result,
    enabled: !!user_id,
  });

  const { control } = useForm<IUser>();

  const {
    handleSubmit,
    reset,
    formState: { errors, isDirty },
    control: passwordControl,
  } = useForm<IPasswordChange>();

  const userItems = useMemo(
    () => [
      { name: "id", inputType: "text", label: "شناسه", elementProps: { disabled: true } },
      { name: "firstName", inputType: "text", label: "نام", elementProps: { disabled: true } },
      { name: "lastName", inputType: "text", label: "نام خانوادگی", elementProps: { disabled: true } },
      { name: "username", inputType: "text", label: "نام کاربری", elementProps: { disabled: true } },
      { name: "nationalId", inputType: "text", label: "کد ملی", elementProps: { disabled: true } },
      { name: "personnelCode", inputType: "text", label: "کد پرسنلی", elementProps: { disabled: true } },
      { name: "activationDate", inputType: "text", label: "شروع فعالیت", elementProps: { disabled: true } },
      { name: "expireDate", inputType: "text", label: "تاریخ انقضا", elementProps: { disabled: true } },
    ],
    []
  );
  const passwordItems = useMemo(
    () => [
      { name: "oldPassword", inputType: "password", label: "رمز فعلی", elementProps: {} },
      { name: "newPassword", inputType: "password", label: "رمز جدید", elementProps: {} },
      { name: "confirmedNewPassword", inputType: "password", label: "تکرار رمز جدید", elementProps: {} },
    ],
    []
  );

  const onSubmitHandler = (data: IPasswordChange) => {
    setError("");
    mutate(
      {
        entity: `user/change_password`,
        method: "post",
        data,
      },
      {
        onSuccess: (res: any) => {
          if (res.code !== 200) {
            setError(res.message);
          } else {
            setShowSuccess(true);
            reset({ newPassword: "", oldPassword: "", confirmedNewPassword: "" });
          }
        },
      }
    );
  };

  return (
    <Container maxWidth="lg">
      {status === "loading" ? (
        <LinearProgress sx={{ mt: 3 }} />
      ) : status === "error" ? (
        <ErrorHandler onRefetch={refetch} />
      ) : (
        <>
          <Typography variant="h5" textAlign="left" fontWeight={700} sx={{ display: "flex", alignItems: "center" }}>
            پروفایل کاربری
            <Typography variant="body1" textAlign="left" fontWeight={700} sx={{ ml: 1 }}>
              {`${data.firstName} ${data.lastName}`}
            </Typography>
          </Typography>
          <Box sx={{ p: 4, pt: 1, background: (theme) => theme.palette.grey[300], borderRadius: 1, mt: 2 }}>
            <Typography variant="body1" fontWeight={800} sx={{ mb: 3 }}>
              اطلاعات کاربری
            </Typography>
            <Grid container spacing={2}>
              {userItems.map((item) => (
                <Grid item key={item.name} xs={12} md={3}>
                  <Controller
                    name={item.name as keyof IUser}
                    control={control}
                    defaultValue={data?.[item.name as keyof IUser]}
                    render={({ field }) => {
                      return (
                        //@ts-ignore
                        <RenderFormInput controllerField={field} {...item} {...field} />
                      );
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box
            component="form"
            sx={{ px: 4, py: 1, background: (theme) => theme.palette.grey[50], borderRadius: 1, mt: 2 }}
            onSubmit={handleSubmit(onSubmitHandler)}
          >
            <Typography variant="body1" fontWeight={800} sx={{ mb: 3 }}>
              تغییر رمز
            </Typography>
            <Grid container spacing={2}>
              {passwordItems.map((item) => (
                <Grid item key={item.name} xs={12} md={4}>
                  <Controller
                    name={item.name as keyof IPasswordChange}
                    control={passwordControl}
                    defaultValue={data?.[item.name as keyof IPasswordChange]}
                    render={({ field }) => {
                      return (
                        //@ts-ignore
                        <RenderFormInput controllerField={field} errors={errors} {...item} {...field} />
                      );
                    }}
                  />
                </Grid>
              ))}
            </Grid>
            {error && <ErrorAlert text={error} />}
            {showSuccess && !isDirty && (
              <Alert variant="standard" sx={{ mt: 2 }} color="success">
                رمز عبور با موفقیت تغییر یافت
              </Alert>
            )}
            <FormButtons onSave={handleSubmit(onSubmitHandler)} isLoading={isLoading} />
          </Box>
        </>
      )}
    </Container>
  );
};

export default Profile;
