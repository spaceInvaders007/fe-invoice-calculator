"use client";

import Autocomplete from "@mui/material/Autocomplete";
import { currencies } from "@/constants/currencies";
import TextField from "@mui/material/TextField";

interface Props {
  value: string | null;
  onChange: (...event: unknown[]) => void;
}

export const CurrencySelector = ({ value, onChange }: Props) => {
  return (
    <Autocomplete
      value={value}
      options={currencies}
      getOptionLabel={(option) => String(option)}
      isOptionEqualToValue={(option, value) => option === value}
      renderInput={(params) => (
        <TextField 
          {...params} 
          label="Currency" 
          slotProps={{
            input: {
              'aria-label': 'Main Currency'
            }
          }}
        />
      )}
      onChange={(event, newValue) => onChange(newValue)}
    />
  );
};
