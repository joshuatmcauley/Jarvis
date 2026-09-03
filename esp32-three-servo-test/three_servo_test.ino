/*
  3-servo "look around the room" on Keyestudio ESP32 PLUS.
  Pins from the working setup: 18, 19, 12.

  Board: ESP32 Dev Module
  Library: ESP32Servo
*/

#include <ESP32Servo.h>

const int PIN_PAN  = 18;  // left / right
const int PIN_TILT = 19;  // up / down
const int PIN_LEAN = 12;  // slight head tilt

const int CENTER = 90;
const int PAN  = 25;  // how far left/right
const int TILT = 18;  // how far up/down
const int LEAN = 12;  // small roll

Servo pan, tilt, lean;

void go(Servo &servo, int angle, int stepDelay = 18) {
  int from = servo.read();
  if (from < 0) from = CENTER;
  int dir = (angle > from) ? 1 : -1;
  for (int a = from; a != angle; a += dir) {
    servo.write(a);
    delay(stepDelay);
  }
  servo.write(angle);
}

void look(int panA, int tiltA, int leanA) {
  go(pan,  constrain(panA,  55, 125));
  go(tilt, constrain(tiltA, 65, 120));
  go(lean, constrain(leanA, 70, 110));
  delay(350);
}

void setup() {
  Serial.begin(115200);

  pan.setPeriodHertz(50);
  tilt.setPeriodHertz(50);
  lean.setPeriodHertz(50);

  pan.attach(PIN_PAN, 500, 2500);
  tilt.attach(PIN_TILT, 500, 2500);
  lean.attach(PIN_LEAN, 500, 2500);

  pan.write(CENTER);
  tilt.write(CENTER);
  lean.write(CENTER);
  delay(800);
  Serial.println("Looking around...");
}

void loop() {
  look(CENTER, CENTER, CENTER);

  look(CENTER - PAN, CENTER, CENTER);            // left
  look(CENTER - PAN, CENTER - TILT, CENTER);     // left + up
  look(CENTER, CENTER - TILT, CENTER);             // up
  look(CENTER + PAN, CENTER - TILT, CENTER);      // right + up
  look(CENTER + PAN, CENTER, CENTER);              // right
  look(CENTER + PAN, CENTER + TILT / 2, CENTER); // right + down a bit
  look(CENTER, CENTER + TILT / 2, CENTER);       // down
  look(CENTER - PAN / 2, CENTER, CENTER + LEAN); // curious tilt
  look(CENTER, CENTER, CENTER);

  delay(1200);
}
