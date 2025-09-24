"use client";
import { Box, Stack, Paper } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { SubmitHandler } from "react-hook-form";
import { InvoiceLines } from "./InvoiceLines";
import { InvoiceResults } from "./InvoiceResults";
import { useInvoiceCalculation } from "../hooks/useInvoiceCalculation";
import { InvoiceFormHeader } from "./InvoiceFormHeader";
import { ValidationSummary } from "./ValidationSummary";
import { InvoiceCurrencyField } from "./InvoiceCurrencyField";
import { SubmitButton } from "./SubmitButton";
import { InvoiceDateField } from "./InvoiceDateFields";
import { IFormInput } from "@/types/types";
import { useInvoiceForm } from "@/hooks/useInvoiceForm";

export const InvoiceForm = () => {
  const { result, error, isLoading, calculateTotal } = useInvoiceCalculation();
  
  const {
    handleSubmit,
    control,
    formState: { errors, isValid, isDirty, isSubmitted },
    watch,
  } = useInvoiceForm();

  const watchedCurrency = watch("invoice.currency");

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    await calculateTotal(data);
  };

  const showValidationSummary = isSubmitted && Object.keys(errors).length > 0;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <InvoiceFormHeader />
      
      <ValidationSummary 
        errors={errors} 
        isVisible={showValidationSummary} 
      />

      <Paper elevation={1} sx={{ p: 3 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            <InvoiceDateField control={control} />
            <InvoiceCurrencyField control={control} />
            
            <Box>
              <InvoiceLines control={control} errors={errors} />
            </Box>

            <SubmitButton 
              isLoading={isLoading}
              isValid={isValid}
              isDirty={isDirty}
            />
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