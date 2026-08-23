import { z } from "zod";
import { CANADIAN_PROVINCES } from "@/lib/tax/canada";

// Canadian postal code: A1A 1A1 or A1A-1A1 or A1A1A1
// First letter cannot be D, F, I, O, Q, or U (not used by Canada Post)
// Third/fifth letter cannot be D, F, I, O, Q, or U
const canadianPostalCodeRegex =
  /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV][ -]?\d[ABCEGHJ-NPRSTV]\d$/i;

// Canadian phone numbers:
// - Country code: +1 or 1 (optional)
// - Area code: 3 digits (200–999, excludes 0xx/1xx)
// - Exchange code: 3 digits (200–999, excludes 0xx/1xx)  ← NANP rule
// - Subscriber number: 4 digits
// Separators: spaces, dashes, dots, or parentheses around area code
export const canadianPhoneRegex =
  /^(?:\+?1[-.\s]?)?\(?([2-9]\d{2})\)?[-.\s]?([2-9]\d{2})[-.\s]?(\d{4})$/;

export const CheckoutSchema = z.object({
  customerName: z.string().trim().min(2, "Name must be at least 2 characters"),
  customerEmail: z.email({ error: "Provide a valid email" }),
  customerPhone: z
    .string()
    .trim()
    .optional()
    .refine(
      (value) => !value || canadianPhoneRegex.test(value),
      "Enter a valid Canadian phone number (e.g. +1 416-555-0123)",
    ),
  addressLine1: z.string().trim().min(3, "Address line 1 is required"),
  addressLine2: z.string().trim().optional(),
  city: z.string().trim().min(2, "City is required"),
  state: z.enum(CANADIAN_PROVINCES, {
    error: "Select a valid Canadian province or territory",
  }),
  postalCode: z
    .string()
    .trim()
    .regex(
      canadianPostalCodeRegex,
      "Enter a valid Canadian postal code (e.g. A1A 1A1)",
    ),
  country: z.literal("CA"),
  customerNotes: z.string().trim().optional(),
});

/**
 * Cart items as submitted by the client. `unitPrice` is deliberately NOT
 * accepted here — the server re-reads every price from the database.
 */
export const CheckoutItemSchema = z.object({
  productId: z.string().min(1, "Invalid product"),
  quantity: z
    .number()
    .int("Quantity must be a whole number")
    .min(1, "Quantity must be at least 1")
    .max(100, "Quantity is too large"),
});

export const CheckoutPayloadSchema = CheckoutSchema.extend({
  items: z
    .array(CheckoutItemSchema)
    .min(1, "Your cart is empty.")
    .max(50, "Too many items in cart."),
  sourceId: z.string().min(1, "Payment token is missing."),
});

export type CheckoutPayloadType = z.infer<typeof CheckoutPayloadSchema>;

export type CheckoutFormDataType = z.infer<typeof CheckoutSchema>;
