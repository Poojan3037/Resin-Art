import "server-only";

import prisma from "@/lib/prisma";

/**
 * Attaches pre-existing guest Orders/Registrations to a newly signed-in
 * user. Matches by email (case-insensitive) and only claims rows that have
 * no owner yet, so a claimed guest record never moves between accounts.
 *
 * `Order` tracks the guest email as `customerEmail`; `Registration` tracks
 * it as `email` — the two models were built independently.
 */
export const claimGuestRecords = async (userId: string, email: string) => {
  await prisma.$transaction([
    prisma.order.updateMany({
      where: {
        customerEmail: { equals: email, mode: "insensitive" },
        userId: null,
      },
      data: { userId },
    }),
    prisma.registration.updateMany({
      where: {
        email: { equals: email, mode: "insensitive" },
        userId: null,
      },
      data: { userId },
    }),
  ]);
};
