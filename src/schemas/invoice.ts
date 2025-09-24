import { Dayjs } from "dayjs";
import * as yup from "yup";
import dayjs from "dayjs";

export const invoiceLineSchema = yup.object({
  description: yup.string().required("Description is required"),
  currency: yup.string().required("Currency is required"),
  amount: yup
    .number()
    .positive("Amount must be a positive number")
    .min(0.01, "Amount must be at least 0.01")
    .required("Amount is required")
    .typeError("Amount must be a valid number"),
});

export const invoiceSchema = yup
  .object({
    currency: yup.string().required("Base currency is required"),
    date: yup
      .mixed<Dayjs>()
      .required("Invoice date is required")
      .nullable()
      .test("is-valid-date", "Please select a valid date", (value) => {
        if (!value) return false;
        return dayjs.isDayjs(value) && value.isValid();
      })
      .test("not-future", "Invoice date cannot be in the future", (value) => {
        if (!value) return true;
        const today = dayjs().endOf('day');
        return dayjs(value).isBefore(today) || dayjs(value).isSame(today, 'day');
      }),
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