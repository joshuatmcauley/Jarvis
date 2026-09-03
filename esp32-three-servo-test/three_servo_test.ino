/*
  Fast dance only. Pins 18, 19, 12 on Keyestudio ESP32 PLUS.
*/

#include <ESP32Servo.h>

const int PIN_PAN  = 18;
const int PIN_TILT = 19;
const int PIN_LEAN = 12;

const int CENTER = 90;

Servo pan, tilt, lean;

void beat(int panA, int tiltA, int leanA, int ms) {
  pan.write(constrain(panA, 60, 120));
  tilt.write(constrain(tiltA, 70, 115));
  lean.write(constrain(leanA, 75, 110));
  delay(ms);
}

void setup() {
  Serial.begin(115200);

  pan.setPeriodHertz(50);
  tilt.setPeriodHertz(50);
  lean.setPeriodHertz(50);

  pan.attach(PIN_PAN, 500, 2500);
  tilt.attach(PIN_TILT, 500, 2500);
  lean.attach(PIN_LEAN, 500, 2500);

  beat(CENTER, CENTER, CENTER, 400);
  Serial.println("Dance");
}

void loop() {
  // side to side
  for (int i = 0; i < 6; i++) {
    beat(70, 100, 78, 120);
    beat(110, 80, 102, 120);
  }

  // bounce
  for (int i = 0; i < 6; i++) {
    beat(90, 75, 90, 100);
    beat(90, 110, 90, 100);
  }

  // twist
  for (int i = 0; i < 6; i++) {
    beat(75, 90, 108, 110);
    beat(105, 90, 72, 110);
  }

  // shake
  for (int i = 0; i < 8; i++) {
    beat(82, 85, 82, 80);
    beat(98, 95, 98, 80);
  }

  beat(CENTER, CENTER, CENTER, 250);
}
