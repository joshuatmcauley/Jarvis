# Copy-Paste Code Examples

Ready-to-use code for common projects. Just copy, paste, and customize!

## Table of Contents
1. [Control Smart Bulbs](#control-smart-bulbs)
2. [Control Computer](#control-computer)
3. [IFTTT Notifications](#ifttt-notifications)
4. [Spotify Control](#spotify-control)
5. [Home Assistant](#home-assistant)
6. [GPIO Control](#gpio-control)
7. [Email Notifications](#email-notifications)
8. [Text-to-Speech](#text-to-speech)
9. [Database Logging](#database-logging)
10. [Multi-Action Scenes](#multi-action-scenes)

---

## Control Smart Bulbs

### Philips Hue

```python
import requests

HUE_BRIDGE_IP = "192.168.1.100"
HUE_USERNAME = "your-username-here"

@app.route('/button1')
def button1_lights_on():
    url = f"http://{HUE_BRIDGE_IP}/api/{HUE_USERNAME}/lights/1/state"
    requests.put(url, json={"on": True, "bri": 254})
    return jsonify({"status": "success", "action": "lights on"})

@app.route('/button2')
def button2_lights_off():
    url = f"http://{HUE_BRIDGE_IP}/api/{HUE_USERNAME}/lights/1/state"
    requests.put(url, json={"on": False})
    return jsonify({"status": "success", "action": "lights off"})

@app.route('/button3')
def button3_dim():
    url = f"http://{HUE_BRIDGE_IP}/api/{HUE_USERNAME}/lights/1/state"
    requests.put(url, json={"bri": 100})
    return jsonify({"status": "success", "action": "dimmed"})

@app.route('/button4')
def button4_color_scene():
    url = f"http://{HUE_BRIDGE_IP}/api/{HUE_USERNAME}/groups/0/action"
    requests.put(url, json={"scene": "your-scene-id"})
    return jsonify({"status": "success", "action": "scene activated"})
```

### TP-Link Kasa Bulbs

```python
from kasa import SmartBulb
import asyncio

async def control_bulb(action):
    bulb = SmartBulb("192.168.1.101")
    await bulb.update()
    if action == "on":
        await bulb.turn_on()
    elif action == "off":
        await bulb.turn_off()

@app.route('/button1')
def button1():
    asyncio.run(control_bulb("on"))
    return jsonify({"status": "success"})
```

### LIFX Bulbs

```python
LIFX_TOKEN = "your-token-here"

@app.route('/button1')
def button1():
    headers = {"Authorization": f"Bearer {LIFX_TOKEN}"}
    url = "https://api.lifx.com/v1/lights/all/state"
    requests.put(url, headers=headers, json={"power": "on", "brightness": 1.0})
    return jsonify({"status": "success"})
```

---

## Control Computer

### Wake on LAN

```python
from wakeonlan import send_magic_packet

@app.route('/button1')
def wake_computer():
    MAC_ADDRESS = "AA:BB:CC:DD:EE:FF"  # Your computer's MAC
    send_magic_packet(MAC_ADDRESS)
    return jsonify({"status": "success", "action": "wake sent"})
```

### Shutdown Computer (Windows - requires server on PC)

```python
@app.route('/button2')
def shutdown_computer():
    import requests
    # Requires simple HTTP server running on Windows PC
    requests.get("http://192.168.1.102:8080/shutdown")
    return jsonify({"status": "success"})

# Windows server code (run on PC):
# from flask import Flask
# import os
# app = Flask(__name__)
# @app.route('/shutdown')
# def shutdown():
#     os.system('shutdown /s /t 1')
#     return "Shutting down..."
# app.run(host='0.0.0.0', port=8080)
```

### Open Application on PC

```python
@app.route('/button3')
def open_netflix():
    import requests
    # Requires AutoHotkey or similar on PC listening to HTTP
    requests.get("http://192.168.1.102:8080/app/netflix")
    return jsonify({"status": "success"})
```

---

## IFTTT Notifications

### Send Phone Notification

```python
IFTTT_KEY = "your-ifttt-key"

@app.route('/button1')
def send_notification():
    url = f"https://maker.ifttt.com/trigger/button1_pressed/with/key/{IFTTT_KEY}"
    requests.post(url, json={
        "value1": "Button 1",
        "value2": "Pressed at home",
        "value3": str(datetime.now())
    })
    return jsonify({"status": "success"})
```

### IFTTT Multiple Actions

```python
@app.route('/button2')
def ifttt_scene():
    # Can trigger multiple IFTTT applets
    events = ["lights_off", "lock_door", "arm_alarm"]
    for event in events:
        url = f"https://maker.ifttt.com/trigger/{event}/with/key/{IFTTT_KEY}"
        requests.post(url)
    return jsonify({"status": "success"})
```

---

## Spotify Control

### Simple Playback Control

```python
import spotipy
from spotipy.oauth2 import SpotifyOAuth

sp = spotipy.Spotify(auth_manager=SpotifyOAuth(
    client_id="YOUR_CLIENT_ID",
    client_secret="YOUR_CLIENT_SECRET",
    redirect_uri="http://localhost:8888/callback",
    scope="user-modify-playback-state user-read-playback-state"
))

@app.route('/button1')
def spotify_play_pause():
    playback = sp.current_playback()
    if playback and playback['is_playing']:
        sp.pause_playback()
        return jsonify({"status": "success", "action": "paused"})
    else:
        sp.start_playback()
        return jsonify({"status": "success", "action": "playing"})

@app.route('/button2')
def spotify_next():
    sp.next_track()
    return jsonify({"status": "success", "action": "next track"})

@app.route('/button3')
def spotify_previous():
    sp.previous_track()
    return jsonify({"status": "success", "action": "previous track"})

@app.route('/button4')
def spotify_playlist():
    sp.start_playback(context_uri="spotify:playlist:YOUR_PLAYLIST_ID")
    return jsonify({"status": "success", "action": "playlist started"})
```

---

## Home Assistant

### Call Services

```python
HA_URL = "http://homeassistant.local:8123"
HA_TOKEN = "your-long-lived-access-token"

headers = {
    "Authorization": f"Bearer {HA_TOKEN}",
    "Content-Type": "application/json"
}

@app.route('/button1')
def ha_lights_on():
    url = f"{HA_URL}/api/services/light/turn_on"
    data = {"entity_id": "light.living_room"}
    requests.post(url, headers=headers, json=data)
    return jsonify({"status": "success"})

@app.route('/button2')
def ha_scene():
    url = f"{HA_URL}/api/services/scene/turn_on"
    data = {"entity_id": "scene.movie_time"}
    requests.post(url, headers=headers, json=data)
    return jsonify({"status": "success"})

@app.route('/button3')
def ha_script():
    url = f"{HA_URL}/api/services/script/turn_on"
    data = {"entity_id": "script.bedtime"}
    requests.post(url, headers=headers, json=data)
    return jsonify({"status": "success"})
```

### Webhook (Simpler)

```python
@app.route('/button1')
def ha_webhook():
    WEBHOOK_ID = "your-webhook-id"
    url = f"{HA_URL}/api/webhook/{WEBHOOK_ID}"
    requests.post(url, json={"button": "1"})
    return jsonify({"status": "success"})
```

---

## GPIO Control

### Basic GPIO (Raspberry Pi)

```python
import RPi.GPIO as GPIO

GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)

# Setup pins
LED_PIN = 17
RELAY_PIN = 27

GPIO.setup(LED_PIN, GPIO.OUT)
GPIO.setup(RELAY_PIN, GPIO.OUT)

@app.route('/button1')
def gpio_led_on():
    GPIO.output(LED_PIN, GPIO.HIGH)
    return jsonify({"status": "success", "led": "on"})

@app.route('/button2')
def gpio_led_off():
    GPIO.output(LED_PIN, GPIO.LOW)
    return jsonify({"status": "success", "led": "off"})

@app.route('/button3')
def gpio_relay_toggle():
    current = GPIO.input(RELAY_PIN)
    GPIO.output(RELAY_PIN, not current)
    return jsonify({"status": "success", "relay": "on" if not current else "off"})
```

### PWM Control (Dimming)

```python
pwm_pin = GPIO.PWM(LED_PIN, 1000)  # 1000 Hz frequency
pwm_pin.start(0)

brightness = 0

@app.route('/button1')
def brightness_up():
    global brightness
    brightness = min(100, brightness + 25)
    pwm_pin.ChangeDutyCycle(brightness)
    return jsonify({"status": "success", "brightness": brightness})

@app.route('/button2')
def brightness_down():
    global brightness
    brightness = max(0, brightness - 25)
    pwm_pin.ChangeDutyCycle(brightness)
    return jsonify({"status": "success", "brightness": brightness})
```

---

## Email Notifications

### Simple Email Alert

```python
import smtplib
from email.mime.text import MIMEText

def send_email(subject, body):
    sender = "your-email@gmail.com"
    password = "your-app-password"  # Use app password, not regular password
    recipient = "recipient@email.com"
    
    msg = MIMEText(body)
    msg['Subject'] = subject
    msg['From'] = sender
    msg['To'] = recipient
    
    with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
        server.login(sender, password)
        server.send_message(msg)

@app.route('/button1')
def emergency_email():
    send_email(
        "Emergency Alert",
        "Button 1 was pressed at " + str(datetime.now())
    )
    return jsonify({"status": "success", "email": "sent"})
```

---

## Text-to-Speech

### Google TTS (on Raspberry Pi)

```python
from gtts import gTTS
import os

@app.route('/button1')
def announce():
    text = "Button 1 was pressed"
    tts = gTTS(text=text, lang='en')
    tts.save("/tmp/announcement.mp3")
    os.system("mpg123 /tmp/announcement.mp3")
    return jsonify({"status": "success"})
```

### System Voice (Linux)

```python
@app.route('/button2')
def speak():
    os.system('espeak "Hello, button 2 was pressed"')
    return jsonify({"status": "success"})
```

---

## Database Logging

### SQLite Logging

```python
import sqlite3
from datetime import datetime

def init_db():
    conn = sqlite3.connect('button_log.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS presses
                 (timestamp TEXT, button INTEGER)''')
    conn.commit()
    conn.close()

init_db()

@app.route('/button1')
def button1_logged():
    conn = sqlite3.connect('button_log.db')
    c = conn.cursor()
    c.execute("INSERT INTO presses VALUES (?, ?)", 
              (str(datetime.now()), 1))
    conn.commit()
    conn.close()
    
    # Do your action
    print("Button 1 pressed")
    
    return jsonify({"status": "success"})
```

### View Logs

```python
@app.route('/logs')
def view_logs():
    conn = sqlite3.connect('button_log.db')
    c = conn.cursor()
    c.execute("SELECT * FROM presses ORDER BY timestamp DESC LIMIT 50")
    rows = c.fetchall()
    conn.close()
    
    return jsonify({"logs": [{"time": r[0], "button": r[1]} for r in rows]})
```

---

## Multi-Action Scenes

### Movie Mode

```python
@app.route('/button1')
def movie_mode():
    # 1. Dim lights
    requests.put(f"http://{HUE_BRIDGE_IP}/api/{HUE_USERNAME}/lights/1/state",
                 json={"bri": 50})
    
    # 2. Turn off kitchen lights
    requests.put(f"http://{HUE_BRIDGE_IP}/api/{HUE_USERNAME}/lights/2/state",
                 json={"on": False})
    
    # 3. Turn on TV (if smart TV)
    requests.post("http://roku-tv:8060/keypress/PowerOn")
    
    # 4. Start streaming app
    time.sleep(2)
    requests.post("http://roku-tv:8060/launch/12")  # Netflix
    
    # 5. Set volume
    for i in range(3):
        requests.post("http://roku-tv:8060/keypress/VolumeUp")
    
    return jsonify({"status": "success", "scene": "movie mode"})
```

### Bedtime Scene

```python
@app.route('/button2')
def bedtime():
    # Turn off all lights except bedroom
    for light_id in [1, 2, 3, 4]:  # Living room, kitchen, etc
        requests.put(f"http://{HUE_BRIDGE_IP}/api/{HUE_USERNAME}/lights/{light_id}/state",
                     json={"on": False})
    
    # Bedroom to warm dim
    requests.put(f"http://{HUE_BRIDGE_IP}/api/{HUE_USERNAME}/lights/5/state",
                 json={"on": True, "bri": 50, "ct": 500})  # Warm white
    
    # Lock doors (if smart lock)
    # requests.post("http://lock-api/lock")
    
    # Set thermostat
    # requests.post("http://thermostat/set", json={"temp": 68})
    
    # Log action
    print(f"Bedtime activated at {datetime.now()}")
    
    return jsonify({"status": "success", "scene": "bedtime"})
```

### Morning Routine

```python
@app.route('/button3')
def morning():
    # Gradually brighten lights
    for brightness in [25, 50, 75, 100]:
        requests.put(f"http://{HUE_BRIDGE_IP}/api/{HUE_USERNAME}/lights/5/state",
                     json={"on": True, "bri": int(brightness * 2.54)})
        time.sleep(2)
    
    # Start coffee maker (via smart plug)
    requests.put("http://coffee-plug/on")
    
    # Start music
    sp.start_playback(context_uri="spotify:playlist:morning-playlist")
    
    # Announce weather (TTS)
    weather = get_weather()  # Your weather function
    tts = gTTS(text=f"Good morning. The temperature is {weather} degrees", lang='en')
    tts.save("/tmp/morning.mp3")
    os.system("mpg123 /tmp/morning.mp3")
    
    return jsonify({"status": "success", "scene": "morning"})
```

### Emergency All Off

```python
@app.route('/button4')
def all_off():
    # Turn off all lights
    requests.put(f"http://{HUE_BRIDGE_IP}/api/{HUE_USERNAME}/groups/0/action",
                 json={"on": False})
    
    # Stop music
    try:
        sp.pause_playback()
    except:
        pass
    
    # Turn off smart plugs
    smart_plugs = ["192.168.1.110", "192.168.1.111", "192.168.1.112"]
    for plug in smart_plugs:
        try:
            requests.put(f"http://{plug}/off", timeout=1)
        except:
            pass
    
    # Turn off TV
    try:
        requests.post("http://roku-tv:8060/keypress/PowerOff")
    except:
        pass
    
    return jsonify({"status": "success", "scene": "all off"})
```

---

## Advanced: Conditional Actions

### Time-Based Actions

```python
from datetime import datetime

@app.route('/button1')
def smart_lighting():
    hour = datetime.now().hour
    
    if 6 <= hour < 9:  # Morning
        brightness = 100
        color = 250  # Cool white
    elif 9 <= hour < 18:  # Daytime
        brightness = 75
        color = 300
    elif 18 <= hour < 22:  # Evening
        brightness = 50
        color = 400  # Warm white
    else:  # Night
        brightness = 25
        color = 500  # Very warm
    
    requests.put(f"http://{HUE_BRIDGE_IP}/api/{HUE_USERNAME}/lights/1/state",
                 json={"on": True, "bri": int(brightness * 2.54), "ct": color})
    
    return jsonify({"status": "success", "time": hour, "brightness": brightness})
```

### State Toggle with Memory

```python
import json

STATE_FILE = "/tmp/button_states.json"

def load_state():
    try:
        with open(STATE_FILE, 'r') as f:
            return json.load(f)
    except:
        return {"button1": False, "button2": False}

def save_state(state):
    with open(STATE_FILE, 'w') as f:
        json.dump(state, f)

@app.route('/button1')
def toggle_with_memory():
    state = load_state()
    state["button1"] = not state["button1"]
    save_state(state)
    
    if state["button1"]:
        # Turn on
        requests.put(f"http://{HUE_BRIDGE_IP}/api/{HUE_USERNAME}/lights/1/state",
                     json={"on": True})
        action = "on"
    else:
        # Turn off
        requests.put(f"http://{HUE_BRIDGE_IP}/api/{HUE_USERNAME}/lights/1/state",
                     json={"on": False})
        action = "off"
    
    return jsonify({"status": "success", "action": action})
```

---

## Installation Requirements

For these examples, install needed Python packages:

```bash
pip3 install flask requests
pip3 install python-kasa  # For TP-Link
pip3 install spotipy  # For Spotify
pip3 install gTTS  # For text-to-speech
pip3 install wakeonlan  # For Wake on LAN
pip3 install RPi.GPIO  # For Raspberry Pi GPIO (on Pi only)
```

---

## How to Use These

1. Copy the code you want into `raspberry_pi_server.py`
2. Replace API keys, IP addresses, and credentials
3. Install required packages
4. Run the server
5. Test with your remote!

**Pro tip:** Start with simple examples (GPIO, IFTTT) then build up to complex scenes.
