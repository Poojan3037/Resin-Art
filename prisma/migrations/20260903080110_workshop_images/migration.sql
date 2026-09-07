-- CreateTable
CREATE TABLE "workshop_images" (
    "id" TEXT NOT NULL,
    "workshopId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "altText" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "workshop_images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "workshop_images_workshopId_idx" ON "workshop_images"("workshopId");

-- AddForeignKey
ALTER TABLE "workshop_images" ADD CONSTRAINT "workshop_images_workshopId_fkey" FOREIGN KEY ("workshopId") REFERENCES "workshops"("id") ON DELETE CASCADE ON UPDATE CASCADE;
