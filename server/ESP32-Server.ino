/*
 * ESP32 IoT Dashboard Firmware
 * Modern Dashboard with Quick Controls
 *
 * Hardware Connections:
 * - Red Light: GPIO 2
 * - Yellow Light: GPIO 4
 * - Green Light: GPIO 5
 * - White Light: GPIO 18
 * - Fan: GPIO 19 (PWM)
 * - Relay: GPIO 21 (PWM)
 * - Water Pump: GPIO 22
 * - Soil Moisture Sensor: GPIO 34 (analog)
 */

#include <WiFi.h>
#include <WebServer.h>
#include <ArduinoJson.h>
#include <ESPmDNS.h>

// WiFi Configuration
const char *ssid = "LOL";
const char *password = "hello124";
const char *hostName = "esp32-server";

// Global Variables
WebServer server(80);

// Pin Definitions
#define RED_LIGHT_PIN 2
#define YELLOW_LIGHT_PIN 4
#define GREEN_LIGHT_PIN 5
#define WHITE_LIGHT_PIN 18
#define FAN_PIN 19
#define RELAY_PIN 21
#define PUMP_PIN 22
#define SOIL_MOISTURE_PIN 34

// PWM Configuration
#define PWM_FREQUENCY 1000
#define PWM_RESOLUTION 8

// Device States
bool redLightState = false;
bool yellowLightState = false;
bool greenLightState = false;
bool whiteLightState = false;
bool fanState = false;
int fanValue = 0;
bool relayState = false;
int relayValue = 0;
bool pumpState = false;

// Sensor Values
int soilMoistureValue = 0;

// Timing
unsigned long lastSensorRead = 0;
unsigned long startTime = 0;
const unsigned long sensorReadInterval = 2000;

// Function prototypes
void handleRoot();
void handleControl();
void handleSystem();
void handleSensors();
void handleAll();
void handleCORSPreflight();

// Device control helpers
void setLight(int pin, bool state);
void setPWMDevice(int pin, bool state, int value);

void setup()
{
  Serial.begin(115200);
  Serial.println("\n\n=== ESP32 IoT Dashboard ===");

  // Initialize pins
  pinMode(RED_LIGHT_PIN, OUTPUT);
  pinMode(YELLOW_LIGHT_PIN, OUTPUT);
  pinMode(GREEN_LIGHT_PIN, OUTPUT);
  pinMode(WHITE_LIGHT_PIN, OUTPUT);
  pinMode(FAN_PIN, OUTPUT);
  pinMode(RELAY_PIN, OUTPUT);
  pinMode(PUMP_PIN, OUTPUT);
  pinMode(SOIL_MOISTURE_PIN, INPUT);

  // Setup PWM (fan only, relay is now toggle)
  ledcAttach(FAN_PIN, PWM_FREQUENCY, PWM_RESOLUTION);

  // Initial state - all off
  digitalWrite(RED_LIGHT_PIN, LOW);
  digitalWrite(YELLOW_LIGHT_PIN, LOW);
  digitalWrite(GREEN_LIGHT_PIN, LOW);
  digitalWrite(WHITE_LIGHT_PIN, LOW);
  ledcWrite(FAN_PIN, 0);
  digitalWrite(RELAY_PIN, LOW);
  digitalWrite(PUMP_PIN, LOW);

  startTime = millis();

  WiFi.mode(WIFI_STA);

  // Connect to WiFi as Station
  Serial.print("Connecting to WiFi: ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }
  Serial.println();

  IPAddress IP = WiFi.localIP();
  Serial.print("Connected! IP address: ");
  Serial.println(IP);

  // Initialize mDNS
  if (MDNS.begin(hostName))
  {
    MDNS.addService("http", "tcp", 80);
    Serial.println("mDNS responder started: http://esp32-server.local");
  }
  else
  {
    Serial.println("Error starting mDNS responder");
  }

  // Handle CORS preflight (OPTIONS) for all routes
  server.onNotFound([]()
                    {
    if (server.method() == HTTP_OPTIONS) {
      handleCORSPreflight();
    } else {
      server.send(404, "text/plain", "Not Found");
    } });

  // Setup web server routes
  server.on("/", HTTP_GET, handleRoot);
  server.on("/control", HTTP_POST, handleControl);
  server.on("/control", HTTP_OPTIONS, handleCORSPreflight);
  server.on("/system", HTTP_GET, handleSystem);
  server.on("/system", HTTP_OPTIONS, handleCORSPreflight);
  server.on("/sensors", HTTP_GET, handleSensors);
  server.on("/sensors", HTTP_OPTIONS, handleCORSPreflight);
  server.on("/all", HTTP_GET, handleAll);
  server.on("/all", HTTP_OPTIONS, handleCORSPreflight);

  server.enableCORS(true);
  server.begin();
  Serial.println("HTTP server started on port 80");
  Serial.print("Open http://");
  Serial.print(WiFi.localIP());
  Serial.println(" or http://esp32-server.local in browser");
}

void loop()
{
  server.handleClient();

  // WiFi reconnect guard
  if (WiFi.status() != WL_CONNECTED)
  {
    static unsigned long lastWifiCheck = 0;
    if (millis() - lastWifiCheck > 5000)
    {
      lastWifiCheck = millis();
      Serial.println("WiFi disconnected, reconnecting...");
      WiFi.reconnect();
    }
  }

  // Read sensors and auto-control R/Y/G LEDs
  if (millis() - lastSensorRead > sensorReadInterval)
  {
    soilMoistureValue = readSoilMoisture();
    lastSensorRead = millis();

    // Auto LED based on soil moisture
    if (soilMoistureValue <= 30)
    {
      redLightState = true;
      yellowLightState = false;
      greenLightState = false;
      setLight(RED_LIGHT_PIN, true);
      setLight(YELLOW_LIGHT_PIN, false);
      setLight(GREEN_LIGHT_PIN, false);
    }
    else if (soilMoistureValue < 50)
    {
      redLightState = false;
      yellowLightState = true;
      greenLightState = false;
      setLight(RED_LIGHT_PIN, false);
      setLight(YELLOW_LIGHT_PIN, true);
      setLight(GREEN_LIGHT_PIN, false);
    }
    else
    {
      redLightState = false;
      yellowLightState = false;
      greenLightState = true;
      setLight(RED_LIGHT_PIN, false);
      setLight(YELLOW_LIGHT_PIN, false);
      setLight(GREEN_LIGHT_PIN, true);
    }
  }
}

// CORS preflight handler
void handleCORSPreflight()
{
  server.sendHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  server.sendHeader("Access-Control-Allow-Headers", "Content-Type");
  server.sendHeader("Access-Control-Max-Age", "86400");
  server.send(204);
}

// Root endpoint
void handleRoot()
{
  server.send(200, "text/plain", "ESP32 IoT Dashboard API");
}

// Unified control endpoint
void handleControl()
{
  if (server.hasArg("plain"))
  {
    StaticJsonDocument<200> doc;
    DeserializationError error = deserializeJson(doc, server.arg("plain"));

    if (!error)
    {
      const char *device = doc["device"];
      int state = doc["state"] | 0;
      int value = doc["value"] | 0;

      String deviceStr = String(device);

      if (deviceStr == "red_light")
      {
        redLightState = state;
        setLight(RED_LIGHT_PIN, state);
        lastSensorRead = millis();  // defer auto-cycle so manual state persists
      }
      else if (deviceStr == "yellow_light")
      {
        yellowLightState = state;
        setLight(YELLOW_LIGHT_PIN, state);
        lastSensorRead = millis();  // defer auto-cycle so manual state persists
      }
      else if (deviceStr == "green_light")
      {
        greenLightState = state;
        setLight(GREEN_LIGHT_PIN, state);
        lastSensorRead = millis();  // defer auto-cycle so manual state persists
      }
      else if (deviceStr == "white_light")
      {
        whiteLightState = state;
        setLight(WHITE_LIGHT_PIN, state);
      }
      else if (deviceStr == "fan")
      {
        fanState = state;
        fanValue = value;
        setPWMDevice(FAN_PIN, state, value);
      }
      else if (deviceStr == "relay")
      {
        relayState = state;
        digitalWrite(RELAY_PIN, state ? HIGH : LOW);
      }
      else if (deviceStr == "water_pump")
      {
        pumpState = state;
        digitalWrite(PUMP_PIN, state ? HIGH : LOW);
      }

      Serial.printf("Control: device=%s, state=%d, value=%d\n", device, state, value);
      server.send(200, "application/json", "{\"status\":\"ok\"}");
    }
    else
    {
      server.send(400, "application/json", "{\"error\":\"Invalid JSON\"}");
    }
  }
  else
  {
    server.send(400, "application/json", "{\"error\":\"No data\"}");
  }
}

// System info endpoint
void handleSystem()
{
  StaticJsonDocument<300> doc;

  unsigned long uptime = (millis() - startTime) / 1000;
  int days = uptime / 86400;
  int hours = (uptime % 86400) / 3600;
  int minutes = (uptime % 3600) / 60;
  int seconds = uptime % 60;

  char uptimeStr[20];
  sprintf(uptimeStr, "%dd %02d:%02d:%02d", days, hours, minutes, seconds);

  uint8_t mac[6];
  WiFi.macAddress(mac);
  char macStr[18];
  sprintf(macStr, "%02X:%02X:%02X:%02X:%02X:%02X", mac[0], mac[1], mac[2], mac[3], mac[4], mac[5]);

  doc["device"] = "ESP32 DevKit V1";
  doc["ip"] = WiFi.localIP().toString();
  doc["mac"] = macStr;
  doc["uptime"] = uptimeStr;
  doc["freeHeap"] = ESP.getFreeHeap() / 1024;
  doc["status"] = "Online";
  doc["mode"] = "STA Mode";
  doc["wifi"] = WiFi.SSID();

  String response;
  serializeJson(doc, response);
  server.send(200, "application/json", response);
}

// Sensors & Devices endpoint
void handleSensors()
{
  StaticJsonDocument<400> doc;

  doc["soilMoisture"] = soilMoistureValue;
  doc["red_light"] = redLightState;
  doc["yellow_light"] = yellowLightState;
  doc["green_light"] = greenLightState;
  doc["white_light"] = whiteLightState;
  doc["fan"] = fanState;
  doc["fanValue"] = fanValue;
  doc["relay"] = relayState;
  doc["water_pump"] = pumpState;

  String response;
  serializeJson(doc, response);
  server.send(200, "application/json", response);
}

// Combined /all endpoint (system + sensors in one call)
void handleAll()
{
  StaticJsonDocument<512> doc;

  // ── System info ──
  unsigned long uptime = (millis() - startTime) / 1000;
  int days = uptime / 86400;
  int hours = (uptime % 86400) / 3600;
  int minutes = (uptime % 3600) / 60;
  int seconds = uptime % 60;

  char uptimeStr[20];
  sprintf(uptimeStr, "%dd %02d:%02d:%02d", days, hours, minutes, seconds);

  uint8_t mac[6];
  WiFi.macAddress(mac);
  char macStr[18];
  sprintf(macStr, "%02X:%02X:%02X:%02X:%02X:%02X", mac[0], mac[1], mac[2], mac[3], mac[4], mac[5]);

  doc["device"] = "ESP32 DevKit V1";
  doc["ip"] = WiFi.localIP().toString();
  doc["mac"] = macStr;
  doc["uptime"] = uptimeStr;
  doc["freeHeap"] = ESP.getFreeHeap() / 1024;
  doc["status"] = "Online";
  doc["mode"] = "STA Mode";
  doc["wifi"] = WiFi.SSID();

  // ── Sensors / devices ──
  doc["soilMoisture"] = soilMoistureValue;
  doc["red_light"] = redLightState;
  doc["yellow_light"] = yellowLightState;
  doc["green_light"] = greenLightState;
  doc["white_light"] = whiteLightState;
  doc["fan"] = fanState;
  doc["fanValue"] = fanValue;
  doc["relay"] = relayState;
  doc["water_pump"] = pumpState;

  String response;
  serializeJson(doc, response);
  server.send(200, "application/json", response);
}

// Device control helpers
void setLight(int pin, bool state)
{
  digitalWrite(pin, state ? HIGH : LOW);
}

void setPWMDevice(int pin, bool state, int value)
{
  if (state)
  {
    int pwmValue = map(value, 0, 100, 0, 255);
    ledcWrite(pin, pwmValue);
  }
  else
  {
    ledcWrite(pin, 0);
  }
}

int readSoilMoisture()
{
  int rawValue = analogRead(SOIL_MOISTURE_PIN);
  int moisturePercent = map(rawValue, 0, 4095, 100, 0);  // inverted sensor: dry=high, wet=low
  moisturePercent = constrain(moisturePercent, 0, 100);
  return moisturePercent;
}
