import { apiGet } from "./client";

export interface StockQuote {
  symbol: string;
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export function getStockHistory(symbol: string) {
  return apiGet<StockQuote[]>(`/stock/${symbol}`);
}
