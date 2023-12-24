export function convertNumberToPersianMoneyFormat(money: number) {
  try {
    return new Intl.NumberFormat("fa-IR").format(money);
  } catch (error) {
    return money;
  }
}
