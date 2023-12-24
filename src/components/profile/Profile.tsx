import { Box, Grid, LinearProgress, Typography } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import ErrorHandler from "components/errorHandler/ErrorHandler";
import RenderFormInput from "components/render/formInputs/RenderFormInput";
import { useAuth } from "hooks/useAuth";
import React, { useMemo, useState } from "react";
import { IUser } from "types/user";
import FormButtons from "components/render/buttons/FormButtons";
import ErrorAlert from "components/phoenixAlert/ErrorAlert";

const Profile = () => {
  const Auth = useAuth();
  const [error, setError] = useState("");
  const { isLoading, mutate } = useMutation({
    mutationFn: Auth?.serverCall,
  });
  const { data, status, refetch } = useQuery({
    queryKey: ["Users/profile"],
    queryFn: Auth?.getRequest,
    select: (res) => {
      if (!res.Succeeded) {
        setError(res.ErrorList);
        return {};
      } else {
        return res.Data;
      }
    },
  });

  const {
    handleSubmit,
    formState: { errors },
    control: passwordControl,
  } = useForm<IUser>();

  const passwordItems = useMemo(
    () => [
      { name: "FirstName", inputType: "text", label: "نام", elementProps: {} },
      { name: "LastName", inputType: "text", label: "نام خانوادگی", elementProps: {} },
      { name: "NationalCode", inputType: "text", label: "کد ملی", elementProps: {} },
      { name: "PhoneNumber", inputType: "text", label: "تلفن همراه", elementProps: {} },
    ],
    []
  );

  const onSubmitHandler = (data: IUser) => {
    setError("");
    mutate(
      {
        entity: `user/change_password`,
        method: "post",
        data,
      },
      {
        onSuccess: (res: any) => {
          if (!res.Succeeded) {
            setError(res.ErrorList);
          }
        },
      }
    );
  };

  return (
    <>
      {status === "loading" ? (
        <LinearProgress sx={{ mt: 3 }} />
      ) : status === "error" ? (
        <ErrorHandler onRefetch={refetch} />
      ) : (
        <>
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
                <Grid item key={item.name} xs={12} md={6} lg={3}>
                  <Controller
                    name={item.name as keyof IUser}
                    control={passwordControl}
                    defaultValue={data?.[item.name as keyof IUser]}
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

            <FormButtons onSave={handleSubmit(onSubmitHandler)} isLoading={isLoading} />
          </Box>
        </>
      )}
    </>
  );
};

export default Profile;
