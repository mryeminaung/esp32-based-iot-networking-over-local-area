const ESP32_API_URL = process.env.ESP32_API_URL || "http://192.168.4.1";

/**
 * Fetch current device state and sensor data from ESP32
 */
export async function getDeviceState() {
  try {
    const res = await fetch(`${ESP32_API_URL}/all`);
    if (!res.ok) throw new Error(`ESP32 responded ${res.status}`);
    return await res.json();
  } catch (error) {
    throw { status: 502, message: `ESP32 unreachable: ${error.message}` };
  }
}

/**
 * Send a control command to ESP32
 */
export async function sendDeviceCommand(device, state, value = 0) {
  try {
    const res = await fetch(`${ESP32_API_URL}/control`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ device, state, value }),
    });
    if (!res.ok) throw new Error(`ESP32 responded ${res.status}`);
    return await res.json();
  } catch (error) {
    throw { status: 502, message: `ESP32 unreachable: ${error.message}` };
  }
}
