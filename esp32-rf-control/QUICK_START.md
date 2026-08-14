# Quick Start Guide - ESP32 RF Smart Plug Control

Get your Energizer smart plugs working with ESP32 in under 30 minutes!

## What You Need

- ✅ Keysstudio ESP32 WROOM-32D board
- ✅ CIACHIP RX480E 433 MHz receiver
- ✅ TX118SA 433 MHz transmitter (4 channel)
- ✅ Energizer remote control smart plugs + original remote
- ✅ Jumper wires (at least 6)
- ✅ USB cable (data-capable)
- ✅ Computer with Arduino IDE

## 5-Minute Setup

### Step 1: Install Arduino IDE (5 minutes)

1. Download Arduino IDE 2.x from [arduino.cc](https://www.arduino.cc/en/software)
2. Install and launch Arduino IDE
3. Go to **File → Preferences**
4. Add this URL to "Additional Board Manager URLs":
   ```
   https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
   ```
5. Go to **Tools → Board → Boards Manager**
6. Search "esp32" and install **ESP32 by Espressif Systems**
7. Go to **Tools → Manage Libraries**
8. Search "rcswitch" and install **rc-switch by sui77**

### Step 2: Wire the Receiver (2 minutes)

Connect for signal capture:

```
Receiver → ESP32
-----------------
VCC     → 3.3V
GND     → GND
DATA    → GPIO 27
```

**Visual:**
```
        Receiver              ESP32
        ┌──────┐           ┌────────┐
  Red   │ VCC  ├───────────┤ 3.3V   │
  Black │ GND  ├───────────┤ GND    │
  Yellow│ DATA ├───────────┤ GPIO27 │
        └──────┘           └────────┘
```

### Step 3: Capture Your Remote Codes (5 minutes)

1. Open Arduino IDE
2. Open `rf_signal_scanner.ino`
3. Select board: **Tools → Board → ESP32 Arduino → ESP32 Dev Module**
4. Select port: **Tools → Port → (your ESP32 port)**
5. Click **Upload** (arrow button)
6. Open **Tools → Serial Monitor** (set to 115200 baud)
7. Press each button on your Energizer remote
8. Write down the codes displayed

**Example output:**
```
Code (Dec): 13383452
Bit Length: 24 bits
Protocol: 1
```

**Record your codes here:**
```
Plug 1 ON:  ____________
Plug 1 OFF: ____________
Plug 2 ON:  ____________
Plug 2 OFF: ____________
Plug 3 ON:  ____________
Plug 3 OFF: ____________
Plug 4 ON:  ____________
Plug 4 OFF: ____________
```

### Step 4: Wire the Transmitter (2 minutes)

Now add the transmitter for control:

```
Transmitter → ESP32
-------------------
VCC        → 5V
GND        → GND
DATA       → GPIO 25
```

**Keep receiver connected!** Both can be wired at the same time.

### Step 5: Program for Control (5 minutes)

1. Open `rf_smart_plug_control.ino`
2. Find the section with `#define PLUG1_ON 0`
3. Replace `0` with your captured codes:
   ```cpp
   #define PLUG1_ON  13383452
   #define PLUG1_OFF 13383449
   // ... etc
   ```
4. Click **Upload**
5. Open **Serial Monitor** (115200 baud)
6. Type commands to test:
   - `1ON` - Turn plug 1 on
   - `1OFF` - Turn plug 1 off

**Success!** You should see your plugs respond! 🎉

### Step 6 (Optional): Add WiFi Control (5 minutes)

For web browser control:

1. Open `rf_web_control.ino`
2. Update WiFi credentials:
   ```cpp
   const char* ssid = "YourWiFiName";
   const char* password = "YourPassword";
   ```
3. Add your captured codes (same as Step 5)
4. Upload the sketch
5. Open Serial Monitor to see the IP address
6. Open that IP in your web browser
7. Control plugs from any device! 📱💻

## Common Issues & Quick Fixes

### "No Signal Detected" 

**Quick Fix:**
- ✅ Check receiver is on 3.3V (not 5V)
- ✅ Move receiver closer to remote (< 30cm)
- ✅ Verify GPIO 27 connection
- ✅ Check remote batteries

### "Plugs Don't Respond"

**Quick Fix:**
- ✅ Check transmitter is on 5V (not 3.3V)
- ✅ Verify codes are correct
- ✅ Move ESP32 closer to plugs
- ✅ Check GPIO 25 connection
- ✅ Try increasing repeat count in code (change `#define RF_REPEAT 10` to `15`)

### "Upload Failed" / "Can't Connect to ESP32"

**Quick Fix:**
- ✅ Press and hold BOOT button while uploading
- ✅ Try different USB cable
- ✅ Try different USB port
- ✅ Reduce upload speed: **Tools → Upload Speed → 115200**

### "Code Not Working"

**Quick Fix:**
- ✅ Verify board selected: **ESP32 Dev Module**
- ✅ Check RCSwitch library is installed
- ✅ Verify baud rate is 115200
- ✅ Check for compiler errors in output

## Testing Checklist

Before declaring success, test:

- [ ] Captured codes from all remote buttons
- [ ] All plugs turn ON via serial command
- [ ] All plugs turn OFF via serial command
- [ ] ALLON command works
- [ ] ALLOFF command works
- [ ] Web interface loads (if using WiFi version)
- [ ] Web interface controls all plugs
- [ ] Range is acceptable (at least 3 meters)

## Understanding Your Hardware

### ESP32 (The Brain)
- WiFi-enabled microcontroller
- Runs your code
- Sends/receives RF signals
- Can serve web pages

### RF Receiver (The Ears)
- Listens for 433 MHz signals
- Captures codes from remote
- Only needed for initial setup
- Can be disconnected after capturing codes

### RF Transmitter (The Mouth)
- Sends 433 MHz signals
- Replays captured codes
- Needed for controlling plugs
- Higher voltage = better range

### Smart Plugs (The Target)
- Receive 433 MHz signals
- Respond to specific codes
- Can be controlled by multiple transmitters
- Original remote still works

## How It Works

```
Original Remote           Your ESP32 System
    │                          │
    │ 433 MHz                  │
    ├──── ON Code ────────────►│ Receiver captures
    │     (13383452)           │ and displays code
    │                          │
    │                          │ You save code in ESP32
    │                          │
    │                          │ Later...
    │                          │
    │                          │ ESP32 transmits same code
    ▼                          ▼
[Smart Plug]  ◄───────────── Transmitter sends
                433 MHz       (13383452)
```

## Next Steps After Quick Start

### Immediate:
1. Test all plugs work reliably
2. Adjust transmitter position for best range
3. Label which code controls which plug

### Short Term:
1. Set up web control for remote access
2. Create automation rules
3. Add scheduling functionality

### Long Term:
1. Integrate with JARVIS assistant
2. Add voice control
3. Create scenes (groups of plugs)
4. Add Alexa/Google Home integration

## Power Tips

### For Best Range:
- Use 5V (not 3.3V) for transmitter
- Add 17.3cm wire antenna to transmitter
- Position transmitter high and unobstructed
- Increase repeat count in code

### For Reliability:
- Use short, quality jumper wires
- Keep connections tight
- Avoid WiFi interference (move away from router)
- Test one plug at a time first

### For Convenience:
- Use web interface for daily control
- Keep serial version as backup
- Label your plugs physically
- Document your codes

## Command Reference

### Serial Commands (rf_smart_plug_control.ino)
```
1ON      - Turn plug 1 ON
1OFF     - Turn plug 1 OFF
2ON      - Turn plug 2 ON
2OFF     - Turn plug 2 OFF
3ON      - Turn plug 3 ON
3OFF     - Turn plug 3 OFF
4ON      - Turn plug 4 ON
4OFF     - Turn plug 4 OFF
ALLON    - Turn all plugs ON
ALLOFF   - Turn all plugs OFF
STATUS   - Show plug states
HELP     - Show help
```

### Web URLs (rf_web_control.ino)
```
http://[ESP32-IP]/              - Web interface
http://[ESP32-IP]/plug1/on      - Plug 1 ON
http://[ESP32-IP]/plug1/off     - Plug 1 OFF
http://[ESP32-IP]/all/on        - All plugs ON
http://[ESP32-IP]/all/off       - All plugs OFF
http://[ESP32-IP]/status        - System status (JSON)
```

## Safety Reminders

- Don't exceed 10A per plug (check plug specs)
- Don't use for critical medical equipment
- Keep ESP32 away from water
- Don't modify RF modules (legal limits)
- Use proper power supply (5V, 1A minimum)

## Success Tips from Experience

1. **Test with receiver first** - Don't skip signal capture step
2. **One plug at a time** - Don't test all at once initially
3. **Keep remote handy** - You still have manual control
4. **Document everything** - Write down codes, wiring, issues
5. **Start close, then move away** - Test range incrementally
6. **Use quality cables** - Cheap jumpers cause 90% of problems
7. **Be patient** - First time takes 30 mins, next time takes 5

## Ready to Go!

You should now have a working ESP32 RF control system! 

**Current Status:**
- ✅ Hardware wired correctly
- ✅ RF codes captured
- ✅ Control software working
- ✅ Plugs responding to commands

**What's possible now:**
- Control from computer (USB serial)
- Control from phone/tablet (web interface)
- Create automation scripts
- Integration with other systems
- Add more smart devices (same frequency)

---

**Questions?** Check the main README.md or TROUBLESHOOTING.md

**Working?** Consider adding:
- Scheduling (turn on/off at specific times)
- Motion sensor triggers
- Temperature-based control
- Voice control via JARVIS
- Mobile app control

**Enjoy your new smart home capabilities!** 🏠⚡
