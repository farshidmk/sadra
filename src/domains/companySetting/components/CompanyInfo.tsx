import React from "react";
import { Grid } from "@mui/material";
import RenderFormInput from "components/render/formInputs/RenderFormInput";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { ICompanySettingInfo, TCompanySetting } from "types/company";

type Props = {
  info: ICompanySettingInfo;
  errors: FieldErrors<TCompanySetting>;
  control: Control<TCompanySetting, any>;
};

const CompanyInfo = ({ info, control, errors }: Props) => {
  return (
    <>
      <Grid container spacing={3}>
        {items.map((item) => (
          <Grid item key={item.name} xs={12} md={6}>
            <Controller
              //@ts-ignore
              name={`Company.${item.name}`}
              control={control}
              defaultValue={info?.[item.name as keyof ICompanySettingInfo]}
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

export default CompanyInfo;

type TItem = {
  name: keyof ICompanySettingInfo;
  label: string;
  inputType: string;
};
let items: TItem[] = [
  { name: "companyName", label: "نام شرکت", inputType: "text" },
  { name: "address", label: "آدرس", inputType: "text" },
  { name: "tel", label: "تلفن", inputType: "text" },
  { name: "zipCode", label: "کدپستی", inputType: "text" },
  { name: "regNumber", label: "شناسه ملی/شماره ملی", inputType: "text" },
  { name: "economicCode", label: "شناسه اقتصادی", inputType: "text" },
];
