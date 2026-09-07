import { z } from "zod";

const imageShape = {
  url: z
    .string()
    .trim()
    .refine((value) => {
      try {
        return Boolean(new URL(value));
      } catch {
        return false;
      }
    }, "Provide a valid image URL"),
  altText: z.string().trim().optional(),
  isPrimary: z.boolean().optional(),
  sortOrder: z.number().int().min(0).optional(),
};

export const ImageSchema = z.object(imageShape);

/** Same shape as ImageSchema, with a friendly message when the field is missing entirely. */
export const RequiredBannerImageSchema = z.object(imageShape, {
  error: "A banner image is required",
});

export type ImageFormDataType = z.infer<typeof ImageSchema>;
