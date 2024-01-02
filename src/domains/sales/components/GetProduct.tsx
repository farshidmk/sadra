import React, { useEffect, useState } from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { Alert, Autocomplete, Box, Chip, Grid, LinearProgress, TextField, Tooltip, Typography } from "@mui/material";
import CodeIcon from "@mui/icons-material/Code";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import { useAuth } from "hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { IProduct } from "types/product";
import ErrorHandler from "components/errorHandler/ErrorHandler";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

type Props = {
  selectedProduct: IProduct | undefined;
  setSelectedProduct: React.Dispatch<React.SetStateAction<IProduct | undefined>>;
};
type TInputType = "CODE" | "NAME";
const GetProduct = ({ selectedProduct, setSelectedProduct }: Props) => {
  const Auth = useAuth();
  const [inputType, setInputType] = useState<TInputType>("CODE");
  const [inputValue, setInputValue] = useState<string>("");

  const { data, status, refetch } = useQuery({
    queryKey: [`Product/Get`],
    queryFn: Auth?.getRequest,
    select: (res): IProduct[] => res.Data,
    cacheTime: Infinity,
    staleTime: Infinity,
  });

  const handleAlignment = (event: React.MouseEvent<HTMLElement>, newInputType: TInputType | null) => {
    if (newInputType !== null) {
      setInputType(newInputType);
      setInputValue("");
    }
  };

  function getProduct(code: string) {
    let temp = data?.find((d) => d.goodCode === code);
    setSelectedProduct(temp);
    setInputValue(code);
  }

  return (
    <>
      <Grid item xs={12} md={6}>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <ToggleButtonGroup size="small" value={inputType} exclusive onChange={handleAlignment} sx={{ mb: 0.6 }}>
            <Tooltip title="جستجو بر اساس کد کالا">
              <ToggleButton value="CODE" aria-label="left aligned">
                <CodeIcon />
              </ToggleButton>
            </Tooltip>
            <Tooltip title="جستجو بر اساس نام کالا">
              <ToggleButton value="NAME" aria-label="centered">
                <TextFieldsIcon />
              </ToggleButton>
            </Tooltip>
          </ToggleButtonGroup>
          {status === "loading" ? (
            <LinearProgress />
          ) : status === "error" ? (
            <ErrorHandler onRefetch={refetch} />
          ) : status === "success" ? (
            <>
              {inputType === "CODE" ? (
                <TextField
                  variant="outlined"
                  label={`جستجو بر اساس  کد کالا`}
                  onBlur={(e) => {
                    getProduct(e.target.value);
                  }}
                />
              ) : (
                <Autocomplete
                  options={data}
                  getOptionLabel={(option: IProduct) => {
                    return option?.goodName;
                  }}
                  filterOptions={(ops, state) => {
                    let temp = ops?.filter((op) => op?.goodName?.includes(state?.inputValue));
                    return temp;
                  }}
                  //@ts-ignore
                  onChange={(e, item: IProduct | undefined) => {
                    getProduct(item?.goodCode || "");
                  }}
                  renderInput={(params) => (
                    <TextField {...params} variant="outlined" label={"جستجو بر اساس  کد کالا"} size="small" />
                  )}
                />
              )}
            </>
          ) : null}
        </Box>
      </Grid>
      <Grid item xs={12} md={6} alignItems="center">
        {inputValue && !selectedProduct ? (
          <Alert variant="outlined" color="error" icon={<ErrorOutlineIcon />}>
            محصولی یافت نشد
          </Alert>
        ) : selectedProduct ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              justifyContent: "flex-end",
              alignItems: "flex-start",
            }}
          >
            <Typography variant="body1">{selectedProduct.goodName}</Typography>
            <Tooltip title="کد کالا">
              <Chip
                label={selectedProduct.goodCode}
                size="small"
                sx={{ minWidth: "85px", display: "flex", alignItems: "center", justifyContent: "space-evenly" }}
                icon={<CodeIcon color="inherit" sx={{ border: "1px solid white", borderRadius: "50%", p: 0.3 }} />}
                variant="filled"
                color="info"
              />
            </Tooltip>
          </Box>
        ) : null}
      </Grid>
    </>
  );
};

export default GetProduct;
