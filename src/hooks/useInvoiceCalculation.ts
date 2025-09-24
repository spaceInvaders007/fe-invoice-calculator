import { IFormInput } from "@/types/types";
import { useState } from "react";

export const useInvoiceCalculation = () => {
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const calculateTotal = async (data: IFormInput) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const payload = {
        invoice: {
          ...data.invoice,
          date: data.invoice.date!.format("YYYY-MM-DD"),
        },
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_QUARKUS_API_URL}/invoice/total`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const responseText = await response.text();

      if (!response.ok) {
        throw new Error(responseText);
      }

      setResult(responseText);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    result,
    error,
    isLoading,
    calculateTotal,
  };
};