import { z } from "zod";

/** Where the visitor signed up from, so the admin can see which empty state converts. */
export const SUBSCRIBER_SOURCES = [
  "workshops",
  "shop",
  "home",
  "videos",
] as const;

export const SubscribeSchema = z.object({
  // Lowercased so the unique constraint on `email` treats casing variants as
  // one person rather than letting the same address in twice.
  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email("Enter a valid email address")),
  source: z.enum(SUBSCRIBER_SOURCES).optional(),
});

export type SubscribeFormValues = z.infer<typeof SubscribeSchema>;
