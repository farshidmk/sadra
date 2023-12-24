import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Autocomplete,
  FormHelperText,
  LinearProgress,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import ErrorHandler from "components/errorHandler/ErrorHandler";
import React from "react";
import { IRenderFormInput, TOption } from "types/render";
import CustomDatePicker from "../datePicker/CustomDatePicker";
import PasswordInput from "./PasswordInput";

const RenderFormInput: React.FC<IRenderFormInput> = (props) => {
  const { name, label, errors, elementProps, controllerField } = props;
  if (props.inputType === "text") {
    return (
      <TextField
        name={name}
        label={label}
        error={Boolean(errors?.[name]?.message)}
        helperText={errors?.[name]?.message}
        {...controllerField}
        {...elementProps}
        fullWidth
        size="small"
      />
    );
  }
  if (props.inputType === "textarea") {
    return (
      <TextField
        name={name}
        label={label}
        error={Boolean(errors?.[name]?.message)}
        helperText={errors?.[name]?.message}
        {...controllerField}
        {...elementProps}
        fullWidth
        size="small"
      />
    );
  }
  if (props.inputType === "password") {
    return (
      <PasswordInput
        name={name}
        label={label}
        errors={errors?.[name]?.message}
        controllerField={controllerField}
        elementProps={elementProps}
      />
    );
  }
  if (props.inputType === "date") {
    const { setValue, watch } = props;
    return (
      <CustomDatePicker
        name={name}
        label={label}
        setDay={(day) => setValue(name, day)}
        value={watch(name)}
        {...elementProps}
        {...controllerField}
        error={errors?.[name]?.message}
      />
    );
  }
  if (props.inputType === "autocomplete") {
    let { options, status, refetch } = props;
    if (status === "loading") return <LoadingState label={label} />;
    if (status === "error" && refetch) return <ErrorState label={label} refetch={refetch} />;
    return (
      <Autocomplete
        {...controllerField}
        {...elementProps}
        options={options}
        //@ts-ignore
        getOptionLabel={(option: TOption) => {
          if (typeof option !== "object") {
            let result = options.find((op: TOption) => op?.value === option);
            return result?.title || "";
          }
          return option?.title || "";
        }}
        filterOptions={(ops, state) => {
          //@ts-ignore
          let temp = ops?.filter((op: TOption) => op?.title?.includes(state?.inputValue));
          return temp;
        }}
        value={controllerField?.value}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            label={label}
            error={Boolean(errors?.[name]?.message)}
            helperText={errors?.[name]?.message}
            size="small"
          />
        )}
      />
    );
  }

  if (props.inputType === "select") {
    let { options, status, refetch } = props;
    if (status === "loading") return <LoadingState label={label} />;
    if (status === "error" && refetch) return <ErrorState label={label} refetch={refetch} />;
    return (
      <FormControl fullWidth>
        <InputLabel id={`select-input-${name}`}>{label}</InputLabel>
        <Select
          labelId={`select-input-${name}`}
          label={label}
          {...controllerField}
          {...elementProps}
          error={Boolean(errors?.[name]?.message)}
          size="small"
        >
          {options?.map((option: TOption) => (
            <MenuItem key={`${name}-select-item-${option.value}`} value={option.value}>
              {option.title}
            </MenuItem>
          ))}
        </Select>
        {Boolean(errors?.[name]?.message) && <FormHelperText error={true}>{errors?.[name]?.message}</FormHelperText>}
      </FormControl>
    );
  }
  // if (props.inputType === "city") {
  //   const { setValue, disabled, cityId } = elementProps;
  //   if (!setValue) throw Error("set value not defined");
  //   return <SelectCity label={label} name={name} setValue={setValue} disabled={disabled} cityId={cityId} />;
  // }
  if (props.inputType === "checkbox") {
    const { setValue, watch, disabled = false } = props;
    return (
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              name={name}
              size="small"
              disabled={disabled}
              checked={watch(name)}
              onChange={(e) => setValue(name, e.target.checked)}
            />
          }
          label={label}
          {...controllerField}
          {...elementProps}
        />
        {Boolean(errors?.[name]?.message) && <FormHelperText error={true}>{errors?.[name]?.message}</FormHelperText>}
      </FormGroup>
    );
  }
  if (props.inputType === "custom") {
    if (!props.render) throw Error("render item not defined");
    return props.render;
  }

  // if (props.inputType === "location") {
  //   const { setValue, watch } = elementProps;
  //   if (!setValue) throw Error("set value not defined");
  //   if (!watch) throw Error("watch is not defined");
  //   return <SelectLocation watch={watch} setValue={setValue} />;
  // }

  return <h1>not supported type</h1>;
};

export default RenderFormInput;

export const LoadingState: React.FC<{ label?: string }> = ({ label }) => {
  return (
    <Box sx={{ minHeight: "40px" }}>
      <Typography variant="caption" sx={{ mb: 1 }}>
        {label}
      </Typography>
      <LinearProgress />
    </Box>
  );
};
const ErrorState: React.FC<{ label?: string; refetch: () => void }> = ({ label, refetch }) => {
  return <ErrorHandler onRefetch={refetch} errorText={`خطا در دریاف ${label} ها`} />;
};
