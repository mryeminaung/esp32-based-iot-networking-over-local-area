/*
 * ESP32 Soil Moisture Sensor Test
 * Standalone sketch for reading capacitive soil moisture
 *
 * Hardware Connections (capacitive soil moisture v1.2 / v2.0):
 * - Soil Moisture AO (analog out): GPIO 34 (ADC1_CH6, input-only)
 * - Soil Moisture VCC: 3.3V
 * - Soil Moisture GND: GND
 * - DO (digital out): not used
 *
 * Note: GPIO 34 is input-only (no internal pull-up).
 * Capacitive sensors are inverted: dry ≈ high raw, wet/submerged ≈ low raw.
 *
 * Serial Monitor: 115200 baud
 * No extra library required — raw analogRead
 *
 * Main firmware mapping (server/ESP32-Server.ino):
 *   moisturePercent = map(raw, 0, 4095, 100, 0)  // inverted
 *   DRY ≤ 30% | OPTIMAL ≥ 50% | MOIST between
 */

// Pin Definitions
#define SOIL_MOISTURE_PIN 34
#define BUZZER_PIN 25

// Classification thresholds (percent) — same as main firmware defaults
const int dryThreshold = 30;     // RED / buzzer when ≤ this
const int optimalThreshold = 50; // GREEN when ≥ this

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
  Serial.println("\n\n=== ESP32 Soil Moisture Sensor Test ===");
  Serial.print("Soil moisture AO on GPIO ");
  Serial.println(SOIL_MOISTURE_PIN);

  pinMode(SOIL_MOISTURE_PIN, INPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  digitalWrite(BUZZER_PIN, LOW);

  // Tip: calibrate in air (dry) and water (wet) if needed
  Serial.println("Calibration tip: dry soil → high raw, water → low raw");

  startTime = millis();
}

void loop()
{
  unsigned long now = millis();

  if (now - lastSensorRead >= sensorReadInterval)
  {
    int raw = analogRead(SOIL_MOISTURE_PIN);

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

    // Inverted mapping: dry=high raw → 0%, wet=low raw → 100%
    int moisturePercent = map(avg, 0, adcMax, 100, 0);
    moisturePercent = constrain(moisturePercent, 0, 100);

    Serial.print("Uptime: ");
    Serial.print((now - startTime) / 1000);
    Serial.print("s | Raw: ");
    Serial.print(raw);
    Serial.print(" | Avg: ");
    Serial.print(avg);
    Serial.print(" | Voltage: ");
    Serial.print(voltage, 2);
    Serial.print(" V | Moisture: ");
    Serial.print(moisturePercent);
    Serial.print(" % | ");

    if (moisturePercent <= dryThreshold)
      Serial.println("Soil: DRY (needs water)");
    else if (moisturePercent < optimalThreshold)
      Serial.println("Soil: MOIST");
    else
      Serial.println("Soil: OPTIMAL (well watered)");

    // Buzzer when soil is dry (mirrors main firmware buzzerDrySoil)
    bool shouldBuzz = moisturePercent <= dryThreshold;
    if (shouldBuzz && !buzzerState)
    {
      buzzerState = true;
      digitalWrite(BUZZER_PIN, HIGH);
      Serial.println("Buzzer ON: Soil dry");
    }
    else if (!shouldBuzz && buzzerState)
    {
      buzzerState = false;
      digitalWrite(BUZZER_PIN, LOW);
      Serial.println("Buzzer OFF: Soil moisture recovered");
    }

    lastSensorRead = now;
  }
}
