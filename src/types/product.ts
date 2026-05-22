import { ProductStatus } from "../../prisma/generated/prisma/client";

export type ProductImageType = {
  id: string;
  productId: string;
  url: string;
  altText: string | null;
  isPrimary: boolean;
  sortOrder: number;
  createdAt: string;
};

export type ProductType = {
  id: string;
  title: string;
  slug: string;
  description: string;
  artistName: string;
  price: string;
  discountPrice: string | null;
  quantity: number;
  isFeatured: boolean;
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
};

export type ProductWithImagesType = ProductType & {
  images: ProductImageType[];
};

export type ProductFormImageType = {
  url: string;
  altText?: string;
  isPrimary?: boolean;
  sortOrder?: number;
};

export type ProductActionStateType = {
  success: boolean;
  message: string;
  productId?: string;
} | null;

export type CartItemType = {
  productId: string;
  slug: string;
  title: string;
  artistName: string;
  imageUrl: string;
  unitPrice: number;
  quantity: number;
  availableStock: number;
};
