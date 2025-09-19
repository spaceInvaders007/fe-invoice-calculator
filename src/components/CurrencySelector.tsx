"use client";

import { Dispatch, SetStateAction } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import { currencies } from "@/constants/currencies";
import TextField from "@mui/material/TextField";

interface Props {
  baseCurrency: string | null;
  setBaseCurrency: Dispatch<SetStateAction<string | null>>;
}

export const CurrencySelector = ({ baseCurrency, setBaseCurrency }: Props) => {
  return (
    <Autocomplete
      value={baseCurrency}
      options={currencies}
      renderInput={(params) => <TextField {...params} label="Currency" />}
      onChange={(event: unknown, newValue: string | null) =>
        setBaseCurrency(newValue)
      }
    />
  );
};
