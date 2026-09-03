/*
  Test 3 servos on Keyestudio ESP32 PLUS.

  Plug each servo into a G-V-S column:
    brown -> G, red -> V, orange -> S
  Change the pin numbers below to match the numbers printed by those columns.

  Board: ESP32 Dev Module
  Library: ESP32Servo
*/

#include <ESP32Servo.h>

const int PIN_A = 13;
const int PIN_B = 26;
const int PIN_C = 27;

const int CENTER = 90;
const int NUDGE = 15;   // small move: 90 -> 75 and 105

Servo s[3];
const int pins[3] = {PIN_A, PIN_B, PIN_C};

void setup() {
  Serial.begin(115200);
  for (int i = 0; i < 3; i++) {
    s[i].setPeriodHertz(50);
    s[i].attach(pins[i], 500, 2500);
    s[i].write(CENTER);
  }
  delay(800);
  Serial.println("3-servo small-move test");
}

void loop() {
  for (int i = 0; i < 3; i++) {
    Serial.print("Servo GPIO ");
    Serial.println(pins[i]);

    s[i].write(CENTER - NUDGE);
    delay(400);
    s[i].write(CENTER + NUDGE);
    delay(400);
    s[i].write(CENTER);
    delay(600);
  }
}
