/*
  3-servo look-around, then dance after 3 curious rounds.
  Pins: 18, 19, 12 on Keyestudio ESP32 PLUS.
*/

#include <ESP32Servo.h>

const int PIN_PAN  = 18;
const int PIN_TILT = 19;
const int PIN_LEAN = 12;

const int CENTER = 90;
const int PAN  = 25;
const int TILT = 18;
const int LEAN = 12;

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

void pose(int panA, int tiltA, int leanA, int stepDelay = 18, int holdMs = 350) {
  go(pan,  constrain(panA,  55, 125), stepDelay);
  go(tilt, constrain(tiltA, 65, 120), stepDelay);
  go(lean, constrain(leanA, 70, 110), stepDelay);
  delay(holdMs);
}

void curiousLook() {
  pose(CENTER, CENTER, CENTER);

  pose(CENTER - PAN, CENTER, CENTER);
  pose(CENTER - PAN, CENTER - TILT, CENTER);
  pose(CENTER, CENTER - TILT, CENTER);
  pose(CENTER + PAN, CENTER - TILT, CENTER);
  pose(CENTER + PAN, CENTER, CENTER);
  pose(CENTER + PAN, CENTER + TILT / 2, CENTER);
  pose(CENTER, CENTER + TILT / 2, CENTER);
  pose(CENTER - PAN / 2, CENTER, CENTER + LEAN);
  pose(CENTER, CENTER, CENTER);

  delay(400);
}

void dance() {
  Serial.println("Dance!");
  // faster steps, still inside the same safe range
  for (int i = 0; i < 4; i++) {
    pose(CENTER - PAN, CENTER + 8, CENTER - LEAN, 8, 80);
    pose(CENTER + PAN, CENTER - 8, CENTER + LEAN, 8, 80);
  }
  for (int i = 0; i < 3; i++) {
    pose(CENTER, CENTER - TILT, CENTER + LEAN, 10, 70);
    pose(CENTER, CENTER + TILT / 2, CENTER - LEAN, 10, 70);
  }
  pose(CENTER - PAN, CENTER - TILT, CENTER + LEAN, 8, 90);
  pose(CENTER + PAN, CENTER - TILT, CENTER - LEAN, 8, 90);
  pose(CENTER + PAN, CENTER + TILT / 2, CENTER + LEAN, 8, 90);
  pose(CENTER - PAN, CENTER + TILT / 2, CENTER - LEAN, 8, 90);
  pose(CENTER, CENTER, CENTER, 12, 500);
  delay(800);
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
  Serial.println("Curious mode");
}

void loop() {
  for (int round = 1; round <= 3; round++) {
    Serial.print("Curious ");
    Serial.println(round);
    curiousLook();
  }
  dance();
}
