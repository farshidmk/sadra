import { Box, Skeleton, Tab, Tabs, Typography } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import ErrorHandler from "components/errorHandler/ErrorHandler";
import { useAuth } from "hooks/useAuth";
import React, { useState } from "react";
import { ISale, ISmGood, ISmPayment } from "types/sale";
import CreateReceipt from "../components/CreateReceipt";
import TabPanel from "domains/companySetting/components/TabPanel";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import ReceiptIcon from "@mui/icons-material/Receipt";
import GoodsReceipts from "../components/GoodsReceipts";
import ItemsReceipts from "../components/ItemsReceipts";
import { useForm } from "react-hook-form";
import ErrorAlert from "components/phoenixAlert/ErrorAlert";
import FormButtons from "components/render/buttons/FormButtons";
import { useSnackbar } from "hooks/useSnackbar";

enum tabIndex {
  goods = 0,
  payment = 1,
}

type Props = {
  isForeign?: boolean;
};

const Sale = ({ isForeign = true }: Props) => {
  const Auth = useAuth();
  const snackbar = useSnackbar();

  const [error, setError] = useState<string[] | undefined>();
  const [tabValue, setTabValue] = React.useState(0);
  const [smGoods, setSmGoods] = useState<ISmGood[]>([]);
  const [smPayment, setSmPayment] = useState<ISmPayment[]>([]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const { data, status, refetch } = useQuery({
    queryKey: [`Sale/fetchLast`],
    queryFn: Auth?.getRequest,
    select: (res): ISale => {
      if (res.Succeeded) {
        return res?.Data;
      } else {
        throw new Error(res.ErrorList);
      }
    },
    onSuccess: (res: ISale) => {
      setSmGoods([]);
      setSmPayment([]);
    },
  });

  const { isLoading, mutate } = useMutation({
    mutationFn: Auth?.serverCall,
  });

  const form = useForm<ISale>({
    defaultValues: {
      FkfPayoffType: 5350,
      uidSM: "",
    },
  });

  const onSubmitHandler = (data: ISale) => {
    setError(undefined);

    mutate(
      {
        entity: `Sale`,
        method: "post",
        data: {
          ...data,
          smGood: smGoods,
          InvoceSubjoct: 1,
          FkfInvocePatern: isForeign ? 7 : 1,
          taxidRef: "",
          uidSM: "",
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

  return (
    <Box>
      {status === "error" ? (
        <ErrorHandler onRefetch={refetch} />
      ) : status === "loading" ? (
        <Skeleton height={300} />
      ) : status === "success" ? (
        <>
          <Box component="form" onSubmit={form.handleSubmit(onSubmitHandler)} sx={{ p: 1 }}>
            <CreateReceipt form={form} isForeign={isForeign} />
            <Box sx={{ p: 1, border: "1px solid", borderRadius: 2, mt: 2 }}>
              <Tabs value={tabValue} onChange={handleChange}>
                <Tab icon={<ReceiptLongIcon />} label="اقلام صورتحساب" />
                <Tab icon={<ReceiptIcon />} label="پرداخت صورتحساب" />
              </Tabs>
              <TabPanel value={tabValue} index={tabIndex.goods}>
                <GoodsReceipts data={smGoods} setDate={setSmGoods} />
              </TabPanel>
              <TabPanel value={tabValue} index={tabIndex.payment}>
                <ItemsReceipts />
              </TabPanel>
            </Box>
            <Box>
              <Typography variant="h5">
                ارزش افزوده:
                {/*
                TODO:
              {smGoods?.reduce((acc, smGood: ISmGood) => smGood?.vatPrice + acc, 0)} */}
              </Typography>
              <Typography variant="h5">
                جمع کل:{" "}
                {/*
              TODO:
                 {smGoods?.reduce((acc, smGood: ISmGood) => smGood?.finalPrice + acc, 0) +
                  parseInt(form.watch("subject17"))}{" "} */}
              </Typography>
            </Box>
            {error && <ErrorAlert text={error} />}
            <FormButtons onSave={form.handleSubmit(onSubmitHandler)} isLoading={isLoading} />
          </Box>
        </>
      ) : null}
    </Box>
  );
};

export default Sale;
