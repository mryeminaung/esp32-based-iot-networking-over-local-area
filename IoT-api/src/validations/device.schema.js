import { z } from "zod";

const DEVICES = [
  "red_light",
  "yellow_light",
  "green_light",
  "white_light",
  "fan",
  "relay",
  "water_pump",
];

export const controlDeviceSchema = z.object({
  device: z.enum(DEVICES, {
    message: `Invalid device. Allowed: ${DEVICES.join(", ")}`,
  }),
  state: z.number().int().min(0).max(1),
  value: z.number().int().min(0).max(100).optional().default(0),
});
