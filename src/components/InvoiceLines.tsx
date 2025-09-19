"use client";

import { useCallback } from "react";
import {
  Button,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
  Divider,
} from "@mui/material";

import type { InvoiceLine } from "@/types/types";
import { currencies } from "@/constants/currencies";
import DeleteIcon from "@mui/icons-material/Delete";
import CreateIcon from "@mui/icons-material/Create";

type Props = {
  invoiceLines: InvoiceLine[];
  setInvoiceLines: React.Dispatch<React.SetStateAction<InvoiceLine[]>>;
};

const newLine: InvoiceLine = {
  description: "",
  currency: "EUR",
  amount: 0,
};

export function InvoiceLines({ invoiceLines, setInvoiceLines }: Props) {
  const addLine = useCallback(() => {
    setInvoiceLines((prev) => [...prev, newLine]);
  }, [setInvoiceLines]);

  const updateLine = useCallback(
    (idx: number, newValue: Partial<InvoiceLine>) => {
      setInvoiceLines((prev: InvoiceLine[]) =>
        prev.map((line, i) => (idx === i ? { ...line, ...newValue } : line))
      );
    },
    [setInvoiceLines]
  );

  const removeLine = useCallback(
    (idx: number) => {
      setInvoiceLines((prev) => prev.filter((_, i) => i !== idx));
    },
    [setInvoiceLines]
  );

  return (
    <Stack spacing={2}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography variant="h6">Invoice Lines</Typography>
        <Divider sx={{ flex: 1 }} />
        <Button
          variant="contained"
          onClick={addLine}
          size="small"
          startIcon={<CreateIcon />}
        >
          Add Invoice Line
        </Button>
      </Stack>

      {invoiceLines.map((line, idx) => (
        <Stack
          key={idx}
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems={{ xs: "stretch", sm: "center" }}
        >
          <TextField
            label="Description"
            fullWidth
            value={line.description}
            onChange={(e) => updateLine(idx, { description: e.target.value })}
          />

          <TextField
            select
            label="Currency"
            sx={{ minWidth: 140 }}
            value={line.currency}
            onChange={(e) => updateLine(idx, { currency: e.target.value })}
          >
            {currencies.map((code) => (
              <MenuItem key={code} value={code}>
                {code}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Amount"
            type="number"
            sx={{ minWidth: 160 }}
            value={line.amount.toString()}
            onChange={(e) =>
              updateLine(idx, { amount: Number(e.target.value) })
            }
          />

          <IconButton
            aria-label="remove"
            color="error"
            onClick={() => removeLine(idx)}
            edge="end"
          >
            <DeleteIcon />
          </IconButton>
        </Stack>
      ))}
    </Stack>
  );
}
