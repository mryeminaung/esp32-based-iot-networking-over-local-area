/*
 * ESP32 BH1750 Light Sensor Test
 * Standalone sketch for reading ambient light intensity (lux) over I2C
 *
 * Hardware Connections (BH1750 GY-302 module):
 * - BH1750 VCC: 3.3V (or 5V — most modules have onboard regulator)
 * - BH1750 GND: GND
 * - BH1750 SDA: GPIO 26 (matches main firmware — 21/22 used by relay+pump)
 * - BH1750 SCL: GPIO 27 (matches main firmware — 21/22 used by relay+pump)
 * - ADDR pin: leave floating / GND → address 0x23 (common default)
 *
 * I2C address: 0x23 (ADDR low) or 0x5C (ADDR high)
 * Typical lux range: 1 (dark) → 65535 (direct sunlight)
 *
 * Serial Monitor: 115200 baud
 * Library: BH1750 by Christopher Laws (Arduino Library Manager)
 */

#include <Wire.h>
#include <BH1750.h>

// I2C Pin Definitions — same as main firmware (relay=21, pump=22 taken)
#define SDA_PIN 26
#define SCL_PIN 27

// BH1750 sensor instance (default address 0x23)
BH1750 lightMeter;

// Timing
unsigned long lastSensorRead = 0;
const unsigned long sensorReadInterval = 2000; // BH1750 continuous mode is fast enough
unsigned long startTime = 0;

void setup()
{
  Serial.begin(115200);
  Serial.println("\n\n=== ESP32 BH1750 Light Sensor Test ===");
  Serial.print("SDA: GPIO ");
  Serial.print(SDA_PIN);
  Serial.print(" | SCL: GPIO ");
  Serial.println(SCL_PIN);

  Wire.begin(SDA_PIN, SCL_PIN);

  if (lightMeter.begin())
  {
    Serial.println("BH1750 found at 0x23 (ADDR pin low/floating)");
    // Optional: lightMeter.begin(BH1750::CONTINUOUS_HIGH_RES_MODE);
    // Default mode: continuous high-resolution (1 lx resolution)
  }
  else
  {
    Serial.println("BH1750 not found! Check I2C wiring and ADDR pin.");
    Serial.println("ADDR floating/GND → 0x23 | ADDR to VCC → 0x5C");
  }

  // Warm-up: first conversion needs a few ms after init
  delay(200);

  startTime = millis();
}

void loop()
{
  unsigned long now = millis();

  if (now - lastSensorRead >= sensorReadInterval)
  {
    float lux = lightMeter.readLightLevel(); // returns -1 on error

    Serial.print("Uptime: ");
    Serial.print((now - startTime) / 1000);
    Serial.print("s | ");

    if (lux < 0)
    {
      Serial.println("BH1750 read failed! Check I2C wiring on GPIO 21/22.");
    }
    else
    {
      Serial.print("Light: ");
      Serial.print(lux, 1);
      Serial.print(" lx | ");

      // Classification thresholds (approximate, for farm/greenhouse context)
      if (lux < 1)
        Serial.println("Light: DARK (no illumination)");
      else if (lux < 10)
        Serial.println("Light: VERY LOW (night / dim room)");
      else if (lux < 50)
        Serial.println("Light: LOW (overcast indoor)");
      else if (lux < 200)
        Serial.println("Light: MODERATE (indoor room / partial shade)");
      else if (lux < 500)
        Serial.println("Light: BRIGHT (well-lit indoor / soft daylight)");
      else if (lux < 1000)
        Serial.println("Light: DAYLIGHT (direct sun through window)");
      else
        Serial.println("Light: FULL SUN (outdoor direct sunlight)");
    }

    lastSensorRead = now;
  }
}
