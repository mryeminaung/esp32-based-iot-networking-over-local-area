/*
 * ESP32 DHT22 Sensor Test
 * Standalone sketch for reading temperature and humidity
 *
 * Hardware Connections:
 * - DHT22 Data: GPIO 13
 * - DHT22 VCC:  3.3V
 * - DHT22 GND:  GND
 * - 10k pull-up resistor between Data and VCC (most modules include one)
 *
 * Serial Monitor: 115200 baud
 * Library: DHT sensor library by Adafruit
 */

#include <DHT.h>

// Pin Definitions
#define DHT_PIN 13
#define DHT_TYPE DHT22

// DHT sensor instance
DHT dht(DHT_PIN, DHT_TYPE);

// Timing
unsigned long lastSensorRead = 0;
const unsigned long sensorReadInterval = 2000; // DHT22 min sampling period
unsigned long startTime = 0;

void setup()
{
  Serial.begin(115200);
  Serial.println("\n\n=== ESP32 DHT22 Sensor Test ===");
  Serial.print("DHT22 on GPIO ");
  Serial.println(DHT_PIN);

  dht.begin();

  // Warm-up: first reliable reading needs ~2s after power-up
  delay(2000);

  startTime = millis();
}

void loop()
{
  unsigned long now = millis();

  if (now - lastSensorRead >= sensorReadInterval)
  {
    float temperature = dht.readTemperature(); // Celsius
    float humidity = dht.readHumidity();       // Relative humidity %

    Serial.print("Uptime: ");
    Serial.print((now - startTime) / 1000);
    Serial.print("s | ");

    if (isnan(temperature) || isnan(humidity))
    {
      Serial.println("DHT22 read failed! Check wiring on GPIO 13.");
    }
    else
    {
      Serial.print("Temperature: ");
      Serial.print(temperature, 1);
      Serial.print(" °C | Humidity: ");
      Serial.print(humidity, 1);
      Serial.println(" %");
    }

    lastSensorRead = now;
  }
}
