"use server";

import prisma from "@/lib/prisma";
import { CheckoutPayloadSchema } from "@/schema/checkout";
import type { OrderActionStateType, OrderWithItemsType } from "@/types/order";
import { verifySession, verifyUserSession } from "./dal";
import { OrderStatus, Prisma } from "../../prisma/generated/prisma/client";
import { revalidatePath, updateTag } from "next/cache";
import { CACHE } from "@/constants/cache";
import { chargeSquarePayment, refundSquarePayment } from "./payment";
import { calculateCanadianTax, type TaxLineType } from "@/lib/tax/canada";
import { centsToDecimalString, toCents } from "@/lib/money";
import { checkRateLimitByIp, rateLimitMessage } from "@/lib/rate-limit";
import {
  sendOrderConfirmationEmail,
  sendOrderStatusEmail,
} from "./email/order";

/** Raised when a conditional stock decrement matches zero rows. */
class OutOfStockError extends Error {}

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
  taxAmount: { toString(): string };
  totalAmount: { toString(): string };
  taxProvince: string | null;
  taxBreakdown: unknown;
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
    taxAmount: order.taxAmount.toString(),
    totalAmount: order.totalAmount.toString(),
    taxProvince: order.taxProvince ?? null,
    taxBreakdown: (order.taxBreakdown as TaxLineType[] | null) ?? null,
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

/**
 * Allocates the next order number atomically from a counter row.
 *
 * Must be called INSIDE the reservation transaction. The previous
 * read-newest-then-increment could hand the same number to two concurrent
 * checkouts, and it read the most recent row rather than the highest sequence.
 */
const allocateOrderNumber = async (
  tx: Prisma.TransactionClient,
): Promise<string> => {
  const year = new Date().getFullYear();
  const counter = await tx.orderCounter.upsert({
    where: { year },
    update: { last: { increment: 1 } },
    create: { year, last: 1 },
    select: { last: true },
  });
  return `ART-${year}-${String(counter.last).padStart(5, "0")}`;
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

const MY_ORDERS_PAGE_SIZE = 10;

/**
 * Orders for the signed-in customer. `userId` always comes from the
 * session — the function accepts no id argument, so a caller cannot ask
 * for anyone else's orders.
 */
export const getMyOrders = async (
  page = 1,
): Promise<{ orders: OrderWithItemsType[]; totalCount: number }> => {
  const { isUserVerified, userId } = await verifyUserSession();
  if (!isUserVerified) return { orders: [], totalCount: 0 };

  const [orders, totalCount] = await Promise.all([
    prisma.order.findMany({
      where: { userId },
      include: {
        items: { orderBy: { createdAt: "asc" } },
        payment: true,
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * MY_ORDERS_PAGE_SIZE,
      take: MY_ORDERS_PAGE_SIZE,
    }),
    prisma.order.count({ where: { userId } }),
  ]);

  return { orders: orders.map(toOrderWithItems), totalCount };
};

export const getOrderByEmailAndNumber = async ({
  email,
  orderNumber,
}: {
  email: string;
  orderNumber: string;
}) => {
  // Order numbers are sequential, so this lookup is enumerable with only a
  // known email address. Throttle it.
  const limit = await checkRateLimitByIp("orderLookup");
  if (!limit.allowed) return null;

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

/**
 * Authoritative pre-payment quote. The checkout UI must display what the
 * server will actually charge, so the totals shown come from the same
 * database prices and tax engine that `createOrder` uses.
 */
export const getCheckoutQuote = async (input: {
  items: Array<{ productId: string; quantity: number }>;
  province: string | null;
}): Promise<{
  subtotalCents: number;
  shippingCents: number;
  taxCents: number;
  totalCents: number;
  taxLines: TaxLineType[];
  taxEnabled: boolean;
}> => {
  const empty = {
    subtotalCents: 0,
    shippingCents: 0,
    taxCents: 0,
    totalCents: 0,
    taxLines: [] as TaxLineType[],
    taxEnabled: false,
  };

  const items = (input.items ?? []).filter(
    (item) =>
      typeof item?.productId === "string" &&
      Number.isInteger(item?.quantity) &&
      item.quantity > 0,
  );
  if (items.length === 0) return empty;

  const products = await prisma.product.findMany({
    where: { id: { in: [...new Set(items.map((i) => i.productId))] } },
    select: { id: true, price: true, discountPrice: true, status: true },
  });
  const productMap = new Map(products.map((product) => [product.id, product]));

  let subtotalCents = 0;
  for (const item of items) {
    const product = productMap.get(item.productId);
    if (!product || product.status !== "PUBLISHED") continue;
    subtotalCents +=
      toCents(product.discountPrice ?? product.price) * item.quantity;
  }

  const shippingCents = 0;

  // No province selected yet, or tax disabled: quote without tax.
  let taxCents = 0;
  let taxLines: TaxLineType[] = [];
  let taxEnabled = false;
  try {
    const tax = calculateCanadianTax({
      taxableCents: subtotalCents,
      province: input.province,
    });
    taxCents = tax.totalTaxCents;
    taxLines = tax.lines;
    taxEnabled = tax.enabled;
  } catch {
    // Unknown/unset province while tax is enabled — quote subtotal only.
  }

  return {
    subtotalCents,
    shippingCents,
    taxCents,
    totalCents: subtotalCents + shippingCents + taxCents,
    taxLines,
    taxEnabled,
  };
};

export const createOrder = async (
  prevState: OrderActionStateType,
  payload: unknown,
): Promise<OrderActionStateType> => {
  const { isUserVerified, userId } = await verifyUserSession();
  if (!isUserVerified) {
    return { success: false, message: "Please sign in to check out." };
  }

  const parsed = CheckoutPayloadSchema.safeParse(payload);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return {
      success: false,
      message: issue?.message ?? "Invalid checkout data.",
    };
  }
  const data = parsed.data;

  // Authenticated action that still charges a card: throttle before touching Square.
  const limit = await checkRateLimitByIp("checkout");
  if (!limit.allowed) {
    return {
      success: false,
      message: rateLimitMessage(limit.retryAfterSeconds),
    };
  }

  const locationId = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID;
  if (!locationId) {
    console.error("[checkout] NEXT_PUBLIC_SQUARE_LOCATION_ID is not set");
    return { success: false, message: "Payment configuration error." };
  }

  // ---------------------------------------------------------------------
  // 1. Price the cart from the database. The client's prices are ignored.
  // ---------------------------------------------------------------------
  const productIds = [...new Set(data.items.map((item) => item.productId))];
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
    return { success: false, message: "One or more products no longer exist." };
  }

  const productMap = new Map(products.map((product) => [product.id, product]));

  const lineItems: Array<{
    productId: string;
    productTitle: string;
    artistName: string;
    quantity: number;
    unitPriceCents: number;
    lineTotalCents: number;
  }> = [];

  for (const item of data.items) {
    const product = productMap.get(item.productId);
    if (!product) {
      return {
        success: false,
        message: "One or more products no longer exist.",
      };
    }
    if (product.status !== "PUBLISHED") {
      return {
        success: false,
        message: `${product.title} is currently unavailable.`,
      };
    }
    const unitPriceCents = toCents(product.discountPrice ?? product.price);
    lineItems.push({
      productId: product.id,
      productTitle: product.title,
      artistName: product.artistName,
      quantity: item.quantity,
      unitPriceCents,
      lineTotalCents: unitPriceCents * item.quantity,
    });
  }

  // ---------------------------------------------------------------------
  // 2. Totals, in integer cents throughout.
  // ---------------------------------------------------------------------
  const subtotalCents = lineItems.reduce(
    (sum, item) => sum + item.lineTotalCents,
    0,
  );
  const shippingCents = 0;

  let tax;
  try {
    tax = calculateCanadianTax({
      taxableCents: subtotalCents,
      province: data.state,
    });
  } catch (error) {
    console.error("[checkout] Tax calculation failed:", error);
    return {
      success: false,
      message: "We could not calculate tax for your address.",
    };
  }

  const amountCents = subtotalCents + shippingCents + tax.totalTaxCents;

  if (amountCents <= 0) {
    console.error("[checkout] Refusing non-positive total:", amountCents);
    return { success: false, message: "Invalid order total." };
  }

  // ---------------------------------------------------------------------
  // 3. RESERVE — decrement stock and create the order before charging.
  //    The conditional update IS the stock guard: a `gte` filter that matches
  //    zero rows means someone else took the last unit, which closes the
  //    check-then-decrement race.
  // ---------------------------------------------------------------------
  let reserved: { orderId: string; orderNumber: string };
  try {
    reserved = await prisma.$transaction(async (tx) => {
      for (const item of lineItems) {
        const { count } = await tx.product.updateMany({
          where: {
            id: item.productId,
            status: "PUBLISHED",
            quantity: { gte: item.quantity },
          },
          data: { quantity: { decrement: item.quantity } },
        });
        if (count === 0) {
          const current = await tx.product.findUnique({
            where: { id: item.productId },
            select: { quantity: true },
          });
          throw new OutOfStockError(
            `${item.productTitle} has only ${current?.quantity ?? 0} left.`,
          );
        }
      }

      const orderNumber = await allocateOrderNumber(tx);

      const order = await tx.order.create({
        data: {
          orderNumber,
          userId,
          customerName: data.customerName,
          customerEmail: data.customerEmail,
          customerPhone: data.customerPhone || null,
          addressLine1: data.addressLine1,
          addressLine2: data.addressLine2 || null,
          city: data.city,
          state: data.state,
          postalCode: data.postalCode,
          country: data.country,
          subtotal: centsToDecimalString(subtotalCents),
          shippingCost: centsToDecimalString(shippingCents),
          taxAmount: centsToDecimalString(tax.totalTaxCents),
          totalAmount: centsToDecimalString(amountCents),
          taxProvince: tax.province,
          taxBreakdown: tax.lines,
          customerNotes: data.customerNotes || null,
          status: "PENDING",
        },
        select: { id: true, orderNumber: true },
      });

      await tx.orderItem.createMany({
        data: lineItems.map((item) => ({
          orderId: order.id,
          productId: item.productId,
          productTitle: item.productTitle,
          artistName: item.artistName,
          quantity: item.quantity,
          unitPrice: centsToDecimalString(item.unitPriceCents),
          lineTotal: centsToDecimalString(item.lineTotalCents),
        })),
      });

      return { orderId: order.id, orderNumber: order.orderNumber };
    });
  } catch (error) {
    if (error instanceof OutOfStockError) {
      return { success: false, message: error.message };
    }
    console.error("[checkout] Reservation failed:", error);
    return {
      success: false,
      message: "Could not place your order. Please try again.",
    };
  }

  // ---------------------------------------------------------------------
  // 4. CHARGE — keyed to the reserved order so a double submit cannot
  //    charge twice.
  // ---------------------------------------------------------------------
  const idempotencyKey = `order:${reserved.orderId}`;
  const charge = await chargeSquarePayment({
    sourceId: data.sourceId,
    amountCents,
    locationId,
    idempotencyKey,
  });

  if (!charge.success) {
    await releaseOrderReservation(reserved.orderId, lineItems);
    return { success: false, message: charge.message ?? "Payment failed." };
  }

  // ---------------------------------------------------------------------
  // 5. CONFIRM — record the payment. If this fails the customer has already
  //    been charged, so refund rather than leaving money unaccounted for.
  // ---------------------------------------------------------------------
  try {
    await prisma.orderPayment.create({
      data: {
        orderId: reserved.orderId,
        idempotencyKey,
        squarePaymentId: charge.paymentId ?? null,
        amountCents,
        receiptUrl: charge.receiptUrl ?? null,
        status: "PAID",
      },
    });
  } catch (error) {
    console.error(
      "[checkout] CRITICAL: charge succeeded but confirm failed for order",
      reserved.orderId,
      error,
    );
    if (charge.paymentId) {
      await refundSquarePayment({
        paymentId: charge.paymentId,
        amountCents,
        idempotencyKey: `refund:${reserved.orderId}`,
      });
    }
    await releaseOrderReservation(reserved.orderId, lineItems);
    return {
      success: false,
      message:
        "We could not complete your order and have reversed the charge. Please try again.",
    };
  }

  // Mark any now-empty products as out of stock.
  await prisma.product.updateMany({
    where: { quantity: { lte: 0 }, status: "PUBLISHED" },
    data: { status: "OUT_OF_STOCK" },
  });

  updateTag(CACHE.PRODUCT);

  // Fire-and-forget: email failure must never roll back a successful order
  sendOrderConfirmationEmail({
    toName: data.customerName,
    toEmail: data.customerEmail,
    orderNumber: reserved.orderNumber,
    orderId: reserved.orderId,
    items: lineItems.map((item) => ({
      productTitle: item.productTitle,
      artistName: item.artistName,
      quantity: item.quantity,
      unitPrice: centsToDecimalString(item.unitPriceCents),
      lineTotal: centsToDecimalString(item.lineTotalCents),
    })),
    subtotal: centsToDecimalString(subtotalCents),
    shippingCost: centsToDecimalString(shippingCents),
    taxAmount: centsToDecimalString(tax.totalTaxCents),
    taxLines: tax.lines,
    totalAmount: centsToDecimalString(amountCents),
    address: {
      addressLine1: data.addressLine1,
      addressLine2: data.addressLine2 || null,
      city: data.city,
      state: data.state,
      postalCode: data.postalCode,
      country: data.country,
    },
    receiptUrl: charge.receiptUrl ?? null,
  }).catch((err) => console.error("[email] Order confirmation failed:", err));

  return {
    success: true,
    message: "Order placed successfully.",
    orderNumber: reserved.orderNumber,
  };
};

/**
 * Compensating action for a reservation that never got paid: puts the stock
 * back and marks the order FAILED so it is not mistaken for a real order.
 */
const releaseOrderReservation = async (
  orderId: string,
  lineItems: Array<{ productId: string; quantity: number }>,
) => {
  try {
    await prisma.$transaction(async (tx) => {
      for (const item of lineItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: { quantity: { increment: item.quantity } },
        });
      }
      await tx.order.update({
        where: { id: orderId },
        data: { status: "FAILED" },
      });
    });
  } catch (error) {
    console.error(
      "[checkout] CRITICAL: could not release reservation for order",
      orderId,
      error,
    );
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

    // Fire-and-forget: email failure must never block the admin status update
    sendOrderStatusEmail({
      toName: order.customerName,
      toEmail: order.customerEmail,
      orderNumber: order.orderNumber,
      orderId: id,
      status,
    }).catch((err) =>
      console.error("[email] Order status update email failed:", err),
    );

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
