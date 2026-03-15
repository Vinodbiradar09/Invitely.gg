-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('active', 'cancelled', 'scheduled');

-- AlterTable
ALTER TABLE "events" ADD COLUMN     "cancelledAt" TIMESTAMP(3),
ADD COLUMN     "scheduledAt" TIMESTAMP(3),
ADD COLUMN     "sentAt" TIMESTAMP(3),
ADD COLUMN     "status" "EventStatus" NOT NULL DEFAULT 'active';

-- AlterTable
ALTER TABLE "invitations" ADD COLUMN     "openedAt" TIMESTAMP(3),
ADD COLUMN     "personalizedOpening" TEXT;

-- CreateTable
CREATE TABLE "event_templates" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "eventId" TEXT,
    "name" TEXT NOT NULL,
    "emailSubject" TEXT NOT NULL,
    "emailBody" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_templates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "event_templates_userId_idx" ON "event_templates"("userId");

-- CreateIndex
CREATE INDEX "events_userId_status_idx" ON "events"("userId", "status");

-- CreateIndex
CREATE INDEX "events_status_scheduledAt_idx" ON "events"("status", "scheduledAt");

-- AddForeignKey
ALTER TABLE "event_templates" ADD CONSTRAINT "event_templates_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_templates" ADD CONSTRAINT "event_templates_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE SET NULL ON UPDATE CASCADE;
