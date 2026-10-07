/*
 * ESP32 Relay Module Test
 * Standalone sketch — toggle relay ON/OFF every 3 seconds
 * Active-LOW module: LOW = ON, HIGH = OFF
 *
 * Hardware Connections:
 * - Relay IN (control): GPIO 21
 * - Relay VCC:  5V (most modules) — check module label
 * - Relay GND:  GND
 * - Relay COM / NO / NC: switch the load (e.g. lamp, pump)
 *
 * Note:
 * - Active-LOW logic: LOW = ON, HIGH = OFF
 * - During ESP32 reset/boot, GPIO 21 floats → brief LOW →
 *   a single click is normal on active-LOW modules.
 * - Main firmware (ESP32-Server.ino) uses the same polarity now.
 * - GPIO 21 is reserved for relay in ESP32-Server.ino
 *
 * Serial Monitor: 115200 baud
 * No extra library required
 *
 * Main firmware mapping (server/ESP32-Server.ino):
 *   RELAY_PIN = 21
 */

// Pin Definitions
#define RELAY_PIN 21

// Timing
unsigned long lastToggle = 0;
const unsigned long toggleInterval = 3000; // 3s on / 3s off
unsigned long startTime = 0;

// Relay state (logical: true = ON, false = OFF)
bool relayState = false;

void setRelay(bool state)
{
  relayState = state;

  // Active-LOW: LOW = ON, HIGH = OFF
  digitalWrite(RELAY_PIN, state ? LOW : HIGH);

  Serial.print("Uptime: ");
  Serial.print((millis() - startTime) / 1000);
  Serial.print("s | Relay ");
  Serial.print(state ? "ON" : "OFF");
  Serial.print(" | Pin ");
  Serial.print(RELAY_PIN);
  Serial.print(" = ");
  Serial.println(digitalRead(RELAY_PIN) == HIGH ? "HIGH" : "LOW");
}

void setup()
{
  Serial.begin(115200);
  Serial.println("\n\n=== ESP32 Relay Module Test (Active-LOW) ===");
  Serial.print("Relay on GPIO ");
  Serial.println(RELAY_PIN);
  Serial.println("Logic: LOW = ON, HIGH = OFF");

  pinMode(RELAY_PIN, OUTPUT);

  // Boot pulse: ON for 500ms so you hear/see the module is alive
  digitalWrite(RELAY_PIN, LOW); // active-LOW = ON
  Serial.println("Boot pulse: Relay ON (500ms)");
  delay(500);

  digitalWrite(RELAY_PIN, HIGH); // OFF
  relayState = false;
  Serial.println("Relay OFF — starting 3s toggle");

  startTime = millis();
  lastToggle = startTime;
}

void loop()
{
  unsigned long now = millis();

  if (now - lastToggle >= toggleInterval)
  {
    setRelay(!relayState);
    lastToggle = now;
  }
}
