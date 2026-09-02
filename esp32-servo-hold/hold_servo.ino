/*
  Hold one servo still on Keyestudio ESP32 PLUS.

  Wire: brown -> G, red -> V, orange -> S on GPIO 13 (or change servoPin).
  Board: ESP32 Dev Module
  Library: ESP32Servo
*/

#include <ESP32Servo.h>

Servo finger;

const int servoPin = 13;   // G-V-S column labeled 13
const int holdAngle = 90; // 0..180 — pick the pose that supports the arm

void setup() {
  Serial.begin(115200);
  finger.setPeriodHertz(50);
  finger.attach(servoPin, 500, 2500);
  finger.write(holdAngle);
  Serial.print("Holding angle ");
  Serial.println(holdAngle);
}

void loop() {
  // Keep sending the same pulse so the servo stays locked.
  finger.write(holdAngle);
  delay(20);
}
