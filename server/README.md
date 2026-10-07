# ESP32 Server — IoT Firmware

Arduino-based firmware for the ESP32 DevKit V1 that powers the IoT Networking Lab's smart agriculture system. Exposes a REST API over Wi-Fi for device control and sensor monitoring.

## Features

- **REST API** — 6 endpoints for device control, sensor reading, system info, and config
- **Auto LED feedback** — Red/Yellow/Green LEDs indicate soil moisture level (dry / moist / wet)
- **Auto grow light** — White LED turns on when light level drops below threshold
- **Auto buzzer** — Alerts on critical water level or dry soil
- **mDNS discovery** — reachable at `http://esp32-server.local`
- **CORS enabled** — works with cross-origin web dashboards
- **WiFi reconnect guard** — auto-reconnects on link loss
- **Configurable thresholds** — Backend can push threshold updates via POST `/config`

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

### Output Devices (Actuators)

| Device       | GPIO | Type        |
| ------------ | ---- | ----------- |
| Red Light    | 2    | Digital OUT |
| Yellow Light | 4    | Digital OUT |
| Green Light  | 5    | Digital OUT |
| White Light  | 18   | Digital OUT |
| Relay        | 21   | Digital OUT |
| Water Pump   | 22   | Digital OUT |
| Buzzer       | 25   | Digital OUT |

### Input Devices (Sensors)

| Device              | GPIO       | Type        |
| ------------------- | ---------- | ----------- |
| Soil Moisture       | 34         | Analog IN   |
| Water Level         | 35         | Analog IN   |
| Air Quality (MQ-135)| 39         | Analog IN   |
| DHT22 (Temp/Humid)  | 13         | Digital IN  |
| BH1750 Light (I2C)  | 26 (SDA)   | I2C IN      |
| BH1750 Light (I2C)  | 27 (SCL)   | I2C IN      |

**Note:** GPIO 21/22 are reserved for relay + pump, so BH1750 I2C uses GPIO 26/27 (not the ESP32 default 21/22).
Light is reported as 0–100% (BH1750 lux mapped: 0–1000 lx → 0–100%).

## API Endpoints

| Method | Path        | Description                                |
| ------ | ----------- | ------------------------------------------ |
| GET    | `/`         | API documentation landing page             |
| GET    | `/all`      | Combined system info + sensor data         |
| GET    | `/system`   | System info (IP, MAC, uptime, free heap)   |
| GET    | `/sensors`  | Sensor readings + device states            |
| POST   | `/control`  | Control device (lights, pump, relay, buzzer)|
| POST   | `/config`   | Update thresholds and buzzer settings      |

### Control Devices

```bash
curl -X POST http://esp32-server.local/control \
  -H "Content-Type: application/json" \
  -d '{"device": "water_pump", "state": 1}'

# Devices: red_light, yellow_light, green_light, white_light, relay, water_pump, buzzer
# States: 1 = ON, 0 = OFF
```

### Update Config

```bash
curl -X POST http://esp32-server.local/config \
  -H "Content-Type: application/json" \
  -d '{"soilDryThreshold": 30, "buzzerEnabled": true}'
```

## Documentation

- [ARCHITECTURE.md](./docs/ARCHITECTURE.md) — system design and data flow
- [WORKFLOW.md](./docs/WORKFLOW.md) — development setup and release checklist
