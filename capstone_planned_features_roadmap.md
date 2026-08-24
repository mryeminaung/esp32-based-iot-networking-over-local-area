# Capstone Project — Planned Features & Implementation Roadmap

## Project Title

**ESP32 based IoT Networking over Local Area**

## 1. Existing Features

The following parts are already implemented and should be retained rather than rebuilt.

### ESP32 / IoT
- ESP32 DevKit V1
- Wi-Fi / Local LAN communication
- HTTP + JSON API
- Sensor monitoring
- LED control
- Fan control through L298N
- Relay control
- Water pump
- Soil-moisture monitoring
- Device/system information
- QR-based access
- Local web server/API

### Web Application
- React
- TypeScript
- Dashboard
- Sensor monitoring
- Actuator controls
- System information
- Activity display

### Mobile Application
- React Native
- Expo
- TypeScript
- Mobile dashboard
- Sensor monitoring
- Device controls
- QR scanning/access

> **Keep the mobile application.** It provides a second client platform for the IoT system.

---

# 2. Planned New Features

The new work should focus on making the existing ESP32 system a more complete Smart Agriculture IoT platform instead of simply adding more sensors.

## A. Authentication

Use Express.js for authentication.

### Features
- Login
- Logout
- Password hashing
- JWT/access tokens
- Current-user endpoint
- Protected API routes
- Persistent authentication/session handling

### Basic Flow

```text
Web / Mobile
      |
      v
Express API
      |
Authenticate
      |
      v
PostgreSQL
```

---

# 3. Role-Based Access Control (RBAC)

Use three meaningful roles.

## Farm Manager

Full access:
- Monitor farm
- Control devices
- Configure automation
- View sensor history
- View activity logs
- Manage users
- View device/network information

## Farm Worker

Operational access:
- Monitor sensors
- Control pump/fan/LED
- View alerts
- View device status
- View relevant activity

Cannot:
- Manage users
- Change critical configuration
- Change system-level settings

## Technician

Technical access:
- ESP32 status
- Network information
- Sensor health
- Actuator testing
- Device diagnostics
- Troubleshooting information

> RBAC should be enforced by the backend, not only by hiding frontend buttons.

---

# 4. Activity / Audit Logging

Store meaningful user and system actions in PostgreSQL.

Example:

```text
Aung Aung
Farm Worker

10:31:20
Water Pump → ON
```

Another example:

```text
Su Su
Farm Worker

10:35:42
Water Pump → OFF
```

Technician example:

```text
Kyaw Kyaw
Technician

10:42:11
Water Pump → TEST
```

## Activity Log Fields

Suggested fields:

```text
id
user_id
device_id
action
target
value
timestamp
```

## Activity Filtering

Allow the Farm Manager to filter by:

```text
User     [ All ▼ ]
Action   [ All ▼ ]
Device   [ All ▼ ]
Date     [ Today ▼ ]
```

## Automatic Actions

Log automatic actions as well as human actions.

Example:

```text
10:31  Aung Aung   MANUAL   Pump ON
10:35  System      AUTO     Pump OFF
10:42  Kyaw Kyaw   TEST     Fan
```

Useful action categories:
- Manual action
- Automatic action
- Technician action
- Configuration change

---

# 5. Sensor History & Analytics

Currently the system mainly displays current sensor values. Add historical storage and visualization.

## Suggested Sensor Data

```text
sensor_readings

temperature
humidity
soil_moisture
light
air_quality
water_level
timestamp
device_id
```

## Dashboard Improvements

### Current Values

```text
Temperature       28.4°C
Humidity           71%
Soil Moisture      34%
Light              620 lux
```

### Historical Data

Provide charts for:
- 24-hour sensor history
- Daily averages
- Minimum/maximum values
- Pump activity
- Sensor trends
- Irrigation events

---

# 6. Automation

Automation should be one of the most important functional upgrades.

Instead of only allowing a user to manually turn the pump on, allow the system to automatically control it based on soil moisture.

## Example

```text
Soil Moisture
      |
      v
    ESP32
      |
      +-- < 30% --> Pump ON
      |
      +-- >= 30% -> Pump OFF
```

## Configurable Automation

Farm Manager can configure:

```text
Automation

Soil moisture threshold
[ 30 ] %

Automatic irrigation
[ ON ]

Pump
[ Water Pump 01 ]
```

## Manual Override

Support both:

```text
AUTO MODE
    |
    v
Automatic irrigation
```

and:

```text
MANUAL MODE
    |
    v
Worker controls pump
```

This creates the complete IoT loop:

**Sensing → Decision → Actuation**

---

# 7. Technician / Device Diagnostics

Create a technician-oriented device diagnostics page.

Example:

```text
ESP32-01
────────────────────────

Status          ● Online
IP Address      192.168.1.105
MAC Address     XX:XX:XX:XX
Uptime          3h 42m
Wi-Fi           Connected

Sensors
────────────────────────
DHT22           ● OK
Soil Moisture   ● OK
BH1750          ● OK

Actuators
────────────────────────
Pump            ● Available
Fan             ● Available
Relay           ● Available

[ Test Pump ]
[ Test Fan ]
[ Test LEDs ]
```

This demonstrates the device-management and networking aspects of the ESP32 system.

---

# 8. Local LAN / Offline Operation

The system should continue working without Internet connectivity as long as the local network remains available.

## Architecture

```text
                  LOCAL LAN
                     |
        +------------+------------+
        |            |            |
        v            v            v
      Web          Mobile        ESP32
        |            |            |
        +------------+------------+
                     |
                 Express
                     |
                 PostgreSQL
```

No cloud service is required for the core functionality.

### Important distinction

**Offline does not mean disconnected.**

The devices still need to communicate through the local network.

A good final demonstration is:

1. Disconnect the LAN from the Internet.
2. Keep the local Wi-Fi/LAN running.
3. Demonstrate that the Web, Mobile, Express, PostgreSQL, and ESP32 components continue operating.

---

# 9. Web vs Mobile Responsibilities

Do not make both dashboards completely identical.

## Web — Management

Focus on:
- Farm overview
- Historical analytics
- Automation configuration
- User/role management
- Activity logs
- Device management
- Network diagnostics

## Mobile — Field Operation

Focus on:
- Live sensor readings
- Quick pump/fan control
- Alerts
- Device status
- Manual override
- QR access

This provides a clear reason for having both platforms.

---

# 10. Multiple Users / Simultaneous Access

Support multiple users and simultaneous sessions.

Example:

```text
Farm Worker A
      |
   Mobile
      |
      +----------+
                 v
               ESP32
                 ^
      +----------+
      |
     Web
      |
Farm Worker B
```

Both users can be logged in at the same time.

If one changes the pump:

```text
Worker A → Pump ON
```

the other client should be able to see the updated state.

The action should also be recorded:

```text
Worker A
Pump ON
10:31:20
```

This demonstrates:
- Authentication
- RBAC
- Multi-client architecture
- IoT control
- Accountability

---

# 11. Database Structure

Avoid making the database unnecessarily complicated.

## Initial Models

```text
users
roles
activity_logs
```

## IoT Models

```text
farms
devices
sensor_readings
automation_rules
```

## Conceptual Relationships

```text
User
 |
 +---- Role
 |
 +---- ActivityLog
              |
              v
            Device
              |
       +------+------+
       |             |
       v             v
SensorReading   AutomationRule
       |
       v
      ESP32
```

## Recommended Backend Stack

- Express.js
- TypeScript
- Prisma
- PostgreSQL
- Zod
- JWT

---

# 12. Target Architecture

```text
                  +---------------------+
                  |      WEB APP        |
                  | React + TypeScript  |
                  +----------+----------+
                             |
                  +----------v----------+
                  |    MOBILE APP       |
                  | React Native + Expo |
                  +----------+----------+
                             |
                         Auth/RBAC
                             |
                  +----------v----------+
                  |     EXPRESS API      |
                  |                     |
                  | Authentication      |
                  | Authorization/RBAC  |
                  | Activity Logging    |
                  +----------+----------+
                             |
                        Prisma ORM
                             |
                  +----------v----------+
                  |     PostgreSQL      |
                  |                     |
                  | Users               |
                  | Roles               |
                  | Activity Logs       |
                  | Sensor History      |
                  | Devices             |
                  | Automation Rules    |
                  +---------------------+

                             |
                       Local Network
                             |
                  +----------v----------+
                  |       ESP32         |
                  |   HTTP / JSON API   |
                  +----------+----------+
                             |
              +--------------+--------------+
              |              |              |
              v              v              v
           Sensors       Actuators         Wi-Fi
                             |
                    +--------+--------+
                    |        |        |
                    v        v        v
                  Pump     Fan      LEDs
```

---

# 13. Implementation Priority

## Phase 1 — Foundation
- [x] Express setup
- [x] PostgreSQL setup
- [x] Prisma setup
- [ ] Database schema
- [ ] User model
- [ ] Roles

## Phase 2 — Authentication
- [ ] Registration/seed users
- [ ] Login
- [ ] JWT
- [ ] Protected routes
- [ ] Logout
- [ ] Current-user endpoint

## Phase 3 — RBAC
- [ ] Farm Manager permissions
- [ ] Farm Worker permissions
- [ ] Technician permissions
- [ ] Backend authorization middleware
- [ ] Frontend route/UI protection

## Phase 4 — Activity Logging
- [ ] Activity model
- [ ] Log manual controls
- [ ] Log technician actions
- [ ] Log configuration changes
- [ ] Log automatic actions
- [ ] Manager activity page

## Phase 5 — IoT Data
- [ ] Store sensor readings
- [ ] Historical charts
- [ ] Sensor statistics
- [ ] Device status

## Phase 6 — Automation
- [ ] Automatic irrigation
- [ ] Configurable threshold
- [ ] Manual override
- [ ] Automation logs

## Phase 7 — Technician
- [ ] ESP32 diagnostics
- [ ] Network information
- [ ] Sensor health
- [ ] Actuator testing

## Phase 8 — Polish & Final Validation
- [ ] Web/mobile synchronization
- [ ] Loading/error states
- [ ] Offline/LAN testing
- [ ] Security testing
- [ ] Final UI polish
- [ ] Documentation
- [ ] Final demo scenario

---

# 14. Final Project Story

The project should be presented as more than a collection of sensors.

A strong description is:

> **The project implements a local-area IoT smart agriculture platform in which ESP32 devices provide real-time environmental sensing and actuator control. Web and mobile clients access the system through role-based authentication, while historical sensor data, automation rules, and activity logs provide higher-level farm management and accountability.**

## Engineering Layers Demonstrated

```text
Hardware
   ↓
Embedded System
   ↓
Networking
   ↓
HTTP / JSON API
   ↓
Backend
   ↓
Database
   ↓
Authentication
   ↓
RBAC
   ↓
Automation
   ↓
Web Application
   ↓
Mobile Application
   ↓
Analytics
```

The **ESP32/LAN networking remains the core** of the project while the new software features demonstrate a broader, integrated IoT system.
