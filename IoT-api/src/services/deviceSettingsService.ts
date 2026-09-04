import { prisma } from "../config/db.js";

export async function getSettings() {
  const settings = await prisma.deviceSettings.findFirst();
  if (settings) return settings;

  // Create with defaults on first access
  return prisma.deviceSettings.create({ data: {} });
}

export async function updateSettings(data: Record<string, unknown>) {
  const existing = await prisma.deviceSettings.findFirst();

  if (existing) {
    return prisma.deviceSettings.update({
      where: { id: existing.id },
      data,
    });
  }

  return prisma.deviceSettings.create({ data });
}
