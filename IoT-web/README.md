# IoT Dashboard

React + TypeScript + Vite dashboard for monitoring and controlling the ESP32 IoT Networking Lab's smart agriculture system.

## Features

- **Connection status** — visual indicator with auto-reconnect
- **Device control** — on/off toggles + PWM slider for fan speed
- **Real-time monitoring** — polls the ESP32 every 3 s for sensor data
- **Auto LED status** — soil moisture drives Red/Yellow/Green indicator gamut
- **Activity log** — scrollable event feed with timestamps
- **Dark / light theme** — persisted to localStorage

## Quick Start

```bash
# Install dependencies
pnpm install

# Configure ESP32 endpoint
cp .env.example .env
# Edit .env → VITE_ESP32_API_URL=http://<esp32-ip>

# Start development server
pnpm dev
```

Open `http://localhost:3000`.

## Environment Variables

| Variable             | Description          | Default                        |
| -------------------- | -------------------- | ------------------------------ |
| `VITE_ESP32_API_URL` | ESP32 API base URL   | `http://xxx.xxx.xxx.xxx`       |
| `VITE_DASHBOARD_URL` | QR Scanning          | `http://xxx.xxx.xxx.xxx:3000/` |
| `VITE_API_TIMEOUT`   | Request timeout (ms) | `5000`                         |

## Scripts

| Command          | Description              |
| ---------------- | ------------------------ |
| `pnpm dev`       | Start Vite dev server    |
| `pnpm build`     | Production build         |
| `pnpm preview`   | Serve built output       |
| `pnpm lint`      | Run ESLint               |
| `pnpm typecheck` | TypeScript type checking |

## Documentation

- [ARCHITECTURE.md](./docs/ARCHITECTURE.md) — layer architecture, data flow, routing
- [WORKFLOW.md](./docs/WORKFLOW.md) — development setup, common tasks, release checklist
