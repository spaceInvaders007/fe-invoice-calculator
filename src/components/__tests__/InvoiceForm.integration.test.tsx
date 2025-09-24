import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { InvoiceForm } from "../InvoiceForm";
import dayjs, { Dayjs } from "dayjs";
import { ReactNode } from "react";

jest.mock("@mui/x-date-pickers", () => ({
  DatePicker: ({
    value,
    onChange,
    slotProps,
  }: {
    value: Dayjs | null;
    onChange: (value: Dayjs | null) => void;
    slotProps?: {
      textField?: {
        inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
      };
    };
  }) => (
    <input
      data-testid="date-picker"
      value={value ? value.format("MM/DD/YYYY") : ""}
      onChange={(e) => {
        const date = dayjs(e.target.value, "MM/DD/YYYY");
        if (date.isValid()) {
          onChange(date);
        }
      }}
      {...slotProps?.textField?.inputProps}
    />
  ),
  LocalizationProvider: ({ children }: { children: ReactNode }) => children,
}));

jest.mock("@mui/material/Autocomplete", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function MockAutocomplete({ value, onChange, renderInput }: any) {
    return (
      <div>
        {renderInput({
          inputProps: {
            value: value || "",
            onChange: (e: { target: { value: string } }) => {
              const newValue = e.target.value;
              onChange(null, newValue);
            },
          },
        })}
      </div>
    );
  };
});

global.fetch = jest.fn();

const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

describe("InvoiceForm Integration", () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it("submits form and displays result", async () => {
    const user = userEvent.setup();

    mockFetch.mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve("1234.56"),
    } as Response);

    render(<InvoiceForm />);

    const dateInput = screen.getByTestId("date-picker");
    await user.type(dateInput, "01/01/2024");

    const currencyInput = screen.getByTestId("currency-selector");
    await user.type(currencyInput, "USD");

    const descriptionInput = screen.getByLabelText("Description");
    await user.type(descriptionInput, "Test item");

    const amountInput = screen.getByLabelText("Amount");
    await user.type(amountInput, "100");

    await new Promise((resolve) => setTimeout(resolve, 100));

    await waitFor(() => {
      const submitButton = screen.getByText("Calculate Total");
      expect(submitButton).not.toBeDisabled();
    });

    const submitButton = screen.getByText("Calculate Total");
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Total in USD")).toBeInTheDocument();
      expect(screen.getByText("1234.56")).toBeInTheDocument();
    });

    expect(mockFetch).toHaveBeenCalledWith(
      "http://localhost:8080/invoice/total",
      expect.objectContaining({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: expect.stringContaining('"currency":"USD"'),
      })
    );
  });

  it("displays error when API call fails", async () => {
    const user = userEvent.setup();

    mockFetch.mockResolvedValueOnce({
      ok: false,
      text: () => Promise.resolve("Error: Invalid date"),
    } as Response);

    render(<InvoiceForm />);

    const dateInput = screen.getByTestId("date-picker");
    await user.type(dateInput, "01/01/2024");

    const currencyInput = screen.getByTestId("currency-selector");
    await user.type(currencyInput, "USD");

    const descriptionInput = screen.getByLabelText("Description");
    await user.type(descriptionInput, "Test item");

    const amountInput = screen.getByLabelText("Amount");
    await user.type(amountInput, "100");

    await new Promise((resolve) => setTimeout(resolve, 100));

    await waitFor(() => {
      const submitButton = screen.getByText("Calculate Total");
      expect(submitButton).not.toBeDisabled();
    });

    const submitButton = screen.getByText("Calculate Total");
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Error: Invalid date")).toBeInTheDocument();
    });
  });

  it("disables submit button when form is invalid", async () => {
    render(<InvoiceForm />);

    const submitButton = screen.getByText("Calculate Total");
    expect(submitButton).toBeDisabled();
  });

  it("shows loading state during API call", async () => {
    const user = userEvent.setup();

    mockFetch.mockImplementationOnce(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                ok: true,
                text: () => Promise.resolve("1234.56"),
              } as Response),
            100
          )
        )
    );

    render(<InvoiceForm />);

    const dateInput = screen.getByTestId("date-picker");
    await user.type(dateInput, "01/01/2024");

    const currencyInput = screen.getByTestId("currency-selector");
    await user.type(currencyInput, "USD");

    const descriptionInput = screen.getByLabelText("Description");
    await user.type(descriptionInput, "Test item");

    const amountInput = screen.getByLabelText("Amount");
    await user.type(amountInput, "100");

    await new Promise((resolve) => setTimeout(resolve, 100));

    await waitFor(() => {
      const submitButton = screen.getByText("Calculate Total");
      expect(submitButton).not.toBeDisabled();
    });

    const submitButton = screen.getByText("Calculate Total");
    await user.click(submitButton);

    expect(screen.getByText("Calculating...")).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });
});
