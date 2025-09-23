"use client";
import { Invoice } from "@/types/types";
import { Button, Stack } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { CurrencySelector } from "./CurrencySelector";
import { InvoiceLines } from "./InvoiceLines";
import { yupResolver } from "@hookform/resolvers/yup";
import { formInputSchema } from "@/schemas/invoice";
import { useState } from "react";
import { InvoiceResults } from "./InvoiceResults";

export interface IFormInput {
  invoice: Invoice;
}
export const InvoiceForm = () => {
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    handleSubmit,
    control,
    formState: { errors, isValid, isDirty },
    watch,
  } = useForm<IFormInput>({
    resolver: yupResolver(formInputSchema),
    mode: "onChange",
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

  const watchedCurrency = watch("invoice.currency");
  const watchedDate = watch("invoice.date");

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const payload = {
        invoice: {
          ...data.invoice,
          date: data.invoice.date!.format("YYYY-MM-DD"),
        },
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_QUARKUS_API_URL}/invoice/total`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const responseText = await response.text();

      if (!response.ok) {
        throw new Error(responseText);
      }

      setResult(responseText);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
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
              <DatePicker value={field.value} onChange={field.onChange} />
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
          <Button
            type="submit"
            variant="contained"
            color="success"
            disabled={!isValid || !isDirty || !watchedDate}
            sx={{ width: "200px" }}
          >
            {isLoading ? "Calculating..." : "Calculate Total"}
          </Button>
        </Stack>
      </form>

      <InvoiceResults
        total={result}
        baseCurrency={watchedCurrency || ""}
        error={error}
      />
    </LocalizationProvider>
  );
};
