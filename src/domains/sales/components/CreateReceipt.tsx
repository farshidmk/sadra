import React from "react";
import { Grid } from "@mui/material";
import RenderFormInput from "components/render/formInputs/RenderFormInput";
import { Controller, UseFormReturn } from "react-hook-form";
import { ISale } from "types/sale";
import useReceiptItems from "../hooks/useReceiptItems";

type Props = {
  form: UseFormReturn<ISale, any, undefined>;
  isForeign?: boolean;
};

const CreateReceipt = ({ form, isForeign }: Props) => {
  const {
    formState: { errors },
    control,
    setValue,
    watch,
  } = form;

  const items = useReceiptItems(setValue, watch, isForeign);

  return (
    <>
      <Grid container spacing={3}>
        {items.map((item) => (
          <Grid item key={item.name} xs={12} md={4} lg={3} {...item.gridSize}>
            <Controller
              name={item.name as keyof ISale}
              control={control}
              render={({ field }) => {
                return <RenderFormInput controllerField={field} errors={errors} {...item} {...field} />;
              }}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default CreateReceipt;
