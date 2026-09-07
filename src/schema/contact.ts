import { z } from "zod";

export const ContactSchema = z.object({
  name: z.string().trim().min(2, "Full name is required"),
  email: z.email("Enter a valid email address"),
  message: z.string().trim().min(10, "Message must be at least 10 characters"),
  // Interpolated into the outgoing email subject, so it must be validated and
  // stripped of CR/LF rather than passed through raw.
  subject: z
    .string()
    .trim()
    .max(150, "Subject is too long")
    .regex(/^[^\r\n]*$/, "Subject cannot contain line breaks")
    .optional(),
});

export type ContactFormValues = z.infer<typeof ContactSchema>;
