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
import { ICompany } from "types/company";
import Title from "components/title/Title";

const CompanyCrud = () => {
  const { companyId } = useParams();
  const mode: TCrudType = !companyId ? "CREATE" : "EDIT";
  const navigate = useNavigate();
  const Auth = useAuth();
  const snackbar = useSnackbar();
  const queryClient = useQueryClient();

  const [error, setError] = useState<string[] | undefined>();

  const { data, status, refetch } = useQuery({
    queryKey: [`Company/${companyId}`],
    queryFn: Auth?.getRequest,
    select: (res): ICompany => res.Data,
    enabled: !!companyId,
  });

  const { isLoading, mutate } = useMutation({
    mutationFn: Auth?.serverCall,
  });

  function onBack() {
    navigate("/company");
  }

  const {
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    watch,
  } = useForm<ICompany>();

  useEffect(() => {
    if (mode !== "CREATE" && data) {
      Object.keys(data).forEach((field) => {
        setValue(field as keyof ICompany, data[field as keyof ICompany]);
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setValue, data]);

  const onSubmitHandler = (data: ICompany) => {
    setError(undefined);
    mutate(
      {
        entity: `Company`,
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
            queryClient.refetchQueries({ queryKey: ["company"] });
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
      { name: "Title", inputType: "text", label: "نام شرکت" },
      { name: "EconomyCode", inputType: "text", label: "کد اقتصادی" },
      {
        name: "IsDefault",
        inputType: "checkbox",
        label: "پیش فرض باشد",
        setValue,
        watch,
      },
    ],
    []
  );

  return (
    <>
      <Title title={`${mode === "CREATE" ? "ساخت" : "ویرایش"} شرکت`} />
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
                  name={item.name as keyof ICompany}
                  control={control}
                  defaultValue={mode === "CREATE" ? "" : data?.[item.name as keyof ICompany]}
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

export default CompanyCrud;
