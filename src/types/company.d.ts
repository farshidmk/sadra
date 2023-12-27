export interface ICompany {
  Id: string;
  Title: string;
  EconomyCode: string;
  IsDefault: boolean;
}

export interface ICompanySettingInfo {
  firstSerialSendSm: number;
  reportDate: string;
  reportTime: string;
  reportTitle: string;
  lastId: number;
  support: string;
  economicCode: string;
  zipCode: string;
  regNumber: string;
  pkfCompany: number;
  title: string;
  companyName: string;
  address: string;
  tel: string;
  fax: string;
  email: string;
  url: string;
  internetConnection: string;
  sqlNameSM: string;
  userSqlSM: string;
  DBNameSM: string;
  passSqlSM: string;
  viewSM: string;
}

export type TCompanySetting = {
  Company: ICompanySettingInfo;
  Setting: ITaxSetting;
};
