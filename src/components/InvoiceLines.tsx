"use client";

import {
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  MenuItem,
  Stack,
  TextField,
  Typography,
  Alert,
  Tooltip,
  Chip,
} from "@mui/material";

import { currencies } from "@/constants/currencies";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/Info";
import { Control, Controller, useFieldArray, FieldErrors } from "react-hook-form";
import { IFormInput } from "@/types/types";

type Props = {
  control: Control<IFormInput>;
  errors: FieldErrors<IFormInput>;
};

export function InvoiceLines({ control, errors }: Props) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "invoice.lines",
  });

  const lineErrors = errors.invoice?.lines;
  const hasLineErrors = Array.isArray(lineErrors) && lineErrors.some(error => error);

  return (
    <Stack spacing={2}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="h5">Invoice Lines</Typography>
        <Chip 
          label={`${fields.length} line${fields.length !== 1 ? 's' : ''}`} 
          size="small" 
          color="primary" 
          variant="outlined"
        />
        <Tooltip title="Add individual line items with their own currency and amount. The system will convert all lines to your base currency.">
          <InfoIcon color="action" fontSize="small" />
        </Tooltip>
      </Box>

      {hasLineErrors && (
        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography variant="subtitle2">
            Please fix the issues in the invoice lines below
          </Typography>
        </Alert>
      )}

      <List sx={{ padding: 0 }}>
        {fields.map((item, index) => {
          const fieldError = Array.isArray(lineErrors) ? lineErrors[index] : null;
          const hasError = !!fieldError;
          
          return (
            <ListItem 
              key={item.id} 
              sx={{ 
                padding: 0, 
                marginBottom: 3,
                border: hasError ? '1px solid #f44336' : '1px solid #e0e0e0',
                borderRadius: 1,
                p: 2,
                backgroundColor: hasError ? 'rgba(244, 67, 54, 0.02)' : 'transparent'
              }}
            >
              <Stack width="100%" spacing={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Line {index + 1}
                  </Typography>
                  <IconButton
                    color="error"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                    size="small"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Controller
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        label="Description *"
                        placeholder="e.g., Intel Core i9 Processor"
                        fullWidth
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message || "Describe the item or service"}
                      />
                    )}
                    name={`invoice.lines.${index}.description`}
                    control={control}
                  />

                  <Controller
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        select
                        label="Currency *"
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message || "Currency for this line"}
                        sx={{ minWidth: { xs: '100%', sm: '150px' } }}
                      >
                        {currencies.map((code) => (
                          <MenuItem key={code} value={code}>
                            {code}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                    name={`invoice.lines.${index}.currency`}
                    control={control}
                  />

                  <Controller
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        label="Amount *"
                        type="number"
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message || "Enter positive amount"}
                        sx={{ minWidth: { xs: '100%', sm: '120px' } }}
                        onFocus={(e) => {
                          if (e.target.value === "0") {
                            e.target.select();
                          }
                        }}
                        onChange={(e) => {
                          const value = e.target.value === '' ? 0 : parseFloat(e.target.value);
                          field.onChange(isNaN(value) ? 0 : value);
                        }}
                        onBlur={field.onBlur}
                      />
                    )}
                    name={`invoice.lines.${index}.amount`}
                    control={control}
                  />
                </Stack>
              </Stack>
            </ListItem>
          );
        })}
      </List>

      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <Button
          variant="contained"
          onClick={() => append({ description: "", currency: "EUR", amount: 0 })}
          size="medium"
          startIcon={<AddIcon />}
          sx={{ minWidth: "180px" }}
        >
          Add Invoice Line
        </Button>
        
        {fields.length === 1 && (
          <Typography variant="caption" color="text.secondary">
            At least one line is required
          </Typography>
        )}
      </Box>
    </Stack>
  );
}