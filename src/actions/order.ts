"use server";

import prisma from "@/lib/prisma";
import { CheckoutSchema, type CheckoutFormDataType } from "@/schema/checkout";
import type { CartItemType } from "@/types/product";
import type { OrderActionStateType, OrderWithItemsType } from "@/types/order";
import { verifySession } from "./dal";
import { OrderStatus } from "../../prisma/generated/prisma/client";
import { revalidatePath, updateTag } from "next/cache";
import { CACHE } from "@/constants/cache";
import { chargeOrderPayment } from "./payment";

type CheckoutPayloadType = CheckoutFormDataType & {
  items: CartItemType[];
  sourceId: string;
};

const toOrderWithItems = (order: {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  subtotal: { toString(): string };
  shippingCost: { toString(): string };
  totalAmount: { toString(): string };
  status: OrderStatus;
  customerNotes: string | null;
  adminNotes: string | null;
  createdAt: Date;
  updatedAt: Date;
  items: Array<{
    id: string;
    orderId: string;
    productId: string;
    productTitle: string;
    artistName: string;
    quantity: number;
    unitPrice: { toString(): string };
    lineTotal: { toString(): string };
    createdAt: Date;
  }>;
  payment: {
    id: string;
    squarePaymentId: string | null;
    amountCents: number;
    currency: string;
    status: string;
    receiptUrl: string | null;
    paidAt: Date;
  } | null;
}): OrderWithItemsType => {
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    customerPhone: order.customerPhone,
    addressLine1: order.addressLine1,
    addressLine2: order.addressLine2,
    city: order.city,
    state: order.state,
    postalCode: order.postalCode,
    country: order.country,
    subtotal: order.subtotal.toString(),
    shippingCost: order.shippingCost.toString(),
    totalAmount: order.totalAmount.toString(),
    status: order.status,
    customerNotes: order.customerNotes,
    adminNotes: order.adminNotes,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
    items: order.items.map((item) => ({
      id: item.id,
      orderId: item.orderId,
      productId: item.productId,
      productTitle: item.productTitle,
      artistName: item.artistName,
      quantity: item.quantity,
      unitPrice: item.unitPrice.toString(),
      lineTotal: item.lineTotal.toString(),
      createdAt: item.createdAt.toISOString(),
    })),
    payment: order.payment
      ? {
          id: order.payment.id,
          squarePaymentId: order.payment.squarePaymentId,
          amountCents: order.payment.amountCents,
          currency: order.payment.currency,
          status: order.payment.status,
          receiptUrl: order.payment.receiptUrl,
          paidAt: order.payment.paidAt.toISOString(),
        }
      : null,
  };
};

const getNextOrderNumber = async () => {
  const year = new Date().getFullYear();
  const prefix = `ART-${year}-`;

  const latestOrder = await prisma.order.findFirst({
    where: {
      orderNumber: {
        startsWith: prefix,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      orderNumber: true,
    },
  });

  const currentSequence = latestOrder
    ? Number(latestOrder.orderNumber.split("-").at(-1) ?? "0")
    : 0;
  const nextSequence = currentSequence + 1;

  return `${prefix}${String(nextSequence).padStart(5, "0")}`;
};

export const getAdminOrders = async ({
  search = "",
  status,
}: {
  search?: string;
  status?: OrderStatus;
} = {}) => {
  const { isUserVerified } = await verifySession({ isAdmin: true });
  if (!isUserVerified) return [];

  const orders = await prisma.order.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(search
        ? {
            OR: [
              {
                orderNumber: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
              {
                customerName: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
              {
                customerEmail: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
            ],
          }
        : {}),
    },
    include: {
      items: {
        orderBy: { createdAt: "asc" },
      },
      payment: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return orders.map(toOrderWithItems);
};

const getOrderByIdDirect = async (id: string) => {
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        orderBy: { createdAt: "asc" },
      },
      payment: true,
    },
  });

  if (!order) return null;

  return toOrderWithItems(order);
};

export const getOrderById = async (id: string) => {
  const { isUserVerified } = await verifySession({ isAdmin: true });
  if (!isUserVerified) return null;

  return getOrderByIdDirect(id);
};

export const getOrderByEmailAndNumber = async ({
  email,
  orderNumber,
}: {
  email: string;
  orderNumber: string;
}) => {
  const order = await prisma.order.findFirst({
    where: {
      customerEmail: email,
      orderNumber,
    },
    include: {
      items: {
        orderBy: { createdAt: "asc" },
      },
      payment: true,
    },
  });

  if (!order) return null;

  return toOrderWithItems(order);
};

export const createOrder = async (
  prevState: OrderActionStateType,
  payload: CheckoutPayloadType,
): Promise<OrderActionStateType> => {
  const parsed = CheckoutSchema.safeParse(payload);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return {
      success: false,
      message: issue?.message ?? "Invalid checkout data.",
    };
  }

  if (!Array.isArray(payload.items) || payload.items.length === 0) {
    return { success: false, message: "Your cart is empty." };
  }

  const locationId = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID;
  if (!locationId) {
    return { success: false, message: "Payment configuration error." };
  }

  try {
    const orderNumber = await getNextOrderNumber();

    // --- Pre-flight: fetch products and compute totals outside the transaction
    const productIds = payload.items.map((item) => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: {
        id: true,
        title: true,
        artistName: true,
        quantity: true,
        price: true,
        discountPrice: true,
        status: true,
      },
    });

    if (products.length !== productIds.length) {
      return {
        success: false,
        message: "One or more products no longer exist.",
      };
    }

    const productMap = new Map(products.map((p) => [p.id, p]));

    const lineItems = payload.items.map((item) => {
      const product = productMap.get(item.productId);
      if (!product) throw new Error("Product missing during checkout.");
      if (product.status !== "PUBLISHED")
        throw new Error(`${product.title} is currently unavailable.`);
      if (item.quantity > product.quantity)
        throw new Error(
          `${product.title} has only ${product.quantity} item${
            product.quantity === 1 ? "" : "s"
          } left.`,
        );
      const unitPrice = Number(product.discountPrice ?? product.price);
      const lineTotal = unitPrice * item.quantity;
      return {
        productId: product.id,
        productTitle: product.title,
        artistName: product.artistName,
        quantity: item.quantity,
        unitPrice,
        lineTotal,
      };
    });

    const subtotal = lineItems.reduce((sum, item) => sum + item.lineTotal, 0);
    const shippingCost = 0;
    const totalAmount = subtotal + shippingCost;
    const amountCents = Math.round(totalAmount * 100);

    // --- Charge Square before any DB writes
    const charge = await chargeOrderPayment({
      sourceId: payload.sourceId,
      amountCents,
      locationId,
    });
    if (!charge.success) {
      return { success: false, message: charge.message ?? "Payment failed." };
    }

    // --- Persist order + payment atomically
    await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          orderNumber,
          customerName: payload.customerName,
          customerEmail: payload.customerEmail,
          customerPhone: payload.customerPhone || null,
          addressLine1: payload.addressLine1,
          addressLine2: payload.addressLine2 || null,
          city: payload.city,
          state: payload.state,
          postalCode: payload.postalCode,
          country: payload.country,
          subtotal,
          shippingCost,
          totalAmount,
          customerNotes: payload.customerNotes || null,
          status: "PENDING",
        },
      });

      await tx.orderItem.createMany({
        data: lineItems.map((item) => ({
          orderId: order.id,
          productId: item.productId,
          productTitle: item.productTitle,
          artistName: item.artistName,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          lineTotal: item.lineTotal,
        })),
      });

      for (const item of lineItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: { quantity: { decrement: item.quantity } },
        });
      }

      await tx.orderPayment.create({
        data: {
          orderId: order.id,
          squarePaymentId: charge.paymentId ?? null,
          amountCents,
          receiptUrl: charge.receiptUrl ?? null,
          status: "PAID",
        },
      });
    });

    // Mark any now-empty products as out of stock.
    await prisma.product.updateMany({
      where: {
        quantity: { lte: 0 },
        status: "PUBLISHED",
      },
      data: {
        status: "OUT_OF_STOCK",
      },
    });

    updateTag(CACHE.PRODUCT);

    return {
      success: true,
      message: "Order placed successfully.",
      orderNumber,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Checkout failed.";
    return {
      success: false,
      message,
    };
  }
};

export const updateOrderStatus = async (id: string, status: OrderStatus) => {
  const { isUserVerified } = await verifySession({ isAdmin: true });
  if (!isUserVerified) return { success: false, message: "Unauthorized." };

  try {
    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) {
      return { success: false, message: "Order not found." };
    }

    await prisma.order.update({
      where: { id },
      data: { status },
    });

    revalidatePath("/admin/orders");
    return {
      success: true,
      message: "Order status updated.",
    };
  } catch {
    return {
      success: false,
      message: "Failed to update order status.",
    };
  }
};
