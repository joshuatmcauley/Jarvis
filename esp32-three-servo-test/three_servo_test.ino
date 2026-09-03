/*
  Faster 10s product demo with bigger motion.
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
  p = constrain(p, 45, 135);
  t = constrain(t, 50, 130);
  l = constrain(l, 60, 120);

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
  delay(200);
  Serial.println("Demo fast");
}

void loop() {
  goAll(CENTER, CENTER, CENTER, 5);
  hold(120);

  goAll(50, 70, 110, 4);     // snap-curious left
  hold(180);

  goAll(130, 68, 70, 4);     // whip to right
  hold(160);

  goAll(90, 55, 90, 4);      // look way up
  hold(150);

  goAll(90, 125, 90, 3);     // nod
  goAll(90, 58, 90, 3);
  goAll(90, 125, 90, 3);
  goAll(90, 70, 90, 3);
  hold(80);

  goAll(70, 80, 118, 4);     // big tilts
  hold(180);
  goAll(110, 80, 62, 4);
  hold(180);

  goAll(50, 90, 90, 3);      // no
  goAll(130, 90, 90, 3);
  goAll(50, 90, 90, 3);
  goAll(130, 90, 90, 3);

  goAll(90, 128, 90, 4);     // bow
  hold(200);
  goAll(90, 60, 90, 4);      // pop up
  hold(100);

  goAll(55, 75, 115, 4);     // last look around
  goAll(125, 75, 65, 4);
  goAll(CENTER, CENTER, CENTER, 5);
  hold(200);
}
