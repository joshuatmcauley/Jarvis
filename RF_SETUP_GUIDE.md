# RF Remote Control Setup Guide

## Overview
This guide will help you capture the RF codes from your Energizer remote control plugs and integrate them with your JARVIS system.

## Hardware You'll Need

### Required Components:
1. **ESP32 or Arduino board** (ESP32 recommended for WiFi control)
   - ESP32 DevKit (~£5-10 on Amazon/eBay)
   - OR Arduino Uno/Nano

2. **433MHz RF Receiver Module** (for code sniffing)
   - HC-12, RXB6, or similar (~£2-5)
   - Look for "433MHz receiver" on Amazon/eBay

3. **433MHz RF Transmitter Module** (for sending commands)
   - FS1000A, STX882, or similar (~£2-5)
   - Often sold as pairs with receivers

4. **Breadboard and jumper wires**

### Where to Buy (UK):
- **Amazon UK**: Search "433MHz RF module Arduino"
- **eBay UK**: Often cheaper, search same terms
- **CPC Farnell**: Professional supplier
- **Pimoroni**: UK-based, good quality
- **The Pi Hut**: Raspberry Pi accessories

**Total Cost**: Approximately £10-20 for all components

---

## Step 1: Capture RF Codes from Your Remote

### 1.1 Wire Up the RF Receiver

Connect the 433MHz receiver to your Arduino/ESP32:

```
RF Receiver -> Arduino/ESP32
VCC         -> 5V (or 3.3V if receiver supports it)
GND         -> GND
DATA        -> Digital Pin 2
```

### 1.2 Install RF Library

1. Open Arduino IDE
2. Go to **Sketch → Include Library → Manage Libraries**
3. Search for "**rc-switch**" by sui77
4. Click **Install**

### 1.3 Upload Code Sniffer Sketch

Create a new sketch with this code:

```cpp
#include <RCSwitch.h>

RCSwitch mySwitch = RCSwitch();

void setup() {
  Serial.begin(115200);
  mySwitch.enableReceive(2);  // Receiver on pin 2
  Serial.println("RF Code Sniffer Ready!");
  Serial.println("Press buttons on your Energizer remote...");
}

void loop() {
  if (mySwitch.available()) {
    
    Serial.println("====== RF CODE DETECTED ======");
    Serial.print("Code: 0x");
    Serial.println(mySwitch.getReceivedValue(), HEX);
    Serial.print("Code (decimal): ");
    Serial.println(mySwitch.getReceivedValue());
    Serial.print("Bit Length: ");
    Serial.println(mySwitch.getReceivedBitlength());
    Serial.print("Protocol: ");
    Serial.println(mySwitch.getReceivedProtocol());
    Serial.print("Pulse Length: ");
    Serial.println(mySwitch.getReceivedDelay());
    Serial.println("==============================\n");
    
    mySwitch.resetAvailable();
  }
}
```

### 1.4 Capture Your Codes

1. Upload the sketch
2. Open Serial Monitor (115200 baud)
3. Press each button on your Energizer remote and record the codes:
   - **Plug 1 ON** button
   - **Plug 1 OFF** button
   - **Plug 2 ON** button
   - **Plug 2 OFF** button

4. **Write down all the values** from each button:
   - Code (hex format, e.g., 0x123456)
   - Bit Length (usually 24)
   - Protocol (usually 1-5)
   - Pulse Length (usually 180-400)

**Important Notes:**
- Press each button multiple times to confirm consistency
- Some remotes send different codes each time (rolling codes) - if so, this method won't work and you'll need a more advanced approach
- Keep the receiver close to the remote (10-30cm) for best results

---

## Step 2: Configure the Controller Sketch

### 2.1 Wire Up the RF Transmitter

```
RF Transmitter -> ESP32/Arduino
VCC            -> 5V
GND            -> GND
DATA           -> Digital Pin 4 (GPIO 4 on ESP32)
```

**Optional Antenna**: Solder a 17.3cm wire to the ANT pad for better range

### 2.2 Update the Code

Open `energizer_rf_controller.ino` and update these sections:

1. **WiFi Credentials** (for ESP32):
```cpp
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
```

2. **RF Codes** (from Step 1.4):
```cpp
PlugCode plug1 = {
  0x123456,  // Replace with your Plug 1 ON code
  0x789ABC,  // Replace with your Plug 1 OFF code
  350,       // Replace with your pulse length
  1          // Replace with your protocol
};

PlugCode plug2 = {
  0xDEF012,  // Replace with your Plug 2 ON code
  0x345678,  // Replace with your Plug 2 OFF code
  350,       // Same pulse length
  1          // Same protocol
};
```

### 2.3 Upload to ESP32/Arduino

1. Install **rc-switch** library (if not already done)
2. Select your board: **Tools → Board**
3. Select the correct COM port: **Tools → Port**
4. Click **Upload**

---

## Step 3: Test the System

### Testing via Serial (Arduino or ESP32):

1. Open Serial Monitor (115200 baud)
2. Send commands:
   - `PLUG1_ON`
   - `PLUG1_OFF`
   - `PLUG2_ON`
   - `PLUG2_OFF`

### Testing via WiFi (ESP32 only):

1. Wait for the ESP32 to connect to WiFi
2. Note the IP address shown in Serial Monitor (e.g., `192.168.1.100`)
3. Open a web browser on your phone or computer
4. Navigate to: `http://192.168.1.100`
5. Use the web interface to control your plugs!

---

## Step 4: Connect to Raspberry Pi / JARVIS

### 4.1 Physical Connection

Connect ESP32/Arduino to Raspberry Pi via USB cable

### 4.2 Find the Serial Port

On Raspberry Pi, run:
```bash
ls /dev/ttyUSB* /dev/ttyACM*
```

Usually it will be `/dev/ttyUSB0` or `/dev/ttyACM0`

### 4.3 Test from Python

```python
import serial
import time

# Open serial connection
ser = serial.Serial('/dev/ttyUSB0', 115200, timeout=1)
time.sleep(2)  # Wait for connection

# Send command
ser.write(b'PLUG1_ON\n')
response = ser.readline().decode().strip()
print(response)

ser.close()
```

### 4.4 Install Updated JARVIS App

The new JARVIS app includes RF plug controls. See `jarvis_app.py` for the updated version.

---

## Troubleshooting

### Problem: No codes received when sniffing

**Solutions:**
- Check wiring (especially GND connection)
- Move receiver closer to remote
- Try different receiver modules (quality varies)
- Ensure receiver is 433MHz (not 315MHz)
- Check receiver antenna connection

### Problem: Codes captured but plugs don't respond

**Solutions:**
- Verify transmitter wiring
- Add antenna to transmitter (17.3cm wire)
- Increase transmission repeats (already set to 5)
- Try different protocols (1-5)
- Adjust pulse length slightly (±50)
- Reduce distance between transmitter and plugs for testing

### Problem: Works sometimes but not reliably

**Solutions:**
- Add external antenna to transmitter
- Increase power supply quality (use powered USB hub)
- Move transmitter away from interference sources
- Increase transmission repeats to 10

### Problem: ESP32 won't connect to WiFi

**Solutions:**
- Double-check SSID and password
- Ensure 2.4GHz WiFi (ESP32 doesn't support 5GHz)
- Move ESP32 closer to router
- Check Serial Monitor for error messages

---

## Understanding Your Energizer Plugs

### RF Frequency
Most UK RF plugs operate on **433.92 MHz** which is legal for short-range devices in the UK under license-exempt operation.

### Code Types

1. **Fixed Codes**: Same code every time (easiest to clone)
2. **Rolling Codes**: Different code each time (harder/impossible to clone)

Your Energizer plugs likely use **fixed codes**, which is why this method works.

### Range Expectations

- **Original Remote**: 10-30 meters
- **Basic Transmitter Module**: 5-15 meters
- **With Antenna**: 15-30 meters
- **With External Antenna**: 30-50+ meters

---

## Safety & Legal Notes

1. **Only control your own devices**
2. **RF equipment must not cause interference** with other devices
3. **433MHz is legal in the UK** for license-exempt short-range devices
4. **Don't exceed transmitter power limits** (10mW typical)
5. **This is for learning purposes** - commercial use may require certification

---

## Next Steps

Once everything is working:

1. ✅ Mount ESP32 in a case
2. ✅ Use the JARVIS interface for control
3. ✅ Create phone shortcuts to the ESP32 web interface
4. ✅ Add voice control (future feature)
5. ✅ Add scheduling/automation rules

---

## Additional Resources

- **rc-switch Library Docs**: https://github.com/sui77/rc-switch
- **ESP32 Arduino Core**: https://github.com/espressif/arduino-esp32
- **RF Protocol Analysis**: https://wiki.elvis.science/index.php?title=RF_Communication

---

## Need Help?

If you encounter issues:
1. Check Serial Monitor output for error messages
2. Verify all wiring connections
3. Test with a simple sketch first
4. Try different RF modules (quality varies significantly)

Good luck with your smart home project! 🏠⚡
