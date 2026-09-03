# Your RF Plug Control Setup - Using What You Have

## ✅ What You Have That We'll Use

From your inventory:
- ✅ **Keyestudio Arduino ESP32 Plus** - PERFECT! Has WiFi for phone control
- ✅ **Relay module** (from Elegoo 37 sensor kit)
- ✅ **Energizer remote** (with your plugs)
- ✅ **Jumper wires** - All types
- ✅ **Raspberry Pi** - For JARVIS integration

## 🎯 The Solution: Relay-on-Remote Approach

Since you **don't have 433MHz RF transmitter/receiver modules**, we'll use the **relay-on-remote approach** I documented. This is actually BETTER for you because:

✅ **Use what you have** - No purchases needed
✅ **More reliable** - Your remote's RF circuit is proven to work
✅ **Phone control via WiFi** - ESP32 has WiFi built-in
✅ **No code sniffing** - Don't need to capture RF codes

## 🔌 How It Works

```
Phone → ESP32 (WiFi) → Relay → Remote Buttons → RF Signal → Plugs
```

The relay physically "presses" your remote's buttons!

---

## 📦 Parts You'll Use

### 1. Keyestudio ESP32 Plus
- Main controller
- Handles WiFi for phone control
- Controls the relay

### 2. Relay Module (from Elegoo kit)
- Number 6 in your sensor kit
- Will "press" remote buttons
- 1 relay can control 1 button

### 3. Your Energizer Remote
- Provides the RF transmission
- We'll wire to the button contacts
- Stays powered by its battery

### 4. Jumper Wires
- Connect ESP32 to relay
- Connect relay to remote

---

## 🛠️ Step-by-Step Setup

### Step 1: Test Your Relay Module (5 minutes)

First, let's make sure the relay works:

```cpp
// Test sketch for ESP32 + Relay
#define RELAY_PIN 4  // GPIO 4 on ESP32

void setup() {
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, HIGH);  // Off initially
}

void loop() {
  digitalWrite(RELAY_PIN, LOW);   // Relay ON
  delay(1000);
  digitalWrite(RELAY_PIN, HIGH);  // Relay OFF
  delay(1000);
}
```

**Expected:** Relay clicks on/off every second

---

### Step 2: Open Your Energizer Remote

**Tools needed:**
- Small screwdriver
- Your eyes

**Steps:**
1. Remove batteries
2. Look for screws (usually under battery sticker)
3. Carefully open case
4. Identify which button is which:
   - Plug 1 ON
   - Plug 1 OFF
   - Plug 2 ON
   - Plug 2 OFF

---

### Step 3: Identify Button Contacts

**Using a multimeter (if you have one):**
1. Set to continuity mode
2. Touch probes to metal pads near button
3. Press button
4. When it beeps, you found the contacts!

**Without a multimeter:**
Look for two metal pads that the button bridges when pressed.

---

### Step 4: Wire Relay to ONE Button (Start Simple)

Let's start with just **Plug 1 ON button**:

**Option A: If you can solder (recommended):**
1. Solder two thin wires to the Plug 1 ON button contacts
2. Connect these wires to relay's COM and NO terminals
3. Button is now controlled by relay!

**Option B: If you can't solder:**
1. Carefully tape thin wires to button contacts
2. Test with multimeter that circuit closes
3. Connect to relay COM and NO

**Wiring:**
```
Remote Button Contact 1 → Relay COM
Remote Button Contact 2 → Relay NO
```

---

### Step 5: Wire ESP32 to Relay

```
ESP32 5V   → Relay VCC
ESP32 GND  → Relay GND
ESP32 GPIO4 → Relay IN (or S, or Signal)
```

---

### Step 6: Upload Control Code to ESP32

Use this modified code:

```cpp
#include <WiFi.h>
#include <WebServer.h>

// WiFi credentials - CHANGE THESE!
const char* ssid = "YOUR_WIFI_NAME";
const char* password = "YOUR_WIFI_PASSWORD";

// Relay pin
#define RELAY_PLUG1_ON 4

WebServer server(80);

void setup() {
  Serial.begin(115200);
  
  pinMode(RELAY_PLUG1_ON, OUTPUT);
  digitalWrite(RELAY_PLUG1_ON, HIGH);  // Off initially
  
  // Connect to WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println("\nWiFi connected!");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
  
  // Web server routes
  server.on("/", handleRoot);
  server.on("/plug1/on", handlePlug1On);
  
  server.begin();
}

void loop() {
  server.handleClient();
}

void handlePlug1On() {
  Serial.println("Pressing Plug 1 ON button");
  digitalWrite(RELAY_PLUG1_ON, LOW);   // Press button
  delay(200);                           // Hold for 200ms
  digitalWrite(RELAY_PLUG1_ON, HIGH);  // Release button
  
  server.send(200, "text/plain", "Plug 1 turned ON");
}

void handleRoot() {
  String html = R"(
<!DOCTYPE html>
<html>
<head>
    <title>Energizer Control</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        body {
            font-family: Arial;
            max-width: 400px;
            margin: 50px auto;
            text-align: center;
            background: #1a1a1a;
            color: white;
        }
        button {
            padding: 20px 40px;
            font-size: 20px;
            margin: 10px;
            border: none;
            border-radius: 10px;
            background: #00ff00;
            color: black;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <h1>Energizer Control</h1>
    <button onclick="fetch('/plug1/on')">Turn Plug 1 ON</button>
</body>
</html>
  )";
  
  server.send(200, "text/html", html);
}
```

---

### Step 7: Test from Your Phone!

1. Note the IP address from Serial Monitor (e.g., 192.168.1.100)
2. Open browser on your phone
3. Go to that IP address
4. Press "Turn Plug 1 ON" button
5. **Your plug should turn on!** 🎉

---

## 🚀 Expanding to All 4 Buttons

Once ONE button works, repeat for others:

### Wiring:
```
ESP32 GPIO 4  → Relay 1 → Remote Plug 1 ON button
ESP32 GPIO 5  → Relay 2 → Remote Plug 1 OFF button  
ESP32 GPIO 18 → Relay 3 → Remote Plug 2 ON button
ESP32 GPIO 19 → Relay 4 → Remote Plug 2 OFF button
```

### Problem: You Only Have ONE Relay Module

**Solutions:**

**Option 1: Control One Plug Only** (simplest)
- Use the one relay for Plug 1 ON
- Control manually or buy more relays later

**Option 2: Share the Relay** (clever)
- Plug 1 ON for 3 seconds = Turn OFF
- Gets confusing but works

**Option 3: Use Your Arduino Uno R4 Too**
- ESP32 handles WiFi and Plug 1
- Arduino handles Plug 2
- They communicate via serial or shared pins

**Option 4: Buy 4-Channel Relay Module** (~£5)
- But you said "off that only"
- So let's stick with what you have

---

## 📱 Phone Control Interface

Once working, bookmark this page on your phone:

```
http://192.168.1.XXX
```

You'll have instant control of your plugs!

---

## 🔧 What About the IR Emitter/Receiver?

**Unfortunately:** Your Energizer plugs use **433MHz RF**, not infrared.

Your IR emitter/receiver (from Elegoo kit) won't work with RF plugs.

**But good news:** The relay approach works perfectly!

---

## 💡 Future Upgrades (With What You Have)

### 1. Add PIR Motion Sensor
Turn on lights when you enter a room!

```cpp
if (motionDetected) {
  pressPlug1OnButton();
}
```

### 2. Add Temperature Sensor
Turn on fan when hot!

```cpp
if (temperature > 25) {
  pressPlug2OnButton();  // Fan
}
```

### 3. Add Gas Sensor
Safety shutoff for appliances!

### 4. Add LCD Display
Show status without phone!

### 5. Add RFID Module
Swipe card to control plugs!

---

## 🎯 Your Next Steps

1. **Tonight:** Test relay module with ESP32
2. **Tomorrow:** Open remote and identify button contacts
3. **Next:** Wire ONE button to relay
4. **Test:** Control from phone
5. **Expand:** Add more buttons as needed

---

## ❓ Need More Relays?

If you need to control all 4 buttons and want to buy:
- **4-Channel Relay Module** (~£5 on Amazon UK)
- Search: "4 channel 5V relay module"

But start with ONE button first to prove it works!

---

## 🔗 Reference Documents

Full details in:
- `RELAY_ON_REMOTE_GUIDE.md` - Complete relay wiring guide
- `RELAY_VS_RF_COMPARISON.md` - Why this approach works

---

## ✅ Summary

**What you'll build:**
- ESP32 with WiFi web server
- Relay "presses" remote buttons
- Control from phone browser
- Uses only what you have!

**Cost:** £0 (you have everything!)

**Time:** 1-2 hours for first button

**Result:** Phone-controlled smart plugs! 📱⚡

---

Good luck! Start simple with ONE button and expand from there!
