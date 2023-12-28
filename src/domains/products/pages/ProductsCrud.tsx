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
import { IProduct } from "types/product";
// import SelectUnit from "../components/SelectUnit";
import { IUnit } from "types/unit";

const ProductsCrud = () => {
  const { id } = useParams();
  const mode: TCrudType = !id ? "CREATE" : "EDIT";
  const navigate = useNavigate();
  const Auth = useAuth();
  const snackbar = useSnackbar();
  const queryClient = useQueryClient();

  const [error, setError] = useState<string[] | undefined>();

  const {
    data: units,
    status: unitsStatus,
    refetch: unitRefetch,
  } = useQuery({
    queryKey: [`Unit/Get`],
    queryFn: Auth?.getRequest,
    cacheTime: Infinity,
    staleTime: Infinity,
    select: (res): IUnit[] => {
      if (res.Succeeded) {
        return res.Data;
      } else {
        throw new Error(res.ErrorList);
      }
    },
  });

  const { data, status, refetch } = useQuery({
    queryKey: [`Product/Find?id=${id}`],
    queryFn: Auth?.getRequest,
    select: (res): IProduct => res.Data,
    enabled: !!id,
  });

  const { isLoading, mutate } = useMutation({
    mutationFn: Auth?.serverCall,
  });

  function onBack() {
    navigate("/products");
  }

  const {
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    watch,
  } = useForm<IProduct>({
    //@ts-ignore
    defaultValues: async () => {
      let code = await Auth?.getRequest({ queryKey: `Product/GetMaxCode` });
      let defaults = {
        vatTax: 9,
        goodCode: code?.Messages,
      };
      return defaults;
    },
  });

  useEffect(() => {
    if (mode !== "CREATE" && data) {
      Object.keys(data).forEach((field) => {
        setValue(field as keyof IProduct, data[field as keyof IProduct]);
      });
    }
  }, [setValue, data, mode]);

  // useEffect(() => {
  //   if (mode === "CREATE" && lastCodeStatus === "success" && ) {
  //       setValue(field as keyof IProduct, data[field as keyof IProduct]);
  //   }
  // }, [setValue, data, mode]);

  const onSubmitHandler = (data: IProduct) => {
    setError(undefined);
    mutate(
      {
        entity: `Product`,
        method: mode === "CREATE" ? "post" : "put",
        data: {
          ...(mode === "EDIT" ? { id: data?.pkfGood } : {}),
          ...data,
        },
      },
      {
        onSuccess: (res: any) => {
          if (!res.Succeeded) {
            setError(res.ErrorList);
          } else {
            queryClient.refetchQueries({ queryKey: ["product"] });
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
      { name: "goodCode", label: "کد کالا", inputType: "text" },
      { name: "goodName", label: "نام کالا", inputType: "text" },
      //@ts-ignore
      {
        name: "unit1.unitName",
        label: "واحد",
        // inputType: "custom",
        // render: <SelectUnit watch={watch} setValue={setValue} />,
        inputType: "select",
        options: units?.map((unit) => ({ value: unit.pkfUnit, title: unit.unitName })),
        status: unitsStatus,
        refetch: unitRefetch,
      },
      { name: "vatTax", label: "درصد مالیات بر ارزش افزوده ", inputType: "text" },
      { name: "goodCodeSM", label: "کد کالاسامانه مودیان", inputType: "text" },
      {
        name: "memo",
        label: "توضیحات ",
        inputType: "text",
        gridSize: {
          lg: 9,
          md: 8,
        },
      },
    ],
    [unitRefetch, units, unitsStatus]
  );

  return (
    <>
      <Title title={`${mode === "CREATE" ? "ساخت" : "ویرایش"} کالا`} />
      {status === "loading" && mode === "EDIT" ? (
        <Skeleton height={500} />
      ) : status === "error" ? (
        <ErrorHandler onRefetch={refetch} />
      ) : (
        <Box component="form" onSubmit={handleSubmit(onSubmitHandler)} sx={{ p: 1 }}>
          <Grid container spacing={3}>
            {projectItems.map((item) => (
              <Grid item key={item.name} xs={12} md={4} lg={3} {...item.gridSize}>
                <Controller
                  name={item.name as keyof IProduct}
                  control={control}
                  defaultValue={mode === "CREATE" ? "" : data?.[item.name as keyof IProduct]}
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

export default ProductsCrud;
