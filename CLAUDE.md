# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ESP32 IoT Networking Lab - A capstone project for "Arduino Based IoT Networking Over Local Area" course. Monorepo with two main subsystems:

- **IoT-dashboard/** - React web dashboard for monitoring and controlling ESP32 sensors/actuators
- **server/** - ESP32 Arduino firmware (single-file sketch)

## Commands

### IoT-dashboard (Web)

```bash
pnpm install          # Install dependencies
pnpm dev              # Start dev server at http://localhost:3000 (HMR, binds 0.0.0.0)
pnpm build            # Production build (tsc -b && vite build) → dist/
pnpm preview          # Serve production build locally
pnpm lint             # ESLint with TypeScript + React plugins
```

### ESP32 Firmware (server/)

```bash
# Arduino IDE: Open ESP32-Server.ino → Board: ESP32 Dev Module → Upload
# Serial Monitor: 115200 baud

# PlatformIO (if configured):
pio run                           # Compile
pio run --target upload           # Flash
pio device monitor -b 115200      # Monitor
```

## Environment Setup

Copy `.env.example` to `.env` in IoT-dashboard/:

```
VITE_ESP32_API_URL=http://192.168.x.x    # ESP32 IP address
VITE_DASHBOARD_URL=http://192.168.x.x:3000/  # Dashboard URL for QR code
VITE_API_TIMEOUT=5000                     # Request timeout in ms
```

## Architecture

### Frontend (4-Layer Architecture)

```
API Client Layer (src/api/)
    ↓
State Layer (src/store/dashboard.ts - Zustand)
    ↓
Sync Layer (src/features/dashboard/hooks/useEsp32Sync.ts)
    ↓
UI Layer (src/features/)
```

**Data Flow:**
- ESP32 → GET /all every 3s → Axios → useEsp32Sync → Zustand Store → React UI
- User toggle → sendCommand() → optimistic store update → POST /control
  - Success: add log entry
  - Failure: revert store, log error

### Key Patterns

- **Optimistic updates with revert**: Device control updates store immediately, sends HTTP request, reverts on failure
- **Fat endpoint**: ESP32 `/all` combines system info + sensor data to minimize round-trips
- **Consecutive failure tolerance**: Disconnected state only after 2 consecutive failures
- **Manual override deferral**: ESP32 defers auto-LED cycle for 2s after manual control

### Firmware (server/)

Single-file Arduino sketch (`ESP32-Server.ino`) with:
- WiFi + mDNS (esp32.local)
- REST API endpoints: `/all`, `/sensors`, `/system`, `/control`
- Capacitive soil moisture sensor (GPIO 34, inverted scale)
- PWM motor control (GPIO 19, 1kHz 8-bit)
- LED indicators: Red (GPIO 2), Yellow (GPIO 4), Green (GPIO 5)

## File Structure Conventions

- **Path alias**: `@/` → `./src/` (configured in vite.config.ts and tsconfig.app.json)
- **Feature-based organization**: Each feature (dashboard, experiments) has its own directory
- **Shared components**: Header, Footer, SplashScreen, ScrollToTop in `src/components/`
- **Theme**: CSS custom properties with `data-theme` attribute on `<html>`, not Tailwind's native dark mode

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 19 + TypeScript |
| Build | Vite 8 |
| Routing | react-router 8 |
| State | Zustand 5 |
| HTTP | Axios |
| Styling | Tailwind CSS 4 |
| Animation | framer-motion |
| Icons | lucide-react |
| Firmware | Arduino (ESP32) |

## Routing

| Path | Component | Purpose |
|------|-----------|---------|
| `/` | DashboardPage | Main monitoring/control interface |
| `/experiments` | ExperimentsPage | Experiment reference cards |
| `*` | NotFoundPage | 404 fallback |

## Common Tasks

**Adding a new dashboard component:**
1. Create in `src/features/dashboard/components/`
2. Import in `Dashboard.tsx`
3. Add motion wrapper with `section` variants for staggered animation
4. Read state from Zustand store via `useDashboardStore`

**Adding a new API endpoint:**
1. Add typed function in `src/api/esp32.ts`
2. If polling needed, update `useEsp32Sync.ts`
3. Add state/action to Zustand store if needed

**Modifying ESP32 endpoints:**
1. Edit `server/ESP32-Server.ino`
2. Update `server/docs/ARCHITECTURE.md` with new endpoint docs
3. Add corresponding API function in `src/api/esp32.ts`
