import React from "react";
import { IBaseInput } from "types/render";
import { Box, TextField, FormHelperText } from "@mui/material";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import "./CustomDatePicker.css";

type Props = {
  value: string | null;
  setDay: (value: string) => void;
  error?: string;
  disabled?: boolean;
} & IBaseInput<"date">;

const CustomDatePicker: React.FC<Props> = ({ value, setDay, label, disabled = false, error, name }) => {
  if (disabled) {
    return (
      <TextField
        label={label}
        value={typeof value === "string" ? value : "convertDayToString(value)"}
        disabled
        fullWidth
        size="small"
      />
    );
  }
  return (
    <Box sx={{ width: "100%" }}>
      <Box
        className="date-field"
        sx={{
          position: "relative",
          display: "flex",
          height: "40px",
          alignItems: "center",
          borderRadius: "4px",
          width: "100%",

          // border: (theme) => `1px solid ${theme.palette.grey[400]}`,
          // ":hover": {
          //   border: (theme) => `1px solid ${theme.palette.grey[700]}`,
          // },
          // ":focus": {
          //   border: (theme) => `1px solid ${theme.palette.grey[700]}`,
          // },
        }}
      >
        <Box
          onClick={() => {
            let element = document.getElementsByName(name);
            element?.[0].focus();
          }}
          component="legend"
          fontSize={12}
          sx={{
            paddingLeft: 0.5,
            height: "100%",
            borderRadius: "4px 0px 0px 4px",
            backgroundColor: (theme) => theme.palette.grey[300],
            display: "flex",
            alignItems: "center",
            // mr: 2,
            px: 1,
          }}
        >
          {label}
        </Box>
        <DatePicker
          calendar={persian}
          locale={persian_fa}
          calendarPosition="bottom-right"
          containerClassName="date-input"
          onChange={(date) => {
            let temp = date?.valueOf();
            if (!temp) return false;
            //@ts-ignore
            let isoDate = new Date(temp);
            temp = isoDate.toISOString();

            //@ts-ignore
            setDay(temp);
          }}
          value={value}
          style={{ height: "100%", minWidth: "100px", borderRadius: "4px 0px 0px 4px", margin: "0px", width: "100%" }}
          placeholder="انتخاب تاریخ ..."
          name={name}
        />
        {value && (
          <HighlightOffIcon onClick={() => setDay("")} sx={{ ml: -3, color: (theme) => theme.palette.grey[600] }} />
        )}
      </Box>
      {error && <FormHelperText error={true}>{error}</FormHelperText>}
    </Box>
  );
};

export default CustomDatePicker;

// export function convertDayToString(day: DayValue | null) {
//   if (!day) return "";
//   function convertTo2Digit(number: number) {
//     return number.toLocaleString("en-US", {
//       minimumIntegerDigits: 2,
//       useGrouping: false,
//     });
//   }
//   let result = `${day?.year}-${convertTo2Digit(day?.month)}-${convertTo2Digit(day?.day)}`;
//   return result;
// }

// export function convertStringToDay(day: string | null): DayValue {
//   if (!day) return null;
//   let value = day.split("-")?.map((d) => parseInt(d));
//   return { day: value[2], month: value[1], year: value[0] };
// }
