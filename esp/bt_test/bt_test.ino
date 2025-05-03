#include "BluetoothSerial.h"

BluetoothSerial SerialBT;

void setup()
{
    Serial.begin(115200);
    SerialBT.begin("ESP32-3351"); // Start Bluetooth with a device name
    Serial.println("ESP32 Bluetooth Serial started.  Sending data...");
}

void loop()
{
    // Send data to the connected Mac
    String message = "Hello from ESP32! Time: " + String(millis());
    SerialBT.println(message);
    Serial.print("Sent: ");
    Serial.println(message);
    delay(1000); // Send data every second
}
