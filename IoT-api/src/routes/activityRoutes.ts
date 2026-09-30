import { Router } from "express";
import { createLogHandler, getLogsHandler } from "../controllers/activityController.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";

const router: ReturnType<typeof Router> = Router();

// All activity routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /api/activity/:
 *   post:
 *     tags: [Activity]
 *     summary: Create activity log
 *     description: Log a device action. All roles can create logs.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [device, action]
 *             properties:
 *               device:
 *                 type: string
 *                 example: water_pump
 *               action:
 *                 type: string
 *                 example: turned_on
 *               value:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Activity logged
 *       400:
 *         description: Missing device or action
 */
router.post("/", authorize("activity:write"), createLogHandler);

/**
 * @swagger
 * /api/activity/:
 *   get:
 *     tags: [Activity]
 *     summary: Get activity logs
 *     description: Returns paginated activity logs with optional filters.
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema: { type: integer }
 *       - in: query
 *         name: action
 *         schema: { type: string }
 *       - in: query
 *         name: device
 *         schema: { type: string }
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
 *         schema: { type: integer, default: 20 }
 *     responses:
 *       200:
 *         description: Activity logs
 */
router.get("/", getLogsHandler);

export default router;
