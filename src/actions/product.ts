"use server";

import { deleteCloudinaryAssetByUrl } from "@/lib/cloudinary";
import prisma from "@/lib/prisma";
import { ProductSchema, type ProductFormDataType } from "@/schema/product";
import type {
  ProductActionStateType,
  ProductWithImagesType,
} from "@/types/product";
import { verifySession } from "./dal";
import { ProductStatus } from "../../prisma/generated/prisma/client";
import { revalidatePath, updateTag } from "next/cache";
import { CACHE } from "@/constants/cache";

const slugify = (input: string) => {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

const toProductWithImages = (product: {
  id: string;
  title: string;
  slug: string;
  description: string;
  artistName: string;
  price: { toString(): string };
  discountPrice: { toString(): string } | null;
  quantity: number;
  isFeatured: boolean;
  status: ProductStatus;
  lastNotifiedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  images: Array<{
    id: string;
    productId: string;
    url: string;
    altText: string | null;
    isPrimary: boolean;
    sortOrder: number;
    createdAt: Date;
  }>;
}): ProductWithImagesType => {
  return {
    id: product.id,
    title: product.title,
    slug: product.slug,
    description: product.description,
    artistName: product.artistName,
    price: product.price.toString(),
    discountPrice: product.discountPrice
      ? product.discountPrice.toString()
      : null,
    quantity: product.quantity,
    isFeatured: product.isFeatured,
    status: product.status,
    lastNotifiedAt: product.lastNotifiedAt?.toISOString() ?? null,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
    images: product.images
      .slice()
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((image) => ({
        id: image.id,
        productId: image.productId,
        url: image.url,
        altText: image.altText,
        isPrimary: image.isPrimary,
        sortOrder: image.sortOrder,
        createdAt: image.createdAt.toISOString(),
      })),
  };
};

export const getProducts = async ({
  search = "",
  status,
}: {
  search?: string;
  status?: ProductStatus;
} = {}) => {
  const where = {
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" as const } },
            {
              artistName: { contains: search, mode: "insensitive" as const },
            },
            {
              description: { contains: search, mode: "insensitive" as const },
            },
          ],
        }
      : {}),
    ...(status ? { status } : {}),
  };

  const products = await prisma.product.findMany({
    where,
    orderBy: [{ createdAt: "desc" }],
    include: {
      images: {
        orderBy: [
          { isPrimary: "desc" },
          { sortOrder: "asc" },
          { createdAt: "asc" },
        ],
      },
    },
  });

  return products.map(toProductWithImages);
};

export const getProductBySlug = async (slug: string) => {
  const product = await prisma.product.findFirst({
    where: {
      slug,
      status: "PUBLISHED",
    },
    include: {
      images: {
        orderBy: [
          { isPrimary: "desc" },
          { sortOrder: "asc" },
          { createdAt: "asc" },
        ],
      },
    },
  });

  if (!product) return null;

  return toProductWithImages(product);
};

export const createProduct = async (
  prevState: ProductActionStateType,
  rawData: ProductFormDataType,
): Promise<ProductActionStateType> => {
  const { isUserVerified } = await verifySession({ isAdmin: true });
  if (!isUserVerified) return { success: false, message: "Unauthorized." };

  const parsed = ProductSchema.safeParse(rawData);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return {
      success: false,
      message: issue?.message ?? "Invalid product data.",
    };
  }

  try {
    const productData = parsed.data;
    const baseSlug = slugify(productData.title);

    let uniqueSlug = baseSlug;
    let sequence = 1;

    // Ensure slug uniqueness for product URLs.
    while (await prisma.product.findUnique({ where: { slug: uniqueSlug } })) {
      sequence += 1;
      uniqueSlug = `${baseSlug}-${sequence}`;
    }

    const product = await prisma.product.create({
      data: {
        title: productData.title,
        slug: uniqueSlug,
        description: productData.description,
        artistName: productData.artistName,
        price: productData.price,
        discountPrice: productData.discountPrice || null,
        quantity: productData.quantity,
        isFeatured: productData.isFeatured,
        status: productData.status,
        images: {
          createMany: {
            data: productData.images.map((image, index) => ({
              url: image.url,
              altText: image.altText?.trim() || null,
              isPrimary: image.isPrimary ?? index === 0,
              sortOrder: image.sortOrder ?? index,
            })),
          },
        },
      },
    });

    revalidatePath("/admin/products");
    updateTag(CACHE.PRODUCT);

    return {
      success: true,
      message: "Product created successfully.",
      productId: product.id,
    };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to create product." };
  }
};

export const updateProduct = async (
  prevState: ProductActionStateType,
  data: ProductFormDataType & { id: string },
): Promise<ProductActionStateType> => {
  const { isUserVerified } = await verifySession({ isAdmin: true });
  if (!isUserVerified) return { success: false, message: "Unauthorized." };

  const { id, ...rawData } = data;
  const parsed = ProductSchema.safeParse(rawData);

  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return {
      success: false,
      message: issue?.message ?? "Invalid product data.",
    };
  }

  try {
    const productData = parsed.data;

    await prisma.$transaction(async (tx) => {
      const existingImages = await tx.productImage.findMany({
        where: { productId: id },
        select: { url: true },
      });

      const incomingUrls = new Set(
        productData.images.map((image) => image.url),
      );
      const removedImages = existingImages.filter(
        (image) => !incomingUrls.has(image.url),
      );

      await tx.product.update({
        where: { id },
        data: {
          title: productData.title,
          description: productData.description,
          artistName: productData.artistName,
          price: productData.price,
          discountPrice: productData.discountPrice || null,
          quantity: productData.quantity,
          isFeatured: productData.isFeatured,
          status: productData.status,
        },
      });

      await tx.productImage.deleteMany({ where: { productId: id } });
      await tx.productImage.createMany({
        data: productData.images.map((image, index) => ({
          productId: id,
          url: image.url,
          altText: image.altText?.trim() || null,
          isPrimary: image.isPrimary ?? index === 0,
          sortOrder: image.sortOrder ?? index,
        })),
      });

      await Promise.all(
        removedImages.map((image) =>
          deleteCloudinaryAssetByUrl(image.url).catch(() => null),
        ),
      );
    });

    revalidatePath("/admin/products");
    updateTag(CACHE.PRODUCT);

    return {
      success: true,
      message: "Product updated successfully.",
      productId: id,
    };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to update product." };
  }
};

export const deleteProduct = async (id: string) => {
  const { isUserVerified } = await verifySession({ isAdmin: true });
  if (!isUserVerified) return { success: false, message: "Unauthorized." };

  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        images: {
          select: {
            url: true,
          },
        },
      },
    });

    if (!product) {
      return { success: false, message: "Product not found." };
    }

    await prisma.product.delete({ where: { id } });

    await Promise.all(
      product.images.map((image) =>
        deleteCloudinaryAssetByUrl(image.url).catch(() => null),
      ),
    );

    revalidatePath("/admin/products");
    updateTag(CACHE.PRODUCT);

    return {
      success: true,
      message: "Product deleted successfully.",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Failed to delete product.",
    };
  }
};
