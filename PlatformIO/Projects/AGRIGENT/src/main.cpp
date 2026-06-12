#include <Arduino.h>

#define RE_DE_PIN 4

const byte inquiryFrame[] = {0x01, 0x03, 0x00, 0x00, 0x00, 0x07, 0x04, 0x08};
byte responseBuffer[19];

void setup() {
  Serial.begin(115200);

  Serial2.begin(4800, SERIAL_8N1, 16, 17);

  pinMode(RE_DE_PIN, OUTPUT);
  digitalWrite(RE_DE_PIN, LOW);

  Serial.println("=== AGRIGENT System Started ===");
  delay(1000);
}

void loop() {

  digitalWrite(RE_DE_PIN, HIGH);
  delay(5);

  Serial2.write(inquiryFrame, sizeof(inquiryFrame));
  Serial2.flush();

  delayMicroseconds(200);
  digitalWrite(RE_DE_PIN, LOW);

  unsigned long startTime = millis();

  bool frameStarted = false;
  int byteCounter = 0;

  while (millis() - startTime < 1500) {

    if (Serial2.available()) {

      byte incoming = Serial2.read();

      if (!frameStarted && incoming == 0x01) {
        frameStarted = true;
        responseBuffer[byteCounter++] = incoming;
      }
      else if (frameStarted) {

        responseBuffer[byteCounter++] = incoming;

        if (byteCounter >= 19) {
          break;
        }
      }
    }
  }

  if (byteCounter == 19) {

    float moisture =
      ((responseBuffer[3] << 8) | responseBuffer[4]) / 10.0;

    float temperature =
      ((responseBuffer[5] << 8) | responseBuffer[6]) / 10.0;

    int ec =
      ((responseBuffer[7] << 8) | responseBuffer[8]);

    float ph =
      ((responseBuffer[9] << 8) | responseBuffer[10]) / 10.0;

    int nitrogen =
      ((responseBuffer[11] << 8) | responseBuffer[12]);

    int phosphorus =
      ((responseBuffer[13] << 8) | responseBuffer[14]);

    int potassium =
      ((responseBuffer[15] << 8) | responseBuffer[16]);

    Serial.println("");
    Serial.println("========== SENSOR DATA ==========");

    Serial.print("Moisture: ");
    Serial.print(moisture);
    Serial.println(" %");

    Serial.print("Temperature: ");
    Serial.print(temperature);
    Serial.println(" C");

    Serial.print("EC: ");
    Serial.println(ec);

    Serial.print("pH: ");
    Serial.println(ph);

    Serial.print("Nitrogen: ");
    Serial.println(nitrogen);

    Serial.print("Phosphorus: ");
    Serial.println(phosphorus);

    Serial.print("Potassium: ");
    Serial.println(potassium);

    Serial.println("=================================");
  }
  else {

    Serial.println("Waiting for valid sensor frame...");
  }

  delay(3000);
}