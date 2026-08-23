-- AlterTable
ALTER TABLE "products" ADD COLUMN     "lastNotifiedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "workshops" ADD COLUMN     "lastNotifiedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "subscribers" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "source" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "subscribers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "subscribers_email_key" ON "subscribers"("email");

-- CreateIndex
CREATE INDEX "subscribers_createdAt_idx" ON "subscribers"("createdAt");
