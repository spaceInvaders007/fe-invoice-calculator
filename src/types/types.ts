import { Dayjs } from "dayjs";

export interface Invoice {
  currency: string;
  date: Dayjs | null;
  lines: InvoiceLine[];
}

export interface InvoiceLine {
  description: string;
  amount: number;
  currency: string;
}

export interface IFormInput {
  invoice: Invoice;
}
