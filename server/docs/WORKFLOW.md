# ESP32 Server — Development Workflow

## Prerequisites

- **Arduino IDE** (v2.x) or **PlatformIO** (VS Code extension)
- **ESP32 board package** (ESP32 by Espressif Systems)
- USB-to-UART driver (CP2102 or CH340, depending on your board)

## Hardware Setup

1. Connect components per pin assignments in [ARCHITECTURE.md](./ARCHITECTURE.md).
2. Power the board via USB (5 V / 500 mA minimum).
3. Confirm the serial port is detected (e.g. `/dev/ttyUSB0`, `COM3`).

## Development Loop

### 1. Edit

Open `ESP32-Server.ino` in the Arduino IDE or PlatformIO.

Key areas:

- **Pin definitions** — change GPIO assignments at the top.
- **WiFi credentials** — update `ssid` and `password` for your network.
- **Endpoint handlers** — add/modify `handle*()` functions for new routes.
- **Control logic** — the `loop()` function's sensor-reading and auto-LED block.

### 2. Compile

**Arduino IDE:**

```
Sketch → Verify/Compile (Ctrl+R)
```

**PlatformIO:**

```bash
pio run
```

Resolve any serial-port or board-package errors before flashing.

### 3. Flash

**Arduino IDE:**

```
Sketch → Upload (Ctrl+U)
```

**PlatformIO:**

```bash
pio run --target upload
```

Hold the **BOOT** button on the ESP32 if auto-reset fails.

### 4. Monitor

Open the Serial Monitor at **115200 baud**:

**Arduino IDE:** `Tools → Serial Monitor (Ctrl+Shift+M)`

**PlatformIO:**

```bash
pio device monitor -b 115200
```

Expected startup output:

```
=== ESP32 IoT Dashboard ===
Connecting to WiFi: LOL
....
Connected! IP address: 192.168.x.x
mDNS responder started: http://esp32-server.local
HTTP server started on port 80
```

### 5. Test

Once the board is online:

```bash
# Health check
curl http://esp32-server.local/

# Turn on red light
curl -X POST http://esp32-server.local/control \
  -H "Content-Type: application/json" \
  -d '{"device":"red_light","state":1}'

# Read all sensors
curl http://esp32-server.local/all
```

## Common Issues

| Symptom             | Likely Cause            | Fix                               |
| ------------------- | ----------------------- | --------------------------------- |
| No serial output    | Wrong baud rate         | Set monitor to 115200             |
| Upload fails        | Board not in flash mode | Hold BOOT, press EN, release BOOT |
| WiFi not connecting | Wrong SSID/password     | Check credentials in sketch       |
| mDNS not resolving  | Network blocks mDNS     | Use IP address directly           |
| JSON parse errors   | Malformed POST body     | Validate JSON syntax              |

## Project Structure

```
server/
├── ESP32-Server.ino    # Main firmware (single-file sketch)
├── ArduinoJson.h       # JSON library header (bundled dependency)
├── ARCHITECTURE.md     # System design documentation
├── docs/WORKFLOW.md    # This file — development workflow
└── docs/README.md      # Project overview and quick-start
```
