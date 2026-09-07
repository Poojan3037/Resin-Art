-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_userId_fkey";

-- DropForeignKey
ALTER TABLE "password_reset_tokens" DROP CONSTRAINT "password_reset_tokens_userId_fkey";

-- DropForeignKey
ALTER TABLE "registrations" DROP CONSTRAINT "registrations_userId_fkey";

-- DropIndex
DROP INDEX "orders_userId_createdAt_idx";

-- DropIndex
DROP INDEX "registrations_userId_registeredAt_idx";

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "registrations" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "firstName",
DROP COLUMN "lastName",
DROP COLUMN "passwordChangedAt";

-- DropTable
DROP TABLE "password_reset_tokens";


-- Customer accounts are gone, so a non-admin user row is unreachable dead
-- PII: there is no longer any way to sign in as one. Runs last, after the
-- orders/registrations foreign keys above have been dropped.
DELETE FROM "users" WHERE "isAdmin" = false;
