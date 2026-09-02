# ESP32 IoT Networking Over Local Area

A capstone project for **Arduino Based IoT Networking Over Local Area** — a smart agriculture IoT platform with real-time sensor monitoring, device control, and automation.

## Project Structure

```
├── IoT-web/          # React web dashboard (Vite)
├── IoT-api/          # Express + Prisma REST API server
├── IoT-mobile/       # React Native (Expo) mobile app
├── server/           # ESP32 Arduino firmware
└── package.json      # Root scripts for dev orchestration
```

## Prerequisites

- [Node.js](https://nodejs.org/) >= 18
- [pnpm](https://pnpm.io/) (package manager)
- [PostgreSQL](https://www.postgresql.org/) (for IoT-api)
- [Arduino IDE](https://www.arduino.cc/en/software) or [PlatformIO](https://platformio.org/) (for ESP32 firmware)
- An ESP32 Dev Board

## Quick Start

### 1. Install Dependencies

```bash
pnpm install:all
```

Or install each workspace individually:

```bash
cd IoT-web && pnpm install
cd ../IoT-api && pnpm install
cd ../IoT-mobile && pnpm install
```

### 2. Environment Setup

**IoT-api/** — copy `.env.example` to `.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/iot_db"
PORT=8000
JWT_SECRET="your-access-token-secret"
JWT_REFRESH_SECRET="your-refresh-token-secret"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="changeme"
```

**IoT-web/** — copy `.env.example` to `.env`:

```env
VITE_ESP32_API_URL=http://192.168.x.x        # ESP32 IP address
VITE_API_BASE_URL=http://localhost:8000       # IoT-api base URL
VITE_API_TIMEOUT=5000                         # Request timeout in ms
```

### 3. Set Up Database

```bash
cd IoT-api
npx prisma migrate dev
npx prisma db seed
```

### 4. Run Everything

```bash
pnpm dev          # Runs IoT-web + IoT-api concurrently
```

Or run individually:

```bash
pnpm dev:web      # Web dashboard on http://localhost:3000
pnpm dev:api      # API server on http://localhost:8000
```

### 5. Upload ESP32 Firmware

1. Open `server/ESP32-Server.ino` in Arduino IDE
2. Select Board: **ESP32 Dev Module**
3. Upload and open Serial Monitor at **115200 baud**

## Subsystems

### IoT-web (Web Dashboard)

React 19 + TypeScript + Vite 8 web dashboard with role-based access control.

| Feature | Description |
|---------|-------------|
| Dashboard | Real-time sensor overview with role-specific views (Manager/Worker/Technician) |
| Sensors | Detailed sensor readings (soil, temperature, humidity, light, air quality, water level) |
| Actuators | Device control (LEDs, water pump, relay) with quick controls |
| Analytics | Charts and statistics for sensor data with date range picker |
| Automation | Rule-based automation management (CRUD, toggle, filter) |
| Activity Log | System activity history with device/action/date filters and pagination |
| Diagnostics | Device health, sensor health, actuator testing (technician view) |
| Settings | Profile, security, theme, and account settings |
| User Management | Admin user CRUD (farm_manager only) |
| Experiments | IoT experiment reference cards (5 experiments) |
| Device Info | ESP32 system information (technician view) |
| Login | JWT-based authentication with auto-refresh |

### IoT-api (Backend Server)

Express 5 + Prisma 7 + PostgreSQL REST API.

**Endpoints:**

| Route | Method | Description |
|-------|--------|-------------|
| `/api/auth/login` | POST | Login and receive JWT tokens |
| `/api/auth/logout` | POST | Invalidate refresh token |
| `/api/auth/refresh` | POST | Refresh access token |
| `/api/auth/me` | GET | Get current authenticated user |
| `/api/sensors/readings` | GET | Get sensor readings (paginated, filterable) |
| `/api/sensors/latest` | GET | Get most recent reading |
| `/api/sensors/analytics` | GET | Get daily statistics with date range |
| `/api/devices` | GET | Get device states from ESP32 |
| `/api/devices/control` | POST | Control device on ESP32 |
| `/api/automation` | GET/POST | List/create automation rules |
| `/api/automation/:id` | PATCH/DELETE | Update/delete automation rule |
| `/api/activity` | GET/POST | Get/create activity logs (paginated, filterable) |
| `/api/users` | GET/POST | List/create users (admin) |
| `/api/users/:id` | PATCH/DELETE | Update/delete user (admin) |

**Architecture:**

- **collectorService** — Polls ESP32 `/sensors` every 60s, stores readings in PostgreSQL, evaluates automation rules
- **JWT auth** — Access token (15m) + refresh token (7d, HTTP-only cookie) with auto-refresh interceptor
- **Role-based access** — farm_manager, farm_worker, technician with permission constants
- **Zod validation** — Request body validation on all endpoints

### IoT-mobile (Mobile App)

React Native + Expo Router 6 mobile app for on-the-go monitoring.

**Tabs:**

| Tab | Description |
|-----|-------------|
| Home | Soil moisture gauge, system info, alert banner |
| Sensors | Temperature, humidity, light, water level, air quality with trend indicators |
| Devices | Device controls (water pump, grow light, fan, relay) with quick actions |
| Settings | ESP32 connection, device info, theme (light/dark/system), polling interval, alert thresholds |

**Features:**
- Custom animated tab bar with haptic feedback
- Configurable polling interval (1s–30s)
- Customizable moisture alert thresholds
- Connection test to ESP32
- Splash screen with animated waves

### ESP32 Firmware (server/)

Single-file Arduino sketch (`ESP32-Server.ino`) with:
- WiFi + mDNS (`esp32.local`)
- REST API: `/all`, `/sensors`, `/system`, `/control`
- Sensors: DHT22 (temp, humidity), capacitive soil moisture (GPIO 34), light (BH1750), air quality (MQ-135), water level
- Actuators: PWM motor (GPIO 19), Red/Yellow/Green/White LEDs, relay, water pump
- Optimistic LED auto-cycle with manual override deferral (2s)

## Tech Stack

| Layer | Technology |
|-------|------------|
| Web Dashboard | React 19, TypeScript 6, Vite 8, Zustand 5, Tailwind CSS 4, shadcn |
| Web Charts | recharts 3 |
| Web Animation | framer-motion 12 |
| Mobile App | React Native 0.81, Expo 54, Expo Router 6, Zustand 5 |
| Mobile Animation | react-native-reanimated 4 |
| API Server | Express 5, Prisma 7, PostgreSQL, JWT (jsonwebtoken), Zod 4 |
| Auth | bcryptjs, HTTP-only refresh cookies, access token in localStorage |
| Firmware | Arduino (ESP32), DHT22, BH1750, MQ-135 |
| Build/Dev | pnpm workspaces, concurrently, tsx |

## Roles

| Role | Dashboard View | Access |
|------|---------------|--------|
| `farm_manager` | Full overview with stats, activity log, quick actions | Analytics, automation, users, activity, settings |
| `farm_worker` | Simplified sensor overview | Sensors, actuators, activity, settings |
| `technician` | Device status, system info, health grid | Device info, diagnostics, settings |

## Default Credentials

After seeding: `admin@example.com` / `changeme` (farm_manager role)

## License

This project is for educational purposes (capstone project).
