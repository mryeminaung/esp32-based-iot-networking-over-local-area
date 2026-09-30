/*
  Warnings:

  - You are about to drop the column `fanEnabled` on the `device_settings` table. All the data in the column will be lost.
  - You are about to drop the column `fanSpeed` on the `device_settings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "device_settings" DROP COLUMN "fanEnabled",
DROP COLUMN "fanSpeed",
ADD COLUMN     "lightLowThreshold" INTEGER NOT NULL DEFAULT 30;
