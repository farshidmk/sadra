import { Box, Grid, Skeleton } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ErrorHandler from "components/errorHandler/ErrorHandler";
import ErrorAlert from "components/phoenixAlert/ErrorAlert";
import FormButtons from "components/render/buttons/FormButtons";
import RenderFormInput from "components/render/formInputs/RenderFormInput";
import { useAuth } from "hooks/useAuth";
import { useSnackbar } from "hooks/useSnackbar";
import React, { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { TCrudType } from "types/types";
import Title from "components/title/Title";
import { IUnit } from "types/unit";

const MeasurementUnitCrud = () => {
  const { companyId: id } = useParams();
  const mode: TCrudType = !id ? "CREATE" : "EDIT";
  const navigate = useNavigate();
  const Auth = useAuth();
  const snackbar = useSnackbar();
  const queryClient = useQueryClient();

  const [error, setError] = useState<string[] | undefined>();

  const { data, status, refetch } = useQuery({
    queryKey: [`Unit/Find?id=${id}`],
    queryFn: Auth?.getRequest,
    select: (res): IUnit => res.Data,
    enabled: !!id,
  });

  const { isLoading, mutate } = useMutation({
    mutationFn: Auth?.serverCall,
  });

  function onBack() {
    navigate("/measurement-unit");
  }

  const {
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm<IUnit>();

  useEffect(() => {
    if (mode !== "CREATE" && data) {
      Object.keys(data).forEach((field) => {
        setValue(field as keyof IUnit, data[field as keyof IUnit]);
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setValue, data]);

  const onSubmitHandler = (data: IUnit) => {
    setError(undefined);
    mutate(
      {
        entity: `Unit`,
        method: mode === "CREATE" ? "post" : "put",
        data: {
          ...(mode === "EDIT" ? { id: data?.Id } : {}),
          ...data,
        },
      },
      {
        onSuccess: (res: any) => {
          if (!res.Succeeded) {
            setError(res.ErrorList);
          } else {
            queryClient.refetchQueries({ queryKey: ["Unit"] });
            snackbar("عملیات با موفقیت انجام شد", "success");
            onBack();
          }
        },
        onError: (res) => snackbar("خطا در انجام عملیات", "error"),
      }
    );
  };

  let projectItems = useMemo(
    () => [
      { name: "unitName", label: "نام واحد", inputType: "text" },
      { name: "unitNameEN", label: "نام واحد به لاتین", inputType: "text" },
      { name: "unitCode", label: "کد واحد", inputType: "text" },
      { name: "unitCodeSM", label: "کد واحد سامانه مودیان", inputType: "text" },
    ],
    []
  );

  return (
    <>
      <Title title={`${mode === "CREATE" ? "ساخت" : "ویرایش"} واحد اندازه گیری`} />
      {status === "loading" && mode === "EDIT" ? (
        <Skeleton height={300} />
      ) : status === "error" ? (
        <ErrorHandler onRefetch={refetch} />
      ) : (
        <Box component="form" onSubmit={handleSubmit(onSubmitHandler)} sx={{ p: 1 }}>
          <Grid container spacing={3}>
            {projectItems.map((item) => (
              <Grid item key={item.name} xs={12} md={4} lg={3}>
                <Controller
                  name={item.name as keyof IUnit}
                  control={control}
                  defaultValue={mode === "CREATE" ? "" : data?.[item.name as keyof IUnit]}
                  render={({ field }) => {
                    return <RenderFormInput controllerField={field} errors={errors} {...item} {...field} />;
                  }}
                />
              </Grid>
            ))}
          </Grid>

          {error && <ErrorAlert text={error} />}
          <FormButtons onBack={onBack} onSave={handleSubmit(onSubmitHandler)} isLoading={isLoading} />
        </Box>
      )}
    </>
  );
};

export default MeasurementUnitCrud;
