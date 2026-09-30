import { Router } from "express";
import { authenticate, authorize } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validateMiddleware.js";
import { updateDeviceSettingsSchema } from "../validations/deviceSettingsSchema.js";
import {
  getSettingsHandler,
  updateSettingsHandler,
} from "../controllers/deviceSettingsController.js";

const router: ReturnType<typeof Router> = Router();

router.use(authenticate);

/**
 * @swagger
 * /api/device-settings/:
 *   get:
 *     tags: [Device Settings]
 *     summary: Get device settings
 *     description: Returns current threshold and buzzer configuration.
 *     responses:
 *       200:
 *         description: Device settings
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/DeviceSettings'
 */
router.get("/", getSettingsHandler);

/**
 * @swagger
 * /api/device-settings/:
 *   put:
 *     tags: [Device Settings]
 *     summary: Update device settings
 *     description: Farm manager only. Updates thresholds and pushes config to ESP32.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               soilDryThreshold:
 *                 type: number
 *                 example: 30
 *               soilOptimalThreshold:
 *                 type: number
 *                 example: 50
 *               waterLowThreshold:
 *                 type: number
 *                 example: 25
 *               waterCriticalThreshold:
 *                 type: number
 *                 example: 10
 *               waterWarningEnabled:
 *                 type: boolean
 *               buzzerEnabled:
 *                 type: boolean
 *               buzzerLowWater:
 *                 type: boolean
 *               buzzerDrySoil:
 *                 type: boolean
 *               buzzerSensorError:
 *                 type: boolean
 *               lightLowThreshold:
 *                 type: integer
 *                 example: 30
 *     responses:
 *       200:
 *         description: Settings updated
 *       403:
 *         description: Insufficient permissions
 */
router.put(
  "/",
  authorize("system:configure"),
  validate(updateDeviceSettingsSchema),
  updateSettingsHandler,
);

export default router;
