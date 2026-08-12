# Quick Start Guide - RF Remote Control

This guide will get you controlling your Energizer RF plugs quickly!

## Prerequisites

✅ **What you need:**
- Your Energizer remote control plug 2-pack from B&M Bargains
- ESP32 or Arduino board
- 433MHz RF receiver module (for sniffing codes)
- 433MHz RF transmitter module (for sending commands)
- Breadboard and jumper wires
- Raspberry Pi with JARVIS installed

## Step-by-Step Setup

### 1️⃣ **Order RF Modules** (if you don't have them yet)

**Quick Links for UK:**
- Amazon UK: Search "433MHz RF module Arduino"
- eBay UK: Search "433MHz transmitter receiver kit"

**What to buy:**
- "433MHz RF Transmitter and Receiver Kit" (usually £5-8)
- ESP32 DevKit board (£5-10)

**Expected delivery:** 1-3 days (Amazon Prime) or 3-7 days (eBay)

---

### 2️⃣ **Capture RF Codes from Your Remote**

Once you have the RF receiver module:

1. **Wire the receiver:**
   ```
   Receiver VCC  → Arduino 5V
   Receiver GND  → Arduino GND
   Receiver DATA → Arduino Pin 2
   ```

2. **Install Arduino IDE** (if not already):
   - Download from: https://www.arduino.cc/en/software

3. **Install rc-switch library:**
   - Open Arduino IDE
   - Go to: Sketch → Include Library → Manage Libraries
   - Search: "rc-switch"
   - Click Install

4. **Upload the code sniffer:**
   - See `RF_SETUP_GUIDE.md` section 1.3 for the complete sketch
   - Upload to Arduino
   - Open Serial Monitor (115200 baud)

5. **Press buttons and record codes:**
   - Press Plug 1 ON → Write down the code
   - Press Plug 1 OFF → Write down the code
   - Press Plug 2 ON → Write down the code
   - Press Plug 2 OFF → Write down the code
   
   Example output:
   ```
   Code: 0x123456
   Bit Length: 24
   Protocol: 1
   Pulse Length: 350
   ```

---

### 3️⃣ **Set Up the Transmitter**

1. **Wire the transmitter:**
   ```
   Transmitter VCC  → ESP32 5V
   Transmitter GND  → ESP32 GND
   Transmitter DATA → ESP32 GPIO 4
   ```

2. **Configure the sketch:**
   - Open `energizer_rf_controller.ino`
   - Update WiFi credentials:
     ```cpp
     const char* ssid = "Your_WiFi_Name";
     const char* password = "Your_WiFi_Password";
     ```
   - Update RF codes (from step 2.5):
     ```cpp
     PlugCode plug1 = {
       0x123456,  // Your ON code
       0x789ABC,  // Your OFF code
       350,       // Your pulse length
       1          // Your protocol
     };
     ```

3. **Upload to ESP32:**
   - Select Board: "ESP32 Dev Module"
   - Select Port: (Your ESP32 port)
   - Click Upload

---

### 4️⃣ **Test Basic Control**

1. **Open Serial Monitor** (115200 baud)

2. **Type commands:**
   ```
   PLUG1_ON
   PLUG1_OFF
   PLUG2_ON
   PLUG2_OFF
   ```

3. **Your plugs should respond!** 🎉

---

### 5️⃣ **Control from Your Phone**

1. **Note the IP address** from Serial Monitor:
   ```
   WiFi connected!
   IP address: 192.168.1.100
   ```

2. **Open web browser** on your phone

3. **Navigate to:** `http://192.168.1.100`

4. **You'll see a control panel** with ON/OFF buttons!

5. **Bookmark it** for quick access

---

### 6️⃣ **Connect to Raspberry Pi / JARVIS**

1. **Connect ESP32 to Pi via USB**

2. **Update JARVIS:**
   ```bash
   cd /path/to/JARVIS
   git pull  # If using git
   pip3 install -r requirements.txt
   ```

3. **Run JARVIS:**
   ```bash
   python3 jarvis_app.py
   ```

4. **Click "RF Plug Control"** button

5. **Control your plugs from JARVIS!** 🚀

---

## Troubleshooting

### ❌ **No codes captured**
- Check wiring (especially GND)
- Move receiver closer to remote
- Try a different receiver module

### ❌ **Codes captured but plugs don't respond**
- Add antenna to transmitter (17.3cm wire)
- Check transmitter wiring
- Try adjusting pulse length (±50)

### ❌ **ESP32 won't connect to WiFi**
- Check SSID and password
- Make sure it's 2.4GHz WiFi (not 5GHz)
- Move ESP32 closer to router

### ❌ **JARVIS can't find RF controller**
- Check USB connection
- Run: `ls /dev/ttyUSB* /dev/ttyACM*`
- Make sure ESP32 is powered on
- Click "Reconnect" in JARVIS

---

## What Can You Do Now?

✅ **Control plugs from:**
- JARVIS desktop app
- Web browser (phone, tablet, computer)
- Command line / Python scripts

✅ **Possible Uses:**
- Lamps and lights
- Fans
- Coffee maker (wake up to fresh coffee!)
- Phone chargers
- Space heaters (with caution!)
- Christmas lights
- Any device under 13A

---

## Safety Notes

⚠️ **Important:**
- Don't exceed 13A per plug
- Don't use with critical medical equipment
- Don't use with devices that could be dangerous if turned on unexpectedly
- Keep RF equipment away from water
- Follow UK electrical safety regulations

---

## Next Steps

Once everything is working:

1. **Voice Control** (coming soon in JARVIS)
2. **Scheduling** (turn on/off at specific times)
3. **Automation Rules** (temperature triggers, motion sensors, etc.)
4. **More Plugs** (you can add more by capturing additional codes)

---

## Need More Help?

📖 **Full Documentation:**
- `RF_SETUP_GUIDE.md` - Detailed technical guide
- `energizer_rf_controller.ino` - Arduino sketch with comments

🔧 **Test Commands:**
```bash
# Test serial connection
python3 -c "import serial; print(serial.VERSION)"

# List USB devices
ls -la /dev/tty*

# Check Python packages
pip3 list | grep serial
```

---

Have fun automating your home! 🏠⚡
