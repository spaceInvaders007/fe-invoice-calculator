import { IFormInput } from "@/types/types";
import { Alert, Typography } from "@mui/material";
import { FieldErrors } from "react-hook-form";

interface ValidationSummaryProps {
  errors: FieldErrors<IFormInput>;
  isVisible: boolean;
}

export const ValidationSummary = ({ errors, isVisible }: ValidationSummaryProps) => {
  if (!isVisible) return null;

  return (
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
  );
};
