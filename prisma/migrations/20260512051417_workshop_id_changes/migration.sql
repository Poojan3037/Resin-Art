/*
  Warnings:

  - The primary key for the `registrations` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `workshops` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "registrations" DROP CONSTRAINT "registrations_workshopId_fkey";

-- AlterTable
ALTER TABLE "registrations" DROP CONSTRAINT "registrations_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "workshopId" SET DATA TYPE TEXT,
ADD CONSTRAINT "registrations_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "registrations_id_seq";

-- AlterTable
ALTER TABLE "workshops" DROP CONSTRAINT "workshops_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "workshops_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "workshops_id_seq";

-- AddForeignKey
ALTER TABLE "registrations" ADD CONSTRAINT "registrations_workshopId_fkey" FOREIGN KEY ("workshopId") REFERENCES "workshops"("id") ON DELETE CASCADE ON UPDATE CASCADE;
