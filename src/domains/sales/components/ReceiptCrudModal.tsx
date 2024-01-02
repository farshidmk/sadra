import { Box, Dialog, DialogContent, DialogTitle, Divider, Grid, Typography } from "@mui/material";
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ISmGood, TModalValue } from "types/sale";
import GetProduct from "./GetProduct";
import RenderFormInput from "components/render/formInputs/RenderFormInput";
import FormButtons from "components/render/buttons/FormButtons";
import { IProduct } from "types/product";

type Props = {
  modalValue: TModalValue | undefined;
  handleClose: () => void;
  setData: Dispatch<SetStateAction<ISmGood[]>>;
};

const ReceiptCrudModal = ({ modalValue, handleClose, setData }: Props) => {
  const [totalPrice, setTotalPrice] = useState(-1);
  const [sumAfterDiscount, setSumAfterDiscount] = useState(-1);
  const [vatPrice, setVatPrice] = useState(-1);
  const [finalPrice, setFinalPrice] = useState(-1);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | undefined>();
  const open = !!modalValue;

  const {
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    watch,
    reset,
  } = useForm<ISmGood>({
    defaultValues: {
      discount: 0,
    },
  });

  useEffect(() => {
    if (modalValue?.mode === "EDIT" && modalValue?.item) {
      Object.keys(modalValue?.item).forEach((field) => {
        setValue(field as keyof ISmGood, modalValue?.item[field as keyof ISmGood]);
      });
    }
  }, [modalValue, setValue]);

  useEffect(() => {
    try {
      let amount = watch("amount");
      let fee = watch("fee");
      if (amount && fee) {
        let intAmount = parseInt(`${amount}`);
        let intFee = parseInt(`${fee}`);
        let temp = intAmount * intFee;
        setTotalPrice(temp);
      }
    } catch (error) {
      // inserted value in not number
    }
  }, [watch, watch("amount"), watch("fee")]);

  useEffect(() => {
    try {
      let discount = watch("discount");
      if (discount && totalPrice > 0) {
        let intDiscount = parseInt(`${discount}`);
        let temp = totalPrice - intDiscount;

        setSumAfterDiscount(temp);
      }
    } catch (error) {}
  }, [watch, watch("discount")]);

  useEffect(() => {
    if (selectedProduct?.vatTax && sumAfterDiscount > 0) {
      let temp = (sumAfterDiscount * selectedProduct.vatTax) / 100;
      setVatPrice(Math.floor(temp));
    }
  }, [sumAfterDiscount, selectedProduct?.vatTax, totalPrice]);
  useEffect(() => {
    if (vatPrice > 0 && sumAfterDiscount > 0) {
      let temp = sumAfterDiscount + vatPrice;
      setFinalPrice(temp);
    }
  }, [vatPrice, sumAfterDiscount]);

  const onSubmitHandler = (smGood: ISmGood) => {
    let data: ISmGood = {
      ...smGood,
      goodCode: selectedProduct?.goodCode!,
      goodName: selectedProduct?.goodName!,
      unitName: selectedProduct?.unitName!,
      pkfUnit: selectedProduct?.pkfUnit!,
      pkfGood: selectedProduct?.pkfGood!,
      totalPrice,
      sumAfterDiscount,
      vatPrice,
      finalPrice,
    };
    if (!data.pkfSmGood) {
      // Generate random number for accessing item from table - pkfSmGood not provided yet
      let date = new Date();
      data.pkfSmGood = date.getTime() % 1000000000; // decrease to integer size
    }
    if (modalValue?.mode === "CREATE") {
      setData((p) => {
        if (p) return [...p, data];
        else return [data];
      });
      handleClose();
    } else if (modalValue?.mode === "EDIT") {
      let modalItem = modalValue?.item;
      //TODO: fix undefined type
      //@ts-ignore
      setData((p: ISmGood[]) => {
        if (!p) return null;
        let temp = [...p];
        let index = p.findIndex((item: ISmGood) => item.pkfSmGood === modalItem.pkfSmGood);
        if (index > -1) {
          temp.splice(index, 1);
          return temp;
        }
      });
      reset();
      handleClose();
    }
  };

  if (!open) return null;
  const title = modalValue.mode === "CREATE" ? "ایجاد صورتحساب جدید" : `ویرایش  ${modalValue.item.goodName}`;
  return (
    <Dialog onClose={handleClose} open={open} sx={{ minWidth: "500px" }}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit(onSubmitHandler)}>
          <Grid container spacing={2}>
            <GetProduct selectedProduct={selectedProduct} setSelectedProduct={setSelectedProduct} />
            {ITEMS.map((item) => (
              <Grid item key={item.name} xs={12} md={6}>
                <Controller
                  name={item.name as keyof ISmGood}
                  control={control}
                  defaultValue={modalValue.mode === "CREATE" ? "" : modalValue.item?.[item.name as keyof ISmGood]}
                  render={({ field }) => {
                    return <RenderFormInput controllerField={field} errors={errors} {...item} {...field} />;
                  }}
                />
              </Grid>
            ))}
          </Grid>
          <Divider sx={{ my: 1.2 }} />
          {totalPrice > -1 && (
            <Typography variant="h6">
              قیمت کل:
              {totalPrice.toLocaleString("fa-IR")}
            </Typography>
          )}
          {sumAfterDiscount > -1 && (
            <Typography variant="h6">جمع پس از تخفیف: {sumAfterDiscount?.toLocaleString("fa-IR")}</Typography>
          )}
          {vatPrice > -1 && <Typography variant="h6">مبلغ ارزش افزوده: {vatPrice.toLocaleString("fa-IR")}</Typography>}
          {finalPrice > -1 && (
            <Typography variant="h5" fontWeight={600}>
              مبلغ نهایی: {finalPrice.toLocaleString("fa-IR")}
            </Typography>
          )}
          {/* TODO: change submit name to temporary save */}
          <FormButtons onBack={handleClose} onSave={handleSubmit(onSubmitHandler)} />
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ReceiptCrudModal;

let ITEMS = [
  { name: "amount", label: "مقدار", inputType: "text" },
  { name: "fee", label: "قیمت واحد", inputType: "text" },
  { name: "discount", label: "مبلغ تخفیف", inputType: "text" },
  { name: "taxIDLaborRightsContract", label: "شناسه قرارداد حق العمل کاری", inputType: "text" },
];
