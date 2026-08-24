# IoT-api

REST API backend for the Smart Agriculture IoT platform. Manages user authentication, role-based access control, sensor data collection, and activity logging for ESP32-based farm monitoring systems.

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

## Project Structure

```
IoT-api/
├── server.js                    # Entry point
├── prisma/
│   ├── schema.prisma            # Database schema
│   ├── seed.js                  # Admin user seeder
│   ├── seed-sensor-data.js      # Sample sensor data seeder
│   └── migrations/              # Database migrations
├── src/
│   ├── config/
│   │   ├── db.js                # Prisma client + connection
│   │   └── permissions.js       # RBAC roles & permissions
│   ├── controllers/
│   │   ├── auth.controller.js   # Login, logout, refresh, me
│   │   ├── user.controller.js   # CRUD users, profile, avatar
│   │   ├── activity.controller.js # Activity logs
│   │   └── sensor.controller.js # Sensor readings & analytics
│   ├── middleware/
│   │   ├── auth.middleware.js    # JWT auth + RBAC authorize
│   │   └── validate.middleware.js # Zod request validation
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── activity.routes.js
│   │   └── sensor.routes.js
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── user.service.js
│   │   ├── activity.service.js
│   │   ├── sensor.service.js
│   │   └── collector.service.js # Periodic sensor data collector
│   ├── validations/
│   │   ├── auth.schema.js
│   │   └── user.schema.js
│   └── utils/
│       ├── bcrypt.js
│       └── jwt.js
├── uploads/avatars/             # User avatar images
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
# DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
# JWT_SECRET="your-secret"
# JWT_REFRESH_SECRET="your-refresh-secret"
# ADMIN_EMAIL="admin@farm.com"
# ADMIN_PASSWORD="admin123"

# Run migrations
npx prisma migrate dev

# Seed admin user
npx prisma db seed

# Start development server
pnpm dev
```

The server starts at `http://localhost:8000` (or the port specified in `.env`).

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

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/sensors/readings` | Record sensor reading | Yes |
| GET | `/api/sensors/readings` | Get readings (paginated, filterable) | Yes |
| GET | `/api/sensors/analytics` | Get daily aggregated analytics | Yes |
| GET | `/api/sensors/latest` | Get latest sensor reading | Yes |

### Activity Logs

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/activity` | Create activity log entry | Yes |
| GET | `/api/activity` | Get logs (paginated, filterable) | Yes |

## Roles & Permissions

| Role | Description | Permissions |
|------|-------------|-------------|
| `farm_manager` | Full admin access | All permissions |
| `farm_worker` | Device control + monitoring | `sensors:read`, `devices:read`, `devices:control`, `logs:read`, `activity:read` |
| `technician` | Read-only diagnostics | `sensors:read`, `devices:read`, `network:read`, `diagnostics:read` |

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
```

- **User**: id, email, name, image, password (hashed), role, timestamps
- **RefreshToken**: token, userId, expiresAt (indexed, cascade delete)
- **ActivityLog**: userId, device, action, value, createdAt (indexed)
- **SensorReading**: deviceId, temperature, humidity, soilMoisture, light, airQuality, waterLevel, createdAt (indexed)

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | — |
| `PORT` | Server port | `8000` |
| `JWT_SECRET` | Access token signing secret | — |
| `JWT_REFRESH_SECRET` | Refresh token signing secret | — |
| `JWT_EXPIRES_IN` | Access token lifetime | `15m` |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token lifetime | `7d` |
| `ADMIN_EMAIL` | Initial admin email (seed) | — |
| `ADMIN_PASSWORD` | Initial admin password (seed) | — |
