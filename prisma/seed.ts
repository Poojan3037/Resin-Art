import "dotenv/config";
import bcrypt from "bcryptjs";
import prisma from "../src/lib/prisma";

/**
 * Creates (or updates the password of) the admin user from env vars.
 * Replaces the old public POST /api/register endpoint, which allowed
 * unauthenticated user creation.
 *
 * Usage: ADMIN_EMAIL=... ADMIN_USERNAME=... ADMIN_PASSWORD=... npx tsx prisma/seed.ts
 */
const main = async () => {
  const email = process.env.ADMIN_EMAIL;
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !username || !password) {
    throw new Error(
      "ADMIN_EMAIL, ADMIN_USERNAME and ADMIN_PASSWORD must all be set.",
    );
  }

  if (password.length < 12) {
    throw new Error("ADMIN_PASSWORD must be at least 12 characters.");
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.upsert({
    where: { email },
    update: { password: hashedPassword, isAdmin: true },
    create: { email, username, password: hashedPassword, isAdmin: true },
    select: { id: true, email: true, username: true },
  });

  console.log(`Admin ready: ${user.email} (${user.id})`);
};

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
