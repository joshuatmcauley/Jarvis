/*
  Funny bit, but it recenters after every gag so it does not sit in a bow
  or scan forever. Pins 18, 19, 12.
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
  t = constrain(t, 70, 110);
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

void homePose(int ms) {
  goAll(CENTER, CENTER, CENTER, 5);
  hold(ms);
}

void setup() {
  Serial.begin(115200);

  pan.setPeriodHertz(50);
  tilt.setPeriodHertz(50);
  lean.setPeriodHertz(50);

  pan.attach(PIN_PAN, 500, 2500);
  tilt.attach(PIN_TILT, 500, 2500);
  lean.attach(PIN_LEAN, 500, 2500);

  homePose(800);
  Serial.println("Funny v2");
}

void loop() {
  Serial.println("chill");
  homePose(700);

  Serial.println("side eye");
  goAll(68, 90, 108, 4);
  hold(400);
  homePose(250);

  Serial.println("double take");
  goAll(62, 90, 90, 6);
  hold(450);
  goAll(120, 82, 78, 3);
  hold(350);
  homePose(300);

  Serial.println("nod yes");
  goAll(90, 105, 90, 4);
  hold(90);
  goAll(90, 78, 90, 4);
  hold(90);
  goAll(90, 105, 90, 4);
  hold(90);
  homePose(300);

  Serial.println("confused tilt");
  goAll(90, 88, 115, 4);
  hold(500);
  goAll(90, 88, 72, 4);
  hold(350);
  homePose(300);

  Serial.println("sneeze");
  goAll(90, 78, 90, 8);
  hold(280);
  goAll(90, 108, 90, 2);
  hold(180);
  homePose(400);

  Serial.println("peek");
  goAll(58, 98, 112, 4);
  hold(320);
  goAll(90, 82, 90, 3);
  hold(280);
  homePose(600);
}
