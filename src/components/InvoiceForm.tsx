"use client";
import { Invoice } from "@/types/types";
import { Button, Stack } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { CurrencySelector } from "./CurrencySelector";
import { InvoiceLines } from "./InvoiceLines";

export interface IFormInput {
  invoice: Invoice;
}
export const InvoiceForm = () => {

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<IFormInput>({
    defaultValues: {
      invoice: {
        currency: "",
        date: null,
        lines: [
          {
            description: "",
            currency: "EUR",
            amount: 0,
          },
        ],
      },
    },
  });

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    console.log("Form data:", data);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <Controller
            name="invoice.date"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <DatePicker 
                value={field.value || null} 
                onChange={field.onChange} 
              />
            )}
          />
          <Controller
            name="invoice.currency"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <CurrencySelector 
                value={field.value || ""} 
                onChange={field.onChange} 
              />
            )}
          />
          <InvoiceLines control={control} />
          <Button type="submit">Submit Invoice</Button>
        </Stack>
      </form>
    </LocalizationProvider>
  );
};
