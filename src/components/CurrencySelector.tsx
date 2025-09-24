"use client";

import Autocomplete from "@mui/material/Autocomplete";
import { currencies } from "@/constants/currencies";
import TextField from "@mui/material/TextField";

interface Props {
  value: string | null;
  onChange: (...event: unknown[]) => void;
  error?: boolean;
  helperText?: string;
}

export const CurrencySelector = ({ 
  value, 
  onChange, 
  error = false,
  helperText,
}: Props) => {
  return (
    <>
      <Autocomplete
        value={value}
        options={currencies}
        getOptionLabel={(option) => String(option)}
        isOptionEqualToValue={(option, value) => option === value}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Base Currency *"
            error={error}
            helperText={helperText}
            slotProps={{
              htmlInput: {
                ...params.inputProps,
                "data-testid": "currency-selector",
              },
            }}
          />
        )}
        onChange={(event, newValue) => onChange(newValue)}
      />
    </>
  );
};