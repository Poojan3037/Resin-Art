-- CreateTable
CREATE TABLE "workshop_payments" (
    "id" TEXT NOT NULL,
    "registrationId" TEXT NOT NULL,
    "squarePaymentId" TEXT,
    "amountCents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'CAD',
    "status" "PaymentStatus" NOT NULL DEFAULT 'PAID',
    "receiptUrl" TEXT,
    "paidAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workshop_payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "workshop_payments_registrationId_key" ON "workshop_payments"("registrationId");

-- CreateIndex
CREATE UNIQUE INDEX "workshop_payments_squarePaymentId_key" ON "workshop_payments"("squarePaymentId");

-- CreateIndex
CREATE INDEX "workshop_payments_squarePaymentId_idx" ON "workshop_payments"("squarePaymentId");

-- AddForeignKey
ALTER TABLE "workshop_payments" ADD CONSTRAINT "workshop_payments_registrationId_fkey" FOREIGN KEY ("registrationId") REFERENCES "registrations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
