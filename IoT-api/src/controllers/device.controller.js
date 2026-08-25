import { getDeviceState, sendDeviceCommand } from "../services/device.service.js";

/**
 * GET /api/devices — proxy GET /all from ESP32
 */
export async function getDeviceStateHandler(req, res) {
  try {
    const data = await getDeviceState();
    return res.json({ success: true, data });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || "Failed to get device state",
    });
  }
}

/**
 * POST /api/devices/control — proxy POST /control to ESP32
 */
export async function controlDeviceHandler(req, res) {
  try {
    const { device, state, value } = req.body;
    const result = await sendDeviceCommand(device, state, value);
    return res.json({
      success: true,
      message: "Device controlled",
      data: result,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || "Failed to control device",
    });
  }
}
