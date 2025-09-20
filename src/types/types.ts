import { Dayjs } from "dayjs";

export interface Invoice {
  currency: string;
  date: Dayjs;
  lines: InvoiceLine[];
}

export interface InvoiceLine {
  description: string;
  amount: number;
  currency: string;
}
