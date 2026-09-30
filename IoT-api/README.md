# IoT-api

REST API backend for the Smart Agriculture IoT platform. Manages user authentication, role-based access control, sensor data collection, device control, and activity logging for ESP32-based farm monitoring systems.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Runtime | Node.js (ESM) |
| Framework | Express 5 |
| Database | PostgreSQL (via Prisma 7) |
| Auth | JWT (access + refresh tokens) |
| Validation | Zod |
| Password | bcryptjs |
| File Upload | Multer |
| API Docs | Swagger (OpenAPI 3.0) |

## Project Structure

```
IoT-api/
├── server.ts                          # Entry point
├── prisma/
│   ├── schema.prisma                  # Database schema
│   ├── prisma.config.ts               # Driver adapter config
│   ├── seed/
│   │   ├── index.ts                   # Seed orchestrator
│   │   ├── seedUsers.ts               # Default users seeder
│   │   └── seedSensorData.ts          # Sample sensor data seeder
│   └── migrations/                    # Database migrations
├── src/
│   ├── config/
│   │   ├── db.ts                      # Prisma client + connection
│   │   ├── permissions.ts             # RBAC roles & permissions
│   │   ├── swagger.ts                 # Swagger config
│   │   └── swagger-schemas.ts         # Shared OpenAPI schemas
│   ├── controllers/
│   │   ├── authController.ts          # Login, logout, refresh, me
│   │   ├── userController.ts          # CRUD users, profile, avatar
│   │   ├── activityController.ts      # Activity logs
│   │   ├── sensorController.ts        # Sensor readings & analytics
│   │   ├── deviceController.ts        # ESP32 device control
│   │   └── deviceSettingsController.ts# Threshold & buzzer config
│   ├── middleware/
│   │   ├── authMiddleware.ts          # JWT auth + RBAC authorize
│   │   └── validateMiddleware.ts      # Zod request validation
│   ├── routes/
│   │   ├── authRoutes.ts
│   │   ├── userRoutes.ts
│   │   ├── activityRoutes.ts
│   │   ├── sensorRoutes.ts
│   │   ├── deviceRoutes.ts
│   │   └── deviceSettingsRoutes.ts
│   ├── services/
│   │   ├── authService.ts
│   │   ├── userService.ts
│   │   ├── activityService.ts
│   │   ├── sensorService.ts
│   │   ├── deviceService.ts           # Proxies to ESP32
│   │   ├── deviceSettingsService.ts   # Threshold CRUD
│   │   └── collectorService.ts        # Periodic ESP32 poller
│   ├── validations/
│   │   ├── authSchema.ts
│   │   ├── userSchema.ts
│   │   ├── deviceSchema.ts
│   │   └── deviceSettingsSchema.ts
│   └── utils/
│       ├── bcrypt.ts
│       └── jwt.ts
├── generated/prisma/                  # Generated Prisma client
├── uploads/avatars/                   # User avatar images
├── .env.example
└── package.json
```

## Getting Started

### Prerequisites

- Node.js >= 18
- PostgreSQL database
- pnpm

### Setup

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env

# Configure .env with your database URL and JWT secrets
# DATABASE_URL="postgresql://user:password@localhost:5432/smart_agriculture"
# JWT_SECRET="your-access-token-secret"
# JWT_REFRESH_SECRET="your-refresh-token-secret"
# PORT=8000

# Run migrations
npx prisma migrate dev

# Seed default users (admin, worker, technician)
npx prisma db seed

# Start development server
pnpm dev
```

The server starts at `http://localhost:8000`.

### API Documentation

Swagger UI is available at `http://localhost:8000/api/docs` when the server is running.

## Default Users

| Role | Email | Password |
|------|-------|----------|
| Farm Manager | `admin@farm.com` | `Admin@!23456` |
| Farm Worker | `worker@farm.com` | `Worker@!23456` |
| Technician | `technician@farm.com` | `Tech@!23456` |

## API Endpoints

### Auth

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/login` | Login and get tokens | No |
| POST | `/api/auth/logout` | Invalidate refresh token | No |
| POST | `/api/auth/refresh` | Get new access token | No |
| GET | `/api/auth/me` | Get current user profile | Yes |

### Users

| Method | Endpoint | Description | Auth | Permission |
|--------|----------|-------------|------|------------|
| GET | `/api/users` | List all users | Yes | `users:manage` |
| GET | `/api/users/:id` | Get user by ID | Yes | `users:manage` |
| POST | `/api/users` | Create new user | Yes | `users:manage` |
| PATCH | `/api/users/:id` | Update user | Yes | `users:manage` |
| PATCH | `/api/users/:id/role` | Change user role | Yes | `users:manage` |
| PATCH | `/api/users/:id/password` | Reset user password | Yes | `users:manage` |
| DELETE | `/api/users/:id` | Delete user | Yes | `users:manage` |
| PATCH | `/api/users/me` | Update own profile | Yes | — |
| PATCH | `/api/users/me/password` | Change own password | Yes | — |
| POST | `/api/users/me/avatar` | Upload avatar image | Yes | — |

### Sensors

| Method | Endpoint | Description | Auth | Permission |
|--------|----------|-------------|------|------------|
| POST | `/api/sensors/readings` | Record sensor reading | Yes | — |
| GET | `/api/sensors/readings` | Get readings (paginated) | Yes | — |
| GET | `/api/sensors/analytics` | Daily aggregated analytics | Yes | `sensors:read` |
| GET | `/api/sensors/latest` | Get latest sensor reading | Yes | — |

### Devices

| Method | Endpoint | Description | Auth | Permission |
|--------|----------|-------------|------|------------|
| GET | `/api/devices` | Get device states from ESP32 | Yes | `devices:read` |
| POST | `/api/devices/control` | Control device on ESP32 | Yes | `devices:control` |

### Device Settings

| Method | Endpoint | Description | Auth | Permission |
|--------|----------|-------------|------|------------|
| GET | `/api/device-settings` | Get threshold config | Yes | — |
| PUT | `/api/device-settings` | Update thresholds (pushes to ESP32) | Yes | `system:configure` |

### Activity Logs

| Method | Endpoint | Description | Auth | Permission |
|--------|----------|-------------|------|------------|
| POST | `/api/activity` | Create activity log entry | Yes | `activity:write` |
| GET | `/api/activity` | Get logs (paginated, filterable) | Yes | — |

## Roles & Permissions

| Role | Description | Permissions |
|------|-------------|-------------|
| `farm_manager` | Full admin access | All permissions |
| `farm_worker` | Device control + monitoring | `sensors:read`, `devices:read`, `devices:control`, `logs:read`, `activity:read`, `activity:write` |
| `technician` | Diagnostics + device control | `sensors:read`, `devices:read`, `devices:control`, `network:read`, `diagnostics:read`, `activity:write` |

## Authentication

Uses JWT with access + refresh token pattern:

- **Access token**: Short-lived (default 15m), sent in `Authorization: Bearer <token>` header
- **Refresh token**: Long-lived (default 7d), stored in HTTP-only cookie
- Tokens are verified against the database (refresh tokens are persisted)
- Passwords are hashed with bcryptjs

## Database Schema

```
User ──< RefreshToken
User ──< ActivityLog
SensorReading (standalone, device_id = 1)
DeviceSettings (singleton, threshold config)
```

- **User**: id, email, name, image, password (hashed), role, timestamps
- **RefreshToken**: token, userId, expiresAt (indexed, cascade delete)
- **ActivityLog**: userId, device, action, value, createdAt (indexed)
- **SensorReading**: deviceId, temperature, humidity, soilMoisture, light, airQuality, waterLevel, createdAt (indexed)
- **DeviceSettings**: soil thresholds, water thresholds, buzzer settings, light threshold, timestamps

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | — |
| `PORT` | Server port | `8000` |
| `JWT_SECRET` | Access token signing secret | — |
| `JWT_REFRESH_SECRET` | Refresh token signing secret | — |
| `JWT_EXPIRES_IN` | Access token lifetime | `15m` |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token lifetime | `7d` |
| `COLLECTION_INTERVAL_MS` | ESP32 poll interval | `60000` |
| `ESP32_IP` | ESP32 IP address | `esp32.local` |
