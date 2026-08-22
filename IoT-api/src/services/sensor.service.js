import { prisma } from "../config/db.js";

/**
 * Record a single sensor reading
 */
export async function recordReading(data) {
  return prisma.sensorReading.create({
    data: {
      deviceId: data.deviceId ?? 1,
      temperature: data.temperature ?? null,
      humidity: data.humidity ?? null,
      soilMoisture: data.soilMoisture ?? null,
      light: data.light ?? null,
      airQuality: data.airQuality ?? null,
      waterLevel: data.waterLevel ?? null,
    },
  });
}

/**
 * Record multiple sensor readings in a batch
 */
export async function recordReadingsBatch(readings) {
  return prisma.sensorReading.createMany({ data: readings });
}

/**
 * Query sensor readings with filters and pagination
 */
export async function getReadings(filters = {}) {
  const { device, from, to, page = 1, limit = 50 } = filters;

  const where = {};
  if (device) where.deviceId = Number(device);
  if (from || to) {
    where.createdAt = {};
    if (from) where.createdAt.gte = new Date(from);
    if (to) where.createdAt.lte = new Date(to);
  }

  const [readings, total] = await Promise.all([
    prisma.sensorReading.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.sensorReading.count({ where }),
  ]);

  return {
    readings,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/**
 * Get analytics: daily avg/min/max for each sensor field over a date range
 */
export async function getAnalytics(filters = {}) {
  const { device, from, to } = filters;

  const where = {};
  if (device) where.deviceId = Number(device);
  if (from || to) {
    where.createdAt = {};
    if (from) where.createdAt.gte = new Date(from);
    if (to) where.createdAt.lte = new Date(to);
  }

  // Fetch all readings in range (for aggregation)
  const readings = await prisma.sensorReading.findMany({
    where,
    orderBy: { createdAt: "asc" },
  });

  if (readings.length === 0) return [];

  // Group by day (YYYY-MM-DD)
  const grouped = {};
  for (const r of readings) {
    const day = r.createdAt.toISOString().slice(0, 10);
    if (!grouped[day]) grouped[day] = [];
    grouped[day].push(r);
  }

  const fields = ["temperature", "humidity", "soilMoisture", "light", "airQuality", "waterLevel"];

  return Object.entries(grouped).map(([date, dayReadings]) => {
    const stats = { date };
    for (const field of fields) {
      const values = dayReadings
        .map((r) => r[field])
        .filter((v) => v !== null && v !== undefined);
      if (values.length === 0) {
        stats[field] = { avg: null, min: null, max: null };
      } else {
        const sum = values.reduce((a, b) => a + b, 0);
        stats[field] = {
          avg: Math.round((sum / values.length) * 100) / 100,
          min: Math.round(Math.min(...values) * 100) / 100,
          max: Math.round(Math.max(...values) * 100) / 100,
        };
      }
    }
    return stats;
  });
}

/**
 * Get latest reading for a device
 */
export async function getLatestReading(deviceId = 1) {
  return prisma.sensorReading.findFirst({
    where: { deviceId },
    orderBy: { createdAt: "desc" },
  });
}
