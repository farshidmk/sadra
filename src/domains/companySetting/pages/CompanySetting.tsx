import { Box, Button, Skeleton, Tab, Tabs, CircularProgress } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import ErrorHandler from "components/errorHandler/ErrorHandler";
import { useAuth } from "hooks/useAuth";
import React, { useState } from "react";
import ApartmentIcon from "@mui/icons-material/Apartment";
import TabPanel from "../components/TabPanel";
import PaidIcon from "@mui/icons-material/Paid";
import CompanyInfo from "../components/CompanyInfo";
import TaxSetting from "../components/TaxSetting";
import { TCompanySetting } from "types/company";
import { useForm } from "react-hook-form";
import { useSnackbar } from "hooks/useSnackbar";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import VpnKeyIcon from "@mui/icons-material/VpnKey";

enum tabIndex {
  companyInfo = 0,
  taxSetting = 1,
}

const CompanySetting = () => {
  const Auth = useAuth();
  const snackbar = useSnackbar();

  const [error, setError] = useState<string[] | undefined>();
  const [tabValue, setTabValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const { isLoading, mutate } = useMutation({
    mutationFn: Auth?.serverCall,
  });

  const { data, status, refetch } = useQuery({
    queryKey: [`Setting`],
    queryFn: Auth?.getRequest,
    select: (res): TCompanySetting => res.Data,
  });

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<TCompanySetting>();

  const onSubmitHandler = (val: TCompanySetting) => {
    setError(undefined);
    mutate(
      {
        entity: `Setting`,
        method: "post",
        data: {
          ...data,
          ...val,
        },
      },
      {
        onSuccess: (res: any) => {
          if (!res.Succeeded) {
            setError(res.ErrorList);
          } else {
            snackbar("عملیات با موفقیت انجام شد", "success");
          }
        },
        onError: (res) => snackbar("خطا در انجام عملیات", "error"),
      }
    );
  };

  const onSubmitTokenHandler = (val: TCompanySetting) => {
    setError(undefined);
    mutate(
      {
        entity: `Setting/TestToken`,
        method: "post",
        data: {
          ...data,
          ...val,
        },
      },
      {
        onSuccess: (res: any) => {
          if (!res.Succeeded) {
            setError(res.ErrorList);
          } else {
            snackbar(res.Data, "success");
          }
        },
        onError: (res) => snackbar("خطا در انجام عملیات", "error"),
      }
    );
  };

  return (
    <Box>
      {status === "error" ? (
        <ErrorHandler onRefetch={refetch} />
      ) : status === "loading" ? (
        <Skeleton height={300} />
      ) : status === "success" ? (
        <Box component="form" onSubmit={handleSubmit(onSubmitHandler)} sx={{ p: 1 }}>
          <Tabs value={tabValue} onChange={handleChange} aria-label="icon label tabs example">
            <Tab icon={<ApartmentIcon />} label="مشخصات شرکت" />
            <Tab icon={<PaidIcon />} label="تنظیمات سامانه مودیان" />
          </Tabs>
          <TabPanel value={tabValue} index={tabIndex.companyInfo}>
            <CompanyInfo info={data.Company} errors={errors} control={control} />
          </TabPanel>
          <TabPanel value={tabValue} index={tabIndex.taxSetting}>
            <TaxSetting setting={data.Setting} errors={errors} control={control} />
          </TabPanel>
          <Box>
            <Button
              disabled={isLoading}
              variant="contained"
              onClick={handleSubmit(onSubmitHandler)}
              endIcon={isLoading ? <CircularProgress size={14} /> : <CheckCircleIcon />}
              color="success"
              sx={{ mx: 2, width: "150px" }}
            >
              ذخیره
            </Button>
            <Button
              disabled={isLoading}
              variant="outlined"
              endIcon={isLoading ? <CircularProgress size={14} /> : <VpnKeyIcon />}
              color="info"
              sx={{ mx: 2, width: "150px" }}
              onClick={handleSubmit(onSubmitTokenHandler)}
            >
              تست توکن
            </Button>
          </Box>
        </Box>
      ) : null}
    </Box>
  );
};

export default CompanySetting;
