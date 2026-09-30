/*
  Warnings:

  - You are about to drop the column `buzzerDrySoil` on the `device_settings` table. All the data in the column will be lost.
  - You are about to drop the column `buzzerEnabled` on the `device_settings` table. All the data in the column will be lost.
  - You are about to drop the column `buzzerLowWater` on the `device_settings` table. All the data in the column will be lost.
  - You are about to drop the column `buzzerSensorError` on the `device_settings` table. All the data in the column will be lost.
  - You are about to drop the column `lightLowThreshold` on the `device_settings` table. All the data in the column will be lost.
  - You are about to drop the column `soilDryThreshold` on the `device_settings` table. All the data in the column will be lost.
  - You are about to drop the column `soilOptimalThreshold` on the `device_settings` table. All the data in the column will be lost.
  - You are about to drop the column `waterCriticalThreshold` on the `device_settings` table. All the data in the column will be lost.
  - You are about to drop the column `waterLowThreshold` on the `device_settings` table. All the data in the column will be lost.
  - You are about to drop the column `waterWarningEnabled` on the `device_settings` table. All the data in the column will be lost.
  - You are about to drop the `RefreshToken` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "RefreshToken" DROP CONSTRAINT "RefreshToken_userId_fkey";

-- DropForeignKey
ALTER TABLE "activity_logs" DROP CONSTRAINT "activity_logs_userId_fkey";

-- AlterTable
ALTER TABLE "device_settings" DROP COLUMN "buzzerDrySoil",
DROP COLUMN "buzzerEnabled",
DROP COLUMN "buzzerLowWater",
DROP COLUMN "buzzerSensorError",
DROP COLUMN "lightLowThreshold",
DROP COLUMN "soilDryThreshold",
DROP COLUMN "soilOptimalThreshold",
DROP COLUMN "waterCriticalThreshold",
DROP COLUMN "waterLowThreshold",
DROP COLUMN "waterWarningEnabled",
ADD COLUMN     "buzzer_dry_soil" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "buzzer_enabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "buzzer_low_water" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "buzzer_sensor_error" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "light_low_threshold" INTEGER NOT NULL DEFAULT 30,
ADD COLUMN     "soil_dry_threshold" DOUBLE PRECISION NOT NULL DEFAULT 30,
ADD COLUMN     "soil_optimal_threshold" DOUBLE PRECISION NOT NULL DEFAULT 50,
ADD COLUMN     "water_critical_threshold" DOUBLE PRECISION NOT NULL DEFAULT 10,
ADD COLUMN     "water_low_threshold" DOUBLE PRECISION NOT NULL DEFAULT 25,
ADD COLUMN     "water_warning_enabled" BOOLEAN NOT NULL DEFAULT true;

-- DropTable
DROP TABLE "RefreshToken";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "image" TEXT,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'farm_worker',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_token_key" ON "refresh_tokens"("token");

-- CreateIndex
CREATE INDEX "refresh_tokens_userId_idx" ON "refresh_tokens"("userId");

-- CreateIndex
CREATE INDEX "refresh_tokens_expiresAt_idx" ON "refresh_tokens"("expiresAt");

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
