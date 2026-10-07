/*
 * ESP32 MQ-135 Air Quality Sensor Test
 * Standalone sketch for reading air quality (gas) levels
 *
 * Hardware Connections (Flying-Fish MQ-135 module):
 * - MQ-135 AO (analog out) → 1 kΩ → junction → GPIO 39
 * - Junction → GND via 2 × 1 kΩ in series (2 kΩ)
 * - Voltage divider ratio: 2/3  (AO 5 V → GPIO39 ≈ 3.33 V, safe for ESP32)
 * - MQ-135 DO (digital out): not used
 * - MQ-135 VCC: ESP32 VIN (5 V, sensor heater)
 * - MQ-135 GND: ESP32 GND
 *
 * GPIO 39 is input-only (ADC1_CH3). ADC sees 2/3 of module AO.
 *
 * Serial Monitor: 115200 baud
 * No extra library required — raw analogRead
 */

// Pin Definitions
#define MQ135_PIN 39

// ADC settings (ESP32 12-bit)
const int adcMax = 4095;
const float referenceVoltage = 3.3;

// Divider: GPIO sees AO × (Rbottom / (Rtop + Rbottom)) = 2/3
const float dividerRatio = 2.0 / 3.0;

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
  Serial.println("\n\n=== ESP32 MQ-135 Air Quality Test ===");
  Serial.print("MQ-135 AO on GPIO ");
  Serial.println(MQ135_PIN);

  pinMode(MQ135_PIN, INPUT);

  // Warm-up: MQ-135 heater needs several minutes for stable readings
  Serial.println("Warming up sensor (wait a few minutes for stable values)...");

  startTime = millis();
}

void loop()
{
  unsigned long now = millis();

  if (now - lastSensorRead >= sensorReadInterval)
  {
    int raw = analogRead(MQ135_PIN);

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

    // Voltage at the ADC pin (GPIO 39), and estimated module AO voltage
    float voltage = (avg * referenceVoltage) / adcMax;
    float aoVoltage = voltage / dividerRatio;

    Serial.print("Uptime: ");
    Serial.print((now - startTime) / 1000);
    Serial.print("s | Raw: ");
    Serial.print(raw);
    Serial.print(" | Avg: ");
    Serial.print(avg);
    Serial.print(" | ADC: ");
    Serial.print(voltage, 2);
    Serial.print(" V | AO≈");
    Serial.print(aoVoltage, 2);
    Serial.print(" V | ");

    // Classification thresholds
    if (avg < 50)
      Serial.println("Air quality: GOOD");
    else if (avg < 100)
      Serial.println("Air quality: MODERATE");
    else if (avg < 200)
      Serial.println("Air quality: POOR");
    else if (avg < 300)
      Serial.println("Air quality: VERY POOR");
    else
      Serial.println("Air quality: HAZARDOUS");

    lastSensorRead = now;
  }
}
