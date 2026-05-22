"use server";

import prisma from "@/lib/prisma";
import { verifySession } from "./dal";

export const getStatData = async () => {
  try {
    const { isUserVerified } = await verifySession({ isAdmin: true });
    if (!isUserVerified)
      return {
        success: false,
        message: "Unauthorized.",
        data: {
          totalProducts: 0,
          totalPendingOrders: 0,
          totalUpcomingWorkshops: 0,
          totalOrders: 0,
        },
      };

    const [
      totalProducts,
      totalPendingOrders,
      totalUpcomingWorkshops,
      totalOrders,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.order.count({
        where: { status: "PENDING" },
      }),
      prisma.workshop.count({
        where: { status: "UPCOMING" },
      }),
      prisma.order.count(),
    ]);

    return {
      success: true,
      data: {
        totalProducts,
        totalPendingOrders,
        totalUpcomingWorkshops,
        totalOrders,
      },
    };
  } catch {
    return {
      success: false,
      error: "Something went wrong.",
      data: {
        totalProducts: 0,
        totalPendingOrders: 0,
        totalUpcomingWorkshops: 0,
        totalOrders: 0,
      },
    };
  }
};
