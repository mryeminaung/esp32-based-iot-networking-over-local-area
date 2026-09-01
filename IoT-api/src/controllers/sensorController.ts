import type { Request, Response } from "express";
import {
  recordReading,
  recordReadingsBatch,
  getReadings,
  getAnalytics,
  getLatestReading,
} from "../services/sensorService.js";

/**
 * POST /api/sensors/readings — record one or more sensor readings
 */
export async function recordReadingHandler(req: Request, res: Response) {
  try {
    const { body } = req;

    if (Array.isArray(body.readings)) {
      await recordReadingsBatch(body.readings);
      return res.status(201).json({
        success: true,
        message: `${body.readings.length} readings recorded`,
        data: { count: body.readings.length },
      });
    }

    const reading = await recordReading(body);
    return res.status(201).json({
      success: true,
      message: "Reading recorded",
      data: { reading },
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Failed to record reading",
    });
  }
}

/**
 * GET /api/sensors/readings — query readings with filters
 */
export async function getReadingsHandler(req: Request, res: Response) {
  try {
    const { device, from, to, page, limit } = req.query;
    const result = await getReadings({
      device: device as string,
      from: from as string,
      to: to as string,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 50,
    });
    return res.json({ success: true, data: result });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch readings",
    });
  }
}

/**
 * GET /api/sensors/analytics — aggregated daily stats
 */
export async function getAnalyticsHandler(req: Request, res: Response) {
  try {
    const { device, from, to } = req.query;
    if (!from || !to) {
      return res.status(400).json({
        success: false,
        message: "from and to date parameters are required",
      });
    }
    const analytics = await getAnalytics({
      device: device as string,
      from: from as string,
      to: to as string,
    });
    return res.json({ success: true, data: { analytics } });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch analytics",
    });
  }
}

/**
 * GET /api/sensors/latest — latest reading for a device
 */
export async function getLatestReadingHandler(req: Request, res: Response) {
  try {
    const { device } = req.query;
    const reading = await getLatestReading(device ? Number(device) : 1);
    return res.json({ success: true, data: { reading } });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch latest reading",
    });
  }
}
