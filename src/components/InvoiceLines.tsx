"use client";

import {
  Button,
  IconButton,
  List,
  ListItem,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";

import { currencies } from "@/constants/currencies";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import { Control, Controller, useFieldArray } from "react-hook-form";
import { IFormInput } from "./InvoiceForm";

type Props = {
  control: Control<IFormInput>;
};

export function InvoiceLines({ control }: Props) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "invoice.lines",
  });

  return (
    <Stack spacing={2}>
      <List>
        {fields.map((item, index) => (
          <ListItem key={index} sx={{ padding: 0, marginBottom: 2 }}>
            <Stack
              width="100%"
              direction="row"
              spacing={4}
              justifyContent="space-between"
            >
              <Controller
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Description"
                    fullWidth
                    sx={{ width: "60%" }}
                  />
                )}
                name={`invoice.lines.${index}.description`}
                control={control}
              />
              <Controller
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Currency"
                    sx={{ width: "150px" }}
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
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Amount"
                    type="number"
                    onFocus={(e) => {
                      if (e.target.value === "0") {
                        e.target.select();
                      }
                    }}
                  />
                )}
                name={`invoice.lines.${index}.amount`}
                control={control}
              />
              <IconButton
                aria-label="remove"
                color="error"
                onClick={() => remove(index)}
                edge="end"
              >
                <DeleteIcon />
              </IconButton>
            </Stack>
          </ListItem>
        ))}
      </List>

      <Button
        variant="contained"
        onClick={() => append({ description: "", currency: "EUR", amount: 0 })}
        size="small"
        startIcon={<CreateIcon />}
      >
        Add Invoice Line
      </Button>
    </Stack>
  );
}
