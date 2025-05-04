#include <Wire.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_LSM303_U.h>
#include <BluetoothSerial.h>
BluetoothSerial SerialBT;

// Accelerometer instance
Adafruit_LSM303_Accel_Unified accel = Adafruit_LSM303_Accel_Unified(54321);

// Orientation tracking
String currentOrientation = "";
unsigned long orientationStartTime = 0;

// Total time spent in each orientation (milliseconds)
unsigned long timeXPos = 0;
unsigned long timeXNeg = 0;
unsigned long timeYPos = 0;
unsigned long timeYNeg = 0;
unsigned long timeZPos = 0;
unsigned long timeZNeg = 0;

unsigned long timeXPosLast = 0;
unsigned long timeXNegLast = 0;
unsigned long timeYPosLast = 0;
unsigned long timeYNegLast = 0;
unsigned long timeZPosLast = 0;
unsigned long timeZNegLast = 0;

void setup() {
  delay(3000);
  SerialBT.begin("ESP32_3351");
  Serial.begin(115200);
  delay(100);

  if (!accel.begin()) {
    SerialBT.println("Could not find a valid LSM303 accelerometer sensor, check wiring!");
    Serial.println("Could not find a valid LSM303 accelerometer sensor, check wiring!");
    while (1);
  }
  SerialBT.println("LSM303DLHC accelerometer initialized.");
  Serial.println("LSM303DLHC accelerometer initialized.");
  orientationStartTime = millis();
}

void loop() {
  sensors_event_t event;
  accel.getEvent(&event);

  float x = event.acceleration.x;
  float y = event.acceleration.y;
  float z = event.acceleration.z;

  float absX = abs(x);
  float absY = abs(y);
  float absZ = abs(z);

  String newOrientation;
  if (absX > absY && absX > absZ) {
    newOrientation = (x > 0) ? "X+" : "X-";
  } else if (absY > absX && absY > absZ) {
    newOrientation = (y > 0) ? "Y+" : "Y-";
  } else {
    newOrientation = (z > 0) ? "Z+" : "Z-";
  }

  unsigned long now = millis();
  unsigned long duration = now - orientationStartTime;

  // If orientation changed, add to total and reset timer

    if (currentOrientation == "X+") timeXPos = timeXPosLast + duration;
    else if (currentOrientation == "X-") timeXNeg = timeXNegLast + duration;
    else if (currentOrientation == "Y+") timeYPos = timeYPosLast + duration;
    else if (currentOrientation == "Y-") timeYNeg = timeYNegLast + duration;
    else if (currentOrientation == "Z+") timeZPos = timeZPosLast + duration;
    else if (currentOrientation == "Z-") timeZNeg = timeZNegLast + duration;

  if (newOrientation != currentOrientation) {
    timeXPosLast = timeXPos;
    timeXNegLast = timeXNeg;
    timeYPosLast = timeYPos;
    timeYNegLast = timeYNeg;
    timeZPosLast = timeZPos;
    timeZNegLast = timeZNeg;
    currentOrientation = newOrientation;
    orientationStartTime = now;
    duration = 0; // reset duration for new orientation
  }

  // Live print of current and total time
  SerialBT.print("Current Orientation: ");
  SerialBT.print(currentOrientation);
  SerialBT.print(" | Duration: ");
  SerialBT.print(duration / 1000.0, 2);
  SerialBT.println(" seconds");
  
  Serial.print("Current Orientation: ");
  Serial.print(currentOrientation);
  Serial.print(" | Duration: ");
  Serial.print(duration / 1000.0, 2);
  Serial.println(" seconds");


  SerialBT.println("--- Total Time in Each Orientation (seconds) ---");
  SerialBT.print("X+: "); SerialBT.println(timeXPos / 1000.0, 2);
  SerialBT.print("X-: "); SerialBT.println(timeXNeg / 1000.0, 2);
  SerialBT.print("Y+: "); SerialBT.println(timeYPos / 1000.0, 2);
  SerialBT.print("Y-: "); SerialBT.println(timeYNeg / 1000.0, 2);
  SerialBT.print("Z+: "); SerialBT.println(timeZPos / 1000.0, 2);
  SerialBT.print("Z-: "); SerialBT.println(timeZNeg / 1000.0, 2);
  SerialBT.println("-----------------------------------------------");
  SerialBT.println();

  Serial.println("--- Total Time in Each Orientation (seconds) ---");
  Serial.print("X+: "); Serial.println(timeXPos / 1000.0, 2);
  Serial.print("X-: "); Serial.println(timeXNeg / 1000.0, 2);
  Serial.print("Y+: "); Serial.println(timeYPos / 1000.0, 2);
  Serial.print("Y-: "); Serial.println(timeYNeg / 1000.0, 2);
  Serial.print("Z+: "); Serial.println(timeZPos / 1000.0, 2);
  Serial.print("Z-: "); Serial.println(timeZNeg / 1000.0, 2);
  Serial.println("-----------------------------------------------");
  Serial.println();

  delay(500);
}
