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
const char *ssid = "MIIT-WIFI";
const char *password = "Thanks123";
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

// Root endpoint - API documentation landing page
void handleRoot()
{
  String ip = WiFi.localIP().toString();
  String wifi = WiFi.SSID();

  String html = "<!DOCTYPE html><html lang=\"en\"><head><meta charset=\"UTF-8\">";
  html += "<meta name=\"viewport\" content=\"width=device-width,initial-scale=1.0\">";
  html += "<title>ESP32 - Smart Agriculture API</title><style>";
  html += "*{margin:0;padding:0;box-sizing:border-box}";
  html += "body{font-family:system-ui,-apple-system,sans-serif;background:#F8FAFC;color:#1E293B;min-height:100vh;padding:24px 16px}";
  html += ".container{max-width:600px;margin:0 auto}";
  html += ".header{text-align:center;margin-bottom:32px}";
  html += ".header h1{font-size:1.5rem;font-weight:700;color:#166534;margin-bottom:4px}";
  html += ".header p{color:#64748B;font-size:0.875rem}";
  html += ".card{background:#FFFFFF;border:1px solid #E2E8F0;border-radius:16px;padding:20px;margin-bottom:16px}";
  html += ".card h2{font-size:1rem;font-weight:600;color:#166534;margin-bottom:12px;display:flex;align-items:center;gap:8px}";
  html += ".info-row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #F1F5F9}";
  html += ".info-row:last-child{border-bottom:none}";
  html += ".info-label{color:#64748B;font-size:0.8125rem}";
  html += ".info-value{color:#1E293B;font-size:0.8125rem;font-weight:500;font-family:monospace}";
  html += ".endpoint{margin-bottom:16px;padding-bottom:16px;border-bottom:1px solid #F1F5F9}";
  html += ".endpoint:last-child{margin-bottom:0;padding-bottom:0;border-bottom:none}";
  html += ".method{display:inline-block;padding:2px 8px;border-radius:6px;font-size:0.7rem;font-weight:700;font-family:monospace;margin-right:6px}";
  html += ".method-get{background:#DCFCE7;color:#166534}";
  html += ".method-post{background:#FEF3C7;color:#92400E}";
  html += ".path{font-family:monospace;font-size:0.875rem;color:#1E293B}";
  html += ".endpoint p{color:#64748B;font-size:0.8125rem;margin-top:6px;line-height:1.5}";
  html += ".code-block{background:#F8FAFC;border:1px solid #E2E8F0;border-radius:8px;padding:12px;margin-top:8px;font-family:monospace;font-size:0.75rem;color:#475569;line-height:1.6;white-space:pre;overflow-x:auto}";
  html += ".footer{text-align:center;color:#94A3B8;font-size:0.75rem;margin-top:24px}";
  html += "</style></head><body><div class=\"container\">";
  html += "<div class=\"header\"><h1>&#127793; Smart Agriculture Dashboard API</h1>";
  html += "<p>Smart Agriculture Device</p></div>";
  html += "<div class=\"card\"><h2>Device Info</h2>";
  html += "<div class=\"info-row\"><span class=\"info-label\">Device</span><span class=\"info-value\">ESP32 DevKit V1</span></div>";
  html += "<div class=\"info-row\"><span class=\"info-label\">IP Address</span><span class=\"info-value\">" + ip + "</span></div>";
  html += "<div class=\"info-row\"><span class=\"info-label\">mDNS</span><span class=\"info-value\">esp32-server.local</span></div>";
  html += "<div class=\"info-row\"><span class=\"info-label\">Mode</span><span class=\"info-value\">Station (STA)</span></div>";
  html += "<div class=\"info-row\"><span class=\"info-label\">WiFi</span><span class=\"info-value\">" + wifi + "</span></div>";
  html += "</div>";
  html += "<div class=\"card\"><h2>API Endpoints</h2>";
  html += "<div class=\"endpoint\"><span class=\"method method-get\">GET</span><span class=\"path\">/all</span>";
  html += "<p>Combined system info + sensor data in a single request.</p></div>";
  html += "<div class=\"endpoint\"><span class=\"method method-get\">GET</span><span class=\"path\">/system</span>";
  html += "<p>System info: device name, IP, MAC, uptime, free heap, WiFi SSID.</p></div>";
  html += "<div class=\"endpoint\"><span class=\"method method-get\">GET</span><span class=\"path\">/sensors</span>";
  html += "<p>Sensor readings and device states: soil moisture, lights, fan, relay, pump.</p></div>";
  html += "<div class=\"endpoint\"><span class=\"method method-post\">POST</span><span class=\"path\">/control</span>";
  html += "<p>Control devices. Send JSON body with device name, state, and optional value.</p>";
  html += "<div class=\"code-block\">{\n  \"device\": \"red_light\",\n  \"state\": 1,\n  \"value\": 0\n}</div>";
  html += "<p style=\"margin-top:6px\">Devices: red_light, yellow_light, green_light, white_light, fan, relay, water_pump</p></div>";
  html += "</div>";
  html += "<div class=\"footer\">IoT Monitoring & Irrigation System</div></div></body></html>";

  server.send(200, "text/html", html);
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
        lastSensorRead = millis(); // defer auto-cycle so manual state persists
      }
      else if (deviceStr == "yellow_light")
      {
        yellowLightState = state;
        setLight(YELLOW_LIGHT_PIN, state);
        lastSensorRead = millis(); // defer auto-cycle so manual state persists
      }
      else if (deviceStr == "green_light")
      {
        greenLightState = state;
        setLight(GREEN_LIGHT_PIN, state);
        lastSensorRead = millis(); // defer auto-cycle so manual state persists
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
  int moisturePercent = map(rawValue, 0, 4095, 100, 0); // inverted sensor: dry=high, wet=low
  moisturePercent = constrain(moisturePercent, 0, 100);
  return moisturePercent;
}
