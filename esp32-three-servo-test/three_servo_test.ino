/*
  ~10 second product demo: a few distinct expressions, then loop.
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

void goAll(int p, int t, int l, int stepDelay) {
  p = constrain(p, 55, 125);
  t = constrain(t, 60, 120);
  l = constrain(l, 70, 115);

  while (panPos != p || tiltPos != t || leanPos != l) {
    if (panPos < p) panPos++;
    else if (panPos > p) panPos--;
    if (tiltPos < t) tiltPos++;
    else if (tiltPos > t) tiltPos--;
    if (leanPos < l) leanPos++;
    else if (leanPos > l) leanPos--;
    pan.write(panPos);
    tilt.write(tiltPos);
    lean.write(leanPos);
    delay(stepDelay);
  }
}

void hold(int ms) {
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
  delay(400);
  Serial.println("Demo");
}

void loop() {
  // 1. hello / center
  goAll(CENTER, CENTER, CENTER, 12);
  hold(250);

  // 2. curious look left
  goAll(62, 78, 100, 10);
  hold(400);

  // 3. scan to the right
  goAll(118, 82, 80, 9);
  hold(350);

  // 4. notice something up
  goAll(100, 68, 90, 10);
  hold(300);

  // 5. yes (nod)
  goAll(90, 108, 90, 8);
  hold(80);
  goAll(90, 72, 90, 8);
  hold(80);
  goAll(90, 108, 90, 8);
  hold(80);
  goAll(CENTER, CENTER, CENTER, 10);
  hold(200);

  // 6. cute head tilt
  goAll(84, 88, 112, 10);
  hold(450);

  // 7. other-side tilt
  goAll(96, 88, 72, 10);
  hold(350);

  // 8. no (small shake)
  goAll(70, 90, 90, 8);
  hold(70);
  goAll(110, 90, 90, 8);
  hold(70);
  goAll(70, 90, 90, 8);
  hold(70);

  // 9. bow, then face camera
  goAll(90, 118, 90, 11);
  hold(350);
  goAll(90, 80, 90, 10);
  hold(200);
  goAll(CENTER, CENTER, CENTER, 12);
  hold(400);
}
