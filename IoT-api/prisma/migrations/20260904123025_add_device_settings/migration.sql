/*
  Warnings:

  - You are about to drop the `automation_rules` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "automation_rules";

-- CreateTable
CREATE TABLE "device_settings" (
    "id" SERIAL NOT NULL,
    "soilDryThreshold" DOUBLE PRECISION NOT NULL DEFAULT 30,
    "soilOptimalThreshold" DOUBLE PRECISION NOT NULL DEFAULT 50,
    "waterLowThreshold" DOUBLE PRECISION NOT NULL DEFAULT 25,
    "waterCriticalThreshold" DOUBLE PRECISION NOT NULL DEFAULT 10,
    "waterWarningEnabled" BOOLEAN NOT NULL DEFAULT true,
    "fanEnabled" BOOLEAN NOT NULL DEFAULT true,
    "fanSpeed" INTEGER NOT NULL DEFAULT 65,
    "buzzerEnabled" BOOLEAN NOT NULL DEFAULT true,
    "buzzerLowWater" BOOLEAN NOT NULL DEFAULT true,
    "buzzerDrySoil" BOOLEAN NOT NULL DEFAULT true,
    "buzzerSensorError" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "device_settings_pkey" PRIMARY KEY ("id")
);
