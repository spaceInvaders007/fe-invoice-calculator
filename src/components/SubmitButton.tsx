import { Box, Button, FormHelperText } from "@mui/material";

interface SubmitButtonProps {
  isLoading: boolean;
  isValid: boolean;
  isDirty: boolean;
}

export const SubmitButton = ({ isLoading, isValid, isDirty }: SubmitButtonProps) => {
  return (
    <Box sx={{ pt: 2 }}>
      <Button
        type="submit"
        variant="contained"
        color="success"
        disabled={isLoading}
        size="large"
        sx={{ minWidth: "200px" }}
      >
        {isLoading ? "Calculating..." : "Calculate Total"}
      </Button>
      {!isValid && isDirty && (
        <FormHelperText sx={{ mt: 1 }}>
          Please complete all required fields to calculate the total
        </FormHelperText>
      )}
    </Box>
  );
};