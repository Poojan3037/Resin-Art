"use server";

import { SquareClient, SquareEnvironment } from "square";

const accessToken = process.env.SQUARE_ACCESS_TOKEN;

if (!accessToken) {
  throw new Error("SQUARE_ACCESS_TOKEN environment variable is missing");
}

const squareClient = new SquareClient({
  environment: SquareEnvironment.Sandbox,
  token: accessToken,
});

export const chargeWorkshopPayment = async ({
  sourceId,
  amountCents,
  locationId,
}: {
  sourceId: string;
  amountCents: number;
  locationId: string;
}): Promise<{
  success: boolean;
  message?: string;
  paymentId?: string;
  receiptUrl?: string;
}> => {
  try {
    const { payment } = await squareClient.payments.create({
      sourceId,
      idempotencyKey: crypto.randomUUID(),
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

    return {
      success: false,
      message: "Payment was not completed. Please try again.",
    };
  } catch (error: unknown) {
    const apiError = error as { errors?: Array<{ detail?: string }> };
    const detail = apiError?.errors?.[0]?.detail;
    return {
      success: false,
      message: detail ?? "Payment failed. Please check your card details.",
    };
  }
};

export const chargeOrderPayment = async ({
  sourceId,
  amountCents,
  locationId,
}: {
  sourceId: string;
  amountCents: number;
  locationId: string;
}): Promise<{
  success: boolean;
  message?: string;
  paymentId?: string;
  receiptUrl?: string;
}> => {
  try {
    const { payment } = await squareClient.payments.create({
      sourceId,
      idempotencyKey: crypto.randomUUID(),
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

    return {
      success: false,
      message: "Payment was not completed. Please try again.",
    };
  } catch (error: unknown) {
    const apiError = error as { errors?: Array<{ detail?: string }> };
    const detail = apiError?.errors?.[0]?.detail;
    return {
      success: false,
      message: detail ?? "Payment failed. Please check your card details.",
    };
  }
};
