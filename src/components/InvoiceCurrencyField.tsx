import { Box, FormHelperText } from "@mui/material";
import { Controller, Control } from "react-hook-form";
import { CurrencySelector } from "./CurrencySelector";
import { IFormInput } from "@/types/types";

interface InvoiceCurrencyFieldProps {
  control: Control<IFormInput>;
}

export const InvoiceCurrencyField = ({ control }: InvoiceCurrencyFieldProps) => {
  return (
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
  );
};