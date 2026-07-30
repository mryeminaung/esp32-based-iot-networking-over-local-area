# ESP32 Server — Architecture

## Overview

The ESP32 server runs a lightweight HTTP REST API that exposes device control and sensor monitoring over the local network. It uses the **Arduino** with the **WebServer** library and **ArduinoJson** for serialization.

## Board

- **ESP32 DevKit V1**

## Network Topology

```
┌──────────────────────┐     Wi-Fi (STA)      ┌──────────────────┐
│   ESP32 DevKit V1    │ ◄──────────────────►  │  Client Devices │
│                      │   http://esp32.local  │  (Browser, App) │
│  WebServer :80       │                       │                 │
│  mDNS responder      │                       └─────────────────┘
└──────┬───────┬───────┘
       │       │
       ▼       ▼
  ┌────────┐ ┌──────────┐
  │ GPIO   │ │ Sensor   │
  │ Outputs│ │ Inputs   │
  └────────┘ └──────────┘
```

## Layers

### 1. Hardware Abstraction Layer (Pin Definitions)

All GPIO pins are defined as macros at the top of the sketch. PWM is configured at 1 kHz with 8-bit resolution (0–255).

| Component            | Pin    | Type      | Notes                   |
| -------------------- | ------ | --------- | ----------------------- |
| Red Light (LED)      | GPIO2  | Digital   | Auto/manual control     |
| Yellow Light (LED)   | GPIO4  | Digital   | Auto/manual control     |
| Green Light (LED)    | GPIO5  | Digital   | Auto/manual control     |
| White Light (LED)    | GPIO18 | Digital   | Manual only             |
| Fan (DC Motor)       | GPIO19 | PWM       | 0–100% duty cycle       |
| Relay Module         | GPIO21 | Digital   | On/off toggle           |
| Water Pump           | GPIO22 | Digital   | On/off toggle           |
| Soil Moisture Sensor | GPIO34 | Analog In | 0–100% (inverted scale) |

### 2. Network Layer

- **Wi-Fi Station (STA) mode** — connects to an existing access point.
- **Static hostname** — `esp32-server`.
- **mDNS** — advertised as `http://esp32-server.local` so clients can discover the device without an IP address.
- **CORS** — enabled for cross-origin requests from the web dashboard.

### 3. HTTP Server Layer

A `WebServer` on port 80 exposes the following REST endpoints:

#### `GET /`

- Plain-text health check.

#### `POST /control`

- **Body:** `{ "device": string, "state": 0|1, "value": number }`
- Controls any actuator. The `value` field is used for PWM devices (fan speed 0–100).
- **Manual override:** sending a command to `red_light`, `yellow_light`, or `green_light` defers the auto-moisture cycle for 2 seconds so the manual state is visible.

#### `GET /system`

- Returns device identity, IP, MAC, uptime, free heap, Wi-Fi SSID.

#### `GET /sensors`

- Returns soil moisture + all device on/off states.

#### `GET /all`

- Combined response of `/system` + `/sensors` — used by the dashboard poll loop to minimise requests.

### 4. Application Logic Layer

#### Sensor Reading

- `readSoilMoisture()` reads the analog pin, maps the raw 0–4095 range to 0–100% (inverted — dry soil reads high voltage), and constrains the result.

#### Auto LED Control (every 2 s)

| Moisture    | Red | Yellow | Green |
| ----------- | --- | ------ | ----- |
| ≤ 30% (dry) | ON  | OFF    | OFF   |
| 30–50%      | OFF | ON     | OFF   |
| ≥ 50% (wet) | OFF | OFF    | ON    |

#### WiFi Reconnect Guard

- Checks connection every 5 s and calls `WiFi.reconnect()` if dropped.

## Device Control Helpers

```cpp
void setLight(int pin, bool state)     // digitalWrite HIGH/LOW
void setPWMDevice(int pin, bool state, int value)  // ledcWrite with map(0–100 → 0–255)
```

## Data Flow

```
Client ──POST /control──► ESP32
                            │
                 ┌──────────┴──────────┐
                 │ Parse JSON body     │
                 │ Match device string │
                 │ Write GPIO          │
                 │ Update state vars   │
                 └──────────┬──────────┘
                            ▼
Client ◄── {"status":"ok"}── ESP32

Client ──GET /all──────────► ESP32
                            │
                 ┌──────────┴──────────┐
                 │ Read state vars     │
                 │ Serialize to JSON   │
                 └──────────┬──────────┘
                            ▼
Client ◄── {system + sensors}── ESP32
```

## Key Design Decisions

1. **No persistent storage** — state is held in RAM and resets on power cycle.
2. **Fat endpoint (/all)** — the dashboard polls every 3 s; a single combined response halves network round-trips.
3. **Manual override with deferral** — manual control of R/Y/G lights pauses the auto-cycle until the next sensor read (2 s), so the user sees their action take effect.
4. **PWM via ledc** — the ESP32 LED Control (ledc) peripheral provides hardware PWM without jitter.
