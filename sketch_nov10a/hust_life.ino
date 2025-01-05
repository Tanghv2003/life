#include <WiFi.h>
#include <DHT.h>
#include <MPU6050_tockn.h>
#include <HTTPClient.h>
#include <Wire.h>
#include <TimeLib.h>
#include <NTPClient.h>
#include <WiFiUdp.h>

const char* ssid = "T4";   
const char* password = "77778888"; 

#define DHT_PIN 27
#define DHT_TYPE DHT22
DHT dht(DHT_PIN, DHT_TYPE);

MPU6050 mpu(Wire);

WiFiUDP udp;
NTPClient timeClient(udp, "pool.ntp.org", 3600);

void setup() {
  Serial.begin(115200);
  Wire.begin();
  mpu.begin();
  mpu.calcGyroOffsets(true);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");
  Serial.print("ESP32 IP Address: ");
  Serial.println(WiFi.localIP());

  dht.begin();
  timeClient.begin();
  timeClient.update();
}

void loop() {
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();

  mpu.update();
  float angleX = mpu.getAngleX();
  float angleY = mpu.getAngleY();
  float angleZ = mpu.getAngleZ();

  float accX = mpu.getAccX();
  float accY = mpu.getAccY();
  float accZ = mpu.getAccZ();

  int heartRate = 0;

  Serial.print("Temperature: ");
  Serial.print(temperature);
  Serial.print(" °C, Humidity: ");
  Serial.print(humidity);
  Serial.println(" %");

  Serial.print("Angle: X=");
  Serial.print(angleX);
  Serial.print(" Y=");
  Serial.print(angleY);
  Serial.print(" Z=");
  Serial.println(angleZ);

  Serial.print("Acceleration: X=");
  Serial.print(accX);
  Serial.print(" Y=");
  Serial.print(accY);
  Serial.print(" Z=");
  Serial.println(accZ);

  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    String serverURL =  "http://192.168.0.149:3001/http/data";  
    http.begin(serverURL);

    http.addHeader("Content-Type", "application/json");

    String payload = "{\"temperature\": " + String(temperature) + 
                     ", \"humidity\": " + String(humidity) +
                     ", \"heartRate\": " + String(heartRate) + 
                     ", \"acceleration\": {\"x\": " + String(accX / 1000.0, 2) + 
                     ", \"y\": " + String(accY / 1000.0, 2) + 
                     ", \"z\": " + String(accZ / 1000.0, 2) + "}, " +
                     "\"angles\": {\"x\": " + String(angleX, 2) +
                     ", \"y\": " + String(angleY, 2) +
                     ", \"z\": " + String(angleZ, 2) + "}, " +
                     "\"timestamp\": \"" + getTimestamp() + "\"}";

    int httpResponseCode = http.POST(payload);

    if (httpResponseCode > 0) {
      Serial.print("HTTP Response code: ");
      Serial.println(httpResponseCode);
    } else {
      Serial.print("Error code: ");
      Serial.println(httpResponseCode);
    }

    http.end();
  } else {
    Serial.println("WiFi not connected");
  }

  delay(20000);
}

String getTimestamp() {
  timeClient.update();
  unsigned long epochTime = timeClient.getEpochTime();
  time_t rawTime = (time_t)epochTime;
  struct tm * timeinfo;
  timeinfo = localtime(&rawTime);
  
  char buf[30];
  strftime(buf, sizeof(buf), "%Y-%m-%dT%H:%M:%SZ", timeinfo);
  Serial.println(buf);
  return String(buf);
}
