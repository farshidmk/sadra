export interface ITaxSetting {
  firstSerialSendSm: number;
  elctronicSignatureFile: string;
  uniqueTaxIDDGT: string;
  serviceAddress: string;
  uniqueTaxID: string;
  privatekey: string;
  publicKey: string;
  typeFactor: boolean;
  alarmLoan: boolean;
  alarmGetCheck: boolean;
  alarmPayCheck: boolean;
  alarmPointOrder: boolean;
  alarmSaleOpen: boolean;
  spPrint: boolean;
  pkfSetting: number;
  sendFinal: boolean;
  description: string;
  startDate: string;
  endDate: string;
  active: boolean;
  sendSMFromFinalSerial: boolean;
  treatreDigit: number;
  pathPackup: string;
  version: string;
}
