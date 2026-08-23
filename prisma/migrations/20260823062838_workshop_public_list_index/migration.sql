-- CreateIndex
CREATE INDEX "workshops_showToUsers_status_date_idx" ON "workshops"("showToUsers", "status", "date");
