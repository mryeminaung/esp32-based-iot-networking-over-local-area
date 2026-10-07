/*
 * ESP32 Water Level Sensor Test
 * Standalone sketch for reading tank/reservoir water level
 *
 * Hardware Connections:
 * - Water Level Sensor AO (analog out): GPIO 35 (ADC1_CH7)
 * - Water Level Sensor VCC: 3.3V (or 5V if module is 5V-tolerant — check board)
 * - Water Level Sensor GND: GND
 *
 * Note: GPIO 35 is input-only (no internal pull-up).
 * Most resistive/probe modules: dry ≈ low raw, wet/submerged ≈ high raw.
 *
 * Serial Monitor: 115200 baud
 * No extra library required — raw analogRead
 *
 * Main firmware mapping (server/ESP32-Server.ino):
 *   levelPercent = map(raw, 0, 4095, 0, 100)
 */

// Pin Definitions
#define WATER_LEVEL_PIN 35
#define BUZZER_PIN 25

// Buzzer threshold (percent) — buzz only when level is CRITICAL
const int buzzerLowThreshold = 10;

// Buzzer state
bool buzzerState = false;

// ADC settings (ESP32 12-bit)
const int adcMax = 4095;
const float referenceVoltage = 3.3;

// Timing
unsigned long lastSensorRead = 0;
const unsigned long sensorReadInterval = 2000;
unsigned long startTime = 0;

// Moving average buffer for smoother readings
const int sampleCount = 10;
int samples[sampleCount];
int sampleIndex = 0;
bool bufferFilled = false;

void setup()
{
  Serial.begin(115200);
  Serial.println("\n\n=== ESP32 Water Level Sensor Test ===");
  Serial.print("Water level AO on GPIO ");
  Serial.println(WATER_LEVEL_PIN);

  pinMode(WATER_LEVEL_PIN, INPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  digitalWrite(BUZZER_PIN, LOW);

  startTime = millis();
}

void loop()
{
  unsigned long now = millis();

  if (now - lastSensorRead >= sensorReadInterval)
  {
    int raw = analogRead(WATER_LEVEL_PIN);

    // Feed circular buffer
    samples[sampleIndex] = raw;
    sampleIndex = (sampleIndex + 1) % sampleCount;
    if (sampleIndex == 0)
      bufferFilled = true;

    // Average of available samples
    int sum = 0;
    int count = bufferFilled ? sampleCount : sampleIndex;
    if (count == 0)
      count = 1;
    for (int i = 0; i < count; i++)
      sum += samples[i];
    int avg = sum / count;

    float voltage = (avg * referenceVoltage) / adcMax;
    int levelPercent = map(avg, 0, adcMax, 0, 100);
    levelPercent = constrain(levelPercent, 0, 100);

    Serial.print("Uptime: ");
    Serial.print((now - startTime) / 1000);
    Serial.print("s | Raw: ");
    Serial.print(raw);
    Serial.print(" | Avg: ");
    Serial.print(avg);
    Serial.print(" | Voltage: ");
    Serial.print(voltage, 2);
    Serial.print(" V | Level: ");
    Serial.print(levelPercent);
    Serial.print(" % | ");

    if (levelPercent < 10)
      Serial.println("Water level: CRITICAL (nearly empty)");
    else if (levelPercent < 25)
      Serial.println("Water level: LOW");
    else if (levelPercent < 50)
      Serial.println("Water level: OK");
    else
      Serial.println("Water level: HIGH");

    // Buzzer when water level is LOW or CRITICAL
    bool shouldBuzz = levelPercent < buzzerLowThreshold;
    if (shouldBuzz && !buzzerState)
    {
      buzzerState = true;
      digitalWrite(BUZZER_PIN, HIGH);
      Serial.println("Buzzer ON: Water level low");
    }
    else if (!shouldBuzz && buzzerState)
    {
      buzzerState = false;
      digitalWrite(BUZZER_PIN, LOW);
      Serial.println("Buzzer OFF: Water level recovered");
    }

    lastSensorRead = now;
  }
}
