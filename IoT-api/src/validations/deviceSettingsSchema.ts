import { z } from "zod";

export const updateDeviceSettingsSchema = z.object({
  soilDryThreshold: z.number().int().min(0).max(100).optional(),
  soilOptimalThreshold: z.number().int().min(0).max(100).optional(),
  waterLowThreshold: z.number().int().min(0).max(100).optional(),
  waterCriticalThreshold: z.number().int().min(0).max(100).optional(),
  waterWarningEnabled: z.boolean().optional(),
  fanEnabled: z.boolean().optional(),
  fanSpeed: z.number().int().min(0).max(100).optional(),
  buzzerEnabled: z.boolean().optional(),
  buzzerLowWater: z.boolean().optional(),
  buzzerDrySoil: z.boolean().optional(),
  buzzerSensorError: z.boolean().optional(),
});
