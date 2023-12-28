import { useAuth } from "hooks/useAuth";
import React from "react";
import { UseFormSetValue, UseFormWatch } from "react-hook-form";
import { IProduct } from "types/product";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useQuery } from "@tanstack/react-query";
import ErrorHandler from "components/errorHandler/ErrorHandler";
import { LinearProgress } from "@mui/material";
import { IUnit } from "types/unit";

type Props = {
  watch: UseFormWatch<IProduct>;
  setValue: UseFormSetValue<IProduct>;
};

const SelectUnit = ({ watch, setValue }: Props) => {
  const Auth = useAuth();
  const { data, status, refetch } = useQuery({
    queryKey: [`Unit/Get`],
    queryFn: Auth?.getRequest,
    cacheTime: Infinity,
    staleTime: Infinity,
    select: (res) => {
      if (res.Succeeded) {
        return res.Data;
      } else {
        throw new Error(res.ErrorList);
      }
    },
  });

  if (status === "error") return <ErrorHandler onRefetch={refetch} />;
  if (status === "loading") return <LinearProgress />;

  //@ts-ignore
  //@ts-ignore
  return (
    <>
      <Autocomplete
        value={watch("unit1.unitName")}
        onChange={(event: any, newValue: string | null) => {
          console.log({ newValue });
          setValue("unit1.unitName", newValue ?? "");
        }}
        // inputValue={inputValue}
        // onInputChange={(event, newInputValue) => {
        //   setInputValue(newInputValue);
        // }}
        options={data}
        renderInput={(params) => <TextField {...params} label="واحد" size="small" />}
        //@ts-ignore
        getOptionLabel={(option: IUnit) => {
          console.log("getOptionLabel: ", { option });
          if (typeof option !== "object") {
            let result = data.find((op: IUnit) => op?.pkfUnit === option);
            return result?.title || "";
          }
          return option?.unitName || "";
        }}
        //@ts-ignore
        isOptionEqualToValue={(option: IUnit, value: string) => {
          console.log("isOptionEqualToValue: ", { option, value });
          //@ts-ignore
          return option.pkfUnit === value;
        }}
        // filterOptions={(ops, state) => {
        //   let temp = ops?.findIndex((op: IUnit) => op?.unitName?.includes(state?.inputValue));
        //   return temp > 0;
        // }}
        //   value={controllerField?.value}
        //   renderInput={(params) => (
        //     <TextField
        //       {...params}
        //       variant="outlined"
        //       label={label}
        //       error={Boolean(errors?.[name]?.message)}
        //       helperText={errors?.[name]?.message}
        //       size="small"
        //     />
        //   )}
      />
    </>
  );
};

export default SelectUnit;
