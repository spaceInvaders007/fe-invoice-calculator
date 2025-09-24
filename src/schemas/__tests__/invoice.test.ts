import { formInputSchema, invoiceSchema, invoiceLineSchema } from '../invoice';
import dayjs from 'dayjs';

describe('Invoice Schemas', () => {
  describe('invoiceLineSchema', () => {
    it('should validate a valid invoice line', async () => {
      const validLine = {
        description: 'Test item',
        currency: 'USD',
        amount: 100.50,
      };

      await expect(invoiceLineSchema.validate(validLine)).resolves.toEqual(validLine);
    });

    it('should reject missing description', async () => {
      const invalidLine = {
        currency: 'USD',
        amount: 100,
      };

      await expect(invoiceLineSchema.validate(invalidLine)).rejects.toThrow('Description is required');
    });

    it('should reject missing currency', async () => {
      const invalidLine = {
        description: 'Test item',
        amount: 100,
      };

      await expect(invoiceLineSchema.validate(invalidLine)).rejects.toThrow('Currency is required');
    });

    it('should reject negative amount', async () => {
      const invalidLine = {
        description: 'Test item',
        currency: 'USD',
        amount: -10,
      };

      await expect(invoiceLineSchema.validate(invalidLine)).rejects.toThrow('Amount must be at least 0.01');
    });

    it('should reject zero amount', async () => {
      const invalidLine = {
        description: 'Test item',
        currency: 'USD',
        amount: 0,
      };

      await expect(invoiceLineSchema.validate(invalidLine)).rejects.toThrow('Amount must be at least 0.01');
    });

    it('should reject non-numeric amount', async () => {
      const invalidLine = {
        description: 'Test item',
        currency: 'USD',
        amount: 'not a number',
      };

      await expect(invoiceLineSchema.validate(invalidLine)).rejects.toThrow('Amount must be a valid number');
    });
  });

  describe('invoiceSchema', () => {
    it('should validate a valid invoice', async () => {
      const validInvoice = {
        currency: 'USD',
        date: dayjs('2024-01-01'),
        lines: [
          {
            description: 'Test item 1',
            currency: 'USD',
            amount: 100,
          },
          {
            description: 'Test item 2',
            currency: 'EUR',
            amount: 50,
          },
        ],
      };

      await expect(invoiceSchema.validate(validInvoice)).resolves.toEqual(validInvoice);
    });

    it('should reject missing currency', async () => {
      const invalidInvoice = {
        date: dayjs('2024-01-01'),
        lines: [{ description: 'Test', currency: 'USD', amount: 100 }],
      };

      await expect(invoiceSchema.validate(invalidInvoice)).rejects.toThrow('Base currency is required');
    });

    it('should reject missing date', async () => {
      const invalidInvoice = {
        currency: 'USD',
        lines: [{ description: 'Test', currency: 'USD', amount: 100 }],
      };

      await expect(invoiceSchema.validate(invalidInvoice)).rejects.toThrow('Invoice date is required');
    });

    it('should reject empty lines array', async () => {
      const invalidInvoice = {
        currency: 'USD',
        date: dayjs('2024-01-01'),
        lines: [],
      };

      await expect(invoiceSchema.validate(invalidInvoice)).rejects.toThrow('At least one invoice line is required');
    });

    it('should reject invalid lines', async () => {
      const invalidInvoice = {
        currency: 'USD',
        date: dayjs('2024-01-01'),
        lines: [
          {
            description: '',
            currency: 'USD',
            amount: 100,
          },
        ],
      };

      await expect(invoiceSchema.validate(invalidInvoice)).rejects.toThrow('Description is required');
    });
  });

  describe('formInputSchema', () => {
    it('should validate a valid form input', async () => {
      const validFormInput = {
        invoice: {
          currency: 'USD',
          date: dayjs('2024-01-01'),
          lines: [
            {
              description: 'Test item',
              currency: 'USD',
              amount: 100,
            },
          ],
        },
      };

      await expect(formInputSchema.validate(validFormInput)).resolves.toEqual(validFormInput);
    });

    it('should reject missing invoice', async () => {
      const invalidFormInput = {};

      await expect(formInputSchema.validate(invalidFormInput)).rejects.toThrow('invoice.lines is a required field');
    });
  });
});