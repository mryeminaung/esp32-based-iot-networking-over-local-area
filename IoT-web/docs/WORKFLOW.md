# IoT Dashboard — Development Workflow

## Prerequisites

- **Node.js** v18+
- **pnpm** (`npm i -g pnpm`)
- ESP32 server running and reachable on the same network

## Development Loop

### 1. Install

```bash
cd IoT-dashboard
pnpm install
```

### 2. Configure

```bash
cp .env.example .env
```

Edit `.env` and point `VITE_ESP32_API_URL` to your ESP32's IP or mDNS hostname:

```env
VITE_ESP32_API_URL=http://xxx.xxx.xxx.xxx
VITE_DASHBOARD_URL=http://xxx.xxx.xxx.xxx:3000/
VITE_API_TIMEOUT=5000
```

### 3. Run

```bash
pnpm dev
```

Starts the Vite dev server at `http://localhost:3000`. Hot-module replacement (HMR) is active — edits to `src/` reflect instantly.

### 4. Build for production

```bash
pnpm build       # Outputs to dist/
pnpm preview     # Serves the build locally
```

## Project Structure

```
IoT-dashboard/
├── public/                  # Static assets
├── src/
│   ├── api/
│   │   ├── client.ts        # Axios instance
│   │   └── esp32.ts         # ESP32 API functions + types
│   ├── store/
│   │   └── dashboard.ts     # Zustand state store
│   ├── features/
│   │   ├── dashboard/
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── SplashScreen.tsx
│   │   │   ├── components/  # UI components (see ARCHITECTURE.md)
│   │   │   └── hooks/
│   │   │       └── useEsp32Sync.ts  # Polling + sync logic
│   │   └── experiments/
│   │       ├── ExperimentCard.tsx
│   │       ├── ExperimentDetail.tsx
│   │       ├── ExperimentsPage.tsx
│   │       └── experiments.ts
│   ├── hooks/
│   │   └── useTheme.ts
│   ├── lib/
│   │   └── utils.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .env.example
├── package.json
├── ARCHITECTURE.md
├── WORKFLOW.md
└── README.md
```

## Testing

```bash
pnpm lint         # ESLint
pnpm typecheck    # TypeScript checks
```
