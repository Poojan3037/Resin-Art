import { NextResponse } from "next/server";
import { WebhooksHelper } from "square";
import prisma from "@/lib/prisma";
import { PaymentStatus } from "../../../../../prisma/generated/prisma/client";

/**
 * Square webhook receiver.
 *
 * Without this, payment state was only ever whatever the synchronous
 * `payments.create` call returned — refunds, disputes and out-of-band status
 * changes never reached the database.
 *
 * The raw body is read as text because the HMAC is computed over the exact
 * bytes Square sent; parsing first and re-serializing would break it.
 */

const signatureKey = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY;
const notificationUrl = process.env.SQUARE_WEBHOOK_NOTIFICATION_URL;

type SquareEventType = {
  type?: string;
  data?: {
    object?: {
      payment?: { id?: string; status?: string; refunded_money?: unknown };
      refund?: { id?: string; payment_id?: string; status?: string };
      dispute?: { id?: string; payment_id?: string; state?: string };
    };
  };
};

/** Applies a status to whichever payment table owns this Square payment id. */
const updatePaymentStatus = async (
  squarePaymentId: string,
  status: PaymentStatus,
) => {
  const [orderResult, workshopResult] = await Promise.all([
    prisma.orderPayment.updateMany({
      where: { squarePaymentId },
      data: { status },
    }),
    prisma.workshopPayment.updateMany({
      where: { squarePaymentId },
      data: { status },
    }),
  ]);

  if (workshopResult.count > 0) {
    // Keep the denormalised registration status in step.
    const payment = await prisma.workshopPayment.findFirst({
      where: { squarePaymentId },
      select: { registrationId: true },
    });
    if (payment) {
      await prisma.registration.update({
        where: { id: payment.registrationId },
        data: { paymentStatus: status },
      });
    }
  }

  return orderResult.count + workshopResult.count;
};

export async function POST(request: Request) {
  if (!signatureKey || !notificationUrl) {
    console.error(
      "[webhook] SQUARE_WEBHOOK_SIGNATURE_KEY / SQUARE_WEBHOOK_NOTIFICATION_URL not configured",
    );
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  const rawBody = await request.text();
  const signatureHeader = request.headers.get("x-square-hmacsha256-signature");

  if (!signatureHeader) {
    return NextResponse.json({ error: "Missing signature" }, { status: 401 });
  }

  // Never act on an unverified body.
  let isValid = false;
  try {
    isValid = await WebhooksHelper.verifySignature({
      requestBody: rawBody,
      signatureHeader,
      signatureKey,
      notificationUrl,
    });
  } catch (error) {
    console.error("[webhook] Signature verification threw:", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  if (!isValid) {
    console.warn("[webhook] Rejected event with invalid signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: SquareEventType;
  try {
    event = JSON.parse(rawBody) as SquareEventType;
  } catch {
    return NextResponse.json({ error: "Malformed body" }, { status: 400 });
  }

  try {
    // Handlers key off squarePaymentId (unique on both payment tables), so
    // redelivery of the same event is a no-op rather than a double-apply.
    switch (event.type) {
      case "payment.updated": {
        const payment = event.data?.object?.payment;
        if (payment?.id && payment.status === "COMPLETED") {
          await updatePaymentStatus(payment.id, "PAID");
        } else if (
          payment?.id &&
          (payment.status === "FAILED" || payment.status === "CANCELED")
        ) {
          await updatePaymentStatus(payment.id, "FAILED");
        }
        break;
      }

      case "refund.created":
      case "refund.updated": {
        const refund = event.data?.object?.refund;
        if (refund?.payment_id && refund.status === "COMPLETED") {
          await updatePaymentStatus(refund.payment_id, "REFUNDED");
        }
        break;
      }

      case "dispute.created":
      case "dispute.state.updated": {
        const dispute = event.data?.object?.dispute;
        console.warn(
          "[webhook] Dispute received:",
          dispute?.id,
          dispute?.state,
          "payment:",
          dispute?.payment_id,
        );
        break;
      }

      default:
        // Unhandled event types are acknowledged so Square stops retrying.
        break;
    }
  } catch (error) {
    // Return 500 so Square retries a genuine processing failure.
    console.error("[webhook] Handler failed for", event.type, error);
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
