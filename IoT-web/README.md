# IoT Dashboard

React + TypeScript + Vite dashboard for monitoring and controlling the ESP32 IoT Networking Lab's smart agriculture system.

## Features

- **Real-time monitoring** — polls the backend every 3s for sensor data
- **Device control** — on/off toggles + PWM slider for fan speed
- **User management** — CRUD users with role-based access (farm_manager, farm_worker, technician)
- **Analytics** — daily aggregated sensor stats with interactive charts
- **Activity logs** — filterable table of all device control events
- **Device info** — ESP32 system details (IP, MAC, uptime, WiFi)
- **Dark / light theme** — persisted to localStorage
- **Responsive layout** — works on desktop and mobile
- **Page animations** — staggered framer-motion transitions

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 19 + TypeScript |
| Build | Vite 8 |
| Routing | react-router 8 |
| State | Zustand 5 |
| HTTP | Axios |
| Styling | Tailwind CSS 4 |
| UI Components | Base UI + shadcn |
| Animation | framer-motion |
| Charts | recharts |
| Icons | lucide-react |

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
| `VITE_ESP32_API_URL` | ESP32 API base URL | `http://192.168.x.x` |
| `VITE_API_BASE_URL` | Backend API (IoT-api) | `http://localhost:8000` |
| `VITE_API_TIMEOUT` | Request timeout (ms) | `5000` |

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start Vite dev server |
| `pnpm build` | Production build (tsc -b && vite build) |
| `pnpm preview` | Serve built output |
| `pnpm lint` | Run ESLint |

## Pages

| Route | Page | Access |
|-------|------|--------|
| `/` | Dashboard | All roles |
| `/sensors` | Sensors & Devices | All roles |
| `/actuators` | Actuators & Irrigation | All roles |
| `/analytics` | Sensor Analytics | All roles |
| `/devices` | Device Info | farm_manager, technician |
| `/users` | User Management | farm_manager |
| `/activity` | Activity Logs | farm_manager |
| `/settings` | Account Settings | All roles |

## Project Structure

```
src/
├── api/                  # API client functions (auth, sensors, activity)
├── components/           # Shared UI components (Header, Footer, ui/)
├── config/               # Navigation, roles
├── features/             # Feature-based pages
│   ├── auth/             # Login page
│   ├── dashboard/        # Main dashboard + device cards
│   ├── sensors/          # Sensor cards, moisture gauge
│   ├── actuators/        # Device control toggles & sliders
│   ├── analytics/        # Charts, date range, summary cards
│   ├── users/            # User CRUD, modals, table
│   ├── devices/          # ESP32 system info
│   ├── activity/         # Activity log table
│   ├── settings/         # Profile, security, theme, account
│   └── experiments/      # Experiment reference cards
├── hooks/                # Custom hooks (useHeader, useTheme)
├── lib/                  # Utilities (moistureUtils, cn)
├── store/                # Zustand stores (auth, dashboard, header)
└── index.css             # Tailwind + CSS custom properties
```

## Documentation

- [ARCHITECTURE.md](./docs/ARCHITECTURE.md) — layer architecture, data flow, routing
- [WORKFLOW.md](./docs/WORKFLOW.md) — development setup, common tasks, release checklist
- [DESIGN.md](./docs/DESIGN.md) — design system, theme tokens
