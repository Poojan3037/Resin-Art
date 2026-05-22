/*
  Warnings:

  - You are about to drop the column `time` on the `workshops` table. All the data in the column will be lost.
  - Added the required column `endPeriod` to the `workshops` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endTime` to the `workshops` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startPeriod` to the `workshops` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `workshops` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "workshops" DROP COLUMN "time",
ADD COLUMN     "endPeriod" TEXT NOT NULL,
ADD COLUMN     "endTime" TEXT NOT NULL,
ADD COLUMN     "startPeriod" TEXT NOT NULL,
ADD COLUMN     "startTime" TEXT NOT NULL;
