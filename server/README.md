# ESP32 Server — IoT Firmware

Arduino-based firmware for the ESP32 DevKit V1 that powers the IoT Networking Lab's smart agriculture system. Exposes a REST API over Wi-Fi for device control and sensor monitoring.

## Features

- **REST API** — 5 endpoints for device control, sensor reading, and system info
- **Auto LED feedback** — Red/Yellow/Green LEDs indicate soil moisture level (dry / moist / wet)
- **PWM fan control** — 0–100% duty cycle via `ledc`
- **mDNS discovery** — reachable at `http://esp32-server.local`
- **CORS enabled** — works with cross-origin web dashboards
- **WiFi reconnect guard** — auto-reconnects on link loss

## Quick Start

```bash
# 1. Open ESP32-Server.ino in Arduino IDE or PlatformIO

# 2. Update WiFi credentials in the sketch
const char *ssid = "YourNetwork";
const char *password = "YourPassword";

# 3. Select board: ESP32 Dev Module

# 4. Flash and open Serial Monitor (115200 baud)

# 5. Test the API
curl http://esp32-server.local/all
```

## Pin Mapping

| Component           | GPIO |
| ------------------- | ---- |
| Red Light           | 2    |
| Yellow Light        | 4    |
| Green Light         | 5    |
| White Light         | 18   |
| Fan (PWM)           | 19   |
| Relay               | 21   |
| Water Pump          | 22   |
| Soil Moisture (ADC) | 34   |

## API Endpoints

| Method | Path       | Description             |
| ------ | ---------- | ----------------------- |
| GET    | `/`        | Health check            |
| POST   | `/control` | Control a device        |
| GET    | `/system`  | Device/system info      |
| GET    | `/sensors` | Sensor + device states  |
| GET    | `/all`     | Combined system+sensors |

## Documentation

- [ARCHITECTURE.md](./docs/ARCHITECTURE.md) — system design and data flow
- [WORKFLOW.md](./docs/WORKFLOW.md) — development setup and release checklist
