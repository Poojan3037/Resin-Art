import { z } from "zod";
import { ImageSchema, RequiredBannerImageSchema } from "@/schema/image";

const decimalRegex = /^\d+(\.\d{1,2})?$/;

export const ProductImageSchema = ImageSchema;

export const ProductSchema = z
  .object({
    title: z.string().trim().min(1, "Title is required"),
    description: z.string().trim().min(1, "Description is required"),
    artistName: z.string().trim().min(1, "Artist name is required"),
    price: z
      .string()
      .trim()
      .regex(decimalRegex, "Price must be a valid amount")
      .refine((value) => Number(value) >= 0, "Price cannot be negative"),
    discountPrice: z
      .string()
      .trim()
      .optional()
      .refine(
        (value) => !value || decimalRegex.test(value),
        "Discount price must be a valid amount",
      ),
    quantity: z
      .number({ error: "Stock must be a number" })
      .int("Stock must be a whole number")
      .min(0, "Stock cannot be negative"),
    isFeatured: z.boolean(),
    status: z.enum(["DRAFT", "PUBLISHED", "OUT_OF_STOCK", "ARCHIVED"]),
    bannerImage: RequiredBannerImageSchema,
    galleryImages: z
      .array(ImageSchema)
      .max(9, "Up to 9 gallery images are allowed"),
  })
  .refine(
    (data) => {
      if (!data.discountPrice) return true;
      return Number(data.discountPrice) <= Number(data.price);
    },
    {
      message: "Discount price must be less than or equal to price",
      path: ["discountPrice"],
    },
  );

export type ProductFormDataType = z.infer<typeof ProductSchema>;
