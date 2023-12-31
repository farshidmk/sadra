import { Box, FormControl, Grid, InputLabel, MenuItem, Select, Skeleton } from "@mui/material";
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
import { TOption } from "types/render";
import RenderGridStatus from "components/dataGrid/RenderGridStatus";

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
    select: (res): TOption[] => {
      if (res.Succeeded) {
        return res.Data?.map((unit: IUnit) => ({ value: unit.pkfUnit, title: unit.unitName }));
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
    defaultValues:
      mode === "CREATE"
        ? async () => {
            let code = await Auth?.getRequest({ queryKey: `Product/GetMaxCode` });
            let defaults = {
              vatTax: 9,
              goodCode: code?.Messages,
            };
            return defaults;
          }
        : {},
  });

  useEffect(() => {
    if (mode !== "CREATE" && data) {
      Object.keys(data).forEach((field) => {
        setValue(field as keyof IProduct, data[field as keyof IProduct]);
      });
      //@ts-ignore
      setValue("tempUnit1Id", data?.unit1?.pkfUnit);
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
          unit1: {
            //@ts-ignore
            pkfUnit: data?.tempUnit1Id,
          },
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
  console.log("watch: ", watch("unit1.pkfUnit"));
  let productItems = useMemo(
    () => [
      { name: "goodCode", label: "کد کالا", inputType: "text" },
      { name: "goodName", label: "نام کالا", inputType: "text" },
      {
        name: "unit1.pkfUnit",
        label: "واحد",
        inputType: "custom",
        // inputType: "select",
        // options: units,
        // status: unitsStatus,
        // refetch: unitRefetch,
        render: (
          <>
            <RenderGridStatus
              status={unitsStatus}
              refetch={unitRefetch}
              renderValue={
                <>
                  <FormControl fullWidth>
                    <InputLabel id={`select-input-unit`}>{"واحد"}</InputLabel>
                    <Select
                      label="واحد"
                      error={Boolean(errors?.["unit1"]?.pkfUnit?.message)}
                      size="small"
                      value={watch("unit1.pkfUnit")}
                      onChange={(e, c) => console.log({ e, c })}
                    >
                      {units?.map((option: TOption) => (
                        <MenuItem key={`${"name"}-select-item-${option.value}`} value={option.value}>
                          {option.title}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </>
              }
            />
          </>
        ),
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
    [errors, unitRefetch, units, unitsStatus, watch, watch("unit1.pkfUnit")]
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
            {productItems.map((item) => (
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
