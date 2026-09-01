import { z } from "zod";

const SENSOR_FIELDS = [
  "soilMoisture",
  "temperature",
  "humidity",
  "light",
  "airQuality",
  "waterLevel",
];

const CONDITIONS = ["below", "above", "equals"];

const ACTIONS = ["pump_on", "pump_off", "led_on", "led_off"];

export const createRuleSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  sensor: z.enum(SENSOR_FIELDS, {
    message: `Invalid sensor. Allowed: ${SENSOR_FIELDS.join(", ")}`,
  }),
  condition: z.enum(CONDITIONS, {
    message: `Invalid condition. Allowed: ${CONDITIONS.join(", ")}`,
  }),
  threshold: z.number(),
  action: z.enum(ACTIONS, {
    message: `Invalid action. Allowed: ${ACTIONS.join(", ")}`,
  }),
  duration: z
    .number()
    .int()
    .min(1, "Duration must be at least 1 second")
    .optional()
    .nullable(),
  cooldown: z
    .number()
    .int()
    .min(60, "Cooldown must be at least 60 seconds")
    .optional()
    .default(300),
});

export const updateRuleSchema = z
  .object({
    name: z.string().min(1).max(100).optional(),
    enabled: z.boolean().optional(),
    sensor: z.enum(SENSOR_FIELDS).optional(),
    condition: z.enum(CONDITIONS).optional(),
    threshold: z.number().optional(),
    action: z.enum(ACTIONS).optional(),
    duration: z.number().int().min(1).optional().nullable(),
    cooldown: z.number().int().min(60).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });
