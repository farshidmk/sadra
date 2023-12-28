import React from "react";
import { ITaxSetting } from "types/tax";
import { Grid } from "@mui/material";
import RenderFormInput from "components/render/formInputs/RenderFormInput";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { TCompanySetting } from "types/company";

type Props = {
  setting: ITaxSetting;
  errors: FieldErrors<TCompanySetting>;
  control: Control<TCompanySetting, any>;
};

const TaxSetting = ({ setting, errors, control }: Props) => {
  return (
    <Grid container spacing={3}>
      {items.map((item) => (
        <Grid item key={item.name} xs={12}>
          <Controller
            //@ts-ignore
            name={`Setting.${item.name}`}
            control={control}
            defaultValue={setting?.[item.name as keyof ITaxSetting]}
            render={({ field }) => {
              return <RenderFormInput controllerField={field} errors={errors} {...item} {...field} />;
            }}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default TaxSetting;

type TItem = {
  name: keyof ITaxSetting;
  label: string;
  inputType: string;
  gridSize?: any;
  elementProps?: any;
};
let items: TItem[] = [
  { name: "uniqueTaxID", label: "شناسه یکتای مالیاتی", inputType: "text" },
  {
    name: "privatekey",
    label: "کلید خصوصی (PRIVATE KEY)",
    inputType: "text",

    elementProps: {
      multiline: true,
      minRows: 3,
    },
  },
  {
    name: "publicKey",
    label: "کلید عمومی (PUBLIC KEY)",
    inputType: "text",
    elementProps: {
      multiline: true,
      minRows: 3,
    },
  },
  //   { name: "", label: "شناسه ملی/شماره ملی", inputType: "text" },
  //   { name: "", label: "شناسه اقتصادی", inputType: "text" },
];
