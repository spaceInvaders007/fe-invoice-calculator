"use client";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";
import { FormEvent, useCallback, useState } from "react";
import { CurrencySelector } from "./CurrencySelector";
import { InvoiceLines } from "./InvoiceLines";
import { InvoiceLine } from "@/types/types";
import { Box, Button, Stack } from "@mui/material";
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

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      const finalInvoice = {
        invoice: {
          currency: baseCurrency,
          date,
          lines: [...invoiceLines],
        },
      };
      console.log(finalInvoice, "final invoice ");
    },
    [baseCurrency, date, invoiceLines]
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <DatePicker value={date} onChange={(newDate) => setDate(newDate)} />
          <CurrencySelector
            baseCurrency={baseCurrency}
            setBaseCurrency={setBaseCurrency}
          />
          <InvoiceLines
            invoiceLines={invoiceLines}
            setInvoiceLines={setInvoiceLines}
          />
          <Button type="submit">Submit Invoice</Button>
        </Stack>
      </Box>
    </LocalizationProvider>
  );
};
