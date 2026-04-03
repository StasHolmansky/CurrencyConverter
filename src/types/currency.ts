export interface Currency {
  code: string;          // "USD"
  flag: string;          // флаг-эмодзи или код страны
  rateToUSD: number;     // курс к доллару США (базовая валюта)
}

export interface CurrencyRow {
  id: string;
  currencyCode: string;
  amount: number;
}