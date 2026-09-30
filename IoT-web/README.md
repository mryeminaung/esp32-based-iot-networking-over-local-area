# IoT Dashboard

React 19 + TypeScript + Vite 8 dashboard for monitoring and controlling the ESP32 IoT Networking Lab's smart agriculture system.

## Features

- **Real-time monitoring** — polls the backend every 3s for sensor data
- **Device control** — on/off toggles for lights, pump, relay, buzzer
- **Role-based dashboards** — different views for farm_manager, farm_worker, technician
- **User management** — CRUD users with role-based access (farm_manager only)
- **Device settings** — configure soil/water thresholds, buzzer settings (farm_manager only)
- **Analytics** — daily aggregated sensor stats with interactive charts (farm_manager only)
- **Activity logs** — filterable table of all device control events
- **Diagnostics** — ESP32 system info and connection health (technician only)
- **Dark / light theme** — persisted to localStorage
- **Responsive layout** — works on desktop and mobile
- **Page animations** — staggered framer-motion transitions
- **JWT auto-refresh** — transparent token refresh with request queuing

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 19 + TypeScript 6 |
| Build | Vite 8 |
| Routing | react-router 8 |
| State | Zustand 5 |
| HTTP | Axios |
| Styling | Tailwind CSS 4 |
| UI Components | shadcn |
| Animation | framer-motion 12 |
| Charts | recharts 3 |
| Icons | lucide-react |
| QR Code | qrcode.react |

## Getting Started

```bash
# Install dependencies
pnpm install

# Configure environment
cp .env.example .env
# Edit .env with your backend and ESP32 URLs

# Start development server
pnpm dev
```

Open `http://localhost:3000`.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_ESP32_API_URL` | ESP32 direct API URL | `http://192.168.x.x` |
| `VITE_API_BASE_URL` | Backend API (IoT-api) | `http://localhost:8000` |
| `VITE_API_TIMEOUT` | Request timeout (ms) | `5000` |

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start Vite dev server |
| `pnpm build` | Production build (tsc -b && vite build) |
| `pnpm preview` | Serve built output |
| `pnpm lint` | Run ESLint |

## Pages & Role Access

| Route | Page | Farm Manager | Farm Worker | Technician |
|-------|------|:---:|:---:|:---:|
| `/` | Landing | ✅ | ✅ | ✅ |
| `/login` | Login | ✅ | ✅ | ✅ |
| `/dashboard` | Dashboard | ✅ | ✅ | ✅ |
| `/sensors` | Sensors | ✅ | ✅ | ✅ |
| `/actuators` | Actuators | ✅ | ✅ | ✅ |
| `/activity` | Activity Logs | ✅ | ✅ | ❌ |
| `/analytics` | Analytics | ✅ | ❌ | ❌ |
| `/users` | User Management | ✅ | ❌ | ❌ |
| `/device-settings` | Device Settings | ✅ | ❌ | ❌ |
| `/diagnostics` | Diagnostics | ❌ | ❌ | ✅ |
| `/settings` | Settings | ✅ | ✅ | ✅ |

## Project Structure

```
src/
├── api/                    # API client functions
│   ├── client.ts           # Axios instance with JWT interceptor
│   ├── auth.ts             # Login, logout, refresh, me
│   ├── esp32.ts            # Direct ESP32 API calls
│   └── sensors.ts          # Sensor readings & analytics
├── components/             # Shared UI components
│   ├── AppLayout.tsx       # Main layout wrapper
│   ├── Sidebar.tsx         # Role-filtered navigation
│   ├── TopBar.tsx          # Header with user menu
│   ├── ProtectedRoute.tsx  # Auth guard
│   ├── RoleRoute.tsx       # Role-based guard
│   └── ui/                 # shadcn components (Card, Button, Dialog, etc.)
├── config/
│   ├── navigation.ts       # Nav items with role arrays
│   └── roles.ts            # Role constants
├── features/
│   ├── auth/               # Login page
│   ├── landing/            # Landing page
│   ├── dashboard/          # Role-specific dashboards
│   │   ├── ManagerDashboard.tsx
│   │   ├── WorkerDashboard.tsx
│   │   └── TechnicianDashboard.tsx
│   ├── sensors/            # Sensor cards, moisture gauge
│   ├── actuators/          # Device control toggles
│   ├── analytics/          # Charts, date range, summary cards
│   ├── users/              # User CRUD, modals, table
│   ├── device-settings/    # Threshold & buzzer config
│   ├── diagnostics/        # ESP32 system info
│   ├── activity/           # Activity log table
│   └── settings/           # Profile, security, theme, account, QR code
├── hooks/                  # Custom hooks (useEsp32Sync, useHeader, useTheme)
├── lib/                    # Utilities (moistureUtils, cn)
├── store/
│   ├── use-auth-store.ts   # Auth state + JWT refresh
│   ├── use-dashboard-store.ts  # Sensor readings, device states
│   └── use-header-store.ts # Page title/description
└── index.css               # Tailwind + CSS custom properties (theme)
```

## Architecture

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

## Documentation

- [ARCHITECTURE.md](./docs/ARCHITECTURE.md) — layer architecture, data flow, routing
- [WORKFLOW.md](./docs/WORKFLOW.md) — development setup, common tasks, release checklist
- [DESIGN.md](./docs/DESIGN.md) — design system, theme tokens
