import type { Request, Response } from "express";
import {
	getDeviceState,
	sendDeviceCommand,
} from "../services/deviceService.js";

/**
 * GET /api/devices — proxy GET /all from ESP32
 */
export async function getDeviceStateHandler(req: Request, res: Response) {
	try {
		const data = await getDeviceState();
		return res.json({ success: true, data });
	} catch {
		return res.status(500).json({
			success: false,
			message: "Failed to get device state",
		});
	}
}

/**
 * POST /api/devices/control — proxy POST /control to ESP32
 */
export async function controlDeviceHandler(req: Request, res: Response) {
	try {
		const { device, state, value } = req.body;
		const result = await sendDeviceCommand(device, state, value);
		return res.json({
			success: true,
			message: "Device controlled",
			data: result,
		});
	} catch {
		return res.status(500).json({
			success: false,
			message: "Failed to control device",
		});
	}
}
