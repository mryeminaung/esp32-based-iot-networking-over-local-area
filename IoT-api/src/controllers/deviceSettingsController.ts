import type { Request, Response } from "express";
import { getSettings, updateSettings } from "../services/deviceSettingsService.js";

export async function getSettingsHandler(_req: Request, res: Response) {
  try {
    const settings = await getSettings();
    return res.json({ success: true, data: { settings } });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch device settings",
    });
  }
}

export async function updateSettingsHandler(req: Request, res: Response) {
  try {
    const settings = await updateSettings(req.body);
    return res.json({ success: true, data: { settings } });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Failed to update device settings",
    });
  }
}
