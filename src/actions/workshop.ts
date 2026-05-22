"use server";

import prisma from "@/lib/prisma";
import { WorkshopFormData } from "@/schema/workshop";
import { PaymentStatus } from "../../prisma/generated/prisma/client";
import { revalidatePath, updateTag } from "next/cache";
import { WorkshopActionState } from "@/types/workshop";
import { verifySession } from "./dal";
import { CACHE } from "@/constants/cache";
import { chargeWorkshopPayment } from "./payment";

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
      price: Number(workshop.price),
      totalSeats: workshop.totalSeats,
      availableSeats: workshop.availableSeats,
      showToUsers: workshop.showToUsers,
      status: workshop.status,
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
    price: Number(workshop.price),
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
        price: data.price,
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
        price: data.price,
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

export const bookWorkshop = async (
  workshopId: string,
  data: { name: string; email: string; phone: string; seats: number },
  sourceId: string,
): Promise<WorkshopActionState> => {
  try {
    const workshop = await prisma.workshop.findFirst({
      where: { id: workshopId },
    });

    if (!workshop) {
      return { success: false, message: "Workshop not found." };
    }

    if (workshop.status !== "UPCOMING") {
      return {
        success: false,
        message: "This workshop is no longer accepting bookings.",
      };
    }

    if (!workshop.showToUsers) {
      return { success: false, message: "Workshop not found." };
    }

    if (data.seats > workshop.availableSeats) {
      return {
        success: false,
        message: `Only ${workshop.availableSeats} seat${workshop.availableSeats === 1 ? "" : "s"} available.`,
      };
    }

    const locationId = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID;
    if (!locationId) {
      return { success: false, message: "Payment configuration error." };
    }

    const payment = await chargeWorkshopPayment({
      sourceId,
      amountCents: workshop.price * data.seats * 100,
      locationId,
    });

    if (!payment.success) {
      return {
        success: false,
        message: payment.message ?? "Payment failed. Please try again.",
      };
    }

    const registration = await prisma.registration.create({
      data: {
        workshopId,
        name: data.name,
        email: data.email,
        phone: data.phone,
        seatsBooked: data.seats,
        paymentStatus: "PAID",
      },
    });

    await Promise.all([
      prisma.workshopPayment.create({
        data: {
          registrationId: registration.id,
          squarePaymentId: payment.paymentId ?? null,
          amountCents: workshop.price * data.seats * 100,
          receiptUrl: payment.receiptUrl ?? null,
          status: "PAID",
        },
      }),
      prisma.workshop.update({
        where: { id: workshopId },
        data: { availableSeats: { decrement: data.seats } },
      }),
    ]);

    updateTag(CACHE.WORKSHOP);
    return { success: true, message: "Booking successful!" };
  } catch (e) {
    console.error(e);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
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
        price: Number(workshop.price),
        totalSeats: workshop.totalSeats,
        availableSeats: workshop.availableSeats,
        showToUsers: workshop.showToUsers,
        status: workshop.status,
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
