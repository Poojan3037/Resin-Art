import { z } from "zod";
import { canadianPhoneRegex } from "./checkout";

export const createBookingSchema = (availableSeats: number) =>
  z.object({
    name: z.string().trim().min(1, "Full name is required"),
    email: z.email("Enter a valid email address"),
    phone: z
      .string()
      .trim()
      .refine(
        (value) => !value || canadianPhoneRegex.test(value),
        "Enter a valid Canadian phone number (e.g. +1 416-555-0123)",
      ),
    seats: z
      .number({ error: "Select number of seats" })
      .int()
      .min(1, "At least 1 seat is required")
      .max(
        availableSeats,
        `Only ${availableSeats} seat${availableSeats === 1 ? "" : "s"} available`,
      ),
  });

export type BookingFormValues = z.infer<ReturnType<typeof createBookingSchema>>;
