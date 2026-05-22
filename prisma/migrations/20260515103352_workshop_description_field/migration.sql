-- DropIndex
DROP INDEX "registrations_workshopId_email_key";

-- AlterTable
ALTER TABLE "workshops" ADD COLUMN     "description" TEXT;
