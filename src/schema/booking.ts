import { z } from "zod";

export const createBookingSchema = (availableSeats: number) =>
  z.object({
    name: z.string().trim().min(1, "Full name is required"),
    email: z.email("Enter a valid email address"),
    phone: z
      .string()
      .trim()
      .regex(
        /^\+?1?[\s.-]?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
        "Enter a valid Canadian phone number",
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
