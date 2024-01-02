import { TextField } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "hooks/useAuth";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { UseFormSetValue, UseFormWatch } from "react-hook-form";
import { ICustomer } from "types/customer";
import { TOption } from "types/render";
import { ISale } from "types/sale";

type TSaleItems = {
  PKID: number;
  Title: string;
  connectionString: string;
  error: string;
  status: false;
};

type TCustomerWithType = TOption & { type: number };

const useReceiptItems = (setValue: UseFormSetValue<ISale>, watch: UseFormWatch<ISale>, isForeign = false) => {
  const Auth = useAuth();
  const {
    data: customers,
    status: customersStatus,
    refetch: customersRefetch,
  } = useQuery({
    queryKey: ["Customer"],
    queryFn: Auth?.getRequest,
    select: (res): TCustomerWithType[] =>
      res.Data?.map((customer: ICustomer) => ({
        value: customer.pkfTreater,
        title: customer.name + " " + customer.famile,
        type: customer.type,
      })),
    cacheTime: Infinity,
    staleTime: Infinity,
  });
  const { data: invoiceTypes } = useQuery({
    queryKey: ["Sale/GetInvoiceType"],
    queryFn: Auth?.getRequest,
    select: (res): TOption[] => res.Data?.map((title: TSaleItems) => ({ value: title.PKID, title: title.Title })),
    cacheTime: Infinity,
    staleTime: Infinity,
  });

  const {
    data: invoicePatterns,
    status: invoicePatternsStatus,
    refetch: invoicePatternsRefetch,
  } = useQuery({
    queryKey: ["Sale/GetInvoicePattern"],
    queryFn: Auth?.getRequest,
    select: (res): TOption[] => res.Data?.map((title: TSaleItems) => ({ value: title.PKID, title: title.Title })),
    cacheTime: Infinity,
    staleTime: Infinity,
  });

  const {
    data: invoiceSubject,
    status: invoiceSubjectStatus,
    refetch: invoiceSubjectRefetch,
  } = useQuery({
    queryKey: ["Sale/GetInvoiceSubject"],
    queryFn: Auth?.getRequest,
    select: (res): TOption[] => res.Data?.map((title: TSaleItems) => ({ value: title.PKID, title: title.Title })),
    cacheTime: Infinity,
    staleTime: Infinity,
  });

  const {
    data: paymentTypes,
    status: paymentTypesStatus,
    refetch: paymentTypesRefetch,
  } = useQuery({
    queryKey: ["Sale/GetPayTypeOff"],
    queryFn: Auth?.getRequest,
    select: (res): TOption[] => res.Data?.map((title: TSaleItems) => ({ value: title.PKID, title: title.Title })),
    cacheTime: Infinity,
    staleTime: Infinity,
  });

  useEffect(() => {
    let pkfTreater = watch("pkfTreater");
    if (!pkfTreater) return;
    let selectedCustomer = customers?.find((c) => c.value === pkfTreater);
    if (selectedCustomer?.type === 5) {
      setValue("FkfInvoceType", 5302);
    } else {
      setValue("FkfInvoceType", 5301);
    }
  }, [customers, invoiceTypes, setValue, watch, watch("pkfTreater")]);

  let items = useMemo(
    () => [
      { name: "serial", label: "شماره فاکتور", inputType: "text" },
      {
        name: "contractDateEN",
        label: "تاریخ",
        inputType: "date",
        setValue,
        watch,
      },
      {
        name: "pkfTreater",
        label: "خریدار",
        inputType: "autocomplete",
        options: customers,
        status: customersStatus,
        refetch: customersRefetch,
        setValue,
      },
      { name: "branchCodeBuyer", label: "کد شعبه خریدار", inputType: "text" },
      {
        name: "FkfPayoffType",
        label: "روش تسویه",
        inputType: "select",
        options: paymentTypes,
        status: paymentTypesStatus,
        refetch: paymentTypesRefetch,
      },
      {
        name: "creditPrice",
        label: "مبلغ نسیه",
        inputType: "text",
        elementProps: {
          disabled: watch("FkfPayoffType") === 5350 ? true : false,
        },
      },
      { name: "subject17", label: "موضوع ماده 17", inputType: "text" },
      ...(isForeign
        ? [
            { name: "licenceNoGomrokeSaller", label: "شماره پروانه گمرکی", inputType: "text" },
            { name: "kotajhNumber", label: "شماره کوتاژ اظهارنامه گمرکی", inputType: "text" },
            { name: "gomrokCodePlace", label: "کد گمرک محل اظهار", inputType: "text" },
            { name: "kotajhDateEN", label: "تاریخ کوتاژ اظهارنامه گمرکی", inputType: "date", setValue, watch },
          ]
        : []),
      // { name: "vat", label: "مالیات بر ارزش افزوده", inputType: "text", elementProps: { disabled: true } },
      // { name: "totalPrice", label: "کل مبلغ فاکتور", inputType: "text", elementProps: { disabled: true } },
      // { name: "sum", label: "جمع کل", inputType: "text", elementProps: { disabled: true } },
      { name: "branchCodeSaller", label: "کد شعبه فروشنده", inputType: "text" },
      {
        name: "memo",
        label: "توضیحات",
        inputType: "text",
        gridSize: {
          xs: 12,
          md: 12,
          lg: 12,
        },
      },
    ],
    [
      invoicePatterns,
      invoicePatternsRefetch,
      invoicePatternsStatus,
      invoiceSubject,
      invoiceSubjectRefetch,
      invoiceSubjectStatus,
      paymentTypes,
      paymentTypesRefetch,
      paymentTypesStatus,
      setValue,
      customers,
      customersRefetch,
      customersStatus,
      watch,
      watch("pkfTreater"),
      watch("FkfPayoffType"),
    ]
  );
  return items;
};

export default useReceiptItems;
