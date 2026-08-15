/*
 * PRACTICAL RX480E PROJECT - WiFi Smart Home Controller
 * 
 * Use your TX118SA remote to control things over WiFi!
 * This ACTUALLY WORKS with the hardware you bought.
 * 
 * What this does:
 * - Press button 1: Toggle your computer/lights via HTTP request
 * - Press button 2: Trigger JARVIS actions on your Raspberry Pi
 * - Press button 3: Control any WiFi device (smart TV, etc.)
 * - Press button 4: Send notifications to your phone
 * 
 * You can control ANYTHING with WiFi/HTTP - smart TVs, computers,
 * Raspberry Pi, Home Assistant, IFTTT, and yes, even WiFi smart plugs!
 */

#include <WiFi.h>
#include <HTTPClient.h>

// ========================================
// WiFi Configuration
// ========================================
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// ========================================
// Your Control URLs
// ========================================
// Example: Control your Raspberry Pi JARVIS
const char* button1_url = "http://192.168.1.50:5000/toggle_lights";
const char* button2_url = "http://192.168.1.50:5000/jarvis_command?action=status";
const char* button3_url = "http://192.168.1.50:5000/scene?name=movie_mode";
const char* button4_url = "http://192.168.1.50:5000/all_off";

// Example: Control smart TV
// const char* button1_url = "http://192.168.1.100:8060/keypress/Power";  // Roku TV

// Example: Control computer
// const char* button1_url = "http://192.168.1.101:8080/wake";

// Example: IFTTT webhooks
// const char* button1_url = "https://maker.ifttt.com/trigger/button1/with/key/YOUR_KEY";

// ========================================
// RX480E Pin Configuration
// ========================================
#define BUTTON1_PIN 25  // D0 from RX480E
#define BUTTON2_PIN 26  // D1 from RX480E
#define BUTTON3_PIN 14  // D3 from RX480E
#define BUTTON4_PIN 27  // D2 from RX480E
#define LED_PIN 2       // Built-in LED

// ========================================
// Variables
// ========================================
bool lastState1 = LOW;
bool lastState2 = LOW;
bool lastState3 = LOW;
bool lastState4 = LOW;
unsigned long lastActionTime = 0;
const unsigned long debounceDelay = 300;

// ========================================
// Setup
// ========================================
void setup() {
  Serial.begin(115200);
  delay(1000);
  
  Serial.println("\n========================================");
  Serial.println("  WiFi Smart Remote Control");
  Serial.println("  Using RX480E + TX118SA");
  Serial.println("========================================\n");
  
  // Configure pins
  pinMode(BUTTON1_PIN, INPUT);
  pinMode(BUTTON2_PIN, INPUT);
  pinMode(BUTTON3_PIN, INPUT);
  pinMode(BUTTON4_PIN, INPUT);
  pinMode(LED_PIN, OUTPUT);
  
  // Connect to WiFi
  connectWiFi();
  
  Serial.println("\n✓ Ready! Press buttons on your TX118SA remote.");
  Serial.println("========================================\n");
}

// ========================================
// Main Loop
// ========================================
void loop() {
  bool btn1 = digitalRead(BUTTON1_PIN);
  bool btn2 = digitalRead(BUTTON2_PIN);
  bool btn3 = digitalRead(BUTTON3_PIN);
  bool btn4 = digitalRead(BUTTON4_PIN);
  
  // Check for button presses with debounce
  if (millis() - lastActionTime > debounceDelay) {
    
    if (btn1 == HIGH && lastState1 == LOW) {
      handleButton1();
      lastActionTime = millis();
    }
    
    if (btn2 == HIGH && lastState2 == LOW) {
      handleButton2();
      lastActionTime = millis();
    }
    
    if (btn3 == HIGH && lastState3 == LOW) {
      handleButton3();
      lastActionTime = millis();
    }
    
    if (btn4 == HIGH && lastState4 == LOW) {
      handleButton4();
      lastActionTime = millis();
    }
  }
  
  lastState1 = btn1;
  lastState2 = btn2;
  lastState3 = btn3;
  lastState4 = btn4;
  
  delay(10);
}

// ========================================
// WiFi Connection
// ========================================
void connectWiFi() {
  Serial.print("Connecting to WiFi: ");
  Serial.println(ssid);
  
  WiFi.begin(ssid, password);
  
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 30) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n✓ WiFi connected!");
    Serial.print("IP: ");
    Serial.println(WiFi.localIP());
    
    // Flash LED to indicate connected
    for (int i = 0; i < 5; i++) {
      digitalWrite(LED_PIN, HIGH);
      delay(100);
      digitalWrite(LED_PIN, LOW);
      delay(100);
    }
  } else {
    Serial.println("\n✗ WiFi connection failed!");
    Serial.println("Check your WiFi credentials and try again.");
  }
}

// ========================================
// Button Handlers
// ========================================
void handleButton1() {
  Serial.println("\n┌───────────────────────────────┐");
  Serial.println("│ Button 1 - Toggle Lights      │");
  Serial.println("└───────────────────────────────┘");
  
  flashLED(1);
  sendHTTPRequest(button1_url);
}

void handleButton2() {
  Serial.println("\n┌───────────────────────────────┐");
  Serial.println("│ Button 2 - JARVIS Status      │");
  Serial.println("└───────────────────────────────┘");
  
  flashLED(2);
  sendHTTPRequest(button2_url);
}

void handleButton3() {
  Serial.println("\n┌───────────────────────────────┐");
  Serial.println("│ Button 3 - Movie Mode         │");
  Serial.println("└───────────────────────────────┘");
  
  flashLED(3);
  sendHTTPRequest(button3_url);
}

void handleButton4() {
  Serial.println("\n┌───────────────────────────────┐");
  Serial.println("│ Button 4 - All Off            │");
  Serial.println("└───────────────────────────────┘");
  
  flashLED(4);
  sendHTTPRequest(button4_url);
}

// ========================================
// HTTP Request Function
// ========================================
void sendHTTPRequest(const char* url) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("✗ WiFi not connected!");
    return;
  }
  
  HTTPClient http;
  http.setTimeout(5000);
  
  Serial.print("→ Sending request to: ");
  Serial.println(url);
  
  http.begin(url);
  int httpCode = http.GET();
  
  if (httpCode > 0) {
    Serial.print("✓ Response code: ");
    Serial.println(httpCode);
    
    if (httpCode == HTTP_CODE_OK) {
      String payload = http.getString();
      Serial.println("Response:");
      Serial.println(payload);
    }
  } else {
    Serial.print("✗ Request failed: ");
    Serial.println(http.errorToString(httpCode).c_str());
  }
  
  http.end();
  Serial.println();
}

// ========================================
// Visual Feedback
// ========================================
void flashLED(int times) {
  for (int i = 0; i < times; i++) {
    digitalWrite(LED_PIN, HIGH);
    delay(100);
    digitalWrite(LED_PIN, LOW);
    delay(100);
  }
}

/*
 * ============================================
 * PRACTICAL EXAMPLES - WHAT YOU CAN CONTROL
 * ============================================
 * 
 * 1. YOUR RASPBERRY PI JARVIS:
 *    Add a simple web server to jarvis_app.py:
 * 
 *    from flask import Flask, jsonify
 *    app = Flask(__name__)
 *    
 *    @app.route('/toggle_lights')
 *    def toggle_lights():
 *        # Your code to control something
 *        return jsonify({"status": "success"})
 *    
 *    app.run(host='0.0.0.0', port=5000)
 * 
 * 2. CONTROL YOUR COMPUTER:
 *    - Wake on LAN
 *    - Run scripts via HTTP server
 *    - Control media players
 * 
 * 3. IFTTT WEBHOOKS (Control ANYTHING):
 *    URL: https://maker.ifttt.com/trigger/EVENT_NAME/with/key/YOUR_KEY
 *    Can trigger:
 *    - Phone notifications
 *    - Smart home devices
 *    - Google Home/Alexa
 *    - Email, SMS, etc.
 * 
 * 4. HOME ASSISTANT:
 *    URL: http://homeassistant.local:8123/api/webhook/YOUR_WEBHOOK_ID
 * 
 * 5. SMART TVs:
 *    - Roku: http://ROKU_IP:8060/keypress/Power
 *    - Samsung: Port 8002 with specific API
 *    - LG webOS: Port 3000
 * 
 * 6. TUYA/SMART LIFE WiFi PLUGS:
 *    Use local control or cloud API
 * 
 * 7. NODE-RED:
 *    Create HTTP endpoints that do complex automations
 * 
 * 8. CUSTOM WEB SERVICES:
 *    Build your own API on any server
 * 
 * ============================================
 * WIRING REMINDER
 * ============================================
 * 
 * RX480E → ESP32
 * ─────────────
 * GND    → GND
 * +V     → 5V
 * D0     → GPIO 25
 * D1     → GPIO 26
 * D2     → GPIO 27
 * D3     → GPIO 14
 * 
 * PAIRING:
 * 1. Press learning button on RX480E once (momentary mode)
 * 2. LED turns on
 * 3. Press any button on TX118SA remote
 * 4. LED flashes 3x = paired!
 * 
 * ============================================
 * WHY THIS IS ACTUALLY USEFUL
 * ============================================
 * 
 * Your TX118SA remote becomes a UNIVERSAL controller for:
 * ✓ Any WiFi device in your home
 * ✓ Your JARVIS Raspberry Pi system
 * ✓ Cloud services (IFTTT, webhooks)
 * ✓ Your computer
 * ✓ Multiple devices at once
 * ✓ Complex automation scenes
 * 
 * This is MORE FLEXIBLE than just controlling RF plugs!
 * You can literally control ANYTHING with an HTTP API.
 * 
 * ============================================
 */
