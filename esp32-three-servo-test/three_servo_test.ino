/*
  Funny 3-servo bit. Pins 18, 19, 12 on Keyestudio ESP32 PLUS.
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
  Serial.println("Funny");
}

void loop() {
  // pretending to be chill
  goAll(CENTER, CENTER, CENTER, 5);
  hold(400);

  // wait... what?
  goAll(48, 78, 90, 6);
  hold(500);
  goAll(52, 78, 90, 12);     // tiny second glance
  hold(180);
  goAll(128, 62, 70, 3);     // DOUBLE TAKE
  hold(250);

  // lean in like "you did NOT just say that"
  goAll(118, 55, 65, 4);
  hold(350);

  // follow a fly... then lose it
  goAll(50, 60, 90, 7);
  goAll(70, 55, 90, 7);
  goAll(100, 58, 90, 7);
  goAll(125, 70, 90, 4);
  hold(120);
  goAll(90, 50, 90, 3);      // fly went UP
  hold(200);
  goAll(90, 120, 90, 3);     // bonk, look down
  hold(250);

  // fake sneeze
  goAll(90, 58, 100, 10);
  hold(280);
  goAll(90, 58, 80, 10);
  hold(180);
  goAll(85, 128, 90, 2);     // ACHOO
  hold(150);
  goAll(90, 70, 90, 4);
  hold(200);

  // embarrassed shake
  goAll(55, 100, 90, 3);
  goAll(125, 100, 90, 3);
  goAll(55, 100, 90, 3);
  goAll(125, 100, 90, 3);

  // peek-a-boo
  goAll(50, 110, 118, 4);    // hide
  hold(280);
  goAll(90, 70, 90, 3);      // BOO
  hold(220);
  goAll(130, 110, 62, 4);    // hide other side
  hold(220);
  goAll(90, 65, 90, 3);
  hold(180);

  // dramatic too-low bow, then "oops" pop up
  goAll(90, 130, 90, 5);
  hold(300);
  goAll(90, 55, 90, 3);
  hold(150);
  goAll(CENTER, CENTER, CENTER, 5);
  hold(300);
}
