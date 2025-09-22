import { Dayjs } from "dayjs";
import * as yup from "yup";

export const invoiceLineSchema = yup.object({
  description: yup.string().required("Description is required"),
  currency: yup.string().required("Currency is required"),
  amount: yup.number().positive().required("Amount is required"),
});

const invoiceSchema = yup
  .object({
    currency: yup.string().required("Currency is required"),
    date: yup.mixed<Dayjs>().required("Date is required").nullable(),
    lines: yup
      .array()
      .of(invoiceLineSchema)
      .required()
      .min(1, "At least one invoice line is required"),
  })
  .required();

export const formInputSchema = yup.object({
  invoice: invoiceSchema,
});
