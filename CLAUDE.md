# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ESP32 IoT Networking Lab — Capstone project for "Arduino Based IoT Networking Over Local Area" course. Smart agriculture IoT platform with 4 subsystems:

- **IoT-web/** — React 19 web dashboard with role-based access (Vite 8)
- **IoT-api/** — Express 5 + Prisma 7 REST API (PostgreSQL)
- **IoT-mobile/** — React Native (Expo 54) mobile app
- **server/** — ESP32 Arduino firmware (single-file sketch)

## Commands

### Root (Dev Orchestration)

```bash
pnpm install:all    # Install all workspace dependencies
pnpm dev            # Run IoT-web + IoT-api concurrently
pnpm dev:web        # Run web dashboard only
pnpm dev:api        # Run API server only
pnpm build          # Build IoT-web
pnpm lint           # Lint IoT-web
```

### IoT-web (Web Dashboard)

```bash
pnpm install          # Install dependencies
pnpm dev              # Start dev server at http://localhost:3000 (HMR, binds 0.0.0.0)
pnpm build            # Production build (tsc -b && vite build) → dist/
pnpm preview          # Serve production build locally
pnpm lint             # ESLint with TypeScript + React plugins
```

### IoT-api (Backend Server)

```bash
pnpm install          # Install dependencies
pnpm dev              # Start dev server at http://localhost:8000 (tsx watch)
pnpm start            # Production start
pnpm build            # Compile TypeScript

# Prisma
npx prisma migrate dev        # Run migrations
npx prisma migrate deploy     # Deploy migrations (production)
npx prisma db seed            # Seed database (runs prisma/seed/index.ts)
npx prisma generate           # Regenerate Prisma client
npx prisma studio             # Open Prisma Studio
npx prisma db push            # Push schema without migration
npx prisma db pull            # Pull schema from database
npx prisma migrate status     # Check migration status
```

### IoT-mobile (Mobile App)

```bash
pnpm install          # Install dependencies
pnpm start            # Start Expo dev server
pnpm android          # Run on Android
pnpm ios              # Run on iOS
pnpm web              # Run on web
pnpm lint             # ESLint
```

### ESP32 Firmware (server/)

```bash
# Arduino IDE: Open ESP32-Server.ino → Board: ESP32 Dev Module → Upload
# Serial Monitor: 115200 baud
```

## Environment Setup

### IoT-api

Copy `.env.example` to `.env` in `IoT-api/`:

```
DATABASE_URL="postgresql://user:password@localhost:5432/iot_db"
PORT=8000
JWT_SECRET="your-access-token-secret"
JWT_REFRESH_SECRET="your-refresh-token-secret"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="changeme"
```

### IoT-web

Copy `.env.example` to `.env` in `IoT-web/`:

```
VITE_ESP32_API_URL=http://192.168.x.x        # ESP32 IP address
VITE_API_BASE_URL=http://localhost:8000       # IoT-api base URL
VITE_API_TIMEOUT=5000                         # Request timeout in ms
```

## Architecture

### Web Dashboard (IoT-web) — 4-Layer Architecture

```
API Client Layer (src/api/ — Axios with JWT interceptor)
    ↓
State Layer (src/store/ — Zustand)
    ↓
Sync Layer (hooks — useEsp32Sync)
    ↓
UI Layer (src/features/)
```

**Data Flow:**
- ESP32 → collectorService → PostgreSQL → API → Zustand Store → React UI
- Direct ESP32: GET /all every 3s → Axios → useEsp32Sync → Zustand Store → React UI
- User toggle → sendCommand() → optimistic store update → POST /control
  - Success: add log entry
  - Failure: revert store, log error

**State Stores:**
- `use-dashboard-store` — Sensor readings (soilMoisture, temperature, humidity, waterLevel, light, airQuality), device states, sys info, logs, theme
- `use-auth-store` — User, JWT access token, login/logout, initialization, auto-refresh
- `use-header-store` — Header title/description per page

**API Client (src/api/client.ts):**
- Axios instance with `VITE_API_BASE_URL` base
- Request interceptor: attaches `Authorization: Bearer <token>` from localStorage
- Response interceptor: on 401, attempts token refresh via `/api/auth/refresh` cookie, queues concurrent requests, redirects to `/login` on failure

**Role-Based Dashboards (src/features/dashboard/components/):**
- `ManagerDashboard` — Stat cards (status, moisture, active devices, users), device status grid, soil moisture bar, recent activity, quick actions (analytics, users, automation)
- `WorkerDashboard` — System info, sensor cards, moisture indicators, system decision, quick controls, farm overview
- `TechnicianDashboard` — Connection banner, system info grid, sensor reading gauge, device health grid, quick links (diagnostics, device info)

**Navigation (src/config/navigation.ts):**
- Role-filtered sidebar sections: Main, Analytics, Management, Settings
- Farm Manager: Dashboard, Sensors, Actuators, Analytics, Activity, Users, Automation, Settings
- Farm Worker: Dashboard, Sensors, Actuators, Activity, Settings
- Technician: Dashboard, Sensors, Actuators, Device Info, Diagnostics, Settings

### API Server (IoT-api) — Express + Prisma

```
server.ts (entry point)
  ↓
Routes (src/routes/)
  ↓
Controllers (src/controllers/)
  ↓
Services (src/services/)
  ↓
Prisma Client (generated/prisma/)
  ↓
PostgreSQL
```

**Services:**
- `collectorService` — Polls ESP32 `/sensors` every 60s (configurable via `COLLECTION_INTERVAL_MS`), stores readings, evaluates automation rules
- `sensorService` — CRUD for SensorReading model, analytics aggregation
- `automationService` — Rule evaluation engine (threshold checks → action dispatch to ESP32)
- `activityService` — Activity logging with pagination and filtering
- `authService` — JWT generation (access 15m + refresh 7d), bcrypt hashing, HTTP-only cookie refresh tokens
- `userService` — User CRUD with role-based access control
- `deviceService` — Device state management (proxies to ESP32)

**Middleware:**
- `authMiddleware` — JWT verification (access token from `Authorization` header)
- `validateMiddleware` — Zod schema validation for request bodies

**Auth Flow:**
- Login → access token (15m) + refresh token (7d, HTTP-only cookie)
- Auto-refresh: frontend interceptor sends POST `/api/auth/refresh` on 401, queues concurrent requests
- Logout → invalidate refresh token in database

**Permissions (src/config/permissions.ts):**
- Permission constants: `USERS_READ`, `USERS_MANAGE`, `SENSORS_READ`, `DEVICES_READ`, `DEVICES_CONTROL`, `AUTOMATION_CONFIGURE`, `LOGS_READ`, `ACTIVITY_READ`, `NETWORK_READ`, `DIAGNOSTICS_READ`, `SYSTEM_CONFIGURE`
- `hasPermission(role, permission)` utility

### Mobile App (IoT-mobile) — Expo Router

```
app/_layout.tsx (root layout — splash screen + theme provider)
  ↓
app/(tabs)/_layout.tsx (custom animated tab bar)
  ↓
app/(tabs)/index.tsx      — Home/Dashboard (soil moisture gauge, system info, alerts)
app/(tabs)/sensors.tsx    — Sensor readings (temp, humidity, light, water, air quality)
app/(tabs)/devices.tsx    — Device controls (quick actions, device groups)
app/(tabs)/settings.tsx   — Settings (ESP32 connection, theme, polling, thresholds)
```

**Structure:**
- `features/dashboard/` — Dashboard screen, sensor cards, moisture gauge, alert banner, system info
- `features/devices/` — Device cards, fan slider, quick actions
- `features/sensors/` — Sensor list with trend indicators and grouped display
- `features/settings/` — ESP32 connection test, device info, theme toggle, polling interval, alert thresholds
- `features/navigation/` — Custom animated tab bar with haptic feedback
- `features/splash/` — Animated splash screen with wave effects
- `api/` — Axios client + ESP32 API functions (direct to ESP32)
- `store/` — Zustand dashboard store with AsyncStorage persistence
- `hooks/` — Theme resolution (light/dark/system)
- `constants/` — Colors, SensorColors, navigation theme
- `types/` — Shared type definitions with sensor condition helpers

### Firmware (server/)

Single-file Arduino sketch (`ESP32-Server.ino`) with:
- WiFi + mDNS (`esp32.local`)
- REST API: `/all`, `/sensors`, `/system`, `/control`
- Sensors: DHT22 (temp, humidity), capacitive soil moisture (GPIO 34), BH1750 (light), MQ-135 (air quality), water level
- Actuators: PWM motor (GPIO 19), Red/Yellow/Green/White LEDs, relay, water pump
- Optimistic LED auto-cycle with manual override deferral (2s)

## Key Patterns

- **Optimistic updates with revert**: Device control updates store immediately, sends HTTP request, reverts on failure
- **Fat endpoint**: ESP32 `/all` combines system info + sensor data to minimize round-trips
- **Consecutive failure tolerance**: Disconnected state only after 2 consecutive failures
- **Manual override deferral**: ESP32 defers auto-LED cycle for 2s after manual control
- **Role-based dashboards**: Dashboard components are selected based on user role
- **Collector service**: API server polls ESP32 and stores readings in PostgreSQL for historical analytics
- **Automation engine**: Server evaluates threshold-based rules against sensor readings and dispatches actions to ESP32
- **JWT auto-refresh**: Frontend interceptor transparently refreshes access tokens using HTTP-only refresh cookie
- **Request queuing**: Concurrent 401 responses are queued and retried after token refresh
- **Persistent mobile settings**: Polling interval and thresholds stored in AsyncStorage
- **Moisture thresholds**: Configurable DRY/MOIST/OPTIMAL boundaries (mobile: user-adjustable, web: hardcoded at 30%/50%)

## File Structure Conventions

- **Path alias**: `@/` → `./src/` (configured in `IoT-web/vite.config.ts` and `IoT-web/tsconfig.app.json`)
- **Feature-based organization**: Each feature has its own directory under `src/features/`
- **Shared components**: AppLayout, Sidebar, TopBar, ProtectedRoute, RoleRoute, PageHeader in `src/components/`
- **UI components**: shadcn components in `src/components/ui/` (Card, Button, Dialog, Select, Toast, etc.)
- **Theme (web)**: CSS custom properties with `data-theme` attribute on `<html>`, not Tailwind's native dark mode
- **Theme (mobile)**: Light/dark/system via `useResolvedTheme` hook + `Colors` constants
- **Prisma schema**: `IoT-api/prisma/schema.prisma` with PostgreSQL
- **Generated Prisma client**: `IoT-api/generated/prisma/` (not `node_modules`)
- **Prisma config**: `IoT-api/prisma.config.ts` for driver adapter configuration
- **Mobile types**: `IoT-mobile/types/index.ts` defines shared types and sensor condition helpers

## Tech Stack

| Layer | Technology |
|-------|------------|
| Web Framework | React 19 + TypeScript 6 |
| Web Build | Vite 8 |
| Web Routing | react-router 8 |
| Web State | Zustand 5 |
| Web Styling | Tailwind CSS 4, shadcn |
| Web Charts | recharts 3 |
| Web Animation | framer-motion 12 |
| Web Icons | lucide-react |
| Web QR | qrcode.react |
| Mobile Framework | React Native 0.81 + Expo 54 |
| Mobile Routing | Expo Router 6 |
| Mobile State | Zustand 5 |
| Mobile Animation | react-native-reanimated 4 |
| Mobile Storage | @react-native-async-storage/async-storage |
| Mobile Haptics | expo-haptics |
| API Server | Express 5 |
| ORM | Prisma 7 |
| Database | PostgreSQL |
| Auth | JWT (access + refresh tokens, HTTP-only cookies) |
| Validation | Zod 4 |
| Firmware | Arduino (ESP32) |

## Routing

### Web (IoT-web)

| Path | Component | Access |
|------|-----------|--------|
| `/login` | LoginPage | Public |
| `/experiments` | ExperimentsPage | Public |
| `/` | DashboardPage | All authenticated (role-specific view) |
| `/sensors` | SensorsPage | All authenticated (technician: health only) |
| `/actuators` | ActuatorsPage | All authenticated |
| `/activity` | ActivityLogPage | farm_manager, farm_worker |
| `/analytics` | AnalyticsPage | farm_manager |
| `/automation` | AutomationPage | farm_manager |
| `/users` | UserManagementPage | farm_manager |
| `/devices` | DeviceInfoPage | technician |
| `/diagnostics` | DiagnosticsPage | technician |
| `/settings` | SettingsLayout | All authenticated |
| `/settings/profile` | ProfilePage | All authenticated |
| `/settings/security` | SecurityPage | All authenticated |
| `/settings/theme` | ThemePage | All authenticated |
| `/settings/account` | AccountPage | All authenticated |
| `*` | NotFoundPage | Fallback |

### API (IoT-api)

| Route | Method | Description |
|-------|--------|-------------|
| `/api/auth/login` | POST | Login (returns access token + refresh cookie) |
| `/api/auth/logout` | POST | Invalidate refresh token |
| `/api/auth/refresh` | POST | Refresh access token from cookie |
| `/api/auth/me` | GET | Get current user |
| `/api/sensors/readings` | GET | Sensor readings (paginated, filterable by device/date) |
| `/api/sensors/latest` | GET | Latest sensor reading |
| `/api/sensors/analytics` | GET | Daily statistics (filterable by date range) |
| `/api/devices` | GET | Get device states from ESP32 |
| `/api/devices/control` | POST | Control device on ESP32 |
| `/api/automation` | GET/POST | List/create automation rules |
| `/api/automation/:id` | PATCH/DELETE | Update/delete automation rule |
| `/api/activity` | GET/POST | Get/create activity logs (paginated, filterable) |
| `/api/users` | GET/POST | List/create users (admin) |
| `/api/users/:id` | PATCH/DELETE | Update/delete user (admin) |

## Common Tasks

**Adding a new web dashboard feature:**
1. Create feature directory in `src/features/` with page and components
2. Add route in `App.tsx` (wrap with `RoleRoute` if role-restricted)
3. Add nav item in `src/config/navigation.ts` with role array
4. Add state/actions to Zustand store if needed
5. Add API client function in `src/api/`

**Adding a new API endpoint:**
1. Create Zod schema in `src/validations/`
2. Add controller in `src/controllers/`
3. Add service method in `src/services/`
4. Add route in `src/routes/` and register in `server.ts`

**Adding a new sensor type:**
1. Add field to `SensorReading` model in `IoT-api/prisma/schema.prisma`
2. Run `npx prisma migrate dev`
3. Update `collectorService.ts` to map the new field from ESP32 response
4. Add sensor card in `IoT-web/src/features/sensors/`
5. Add sensor type to dashboard store types
6. Add type helpers in `IoT-mobile/types/index.ts` if needed

**Modifying ESP32 endpoints:**
1. Edit `server/ESP32-Server.ino`
2. Update `IoT-api/src/services/collectorService.ts` if endpoint changes affect collection
3. Update `IoT-web/src/api/esp32.ts` for direct ESP32 calls
4. Update `IoT-mobile/api/esp32.ts` for mobile direct ESP32 calls

**Adding a new mobile feature:**
1. Create screen in `app/(tabs)/` or new route group
2. Add feature components in `features/`
3. Update tab bar config in `app/(tabs)/_layout.tsx` if adding a new tab
4. Add API function in `api/` if calling ESP32 directly
