import {
  recordReading,
  recordReadingsBatch,
  getReadings,
  getAnalytics,
  getLatestReading,
} from "../services/sensor.service.js";

/**
 * POST /api/sensors/readings — record one or more sensor readings
 */
export async function recordReadingHandler(req, res) {
  try {
    const { body } = req;

    if (Array.isArray(body.readings)) {
      // Batch insert
      await recordReadingsBatch(body.readings);
      return res.status(201).json({
        success: true,
        message: `${body.readings.length} readings recorded`,
        data: { count: body.readings.length },
      });
    }

    // Single reading
    const reading = await recordReading(body);
    return res.status(201).json({
      success: true,
      message: "Reading recorded",
      data: { reading },
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || "Failed to record reading",
    });
  }
}

/**
 * GET /api/sensors/readings — query readings with filters
 */
export async function getReadingsHandler(req, res) {
  try {
    const { device, from, to, page, limit } = req.query;
    const result = await getReadings({
      device,
      from,
      to,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 50,
    });
    return res.json({ success: true, data: result });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || "Failed to fetch readings",
    });
  }
}

/**
 * GET /api/sensors/analytics — aggregated daily stats
 */
export async function getAnalyticsHandler(req, res) {
  try {
    const { device, from, to } = req.query;
    if (!from || !to) {
      return res.status(400).json({
        success: false,
        message: "from and to date parameters are required",
      });
    }
    const analytics = await getAnalytics({ device, from, to });
    return res.json({ success: true, data: { analytics } });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || "Failed to fetch analytics",
    });
  }
}

/**
 * GET /api/sensors/latest — latest reading for a device
 */
export async function getLatestReadingHandler(req, res) {
  try {
    const { device } = req.query;
    const reading = await getLatestReading(device ? Number(device) : 1);
    return res.json({ success: true, data: { reading } });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || "Failed to fetch latest reading",
    });
  }
}
