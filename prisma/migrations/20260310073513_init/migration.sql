/*
  Warnings:

  - You are about to drop the column `date` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `time` on the `events` table. All the data in the column will be lost.
  - Added the required column `eventAt` to the `events` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "events" DROP COLUMN "date",
DROP COLUMN "time",
ADD COLUMN     "eventAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "invitations" ADD COLUMN     "updatedAt" TIMESTAMP(3),
ALTER COLUMN "name" DROP NOT NULL;

-- AlterTable
ALTER TABLE "workspace_members" ALTER COLUMN "name" DROP NOT NULL;
