import { Box, Typography } from "@mui/material";

export const InvoiceFormHeader = () => {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="h2">Invoice Calculator</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        Fill in the invoice details below. All fields marked with * are required.
      </Typography>
    </Box>
  );
};