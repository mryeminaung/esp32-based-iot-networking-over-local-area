# ESP32 IoT Networking Lab

ESP32-based IoT networking experiments and smart agriculture system using Wi-Fi communication, REST APIs, and a web-based monitoring dashboard.

This repository contains a series of ESP32 experiments that demonstrate local network communication, web-based device control, sensor monitoring, and IoT automation using the Arduino framework.

## Project Overview

The goal of this project is to explore IoT networking using the ESP32 microcontroller by developing communication between embedded devices and web applications over a local network.

The project covers:

- ESP32 Wi-Fi networking
- Access Point and Station modes
- Local web server development
- HTTP communication
- REST API implementation
- Remote device control
- Sensor data monitoring
- Automated irrigation system

## Repository Structure

```
├── server/                  # ESP32 firmware (Arduino)
│   ├── ESP32-Server.ino     # Main sketch — REST API
│   ├── ArduinoJson.h        # JSON library (bundled)
│   ├── README.md            # Firmware overview
│   ├── docs/ARCHITECTURE.md # Hardware & API design
│   └── docs/WORKFLOW.md     # Flash & test workflow
│
├── IoT-dashboard/           # Web dashboard (React + Vite)
│   ├── src/
│   │   ├── api/             # Axios client & ESP32 API layer
│   │   ├── store/           # Zustand state management
│   │   └── features/        # Dashboard & Experiments UI
│   ├── README.md            # Dashboard overview
│   ├── docs/ARCHITECTURE.md # Frontend architecture & data flow
│   └── docs/WORKFLOW.md     # Dev setup & release checklist
│
├── experiments/             # Experiment reference materials
├── LICENSE
└── README.md                # This file
```

## Quick Start

### 1. Flash the ESP32

```bash
cd server
# Open ESP32-Server.ino in Arduino IDE or PlatformIO
# Update WiFi credentials (ssid / password)
# Upload to ESP32 DevKit V1
# Open Serial Monitor (115200 baud) to confirm IP
```

### 2. Start the Dashboard

```bash
cd IoT-dashboard
pnpm install
cp .env.example .env
# Set VITE_ESP32_API_URL to the ESP32's IP address
# Set VITE_DASHBOARD_URL to the Router's IP address:3000 for QR code generation
pnpm dev
```

Open `http://localhost:3000` — the dashboard connects to the ESP32 and begins polling sensor data every 3 seconds.

## Technologies Used

### Hardware

- ESP32 DevKit V1
- Capacitive Soil Moisture Sensor
- DC Motor
- Relay Module
- Mini Water Pump

### Software

- Arduino Framework
- PlatformIO
- C/C++
- HTTP REST API
- JSON Communication
- React (Dashboard)
- TypeScript
- Tailwind CSS
- Zustand (State Management)

## Experiments

### Experiment 01: ESP32 Wi-Fi Access Point

- Configure ESP32 as a standalone Wi-Fi network
- Understand local IP addressing
- Connect client devices to ESP32 network

### Experiment 02: ESP32 Local Web Server

- Create a web server using ESP32
- Control GPIO devices through HTTP requests
- Implement LED ON/OFF control

### Experiment 03: Motor Speed Control Using PWM

- Generate PWM signals using ESP32
- Control DC motor speed
- Interface motor driver module

### Experiment 04: Internet-Based Device Control

- Connect ESP32 to the Internet
- Control devices remotely
- Exchange data through web services

### Experiment 05: Smart Agriculture System

- Monitor soil moisture level
- Automatically control water pump
- Display real-time sensor information through dashboard

## Learning Objectives

Through this project, the following concepts are explored:

- Embedded networking with ESP32
- IoT communication protocols
- REST API design for embedded systems
- Hardware-software integration
- Web-based IoT monitoring and control
- Real-world automation systems

## Author

**Ye Min Aung**

Capstone Project — **Arduino Based IoT Networking Over Local Area**

---

LICENSE: [MIT License](./LICENSE)
