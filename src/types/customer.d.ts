export interface ICustomer {
  FKFBankCredit: number;
  FKFKindTafzili: number;
  FkfCity: number;
  FkfMarkaz: number;
  FkfMoein: number;
  FkfProjectType: number;
  FkfTafzili: number;
  FkfTreaterType: number;
  IsDirty: true;
  // MoeinDefult: {isCurrency: false, isExchange: false, isControl: false, IsDirty: false, pkfMoein: 0, moeinCode: "",…}
  accYear: number;
  active: boolean;
  address: string;
  aliasName: string;
  aliasNameEN: string;
  bedPrice: number;
  bedPriceCur: number;
  besPrice: number;
  besPriceCur: number;
  // category:{pkfCategory: 1, categoryCode: string, category: "", categoryEn: ""}
  connectionString: string;
  credit: number;
  creditReturnCheque: number;
  creditType: number;
  // currency: {IsDirty: false, currencyEN: "", pkfCurrency: 0, currency: "", isoCode: "", currencyCode: "",…}
  defultPrintCheck: string;
  dirtyDate: string;
  economicCode: string;
  economicCodeOld: string;
  error: string;
  famile: string;
  famileEN: string;
  fax: string;
  feeCur: number;
  fullName: string;
  fullNameEN: string;
  identityCode: string;
  mail: string;
  mainOrderNO: string;
  manager: string;
  mandatoryT2: false;
  mandatoryT3: false;
  memo: string;
  messageMobile: string;
  mobile: string;
  name: string;
  nameEN: string;
  oldPkf: number;
  part: { partID: 0; partTitle: null };
  passWeb: string;
  pkfTreater: number;
  reagent: string;
  regNumber: string;
  registrationNo: string;
  status: false;
  taxIDContractWork: string;
  taxValidityDate: string;
  tel: string;
  title: {
    titleCode: string;
    pkfTitle: number;
    title: string;
    titleEn: string;
    error: string;
    connectionString: string;
    status: boolean;
  };
  title: any;
  treaterCode: string;
  treaterTeibaCode: string;
  // treaterTypeAccounting:{pkfTreaterTypeAccounting: 19, treaterTypeAccounting: null}
  type: number;
  url: string;
  zipCode: string;
}

export interface ICustomerType {
  pkfTreaterLRType: number;
  treaterLRType: string;
}
export interface ICustomerTitle {
  connectionString: string;
  error: string;
  pkfTitle: number;
  status: boolean;
  title: string;
  titleCode: string;
  titleEn: string;
}
