import { z } from "zod";
import { CANADIAN_PROVINCES } from "@/lib/tax/canada";

// HH:MM in 24-hour format (00:00 - 23:59) for native time inputs.
const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

const toMinutes = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

const normalizeDateOnly = (value: string) => {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return null;
  return date;
};

const isTodayOrFuture = (value: string) => {
  const selected = normalizeDateOnly(value);
  if (!selected) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return selected >= today;
};

export const WorkshopSchema = z
  .object({
    title: z.string().trim().min(1, "Title is required"),
    description: z.string().trim().optional(),
    date: z
      .string()
      .regex(dateRegex, "Select a valid date")
      .refine(isTodayOrFuture, "Date cannot be in the past"),
    startTime: z.string().regex(timeRegex, "Select a valid start time"),
    endTime: z.string().regex(timeRegex, "Select a valid end time"),
    location: z.string(),
    // Place of supply for an in-person service: the province where it is held.
    province: z.enum(CANADIAN_PROVINCES, {
      error: "Select the province where this workshop is held",
    }),
    price: z
      .number({ error: "Price must be a number" })
      .refine((value) => !Number.isNaN(value), "Price is required")
      .min(0, "Price cannot be negative"),
    totalSeats: z
      .number({ error: "Must be a number" })
      .int("Must be a whole number")
      .min(0, "Seats cannot be negative"),
    showToUsers: z.boolean(),
    status: z.enum(["UPCOMING", "ONGOING", "COMPLETED", "CANCELLED"]),
  })
  .refine((data) => toMinutes(data.endTime) > toMinutes(data.startTime), {
    message: "End time must be after start time",
    path: ["endTime"],
  });

export type WorkshopFormData = z.infer<typeof WorkshopSchema>;
