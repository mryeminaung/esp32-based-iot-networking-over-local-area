-- CreateTable
CREATE TABLE "sensor_readings" (
    "id" SERIAL NOT NULL,
    "device_id" INTEGER NOT NULL DEFAULT 1,
    "temperature" DOUBLE PRECISION,
    "humidity" DOUBLE PRECISION,
    "soil_moisture" DOUBLE PRECISION,
    "light" DOUBLE PRECISION,
    "air_quality" DOUBLE PRECISION,
    "water_level" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sensor_readings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "sensor_readings_device_id_idx" ON "sensor_readings"("device_id");

-- CreateIndex
CREATE INDEX "sensor_readings_created_at_idx" ON "sensor_readings"("created_at");
