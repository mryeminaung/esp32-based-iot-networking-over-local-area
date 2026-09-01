import type { Request, Response } from "express";
import {
  createActivityLog as createLog,
  getActivityLogs as getLogs,
} from "../services/activityService.js";

export const createLogHandler = async (req: Request, res: Response) => {
  try {
    const { device, action, value } = req.body;

    if (!device || !action) {
      return res.status(400).json({
        success: false,
        message: "Device and action are required",
      });
    }

    const log = await createLog(req.user!.id, device, action, value ?? null);

    res.status(201).json({
      success: true,
      message: "Activity logged",
      data: { log },
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to create activity log",
    });
  }
};

export const getLogsHandler = async (req: Request, res: Response) => {
  try {
    const { userId, action, device, startDate, endDate, page, limit } = req.query;

    const result = await getLogs(
      {
        userId: userId as string | undefined,
        action: action as string | undefined,
        device: device as string | undefined,
        startDate: startDate as string | undefined,
        endDate: endDate as string | undefined,
        page: page as string | undefined,
        limit: limit as string | undefined,
      },
      req.user
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to fetch activity logs",
    });
  }
};
