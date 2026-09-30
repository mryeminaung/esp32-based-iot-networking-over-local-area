import { Router } from "express";
import { authenticate, authorize } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validateMiddleware.js";
import { controlDeviceSchema } from "../validations/deviceSchema.js";
import {
  getDeviceStateHandler,
  controlDeviceHandler,
} from "../controllers/deviceController.js";

const router: ReturnType<typeof Router> = Router();

router.use(authenticate);

/**
 * @swagger
 * /api/devices/:
 *   get:
 *     tags: [Devices]
 *     summary: Get device states
 *     description: Returns current state of all actuators from ESP32.
 *     responses:
 *       200:
 *         description: Device states
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     red_light: { type: boolean }
 *                     yellow_light: { type: boolean }
 *                     green_light: { type: boolean }
 *                     white_light: { type: boolean }
 *                     relay: { type: boolean }
 *                     water_pump: { type: boolean }
 *                     buzzer: { type: boolean }
 */
router.get("/", authorize("devices:read"), getDeviceStateHandler);

/**
 * @swagger
 * /api/devices/control:
 *   post:
 *     tags: [Devices]
 *     summary: Control device
 *     description: Send control command to ESP32 actuator.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [device, state]
 *             properties:
 *               device:
 *                 type: string
 *                 enum: [red_light, yellow_light, green_light, white_light, relay, water_pump, buzzer]
 *               state:
 *                 type: integer
 *                 enum: [0, 1]
 *               value:
 *                 type: integer
 *                 description: Optional value (e.g., PWM duty)
 *     responses:
 *       200:
 *         description: Command sent
 *       400:
 *         description: Invalid device or state
 */
router.post(
  "/control",
  authorize("devices:control"),
  validate(controlDeviceSchema),
  controlDeviceHandler,
);

export default router;
