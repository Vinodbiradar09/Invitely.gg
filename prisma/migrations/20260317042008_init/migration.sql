-- CreateEnum
CREATE TYPE "Recurrence" AS ENUM ('weekly', 'monthly', 'annually');

-- AlterTable
ALTER TABLE "events" ADD COLUMN     "parentEventId" TEXT,
ADD COLUMN     "recurrence" "Recurrence";

-- AlterTable
ALTER TABLE "invitations" ADD COLUMN     "guestNote" TEXT,
ADD COLUMN     "organizerNote" TEXT;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_parentEventId_fkey" FOREIGN KEY ("parentEventId") REFERENCES "events"("id") ON DELETE SET NULL ON UPDATE CASCADE;
