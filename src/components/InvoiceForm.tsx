"use client";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";
import { useState } from "react";
import { CurrencySelector } from "./CurrencySelector";
import { InvoiceLines } from "./InvoiceLines";
import { InvoiceLine } from "@/types/types";
export const InvoiceForm = () => {
  const [date, setDate] = useState<Dayjs | null>(null);
  const [baseCurrency, setBaseCurrency] = useState<string | null>(null);
  const [invoiceLines, setInvoiceLines] = useState<InvoiceLine[]>([
    {
      description: "",
      currency: "EUR",
      amount: 0,
    },
  ]);
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker value={date} onChange={(newDate) => setDate(newDate)} />
      <CurrencySelector
        baseCurrency={baseCurrency}
        setBaseCurrency={setBaseCurrency}
      />
      <InvoiceLines
        invoiceLines={invoiceLines}
        setInvoiceLines={setInvoiceLines}
      />
    </LocalizationProvider>
  );
};
