import { Router } from "express";
import { authenticate, authorize } from "../middleware/authMiddleware.js";
import {
  recordReadingHandler,
  getReadingsHandler,
  getAnalyticsHandler,
  getLatestReadingHandler,
} from "../controllers/sensorController.js";

const router: ReturnType<typeof Router> = Router();

router.use(authenticate);

/**
 * @swagger
 * /api/sensors/readings:
 *   post:
 *     tags: [Sensors]
 *     summary: Record sensor reading
 *     description: Submit a new sensor reading from ESP32 or collector.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               deviceId:
 *                 type: integer
 *                 default: 1
 *               temperature:
 *                 type: number
 *               humidity:
 *                 type: number
 *               soilMoisture:
 *                 type: number
 *               light:
 *                 type: number
 *               airQuality:
 *                 type: number
 *               waterLevel:
 *                 type: number
 *     responses:
 *       201:
 *         description: Reading recorded
 */
router.post("/readings", recordReadingHandler);

/**
 * @swagger
 * /api/sensors/readings:
 *   get:
 *     tags: [Sensors]
 *     summary: Get sensor readings
 *     description: Returns paginated sensor readings with optional filters.
 *     parameters:
 *       - in: query
 *         name: deviceId
 *         schema: { type: integer }
 *       - in: query
 *         name: startDate
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: endDate
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 50 }
 *     responses:
 *       200:
 *         description: Sensor readings
 */
router.get("/readings", getReadingsHandler);

/**
 * @swagger
 * /api/sensors/analytics:
 *   get:
 *     tags: [Sensors]
 *     summary: Get sensor analytics
 *     description: Returns daily aggregated statistics (avg, min, max) for sensors.
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: endDate
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: deviceId
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Analytics data
 */
router.get("/analytics", authorize("sensors:read"), getAnalyticsHandler);

/**
 * @swagger
 * /api/sensors/latest:
 *   get:
 *     tags: [Sensors]
 *     summary: Get latest sensor reading
 *     description: Returns the most recent sensor reading from the database.
 *     responses:
 *       200:
 *         description: Latest reading
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/SensorReading'
 */
router.get("/latest", getLatestReadingHandler);

export default router;
