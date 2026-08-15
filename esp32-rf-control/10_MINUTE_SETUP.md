# 10-Minute Setup - Get Something Working NOW

Forget the Energizer plugs for a minute. Here's something USEFUL you can do RIGHT NOW with what you have.

## What You'll Build

**A wireless remote control for ANYTHING in your home that has WiFi or is connected to your Raspberry Pi.**

Press button on TX118SA remote → ESP32 receives → Triggers action over WiFi → Your stuff responds

## What You Need

- ✅ ESP32 (you have)
- ✅ RX480E module (you have)
- ✅ TX118SA remote (you have)
- ✅ 6 jumper wires (female-to-female)
- ✅ USB cable
- ✅ WiFi network
- ✅ Raspberry Pi (for JARVIS integration)

## Step 1: Wire It Up (2 minutes)

```
RX480E Pin    →    ESP32 Pin
─────────────────────────────
GND           →    GND
+V            →    5V
D0            →    GPIO 25
D1            →    GPIO 26
D2            →    GPIO 27
D3            →    GPIO 14
```

**That's it. 6 wires.**

## Step 2: Pair the Remote (1 minute)

1. **Press** the learning button on RX480E **once** (LED turns on)
2. **Press** any button on TX118SA remote
3. **LED flashes 3 times** = SUCCESS!

All 4 buttons are now paired.

## Step 3: Upload Code to ESP32 (3 minutes)

1. Open Arduino IDE
2. Open `ACTUAL_USEFUL_PROJECT.ino`
3. Change these two lines:
   ```cpp
   const char* ssid = "YOUR_WIFI_SSID";        // Your WiFi name
   const char* password = "YOUR_WIFI_PASSWORD"; // Your WiFi password
   ```
4. Click **Upload**
5. Open **Serial Monitor** (115200 baud)
6. Watch it connect to WiFi

## Step 4A: Quick Test (No Raspberry Pi Needed)

Want to test it RIGHT NOW without setting up anything else?

### Control IFTTT (Free Account)

1. Go to [IFTTT.com](https://ifttt.com) and create free account
2. Create a new applet:
   - **If:** Webhooks → Receive a web request → Event name: `button1`
   - **Then:** Notifications → Send notification to my phone
3. Get your webhook key from [ifttt.com/maker_webhooks/settings](https://ifttt.com/maker_webhooks/settings)
4. Update ESP32 code:
   ```cpp
   const char* button1_url = "https://maker.ifttt.com/trigger/button1/with/key/YOUR_KEY_HERE";
   ```
5. Upload again
6. **Press button 1 on remote → Get notification on phone!**

### Control Your Computer

If you have Python on your computer:

```python
# save as server.py and run: python server.py
from flask import Flask
app = Flask(__name__)

@app.route('/button1')
def button1():
    print("BUTTON 1 PRESSED!")
    return "OK"

app.run(host='0.0.0.0', port=5000)
```

Update ESP32 with your computer's IP:
```cpp
const char* button1_url = "http://192.168.1.XXX:5000/button1";
```

Press button → See message on computer!

## Step 4B: Full JARVIS Integration (4 minutes)

### On Raspberry Pi:

1. **Copy the server file:**
   ```bash
   cd ~
   cp /workspace/esp32-rf-control/raspberry_pi_server.py .
   ```

2. **Install Flask:**
   ```bash
   pip3 install flask
   ```

3. **Run the server:**
   ```bash
   python3 raspberry_pi_server.py
   ```

4. **Note the IP address** it shows (e.g., `192.168.1.50`)

### On ESP32:

1. Edit `ACTUAL_USEFUL_PROJECT.ino`
2. Update URLs with your Pi's IP:
   ```cpp
   const char* button1_url = "http://192.168.1.50:5000/button1";
   const char* button2_url = "http://192.168.1.50:5000/button2";
   const char* button3_url = "http://192.168.1.50:5000/button3";
   const char* button4_url = "http://192.168.1.50:5000/button4";
   ```
3. Upload to ESP32

### Test It:

- Press **Button 1** → See "🔴 Button 1 pressed!" on Pi
- Press **Button 2** → See "🟢 Button 2 pressed!" on Pi  
- Press **Button 3** → See "🔵 Button 3 pressed!" on Pi
- Press **Button 4** → See "🟡 Button 4 pressed!" on Pi

**IT WORKS!**

## What Can You Control?

Now edit `raspberry_pi_server.py` to make the buttons do ANYTHING:

### Easy Examples:

**Play a sound:**
```python
@app.route('/button1')
def button1():
    os.system("aplay /home/pi/sounds/alert.wav")
    return jsonify({"status": "success"})
```

**Run any shell command:**
```python
@app.route('/button2')
def button2():
    os.system("vcgencmd measure_temp")  # Check Pi temperature
    return jsonify({"status": "success"})
```

**Control GPIO pins:**
```python
@app.route('/button3')
def button3():
    import RPi.GPIO as GPIO
    GPIO.setmode(GPIO.BCM)
    GPIO.setup(17, GPIO.OUT)
    GPIO.output(17, GPIO.HIGH)  # Turn on LED/relay
    return jsonify({"status": "success"})
```

**Send notifications:**
```python
@app.route('/button4')
def button4():
    os.system("notify-send 'Alert' 'Button 4 was pressed!'")
    return jsonify({"status": "success"})
```

### Advanced Examples:

**Control WiFi smart bulbs:**
```python
import requests

@app.route('/button1')
def button1():
    # Philips Hue example
    requests.put("http://HUE_BRIDGE_IP/api/USERNAME/lights/1/state",
                 json={"on": True})
    return jsonify({"status": "success"})
```

**Control smart TV:**
```python
@app.route('/button2')
def button2():
    # Roku TV example
    requests.post("http://ROKU_IP:8060/keypress/Power")
    return jsonify({"status": "success"})
```

**Trigger JARVIS actions:**
```python
@app.route('/button3')
def button3():
    # If you have jarvis_integration.py
    from jarvis_integration import SmartPlugController
    controller = SmartPlugController("SMART_PLUG_IP")
    controller.all_on()
    return jsonify({"status": "success"})
```

**Home Assistant webhook:**
```python
@app.route('/button4')
def button4():
    requests.post("http://homeassistant.local:8123/api/webhook/YOUR_WEBHOOK_ID")
    return jsonify({"status": "success"})
```

## Troubleshooting

### Remote doesn't work
- **Re-pair it:** Press learning button on RX480E, then remote button
- **Check wiring:** Especially GND and +V
- **Replace battery** in remote (CR2032)

### ESP32 won't connect to WiFi
- **Check WiFi name/password** (case sensitive!)
- **2.4GHz only** (ESP32 doesn't do 5GHz)
- **Move closer** to router

### HTTP requests fail
- **Check Pi IP address:** `hostname -I` on Raspberry Pi
- **Firewall:** Make sure port 5000 is open
- **Server running?** Check if Python script is still running

### Buttons trigger multiple times
- **Increase debounce:** Change `debounceDelay` to `500` in code
- **Check mode:** RX480E might be in toggle mode instead of momentary

## What You've Built

You now have:
- ✅ **Wireless remote control** that works anywhere in your home
- ✅ **4 programmable buttons** that can trigger anything
- ✅ **WiFi integration** to control any networked device
- ✅ **JARVIS integration** ready to go

## Next Steps

### Make it permanent:

1. **Auto-start the Pi server:**
   ```bash
   sudo nano /etc/systemd/system/remote-server.service
   ```
   Paste the systemd config from `raspberry_pi_server.py` comments
   ```bash
   sudo systemctl enable remote-server
   sudo systemctl start remote-server
   ```

2. **Power the ESP32 permanently:**
   - Use USB power adapter
   - Or power from Pi's 5V pin

### Expand it:

1. **Add more buttons** - Pair multiple TX118SA remotes
2. **Add scenes** - One button = multiple actions
3. **Add conditions** - Time-based actions
4. **Add web UI** - Control from phone browser too
5. **Add voice control** - Integrate with existing JARVIS voice system

### About those Energizer plugs:

If you still want to control them, you need just TWO more cheap components (~$4):
- **Standard 433MHz receiver** (to capture Energizer codes)
- **Standard 433MHz transmitter** (to send codes to plugs)

But honestly? **Get WiFi smart plugs instead.** Then you can control them with your remote using this same system!

---

## Summary

**Time spent:** 10 minutes  
**Cost:** $0 (you have everything)  
**Result:** Working wireless remote control system  
**Coolness factor:** 🔥🔥🔥

Now go press some buttons and make stuff happen!
