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
import { ICustomer, ICustomerTitle, ICustomerType } from "types/customer";
import { TOption } from "types/render";

const CustomerCrud = () => {
  const { id } = useParams();
  const mode: TCrudType = !id ? "CREATE" : "EDIT";
  const navigate = useNavigate();
  const Auth = useAuth();
  const snackbar = useSnackbar();
  const queryClient = useQueryClient();

  const [error, setError] = useState<string[] | undefined>();

  const { data, status, refetch } = useQuery({
    queryKey: [`Customer/${id}`],
    queryFn: Auth?.getRequest,
    select: (res): ICustomer => res.Data,
    enabled: !!id,
  });
  const {
    data: customerTypes,
    status: customerTypesStatus,
    refetch: customerTypesRefetch,
  } = useQuery({
    queryKey: [`Customer`, "GetCustomerType"],
    queryFn: Auth?.getRequest,
    select: (res): TOption[] =>
      res.Data?.map((title: ICustomerType) => ({ value: title.pkfTreaterLRType, title: title.treaterLRType })),
    cacheTime: Infinity,
    staleTime: Infinity,
  });
  const {
    data: customerTitles,
    status: customerTitlesStatus,
    refetch: customerTitlesRefetch,
  } = useQuery({
    queryKey: [`Customer`, "GetCustomerTitle"],
    queryFn: Auth?.getRequest,
    select: (res): TOption[] =>
      res.Data?.map((title: ICustomerTitle) => ({ value: title.pkfTitle, title: title.title })),
    cacheTime: Infinity,
    staleTime: Infinity,
  });

  const { isLoading, mutate } = useMutation({
    mutationFn: Auth?.serverCall,
  });

  function onBack() {
    navigate("/customers");
  }

  const {
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm<ICustomer>();

  useEffect(() => {
    if (mode !== "CREATE" && data) {
      Object.keys(data).forEach((field) => {
        setValue(field as keyof ICustomer, data[field as keyof ICustomer]);
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setValue, data]);

  const onSubmitHandler = (data: ICustomer) => {
    setError(undefined);
    mutate(
      {
        entity: `Customer`,
        method: mode === "CREATE" ? "post" : "put",
        data: {
          ...(mode === "EDIT" ? { id: data?.pkfTreater } : {}),
          ...data,
        },
      },
      {
        onSuccess: (res: any) => {
          if (!res.Succeeded) {
            setError(res.ErrorList);
          } else {
            queryClient.refetchQueries({ queryKey: ["Customer"] });
            snackbar("عملیات با موفقیت انجام شد", "success");
            onBack();
          }
        },
        onError: (res) => snackbar("خطا در انجام عملیات", "error"),
      }
    );
  };

  let items = useMemo(
    () => [
      { name: "treaterCode", label: "کد", inputType: "text" },
      {
        //TODO: value not show in edit mode
        name: "title.pkfTitle",
        label: "عنوان",
        inputType: "select",
        options: customerTitles,
        status: customerTitlesStatus,
        refetch: customerTitlesRefetch,
      },
      { name: "name", label: "نام", inputType: "text" },
      { name: "famile", label: "نام خانوادگی", inputType: "text" },
      {
        name: "type",
        label: "نوع طرف حساب",
        inputType: "select",
        options: customerTypes,
        status: customerTypesStatus,
        refetch: customerTypesRefetch,
      },
      { name: "economicCode", label: "کد اقتصادی", inputType: "text" },
      { name: "identityCode", label: "شناسه ملی/کدملی", inputType: "text" },
      { name: "zipCode", label: "کد پستی", inputType: "text" },
      {
        name: "registrationNo",
        label: "شناسه ثبت",
        inputType: "text",
        gridSize: {
          xs: 12,
          md: 4,
          lg: 3,
        },
      },
      {
        name: "address",
        label: "آدرس",
        inputType: "text",
        gridSize: {
          xs: 12,
          md: 8,
          lg: 9,
        },
      },
    ],
    [
      customerTitles,
      customerTitlesRefetch,
      customerTitlesStatus,
      customerTypes,
      customerTypesRefetch,
      customerTypesStatus,
    ]
  );

  return (
    <>
      <Title title={`${mode === "CREATE" ? "ساخت" : "ویرایش"} مشتری`} />
      {status === "loading" && mode === "EDIT" ? (
        <Skeleton height={300} />
      ) : status === "error" ? (
        <ErrorHandler onRefetch={refetch} />
      ) : (
        <Box component="form" onSubmit={handleSubmit(onSubmitHandler)} sx={{ p: 1 }}>
          <Grid container spacing={3}>
            {items.map((item) => (
              <Grid item key={item.name} xs={12} md={4} lg={3} {...item.gridSize}>
                <Controller
                  name={item.name as keyof ICustomer}
                  control={control}
                  defaultValue={mode === "CREATE" ? "" : data?.[item.name as keyof ICustomer]}
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

export default CustomerCrud;
