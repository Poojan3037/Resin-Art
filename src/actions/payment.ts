import "server-only";

import { SquareClient, SquareEnvironment } from "square";

const accessToken = process.env.SQUARE_ACCESS_TOKEN;

if (!accessToken) {
  throw new Error("SQUARE_ACCESS_TOKEN environment variable is missing");
}

const environment =
  process.env.SQUARE_ENVIRONMENT === "production"
    ? SquareEnvironment.Production
    : SquareEnvironment.Sandbox;

export const squareClient = new SquareClient({
  environment,
  token: accessToken,
});

export type ChargeResultType = {
  success: boolean;
  message?: string;
  paymentId?: string;
  receiptUrl?: string;
};

/**
 * Charges a tokenized card via Square.
 *
 * NOTE: this module is `server-only`, NOT `"use server"`. Exporting a charge
 * helper that accepts a caller-supplied `amountCents` from a `"use server"`
 * module would publish it as a network-addressable Server Action, letting a
 * client mint arbitrary charges with no order record. It must only ever be
 * reached from other server modules.
 *
 * `idempotencyKey` must be derived from the reserved order/registration id so
 * that a retry or a double-submitted form cannot charge twice.
 */
export const chargeSquarePayment = async ({
  sourceId,
  amountCents,
  locationId,
  idempotencyKey,
}: {
  sourceId: string;
  amountCents: number;
  locationId: string;
  idempotencyKey: string;
}): Promise<ChargeResultType> => {
  if (!Number.isInteger(amountCents) || amountCents <= 0) {
    console.error("[payment] Refusing non-positive amount:", amountCents);
    return { success: false, message: "Invalid payment amount." };
  }

  try {
    const { payment } = await squareClient.payments.create({
      sourceId,
      idempotencyKey,
      amountMoney: {
        amount: BigInt(amountCents),
        currency: "CAD",
      },
      locationId,
    });

    if (payment?.status === "COMPLETED") {
      return {
        success: true,
        paymentId: payment.id ?? undefined,
        receiptUrl: payment.receiptUrl ?? undefined,
      };
    }

    console.error("[payment] Non-completed status:", payment?.status);
    return {
      success: false,
      message: "Payment was not completed. Please try again.",
    };
  } catch (error: unknown) {
    // Log the provider detail server-side; never return it to the client.
    const apiError = error as { errors?: Array<{ detail?: string; code?: string }> };
    console.error(
      "[payment] Square charge failed:",
      apiError?.errors ?? error,
    );
    return {
      success: false,
      message: "Payment failed. Please check your card details and try again.",
    };
  }
};

/**
 * Refunds a payment in full. Used as the compensating action when the DB write
 * that confirms an order fails after the card has already been charged.
 */
export const refundSquarePayment = async ({
  paymentId,
  amountCents,
  idempotencyKey,
}: {
  paymentId: string;
  amountCents: number;
  idempotencyKey: string;
}): Promise<{ success: boolean }> => {
  try {
    const { refund } = await squareClient.refunds.refundPayment({
      paymentId,
      idempotencyKey,
      amountMoney: { amount: BigInt(amountCents), currency: "CAD" },
      reason: "Order could not be completed",
    });
    const ok = refund?.status === "COMPLETED" || refund?.status === "PENDING";
    if (!ok) console.error("[payment] Refund not accepted:", refund?.status);
    return { success: ok };
  } catch (error) {
    console.error("[payment] CRITICAL: refund failed for", paymentId, error);
    return { success: false };
  }
};
