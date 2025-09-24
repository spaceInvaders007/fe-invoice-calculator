import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { formInputSchema } from "@/schemas/invoice";
import { IFormInput } from "@/types/types";

export const useInvoiceForm = () => {
  return useForm<IFormInput>({
    resolver: yupResolver(formInputSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      invoice: {
        currency: "",
        date: null,
        lines: [
          {
            description: "",
            currency: "EUR",
            amount: 0,
          },
        ],
      },
    },
  });
};