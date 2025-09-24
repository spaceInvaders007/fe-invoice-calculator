import { Box } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { Controller, Control } from "react-hook-form";
import dayjs from 'dayjs';
import { IFormInput } from "@/types/types";

interface InvoiceDateFieldProps {
  control: Control<IFormInput>;
}

export const InvoiceDateField = ({ control }: InvoiceDateFieldProps) => {
  return (
    <Box>
      <Controller
        name="invoice.date"
        control={control}
        render={({ field, fieldState }) => (
          <DatePicker
            value={field.value}
            onChange={(newValue) => {
              field.onChange(newValue);
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
  );
};