"use client";
import { Invoice } from "@/types/types";
import { 
  Box, 
  Button, 
  Stack, 
  Typography, 
  Alert,
  FormHelperText,
  Paper
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { CurrencySelector } from "./CurrencySelector";
import { InvoiceLines } from "./InvoiceLines";
import { yupResolver } from "@hookform/resolvers/yup";
import { formInputSchema } from "@/schemas/invoice";
import { useState } from "react";
import { InvoiceResults } from "./InvoiceResults";
import dayjs from 'dayjs';

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
    formState: { errors, isValid, isDirty, isSubmitted },
    watch,
    trigger,
  } = useForm<IFormInput>({
    resolver: yupResolver(formInputSchema),
    mode: "onChange",
    reValidateMode: "onChange",
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

  const showValidationSummary = isSubmitted && Object.keys(errors).length > 0;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h2">Invoice Calculator</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Fill in the invoice details below. All fields marked with * are required.
        </Typography>
      </Box>

      {showValidationSummary && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Please fix the following issues:
          </Typography>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            {errors.invoice?.date && (
              <li>Invoice date is required</li>
            )}
            {errors.invoice?.currency && (
              <li>Base currency is required</li>
            )}
            {errors.invoice?.lines && (
              <li>All invoice lines must be completed correctly</li>
            )}
          </ul>
        </Alert>
      )}

      <Paper elevation={1} sx={{ p: 3 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            <Box>
              <Controller
                name="invoice.date"
                control={control}
                render={({ field, fieldState }) => (
                  <DatePicker
                    value={field.value}
                    onChange={(newValue) => {
                      field.onChange(newValue);
                      setTimeout(() => trigger("invoice.date"), 0);
                    }}
                    maxDate={dayjs()}
                    slotProps={{
                      textField: {
                        label: "Invoice Date *",
                        error: !!fieldState.error,
                        helperText: fieldState.error?.message || "Select the date for this invoice",
                        fullWidth: true,
                        inputProps: {
                          "aria-label": "Invoice Date",
                          "data-testid": "date-picker",
                        },
                      },
                    }}
                  />
                )}
              />
            </Box>

            <Box>
              <Controller
                name="invoice.currency"
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <CurrencySelector
                      value={field.value || ""}
                      onChange={(newValue) => {
                        field.onChange(newValue);
                      }}
                      error={!!fieldState.error}
                      helperText="This is the currency for the final invoice total"
                    />
                    {fieldState.error && (
                      <FormHelperText error sx={{ ml: 2, mt: 0.5 }}>
                        {fieldState.error.message}
                      </FormHelperText>
                    )}
                  </>
                )}
              />
            </Box>

            <Box>
              <InvoiceLines control={control} errors={errors} />
            </Box>

            <Box sx={{ pt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="success"
                disabled={isLoading}
                size="large"
                sx={{ minWidth: "200px" }}
              >
                {isLoading ? "Calculating..." : "Calculate Total"}
              </Button>
              {!isValid && isDirty && (
                <FormHelperText sx={{ mt: 1 }}>
                  Please complete all required fields to calculate the total
                </FormHelperText>
              )}
            </Box>
          </Stack>
        </form>
      </Paper>

      <InvoiceResults
        total={result}
        baseCurrency={watchedCurrency || ""}
        error={error}
      />
    </LocalizationProvider>
  );
};