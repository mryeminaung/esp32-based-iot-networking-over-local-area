# IoT Dashboard — Architecture

## Overview

Single-page React application built with Vite + TypeScript that communicates with an ESP32 server over the local network. Uses **Zustand** for state management, **Axios** for HTTP, and **Tailwind CSS** for styling.

## Stack

| Layer      | Choice                   |
| ---------- | ------------------------ |
| Framework  | React 19 + TypeScript    |
| Build tool | Vite                     |
| State      | Zustand                  |
| HTTP       | Axios                    |
| Styling    | Tailwind CSS + shadcn/ui |

## Network Topology

```
┌──────────────────┐     LAN      ┌──────────────────────┐
│  Browser (React) │ ◄──────────► │  ESP32 DevKit V1     │
│  localhost:3000  │   HTTP/JSON  │  WebServer :80       │
└──────────────────┘              └──────────────────────┘
```

## Layer Architecture

### 1. API Client Layer

**`src/api/client.ts`**

- Creates an Axios instance configured with the base URL from `VITE_ESP32_API_URL` and a configurable timeout.
- Single source of truth for all HTTP configuration and headers.

**`src/api/esp32.ts`**

- Typed functions wrapping each ESP32 REST endpoint.
- Exports TypeScript types (`SystemInfo`, `Sensors`, `AllData`, `ControlResult`) that mirror the ESP32 JSON response.

```
┌───────────────────────────────┐
│        API Layer              │
│                               │
│  getAll() → GET /all          │
│  getSystemInfo() → GET /system│
│  getSensors() → GET /sensors  │
│  controlDevice() → POST /ctrl │
└──────┬────────────────────────┘
       │ Axios
       ▼
    ESP32 Server
```

### 2. State Layer (Zustand Store)

**`src/store/dashboard.ts`**

Central store holding:

- `connected` / `connecting` — connection lifecycle flags
- `devices` — map of `DeviceKey` → `boolean | number` (e.g. `fan: 0`)
- `sysInfo` — device identity and network metadata
- `moisture` — latest soil moisture percentage
- `logs` — ring buffer of activity log entries (last 100)
- `theme` — `"light"` | `"dark"` (persisted to `localStorage`)

Actions on the store:
| Action | Purpose |
|---------------------|-------------------------------------------|
| `syncFromESP32` | Bulk-update state from `/all` response |
| `toggleDevice` | Optimistic toggle for on/off devices |
| `setSlider` | Optimistic value set for PWM devices |
| `addLog` | Append a timestamped log entry |
| `setDisconnected` | Mark connection lost |

### 3. Sync Hook

**`src/features/dashboard/hooks/useEsp32Sync.ts`**

A `useEffect`-based polling hook that:

1. Calls `getAll()` every **3 seconds**.
2. On success — maps the ESP32 response keys to store keys and calls `syncFromESP32`.
3. On consecutive failure (≥2) — calls `setDisconnected()` and logs the disconnection.
4. On reconnect — logs "Connected to ESP32".
5. On moisture change — logs the new value with a label (Dry / Moist / Wet).

#### Device Mapping

The hook maps ESP32's flat JSON keys to the store's `DeviceKey` shape:

- Boolean devices (`red_light`, `yellow_light`, ...) — direct pass-through.
- Slider devices (`fan`) — reads the companion `fanValue` field for the percentage.

### 4. UI Layer

Organised under `src/features/dashboard/components/`:

| Component       | Purpose                                   |
| --------------- | ----------------------------------------- |
| `Dashboard`     | Main layout grid                          |
| `Header`        | Title, connection indicator, theme toggle |
| `SensorCard`    | Soil moisture gauge + percentage display  |
| `MoistureCard`  | Alternative moisture visualisation        |
| `RadialGauge`   | SVG-based gauge component                 |
| `QuickControls` | On/off toggles for each device            |
| `ControlItem`   | Individual device toggle/slider UI        |
| `ActivityLog`   | Scrolling log of events                   |
| `SystemInfo`    | Device IP, MAC, uptime, firmware info     |
| `CardContainer` | Reusable card wrapper                     |
| `Footer`        | Status bar                                |

## Data Flow

```
ESP32 ──GET /all──► Axios ──► esp32.ts: getAll()
                                    │
                                    ▼
                           useEsp32Sync hook
                                    │
                         ┌──────────┴──────────┐
                         │ Key mapping         │
                         │ Log changes         │
                         └──────────┬──────────┘
                                    │ syncFromESP32()
                                    ▼
                           Zustand Store
                                    │
                         ┌──────────┴───────────┐
                         │                      │
                         ▼                      ▼
                   Dashboard UI            Logs UI
                   (re-renders)           (re-renders)
```

## User Interaction Flow (Device Control)

```
User clicks toggle ──► ControlItem ──► sendCommand(key, state)
                                           │
                              ┌────────────┴────────────┐
                              │ Optimistic: update store│
                              │ then: POST /control     │
                              └────────────┬────────────┘
                                           │
                              ┌────────────┴──────────────────────┐
                              │ success → addLog("turned on")     │
                              │ failure → revert store, log error │
                              └───────────────────────────────────┘
```

## Theming

- Theme state is stored in Zustand and backed by `localStorage`.
- `toggleTheme()` switches between `"light"` and `"dark"`.
- Tailwind's `dark:` variant handles style overrides.

## Routing

- **`/`** — `DashboardPage` (main monitoring interface)
- **`/experiments`** — `ExperimentsPage` (experiment reference cards)
