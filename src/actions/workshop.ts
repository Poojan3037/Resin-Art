"use server";

import prisma from "@/lib/prisma";
import { WorkshopFormData } from "@/schema/workshop";
import { PaymentStatus } from "../../prisma/generated/prisma/client";
import { revalidatePath, updateTag } from "next/cache";
import { WorkshopActionState } from "@/types/workshop";
import { verifySession } from "./dal";
import { CACHE } from "@/constants/cache";
import { chargeSquarePayment, refundSquarePayment } from "./payment";
import { createBookingSchema } from "@/schema/booking";
import { WorkshopSchema } from "@/schema/workshop";
import { calculateCanadianTax, type TaxLineType } from "@/lib/tax/canada";
import { checkRateLimitByIp, rateLimitMessage } from "@/lib/rate-limit";
import { sendWorkshopConfirmationEmail } from "./email/workshop";

/** Raised when the conditional seat decrement matches zero rows. */
class SeatsUnavailableError extends Error {}

const to12HourTime = (time24: string) => {
  const [hourString, minuteString] = time24.split(":");
  const hour = Number(hourString);
  const period = hour >= 12 ? "PM" : "AM";
  const normalizedHour = hour % 12 || 12;

  return {
    time: `${normalizedHour}:${minuteString}`,
    period,
  };
};

export const getAdminWorkshops = async ({ search }: { search: string }) => {
  const { isUserVerified } = await verifySession({ isAdmin: true });
  if (!isUserVerified) return [];

  const workshops = await prisma.workshop.findMany({
    where: {
      title: {
        contains: search,
      },
    },
  });
  return workshops.map((workshop) => {
    return {
      id: workshop.id,
      title: workshop.title,
      description: workshop.description ?? "",
      date: workshop.date.toISOString(),
      startTime: workshop.startTime,
      startPeriod: workshop.startPeriod,
      endTime: workshop.endTime,
      endPeriod: workshop.endPeriod,
      location: workshop.location,
    province: workshop.province,
      price: workshop.priceCents / 100,
      totalSeats: workshop.totalSeats,
      availableSeats: workshop.availableSeats,
      showToUsers: workshop.showToUsers,
      status: workshop.status,
      lastNotifiedAt: workshop.lastNotifiedAt?.toISOString() ?? null,
      createdAt: workshop.createdAt.toISOString(),
      updatedAt: workshop.updatedAt.toISOString(),
    };
  });
};

export const getWorkShopById = async (id: string) => {
  const { isUserVerified } = await verifySession({ isAdmin: true });
  if (!isUserVerified) return null;

  const workshop = await prisma.workshop.findFirst({ where: { id } });
  if (!workshop) {
    return null;
  }

  return {
    id: workshop.id,
    title: workshop.title,
    description: workshop.description ?? "",
    date: workshop.date.toISOString(),
    startTime: workshop.startTime,
    startPeriod: workshop.startPeriod,
    endTime: workshop.endTime,
    endPeriod: workshop.endPeriod,
    location: workshop.location,
    province: workshop.province,
    price: workshop.priceCents / 100,
    totalSeats: workshop.totalSeats,
    availableSeats: workshop.availableSeats,
    showToUsers: workshop.showToUsers,
    status: workshop.status,
    createdAt: workshop.createdAt.toISOString(),
    updatedAt: workshop.updatedAt.toISOString(),
  };
};

export const addWorkshop = async (
  prevState: WorkshopActionState,
  data: WorkshopFormData,
): Promise<WorkshopActionState> => {
  const { isUserVerified } = await verifySession({ isAdmin: true });
  if (!isUserVerified) return { success: false, message: "Unauthorized." };

  const validated = WorkshopSchema.safeParse(data);
  if (!validated.success) {
    return {
      success: false,
      message: validated.error.issues[0]?.message ?? "Invalid workshop data.",
    };
  }

  try {
    const parsedDate = new Date(data.date);
    if (Number.isNaN(parsedDate.getTime())) {
      return {
        success: false,
        message: "Invalid date. Use a format like May 18, 2026.",
      };
    }

    const normalizedStart = to12HourTime(data.startTime);
    const normalizedEnd = to12HourTime(data.endTime);

    await prisma.workshop.create({
      data: {
        title: data.title,
        description: data.description ?? "",
        date: parsedDate,
        startTime: normalizedStart.time,
        startPeriod: normalizedStart.period,
        endTime: normalizedEnd.time,
        endPeriod: normalizedEnd.period,
        location: data.location,
        province: data.province,
        priceCents: Math.round(data.price * 100),
        totalSeats: data.totalSeats,
        availableSeats: data.totalSeats,
        showToUsers: data.showToUsers,
        status: data.status,
      },
    });

    revalidatePath("/admin/workshops");
    updateTag(CACHE.WORKSHOP);

    return { success: true, message: "Workshop added successfully." };
  } catch (e) {
    console.error(e);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
};

export const editWorkshop = async (
  prevState: WorkshopActionState,
  data: WorkshopFormData & { id: string },
): Promise<WorkshopActionState> => {
  const { isUserVerified } = await verifySession({ isAdmin: true });
  if (!isUserVerified) return { success: false, message: "Unauthorized." };

  const validated = WorkshopSchema.safeParse(data);
  if (!validated.success) {
    return {
      success: false,
      message: validated.error.issues[0]?.message ?? "Invalid workshop data.",
    };
  }

  try {
    const parsedDate = new Date(data.date);
    if (Number.isNaN(parsedDate.getTime())) {
      return {
        success: false,
        message: "Invalid date. Use a format like May 18, 2026.",
      };
    }

    const normalizedStart = to12HourTime(data.startTime);
    const normalizedEnd = to12HourTime(data.endTime);

    const existing = await prisma.workshop.findFirst({
      where: { id: data.id },
    });
    const seatsDelta =
      data.totalSeats - (existing?.totalSeats ?? data.totalSeats);
    const newAvailableSeats = Math.max(
      0,
      (existing?.availableSeats ?? data.totalSeats) + seatsDelta,
    );

    await prisma.workshop.update({
      where: { id: data.id },
      data: {
        title: data.title,
        description: data.description ?? "",
        date: parsedDate,
        startTime: normalizedStart.time,
        startPeriod: normalizedStart.period,
        endTime: normalizedEnd.time,
        endPeriod: normalizedEnd.period,
        location: data.location,
        province: data.province,
        priceCents: Math.round(data.price * 100),
        totalSeats: data.totalSeats,
        availableSeats: newAvailableSeats,
        showToUsers: data.showToUsers,
        status: data.status,
      },
    });

    revalidatePath("/admin/workshops");
    updateTag(CACHE.WORKSHOP);

    return { success: true, message: "Workshop updated successfully." };
  } catch (e) {
    console.error(e);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
};

export const deleteWorkshop = async (id: string) => {
  const { isUserVerified } = await verifySession({ isAdmin: true });
  if (!isUserVerified) return { success: false, message: "Unauthorized." };

  try {
    const isWorkshopExist = await prisma.workshop.findFirst({ where: { id } });

    if (!isWorkshopExist) {
      return {
        success: false,
        message: "Workshop not found.",
      };
    }

    await prisma.workshop.delete({ where: { id } });

    revalidatePath("/admin/workshops");
    updateTag(CACHE.WORKSHOP);

    return {
      success: true,
      message: "Workshop deleted successfully.",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
};

/**
 * Authoritative booking quote. The dialog must show the amount that will
 * actually be charged, including tax, before the customer pays.
 */
export const getWorkshopQuote = async (
  workshopId: string,
  seats: number,
): Promise<{
  subtotalCents: number;
  taxCents: number;
  totalCents: number;
  taxLines: TaxLineType[];
} | null> => {
  if (!Number.isInteger(seats) || seats < 1) return null;

  const workshop = await prisma.workshop.findFirst({
    where: { id: workshopId, showToUsers: true },
    select: { priceCents: true, province: true },
  });
  if (!workshop) return null;

  const subtotalCents = workshop.priceCents * seats;

  try {
    const tax = calculateCanadianTax({
      taxableCents: subtotalCents,
      province: workshop.province,
    });
    return {
      subtotalCents,
      taxCents: tax.totalTaxCents,
      totalCents: subtotalCents + tax.totalTaxCents,
      taxLines: tax.lines,
    };
  } catch {
    // Tax enabled but the workshop has no province set: quote subtotal only
    // rather than showing a total we cannot stand behind.
    return null;
  }
};

export const bookWorkshop = async (
  workshopId: string,
  data: unknown,
  sourceId: unknown,
): Promise<WorkshopActionState> => {
  // Unauthenticated action that charges a card: throttle before touching Square.
  const limit = await checkRateLimitByIp("booking");
  if (!limit.allowed) {
    return { success: false, message: rateLimitMessage(limit.retryAfterSeconds) };
  }

  if (typeof sourceId !== "string" || sourceId.length === 0) {
    return { success: false, message: "Payment token is missing." };
  }

  const workshop = await prisma.workshop.findFirst({ where: { id: workshopId } });

  if (!workshop || !workshop.showToUsers) {
    return { success: false, message: "Workshop not found." };
  }

  if (workshop.status !== "UPCOMING") {
    return {
      success: false,
      message: "This workshop is no longer accepting bookings.",
    };
  }

  // Server-side validation. `createBookingSchema` was previously only wired
  // into the client dialog, so `seats` reached the amount calculation and the
  // seat decrement without ever being checked as a positive integer.
  const parsed = createBookingSchema(workshop.availableSeats).safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Invalid booking details.",
    };
  }
  const booking = parsed.data;

  const locationId = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID;
  if (!locationId) {
    console.error("[booking] NEXT_PUBLIC_SQUARE_LOCATION_ID is not set");
    return { success: false, message: "Payment configuration error." };
  }

  // Place of supply for an in-person service is where the workshop is HELD,
  // not where the attendee lives.
  const subtotalCents = workshop.priceCents * booking.seats;
  let tax;
  try {
    tax = calculateCanadianTax({
      taxableCents: subtotalCents,
      province: workshop.province,
    });
  } catch (error) {
    console.error("[booking] Tax calculation failed:", error);
    return {
      success: false,
      message: "This workshop is not configured for booking yet.",
    };
  }
  const amountCents = subtotalCents + tax.totalTaxCents;

  if (amountCents <= 0) {
    console.error("[booking] Refusing non-positive total:", amountCents);
    return { success: false, message: "Invalid booking total." };
  }

  // --- RESERVE: the conditional decrement is the seat guard.
  let registrationId: string;
  try {
    registrationId = await prisma.$transaction(async (tx) => {
      const { count } = await tx.workshop.updateMany({
        where: {
          id: workshopId,
          status: "UPCOMING",
          showToUsers: true,
          availableSeats: { gte: booking.seats },
        },
        data: { availableSeats: { decrement: booking.seats } },
      });
      if (count === 0) {
        throw new SeatsUnavailableError(
          "Those seats were just taken. Please try again.",
        );
      }

      const registration = await tx.registration.create({
        data: {
          workshopId,
          name: booking.name,
          email: booking.email,
          phone: booking.phone,
          seatsBooked: booking.seats,
          subtotalCents,
          taxCents: tax.totalTaxCents,
          totalCents: amountCents,
          taxProvince: tax.province,
          taxBreakdown: tax.lines,
          paymentStatus: "PENDING",
        },
        select: { id: true },
      });

      return registration.id;
    });
  } catch (error) {
    if (error instanceof SeatsUnavailableError) {
      return { success: false, message: error.message };
    }
    console.error("[booking] Reservation failed:", error);
    return { success: false, message: "Could not book your seat. Please try again." };
  }

  // --- CHARGE, keyed to the reservation so a double submit cannot charge twice.
  const idempotencyKey = `registration:${registrationId}`;
  const payment = await chargeSquarePayment({
    sourceId,
    amountCents,
    locationId,
    idempotencyKey,
  });

  if (!payment.success) {
    await releaseSeatReservation(registrationId, workshopId, booking.seats);
    return {
      success: false,
      message: payment.message ?? "Payment failed. Please try again.",
    };
  }

  // --- CONFIRM. If this fails the card is already charged, so refund.
  try {
    await prisma.$transaction(async (tx) => {
      await tx.workshopPayment.create({
        data: {
          registrationId,
          idempotencyKey,
          squarePaymentId: payment.paymentId ?? null,
          amountCents,
          receiptUrl: payment.receiptUrl ?? null,
          status: "PAID",
        },
      });
      await tx.registration.update({
        where: { id: registrationId },
        data: { paymentStatus: "PAID" },
      });
    });
  } catch (error) {
    console.error(
      "[booking] CRITICAL: charge succeeded but confirm failed for registration",
      registrationId,
      error,
    );
    if (payment.paymentId) {
      await refundSquarePayment({
        paymentId: payment.paymentId,
        amountCents,
        idempotencyKey: `refund:${registrationId}`,
      });
    }
    await releaseSeatReservation(registrationId, workshopId, booking.seats);
    return {
      success: false,
      message:
        "We could not complete your booking and have reversed the charge. Please try again.",
    };
  }

  updateTag(CACHE.WORKSHOP);

  // Fire-and-forget: email failure must never roll back a successful booking
  sendWorkshopConfirmationEmail({
    toName: booking.name,
    toEmail: booking.email,
    seats: booking.seats,
    subtotal: subtotalCents / 100,
    taxAmount: tax.totalTaxCents / 100,
    taxLines: tax.lines,
    totalPrice: amountCents / 100,
    workshop: {
      title: workshop.title,
      date: workshop.date.toISOString(),
      startTime: workshop.startTime,
      startPeriod: workshop.startPeriod,
      endTime: workshop.endTime,
      endPeriod: workshop.endPeriod,
      location: workshop.location,
      price: workshop.priceCents / 100,
    },
    receiptUrl: payment.receiptUrl,
  }).catch((err) => console.error("[email] Workshop confirmation failed:", err));

  return { success: true, message: "Booking successful!" };
};

/** Compensating action for a seat reservation that was never paid for. */
const releaseSeatReservation = async (
  registrationId: string,
  workshopId: string,
  seats: number,
) => {
  try {
    await prisma.$transaction(async (tx) => {
      await tx.workshop.update({
        where: { id: workshopId },
        data: { availableSeats: { increment: seats } },
      });
      await tx.registration.update({
        where: { id: registrationId },
        data: { paymentStatus: "FAILED" },
      });
    });
  } catch (error) {
    console.error(
      "[booking] CRITICAL: could not release seats for registration",
      registrationId,
      error,
    );
  }
};

export const getWorkshops = async () => {
  try {
    const workshops = await prisma.workshop.findMany({
      where: {
        showToUsers: true,
        status: "UPCOMING",
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return workshops.map((workshop) => {
      return {
        id: workshop.id,
        title: workshop.title,
        description: workshop.description ?? "",
        date: workshop.date.toISOString(),
        startTime: workshop.startTime,
        startPeriod: workshop.startPeriod,
        endTime: workshop.endTime,
        endPeriod: workshop.endPeriod,
        location: workshop.location,
    province: workshop.province,
        price: workshop.priceCents / 100,
        totalSeats: workshop.totalSeats,
        availableSeats: workshop.availableSeats,
        showToUsers: workshop.showToUsers,
        status: workshop.status,
        lastNotifiedAt: workshop.lastNotifiedAt?.toISOString() ?? null,
        createdAt: workshop.createdAt.toISOString(),
        updatedAt: workshop.updatedAt.toISOString(),
      };
    });
  } catch {
    return [];
  }
};

export const getRegistrations = async ({
  search = "",
  workshopId = "",
  paymentStatus = "",
}: {
  search?: string;
  workshopId?: string;
  paymentStatus?: string;
}) => {
  const { isUserVerified } = await verifySession({ isAdmin: true });
  if (!isUserVerified) return [];

  const registrations = await prisma.registration.findMany({
    where: {
      ...(workshopId ? { workshopId } : {}),
      ...(paymentStatus
        ? { paymentStatus: paymentStatus as PaymentStatus }
        : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
              { phone: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    include: {
      workshop: {
        select: { id: true, title: true },
      },
    },
    orderBy: { registeredAt: "desc" },
  });

  return registrations.map((r) => ({
    id: r.id,
    workshopId: r.workshopId,
    workshopTitle: r.workshop.title,
    name: r.name,
    email: r.email,
    phone: r.phone,
    seatsBooked: r.seatsBooked,
    paymentStatus: r.paymentStatus,
    registeredAt: r.registeredAt.toISOString(),
  }));
};
