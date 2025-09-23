"use client";
import { Alert, Paper, Typography } from "@mui/material";

interface InvoiceResultsProps {
  total: string | null;
  baseCurrency: string;
  error: string | null;
}

export const InvoiceResults = ({
  total,
  baseCurrency,
  error,
}: InvoiceResultsProps) => {
  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  if (total) {
    return (
      <Paper
        elevation={12}
        sx={{
          p: 3,
          bgcolor: "success.light",
          color: "success.contrastText",
          display: "flex",
          gap: 2,
          mt: 2,
          width: "fit-content",
        }}
      >
        <Typography component="div" gutterBottom>
          Total in {baseCurrency}
        </Typography>
        <Typography component="div" fontWeight="bold">
          {total}
        </Typography>
      </Paper>
    );
  }

  return null;
};
