export interface IProduct {
  FKFBackGround: number;
  FKFColor: number;
  FKFDegree: number;
  FKFForceColor: number;
  FKFSize: number;
  FkfGoodTypeProduce: number;
  IsDirty: boolean;
  ListGoodsPrice: string[];
  ListOfCars: string[];
  ListOfNames: string[];
  accYear: number;
  active: boolean;
  amountOneUnit: number;
  barcode: string;
  baseType: string;
  connectionString: string;
  density: number;
  discountP: number;
  displayCode: number;
  emergency: boolean;
  error: string;
  feeBuy: number;
  feeSale: number;
  feeSaleTotal: number;
  formulaName: string;
  formulaNameD: string;
  gauge: number;
  goodCode: string;
  goodCodeEq: string;
  goodCodeSM: string;
  goodName: string;
  goodNameEnglish: string;
  goodSize: number;
  goodWidth: number;
  // goodsMatter: {pkfGoodsMatter: number, goodsMatterCode: null, goodsMatter: string}
  // groupGood: {pkfGroupGood: number, groupGood: null, groupGoodCode: null,…}
  // groupGood1:{FkfGoodsMatter: number, pkfGroupGood: number, groupGood: string, codeGroup: null, FkfGoodTypeProduce: number}
  // groupGood2: {FkfGoodsMatter: number, pkfGroupGood: number, groupGood: string, codeGroup: null, FkfGoodTypeProduce: number}
  // groupGood3:{FkfGoodsMatter: number, pkfGroupGood: number, groupGood: string, codeGroup: null, FkfGoodTypeProduce: number}
  // groupGood4:{FkfGoodsMatter: number, pkfGroupGood: number, groupGood: string, codeGroup: null, FkfGoodTypeProduce: number}
  // groupGood5:{FkfGoodsMatter: number, pkfGroupGood: number, groupGood: string, codeGroup: null, FkfGoodTypeProduce: number}
  length: number;
  listOfCars: string;
  maxAmount: number;
  maxFeeUnit1: number;
  maxFeeUnit2: number;
  memo: string;
  minAmount: number;
  minFeeUnit1: number;
  minFeeUnit2: number;
  mustStandard: boolean;
  orderAmount: number;
  pirceG: number;
  pkfFormula: number;
  pkfFormulaD: number;
  pkfGood: number;
  placeCode: string;
  pointOrder: number;
  serialable: boolean;
  // serviceSale2: {registrationNo: string, part: {partID: number, partTitle: null}, aliasNameEN: string, fullNameEN: string, nameEN: string,…}
  // serviseBuy:{registrationNo: string, part: {partID: number, partTitle: null}, aliasNameEN: string, fullNameEN: string, nameEN: string,…}
  // serviseBuy2:{registrationNo: string, part: {partID: number, partTitle: null}, aliasNameEN: string, fullNameEN: string, nameEN: string,…}
  // serviseBuyM:{isCurrency: boolean, isExchange: boolean, isControl: boolean, IsDirty: boolean, pkfMoein: number, moeinCode: string,…}
  // serviseSaleM:{isCurrency: boolean, isExchange: boolean, isControl: boolean, IsDirty: boolean, pkfMoein: number, moeinCode: string,…}
  // srviseSale:{registrationNo: string, part: {partID: number, partTitle: null}, aliasNameEN: string, fullNameEN: string, nameEN: string,…}
  standardFee: number;
  standardWeight: number;
  status: boolean;
  storePrice: number;
  tariff: number;
  tariff2: number;
  technicalCode: string;
  unit1: {
    IsDirty: boolean;
    unitNameEN: string;
    pkfUnit: number;
    unitName: string;
    unitCode: string;
    unitCodeSM: string;
    error: string;
  };
  unit1factor: number;
  unit1factorNum: number;
  // unit2: {IsDirty: boolean, unitNameEN: string, pkfUnit: number, unitName: string, unitCode: string, unitCodeSM: string, error: string,…}
  unit2factor: number;
  unit2factorNum: number;
  // unit3: {IsDirty: boolean, unitNameEN: string, pkfUnit: number, unitName: string, unitCode: string, unitCodeSM: string, error: string,…}
  // unitMandatory: {IsDirty: boolean, unitNameEN: string, pkfUnit: number, unitName: string, unitCode: string, unitCodeSM: string, error: string,…}
  // unitNum: {IsDirty: boolean, unitNameEN: string, pkfUnit: number, unitName: string, unitCode: string, unitCodeSM: string, error: string,…}
  // unitStorePrice: {IsDirty: boolean, unitNameEN: string, pkfUnit: number, unitName: string, unitCode: string, unitCodeSM: string, error: string,…}
  vatSide: number;
  vatTax: number;
  wagePrice: number;
  weight: number;
  weightPerMetter: number;
  width: number;
}
