import {
  createActivityLog as createLog,
  getActivityLogs as getLogs,
} from "../services/activity.service.js";

export const createLogHandler = async (req, res) => {
  try {
    const { device, action, value } = req.body;

    if (!device || !action) {
      return res.status(400).json({
        success: false,
        message: "Device and action are required",
      });
    }

    const log = await createLog(req.user.id, device, action, value ?? null);

    res.status(201).json({
      success: true,
      message: "Activity logged",
      data: { log },
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: error.message || "Failed to create activity log",
    });
  }
};

export const getLogsHandler = async (req, res) => {
  try {
    const { userId, action, device, startDate, endDate, page, limit } = req.query;

    const result = await getLogs(
      { userId, action, device, startDate, endDate, page, limit },
      req.user
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: error.message || "Failed to fetch activity logs",
    });
  }
};
