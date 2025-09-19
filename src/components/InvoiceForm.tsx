"use client";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";
import { useState } from "react";
import { CurrencySelector } from "./CurrencySelector";

export const InvoiceForm = () => {
  const [date, setDate] = useState<Dayjs | null>(null);
  const [baseCurrency, setBaseCurrency] = useState<string | null>(null);
  
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker value={date} onChange={(newDate) => setDate(newDate)} />
      <CurrencySelector
        baseCurrency={baseCurrency}
        setBaseCurrency={setBaseCurrency}
      />
    </LocalizationProvider>
  );
};
