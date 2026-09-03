/*
  Slow "conscious idle" for 3 servos. At least ~20 seconds per cycle.
  Pins 18, 19, 12 on Keyestudio ESP32 PLUS.
*/

#include <ESP32Servo.h>

const int PIN_PAN  = 18;
const int PIN_TILT = 19;
const int PIN_LEAN = 12;

const int CENTER = 90;

Servo pan, tilt, lean;
int panPos = CENTER;
int tiltPos = CENTER;
int leanPos = CENTER;

void goOne(Servo &servo, int &current, int target, int stepDelay) {
  target = constrain(target, 70, 110);
  int dir = (target > current) ? 1 : -1;
  while (current != target) {
    current += dir;
    servo.write(current);
    delay(stepDelay);
  }
}

void rest(int ms) {
  pan.write(panPos);
  tilt.write(tiltPos);
  lean.write(leanPos);
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

  pan.write(CENTER);
  tilt.write(CENTER);
  lean.write(CENTER);
  panPos = tiltPos = leanPos = CENTER;
  delay(1000);
  Serial.println("Idle");
}

void loop() {
  unsigned long start = millis();

  // settle, then notice something to the left
  rest(1800);
  goOne(pan, panPos, 78, 28);
  rest(1200);
  goOne(tilt, tiltPos, 84, 32);
  rest(900);

  // think, tiny lean
  goOne(lean, leanPos, 98, 36);
  rest(1400);
  goOne(tilt, tiltPos, 90, 30);
  rest(800);

  // glance up, back down
  goOne(tilt, tiltPos, 80, 34);
  rest(1100);
  goOne(pan, panPos, 86, 30);
  rest(700);

  // look across the room, slowly
  goOne(lean, leanPos, 90, 32);
  goOne(pan, panPos, 108, 30);
  rest(1600);
  goOne(tilt, tiltPos, 94, 32);
  rest(1000);

  // second thought, small correction
  goOne(pan, panPos, 102, 28);
  rest(900);
  goOne(lean, leanPos, 84, 34);
  rest(1300);

  // breathe
  goOne(tilt, tiltPos, 88, 40);
  rest(600);
  goOne(tilt, tiltPos, 96, 40);
  rest(700);
  goOne(tilt, tiltPos, 90, 40);
  rest(1500);

  // come back to center and rest
  goOne(lean, leanPos, CENTER, 32);
  goOne(pan, panPos, CENTER, 30);
  goOne(tilt, tiltPos, CENTER, 32);
  rest(2200);

  // fidget, then still
  goOne(pan, panPos, 93, 36);
  rest(500);
  goOne(pan, panPos, CENTER, 36);
  rest(1800);

  while (millis() - start < 20000) {
    rest(200);
  }
}
