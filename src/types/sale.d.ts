export interface ISale {
  pkfTreater: number;
  kotajhDate: string;
  kotajhDateEN: Date;
  kotajhNumber: string;
  gomrokCode: string;
  IsDirty: true;
  pkfSM: number;
  serial: number;
  contractDate: string;
  contractDateEN: Date;
  FkfInvoceType: number;
  FkfInvocePatern: number;
  InvoceSubjoct: number;
  FkfPayoffType: number;
  creditPrice: number;
  licenceNoGomrokeSaller: string;
  gomrokCodePlace: string;
  referenceNumber: string;
  statusSM: string;
  taxid: string;
  branchCodeSaller: string;
  branchCodeBuyer: string;
  subject17: string;
  memo: string;
  smGood: ISmGood[];
  smPayment: ISmPayment[];
  uidSM: string;
  taxidRef: string;
}

export interface ISmGood {
  pkfCurrency: number;
  netWeight: number;
  otherTaxSubject: string;
  otherTax: number;
  otherTaxPrice: number;
  IsDirty: true;
  curExcRate: number;
  feeCur: number;
  pkfSmGood: number;
  amount: number;
  fee: number;
  discount: number;
  vatTaxOther: number;
  vatPriceOther: number;
  vatOtherSubject: string;
  rateOtherLegalFunds: number;
  rateOtherLegalFundsPrice: number;
  rateOtherLegalFundsSubject: string;
  taxIDLaborRightsContract: string;
  bourceContractNo: string;
  bourceContractDate: string;
  bourceContractDateEN: Date;
  pkfUnit: number;
  unitName: string;
  vatTax: number;
  pkfGood: number;
  goodName: string;
  goodCode: string;

  // -------------------
  totalPrice?: number; // for calculating total price => amount * fee
  sumAfterDiscount: number; // totalPrice - discount
  vatPrice: number; // sumAfterDiscount * vatTax / 100
  finalPrice: number; // sumAfterDiscount + vatPrice
}

export interface ISmPayment {
  IsDirty: boolean;
  pkfPaymentSm: number;
  FkfPaymentMethod: number;
  FkfPaymentMethodTitle: string;
  paymentPrice: number;
  paymentDate: string;
  paymentDateEN: Date;
  switchNo: string;
  psNo: string;
  terminalNo: string;
  trackingNo: string;
  paymentCardNo: string;
  idNo: string;
}

export type TModalValue =
  | {
      mode: "CREATE";
    }
  | {
      mode: "EDIT";
      item: ISmGood;
    };
