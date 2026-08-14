# Troubleshooting Guide

Comprehensive guide to solving common issues with the ESP32 RF control system.

## Table of Contents

1. [Signal Detection Issues](#signal-detection-issues)
2. [Transmission Issues](#transmission-issues)
3. [ESP32 Programming Issues](#esp32-programming-issues)
4. [WiFi Connection Issues](#wifi-connection-issues)
5. [Web Interface Issues](#web-interface-issues)
6. [Hardware Issues](#hardware-issues)
7. [Range Issues](#range-issues)
8. [Integration Issues](#integration-issues)

---

## Signal Detection Issues

### Problem: No signals detected from remote

**Symptoms:**
- Serial Monitor shows "Scanning..." but no signals
- Pressing remote buttons does nothing
- No output in Serial Monitor

**Solutions:**

1. **Check wiring:**
   ```
   Verify connections:
   - Receiver VCC → ESP32 3.3V (NOT 5V for most receivers)
   - Receiver GND → ESP32 GND
   - Receiver DATA → ESP32 GPIO 27
   ```

2. **Check power:**
   - Receiver should have power LED on (if equipped)
   - Measure voltage at receiver VCC (should be 3.3V)
   - Check if receiver gets warm (sign of reversed polarity)

3. **Distance issue:**
   - Move receiver closer to remote (< 30cm initially)
   - Point remote directly at receiver
   - Remove obstacles between remote and receiver

4. **Check remote batteries:**
   - Replace with fresh batteries
   - Test remote on actual smart plugs first

5. **Verify code:**
   - Correct GPIO pin in code (27 for receiver)
   - RCSwitch library properly installed
   - Baud rate set to 115200

6. **Test different GPIO pins:**
   ```cpp
   // Try GPIO 26 instead of 27
   #define RF_RECEIVER_PIN 26
   ```

7. **Check receiver sensitivity:**
   - Some receivers have adjustable potentiometer
   - Turn clockwise to increase sensitivity
   - Don't max it out (causes false triggers)

### Problem: Signals detected but codes are inconsistent

**Symptoms:**
- Same button produces different codes each time
- Codes contain many zeros
- Protocol number changes

**Solutions:**

1. **Interference:**
   - Move away from WiFi router
   - Turn off other 433 MHz devices
   - Test in different room

2. **Weak signal:**
   - Replace remote batteries
   - Move closer to receiver
   - Check receiver antenna is extended

3. **Rolling code remote:**
   - Some remotes use rolling codes (security feature)
   - These change with each press
   - Not compatible with simple RF replay
   - Check if smart plugs support learning mode

4. **Multiple protocols:**
   - Try capturing with different protocols:
   ```cpp
   rfReceive.setProtocol(1);  // Try 1-6
   ```

---

## Transmission Issues

### Problem: Codes transmit but smart plugs don't respond

**Symptoms:**
- Code sends (confirmed in Serial Monitor)
- Smart plugs don't turn on/off
- Original remote still works

**Solutions:**

1. **Verify captured codes:**
   - Re-run rf_signal_scanner.ino
   - Confirm codes match what you programmed
   - Check for typos in code

2. **Check transmitter power:**
   ```
   - Transmitter VCC → ESP32 5V (NOT 3.3V)
   - Measure voltage at transmitter (should be ~5V)
   - Try external 5V power supply
   ```

3. **Increase repeat count:**
   ```cpp
   #define RF_REPEAT 15  // Increase from 10 to 15
   ```

4. **Verify protocol settings:**
   ```cpp
   #define RF_PROTOCOL 1     // Must match captured protocol
   #define RF_BIT_LENGTH 24  // Must match captured bit length
   ```

5. **Check pulse length:**
   ```cpp
   // If you captured pulse length (e.g., 350):
   #define PULSE_LENGTH 350
   
   // In setup():
   rfTransmit.setPulseLength(PULSE_LENGTH);
   ```

6. **Distance:**
   - Move ESP32 closer to smart plugs (< 1 meter initially)
   - No walls between transmitter and plugs
   - Test one plug at a time

7. **Timing issues:**
   ```cpp
   // Add delay between transmissions:
   rfTransmit.send(code, RF_BIT_LENGTH);
   delay(100);  // Wait 100ms
   rfTransmit.send(code, RF_BIT_LENGTH);
   ```

8. **Antenna:**
   - Add 17.3cm wire antenna to transmitter
   - Keep antenna straight and vertical
   - Don't let it touch metal objects

### Problem: Plugs respond intermittently

**Symptoms:**
- Sometimes works, sometimes doesn't
- Works better when closer
- Better with some plugs than others

**Solutions:**

1. **Increase signal strength:**
   - Use 5V for transmitter (not 3.3V)
   - Add proper antenna (17.3cm wire)
   - Increase repeat count (15-20)

2. **Check for interference:**
   - Other 433 MHz devices nearby?
   - Move WiFi router away
   - Change transmitter orientation

3. **Power supply:**
   - USB port may not provide enough current
   - Use powered USB hub
   - Try external 5V 2A power supply

4. **Timing:**
   ```cpp
   // Add delay between commands:
   sendRFCode(PLUG1_ON, "Plug 1");
   delay(200);  // Wait 200ms before next command
   ```

---

## ESP32 Programming Issues

### Problem: Can't upload sketch to ESP32

**Symptoms:**
- "Failed to connect to ESP32" error
- "Timed out waiting for packet header" error
- Upload starts but fails partway

**Solutions:**

1. **Hold BOOT button:**
   - Press and hold BOOT button on ESP32
   - Click Upload in Arduino IDE
   - Keep holding until "Connecting..." appears
   - Release when upload starts

2. **Check USB cable:**
   - Must be data-capable (not charge-only)
   - Try different USB cable
   - Try different USB port on computer

3. **Correct board selected:**
   ```
   Tools → Board → ESP32 Arduino → ESP32 Dev Module
   ```

4. **Correct port selected:**
   ```
   Tools → Port → (COM# or /dev/ttyUSB#)
   ```

5. **Reduce upload speed:**
   ```
   Tools → Upload Speed → 115200
   ```

6. **Check drivers:**
   - Windows: Install CP210x or CH340 driver
   - Mac: Usually works automatically
   - Linux: Add user to dialout group:
     ```bash
     sudo usermod -a -G dialout $USER
     ```
   - Reboot after driver install

7. **Close Serial Monitor:**
   - Serial Monitor locks the port
   - Close it before uploading

8. **Try erasing flash:**
   ```
   Tools → Erase Flash → All Flash Contents
   ```
   Then try uploading again.

### Problem: Compilation errors

**Symptoms:**
- Red error messages in Arduino IDE
- "Compilation error" message
- References to missing libraries

**Solutions:**

1. **Install RCSwitch library:**
   ```
   Tools → Manage Libraries → Search "RCSwitch"
   Install "rc-switch" by sui77
   ```

2. **Install ESP32 board support:**
   ```
   File → Preferences → Additional Board Manager URLs
   Add: https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
   
   Tools → Board → Boards Manager → Search "esp32"
   Install "ESP32 by Espressif Systems"
   ```

3. **Update Arduino IDE:**
   - Use Arduino IDE 2.x (recommended)
   - Download from arduino.cc

4. **Check code for typos:**
   - Missing semicolons
   - Mismatched brackets
   - Incorrect variable names

---

## WiFi Connection Issues

### Problem: ESP32 won't connect to WiFi

**Symptoms:**
- "Connecting to WiFi..." hangs
- "WiFi connection failed!" message
- No IP address displayed

**Solutions:**

1. **Check credentials:**
   ```cpp
   const char* ssid = "YourExactWiFiName";
   const char* password = "YourExactPassword";
   ```
   - Case sensitive!
   - No extra spaces
   - Special characters properly entered

2. **Check WiFi band:**
   - ESP32 only supports 2.4 GHz WiFi
   - Won't connect to 5 GHz networks
   - Enable 2.4 GHz on dual-band router

3. **Signal strength:**
   - Move ESP32 closer to router
   - Check for metal obstacles
   - Try different location

4. **Router settings:**
   - Disable AP isolation
   - Check MAC filtering isn't blocking ESP32
   - Ensure DHCP is enabled

5. **Increase timeout:**
   ```cpp
   int attempts = 0;
   while (WiFi.status() != WL_CONNECTED && attempts < 60) {
     delay(500);
     Serial.print(".");
     attempts++;
   }
   ```

6. **Static IP (if DHCP fails):**
   ```cpp
   IPAddress local_IP(192, 168, 1, 100);
   IPAddress gateway(192, 168, 1, 1);
   IPAddress subnet(255, 255, 255, 0);
   
   WiFi.config(local_IP, gateway, subnet);
   WiFi.begin(ssid, password);
   ```

7. **Check Serial Monitor:**
   - Set to 115200 baud
   - Look for specific error messages
   - Note any status codes

---

## Web Interface Issues

### Problem: Can't access web interface

**Symptoms:**
- Browser shows "Can't reach this page"
- IP address not loading
- Timeout errors

**Solutions:**

1. **Verify IP address:**
   - Check Serial Monitor for IP
   - Ping ESP32: `ping 192.168.1.xxx`
   - Ensure correct IP entered in browser

2. **Same network:**
   - Computer and ESP32 must be on same WiFi
   - Check if on guest network (isolated)
   - Disable VPN if active

3. **Browser issues:**
   - Try different browser
   - Clear browser cache
   - Try incognito/private mode
   - Type `http://` explicitly: `http://192.168.1.100`

4. **Firewall:**
   - Temporarily disable firewall to test
   - Add exception for port 80
   - Check antivirus blocking connections

5. **Check ESP32 status:**
   - Is it still connected to WiFi?
   - Did it crash? (check Serial Monitor)
   - Try restarting ESP32

### Problem: Web interface loads but buttons don't work

**Symptoms:**
- Page displays correctly
- Clicking buttons does nothing
- No response from plugs

**Solutions:**

1. **Check JavaScript console:**
   - Press F12 in browser
   - Look for errors in Console tab
   - Check Network tab for failed requests

2. **RF codes configured:**
   - Verify codes are set (not 0)
   - Check code format is correct
   - Re-upload sketch if needed

3. **CORS issues (if accessing from different domain):**
   - Access directly via IP (not hostname)
   - Ensure using same protocol (http://)

---

## Hardware Issues

### Problem: ESP32 not powering on

**Symptoms:**
- No LED lights
- Computer doesn't detect ESP32
- Nothing happens when plugged in

**Solutions:**

1. **Check USB cable:**
   - Try different cable (data-capable)
   - Try different USB port
   - Check for physical damage

2. **Check power LED:**
   - Should have red LED on when powered
   - If not, possible board damage

3. **Check for shorts:**
   - Disconnect all wires
   - Try powering ESP32 alone
   - Check for solder bridges

4. **Measure voltages:**
   - 3.3V pin should read 3.3V
   - 5V pin should read ~5V
   - GND should be 0V

### Problem: Components getting hot

**Symptoms:**
- ESP32, receiver, or transmitter very warm/hot
- Smell of burning electronics
- Component failure

**Solutions:**

1. **Immediately disconnect power!**

2. **Check for reversed polarity:**
   - VCC and GND swapped?
   - Compare to wiring diagram

3. **Check for shorts:**
   - Measure resistance between VCC and GND
   - Should be high (> 1kΩ)

4. **Excessive current:**
   - Don't power high-current devices from GPIO
   - Use separate power supply if needed

---

## Range Issues

### Problem: Short transmission range

**Symptoms:**
- Works only when very close (< 2 meters)
- Doesn't work through walls
- Unreliable at normal distances

**Solutions:**

1. **Increase transmitter voltage:**
   - Use 5V instead of 3.3V
   - Some transmitters support up to 12V (check specs!)

2. **Add antenna:**
   - Cut 17.3cm solid wire
   - Attach to transmitter ANT pad
   - Keep vertical and straight

3. **Increase repeat count:**
   ```cpp
   #define RF_REPEAT 20
   ```

4. **Check transmitter power:**
   - Measure voltage at VCC
   - Should be steady 5V
   - Use quality power supply

5. **Environment:**
   - Metal objects block RF signals
   - Move away from large metal surfaces
   - Position transmitter higher up
   - Avoid enclosed spaces

6. **Quality of modules:**
   - Cheap modules have shorter range
   - Consider upgrading to better modules
   - Check antenna on modules is extended

---

## Integration Issues

### Problem: Python integration not working

**Symptoms:**
- Can't import jarvis_integration
- Requests fail
- Connection timeout errors

**Solutions:**

1. **Install requests library:**
   ```bash
   pip install requests
   # or
   pip3 install requests
   ```

2. **Check IP address:**
   ```python
   controller = SmartPlugController("192.168.1.100")  # Correct IP?
   ```

3. **Test connectivity:**
   ```bash
   ping 192.168.1.100
   curl http://192.168.1.100/status
   ```

4. **Check firewall:**
   - Raspberry Pi firewall
   - ESP32 web server running
   - Port 80 accessible

5. **Verify web control works:**
   - Test in browser first
   - Ensure /status endpoint returns JSON

---

## Advanced Debugging

### Enable debug output in Arduino:

```cpp
// Add at top of sketch:
#define DEBUG 1

// Throughout code:
#ifdef DEBUG
  Serial.println("Debug message here");
#endif
```

### Check RF signal with oscilloscope:

- Connect probe to DATA pin
- Should see pulses when transmitting
- Pulse width should match protocol

### Use logic analyzer:

- Capture RF signals with logic analyzer
- Compare captured vs transmitted signals
- Verify timing and protocol

### Test with known-good components:

- Swap receiver with another one
- Test transmitter on different ESP32
- Try different smart plugs

---

## Still Having Issues?

### Checklist before asking for help:

- [ ] Followed all troubleshooting steps
- [ ] Checked all wiring connections
- [ ] Verified all voltages with multimeter
- [ ] Tested with minimal setup (receiver OR transmitter only)
- [ ] Tried different GPIO pins
- [ ] Updated all libraries and Arduino IDE
- [ ] Tried example sketches from RCSwitch library
- [ ] Documented exact error messages
- [ ] Taken photos of setup

### Information to provide when seeking help:

1. **Hardware:**
   - Exact ESP32 model
   - RF module models (receiver and transmitter)
   - Smart plug brand and model

2. **Software:**
   - Arduino IDE version
   - ESP32 board support version
   - RCSwitch library version

3. **Symptoms:**
   - Exact error messages
   - When problem occurs
   - What you've already tried

4. **Setup:**
   - Wiring diagram or photo
   - Code modifications (if any)
   - Serial Monitor output

### Where to get help:

- Arduino Forum (forum.arduino.cc)
- ESP32 Forum (esp32.com)
- Reddit r/arduino
- Reddit r/esp32
- Electronics Stack Exchange

---

## Quick Reference: Common Fixes

| Problem | Quick Fix |
|---------|-----------|
| No signal detected | Check receiver on 3.3V, move closer |
| Plugs don't respond | Transmitter on 5V, verify codes |
| Can't upload | Hold BOOT button, try different cable |
| WiFi won't connect | Check 2.4GHz, verify credentials |
| Short range | Add antenna, use 5V, increase repeats |
| Web page won't load | Check IP, same network, clear cache |
| Intermittent operation | Increase repeats, check power supply |

---

**Remember:** Most issues are wiring or power related. Always double-check connections first!
