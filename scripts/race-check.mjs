/**
 * Oversell race check.
 *
 * The stock/seat races cannot be reproduced by clicking — they need genuine
 * concurrency. Server actions can't be called from a plain script (they need
 * request context for `headers()`), so this exercises the exact conditional
 * decrement that `createOrder` / `bookWorkshop` now use for reservation. That
 * decrement IS the fix, so this is the assertion that matters.
 *
 *   node scripts/race-check.mjs product  <productId>
 *   node scripts/race-check.mjs workshop <workshopId>
 *
 * Requires DATABASE_URL to be reachable. Does not touch Square.
 */
import "dotenv/config";
import { PrismaClient } from "../prisma/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const CONCURRENCY = 20;

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const [, , kind, id] = process.argv;
if (!kind || !id) {
  console.error("Usage: node scripts/race-check.mjs <product|workshop> <id>");
  process.exit(1);
}

let failed = false;
const check = (ok, message) => {
  console.log(`  ${ok ? "PASS" : "FAIL"}  ${message}`);
  if (!ok) failed = true;
};

/** Mirrors the reservation transaction in src/actions/order.ts. */
const reserveProduct = async () =>
  prisma.$transaction(async (tx) => {
    const { count } = await tx.product.updateMany({
      where: { id, status: "PUBLISHED", quantity: { gte: 1 } },
      data: { quantity: { decrement: 1 } },
    });
    if (count === 0) throw new Error("OUT_OF_STOCK");
    return true;
  });

/** Mirrors the reservation transaction in src/actions/workshop.ts. */
const reserveSeat = async () =>
  prisma.$transaction(async (tx) => {
    const { count } = await tx.workshop.updateMany({
      where: {
        id,
        status: "UPCOMING",
        showToUsers: true,
        availableSeats: { gte: 1 },
      },
      data: { availableSeats: { decrement: 1 } },
    });
    if (count === 0) throw new Error("NO_SEATS");
    return true;
  });

const main = async () => {
  const isProduct = kind === "product";

  if (isProduct) {
    await prisma.product.update({
      where: { id },
      data: { quantity: 1, status: "PUBLISHED" },
    });
  } else if (kind === "workshop") {
    await prisma.workshop.update({
      where: { id },
      data: { availableSeats: 1, status: "UPCOMING", showToUsers: true },
    });
  } else {
    console.error(`Unknown kind: ${kind}`);
    process.exit(1);
  }

  console.log(
    `\nSet ${kind} ${id} to 1 unit. Firing ${CONCURRENCY} concurrent reservations...\n`,
  );

  const reserve = isProduct ? reserveProduct : reserveSeat;
  const settled = await Promise.allSettled(
    Array.from({ length: CONCURRENCY }, () => reserve()),
  );

  const won = settled.filter((r) => r.status === "fulfilled").length;
  const rejected = settled.filter((r) => r.status === "rejected").length;

  const remaining = isProduct
    ? (await prisma.product.findUnique({ where: { id }, select: { quantity: true } }))?.quantity
    : (await prisma.workshop.findUnique({ where: { id }, select: { availableSeats: true } }))
        ?.availableSeats;

  console.log(`  winners   : ${won}`);
  console.log(`  rejected  : ${rejected}`);
  console.log(`  remaining : ${remaining}\n`);

  check(won === 1, "exactly one reservation succeeded");
  check(rejected === CONCURRENCY - 1, "all other attempts were cleanly rejected");
  check(remaining === 0, "inventory landed at exactly 0");
  check((remaining ?? -1) >= 0, "inventory never went negative");

  console.log(
    failed
      ? "\nOVERSELL DETECTED — the reservation guard is not atomic.\n"
      : "\nNo oversell. The conditional decrement held under concurrency.\n",
  );
  if (failed) process.exitCode = 1;
};

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
