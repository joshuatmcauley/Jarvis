# RF Plug Control - Creative Use Cases

Here are some practical and creative ways to use your RF-controlled plugs with JARVIS!

## 🏠 Home Automation

### 1. **Smart Lighting**
Control lamps and lights throughout your home:
- Turn on lights when you arrive home
- Automatically turn off lights at bedtime
- Create lighting schedules
- Simulate presence when away (security)

**Example Setup:**
- Plug 1: Living room lamp
- Plug 2: Bedroom lamp

---

### 2. **Morning Coffee Automation**
Wake up to fresh coffee every morning:
```python
# Schedule for 7:00 AM
controller.turn_on(1)  # Coffee maker
time.sleep(300)  # Brew for 5 minutes
controller.turn_off(1)
```

**Safety Note:** Only use with coffee makers that have mechanical switches (stay on when power is restored).

---

### 3. **Fan Control**
Automate fans based on temperature or time:
- Turn on during hot hours
- Auto-off at night
- Integrate with temperature sensors (future)

---

### 4. **Phone Charger Management**
Prevent overcharging and save energy:
- Turn off charger after 2 hours
- Schedule charging during off-peak electricity hours
- Reduce phantom power draw

```python
# Charge for 2 hours then stop
controller.turn_on(1)
time.sleep(7200)  # 2 hours
controller.turn_off(1)
```

---

### 5. **Aquarium/Fish Tank**
Automate aquarium equipment:
- Light schedule (day/night cycle)
- Air pump control
- Heater backup control

---

## 🎨 Creative Applications

### 6. **Photography Light Box**
Control photography lighting setups:
- Turn on lights for product photos
- Schedule for time-lapse photography
- Remote control for perfect timing

---

### 7. **Plant Growing Lights**
Automate grow lights for indoor plants:
- 12-16 hours on, 8-12 hours off
- Sunrise/sunset simulation
- Seasonal adjustments

---

### 8. **Christmas/Holiday Lights**
Automate festive decorations:
- Turn on at sunset
- Turn off at bedtime
- Create light shows (rapid on/off patterns)

```python
# Simple twinkling effect
for i in range(10):
    controller.turn_on(1)
    time.sleep(0.5)
    controller.turn_off(1)
    time.sleep(0.5)
```

---

### 9. **Workshop/Garage Tools**
Control workshop equipment:
- 3D printer power
- Soldering iron timer
- Power tool safety cutoff

---

### 10. **Pet Care**
Automate pet-related devices:
- Aquarium bubbler schedule
- Pet fountain pump
- Heated pet bed timer

---

## 🔒 Security & Safety

### 11. **Presence Simulation**
Make it look like you're home when you're away:
```python
import random

# Random on/off to simulate presence
while True:
    controller.turn_on(random.choice([1, 2]))
    time.sleep(random.randint(1800, 7200))  # 30min - 2hr
    controller.turn_off(random.choice([1, 2]))
    time.sleep(random.randint(600, 3600))  # 10min - 1hr
```

---

### 12. **Child Safety Timer**
Limit screen time for TVs or gaming:
```python
# 1 hour gaming limit
controller.turn_on(1)  # TV/Console
time.sleep(3600)  # 1 hour
controller.turn_off(1)
print("Screen time is over!")
```

---

### 13. **Space Heater Safety**
Prevent space heaters from running unattended:
- Auto-off after 2 hours
- Temperature monitoring (with sensor integration)
- Safety shutoff when leaving home

**Safety Warning:** Always follow heater manufacturer guidelines.

---

## 💻 Tech & Development

### 14. **Raspberry Pi Project Control**
Control power to other Pi projects:
- Restart hung projects
- Scheduled reboots
- Remote power cycling

---

### 15. **Network Equipment Reset**
Remotely reboot routers/modems:
```python
# Power cycle router
controller.turn_off(1)
time.sleep(10)
controller.turn_on(1)
print("Router rebooted")
```

---

### 16. **3D Printer/CNC Safety**
Auto-shutoff for maker equipment:
- Turn off after print completion
- Safety timer for long jobs
- Remote emergency stop

---

## 🎵 Entertainment

### 17. **DJ/Party Lighting**
Create synchronized light shows:
```python
# Dance floor effect
while party_mode:
    controller.turn_on(1)
    controller.turn_on(2)
    time.sleep(0.3)
    controller.turn_off(1)
    controller.turn_off(2)
    time.sleep(0.3)
```

---

### 18. **Home Theater Control**
Manage home theater equipment:
- Turn on all equipment together
- Auto-off after movie
- Energy saving mode

---

### 19. **Music Studio Equipment**
Control studio gear power:
- Amp protection (warm-up/cool-down)
- Scheduled recording sessions
- Power management

---

## 🌱 Garden & Outdoor

### 20. **Garden Irrigation Pump**
Automate water pumps:
- Morning watering schedule
- Duration control
- Rain delay integration (future)

---

### 21. **Outdoor Lighting**
Control patio/garden lights:
- Sunset timer
- Motion detection integration (future)
- Party mode

---

### 22. **Greenhouse Equipment**
Automate greenhouse systems:
- Ventilation fans
- Grow lights
- Heating mats

---

## 🧪 Advanced Integration Ideas

### 23. **Voice Control** (Future)
Integrate with voice commands:
```
"Hey JARVIS, turn on the coffee maker"
"Hey JARVIS, turn off all lights"
```

---

### 24. **Sensor-Based Automation** (Future)
Trigger plugs based on sensor data:
- Temperature sensors → Fan control
- Light sensors → Automatic lighting
- Motion sensors → Security lighting

---

### 25. **IFTTT-Style Rules**
Create complex automation rules:
```
IF time == 7:00 AM AND day == weekday
THEN turn_on(coffee_maker)

IF temperature > 25°C
THEN turn_on(fan)

IF motion_detected AND night_time
THEN turn_on(lights)
```

---

## ⚠️ Safety Considerations

### What NOT to Control:
❌ Medical equipment
❌ Life safety equipment (smoke alarms, etc.)
❌ Devices over 13A rating
❌ Water heaters without proper safety
❌ Critical refrigeration
❌ Gas appliances

### What's Generally Safe:
✅ Lamps and LED lights
✅ Phone/tablet chargers
✅ Fans (under 13A)
✅ Coffee makers (mechanical switch)
✅ TV and entertainment equipment
✅ Computer monitors
✅ Small appliances (under 13A)

### General Safety Rules:
1. Never exceed plug rating (typically 13A in UK)
2. Don't use with wet/outdoor conditions unless rated
3. Regular inspection of plugs and cables
4. Don't use with devices that have soft-touch buttons
5. Always follow manufacturer guidelines
6. Use appropriate fuses
7. Keep RF controller dry and ventilated

---

## 🚀 Getting Started

Pick a simple use case to start:
1. **Easiest:** Control a lamp
2. **Next Level:** Coffee maker automation
3. **Advanced:** Create schedules and patterns

Then expand as you get comfortable!

---

## 💡 Pro Tips

1. **Label Your Plugs:** Use labels or colored tape to identify what each plug controls

2. **Document Your Codes:** Keep a backup of your RF codes in case you need to reprogram

3. **Test Thoroughly:** Always test automation before leaving devices unattended

4. **Plan for Failures:** What happens if power goes out? RF fails? Plan accordingly

5. **Start Simple:** Begin with non-critical devices while learning

6. **Monitor Power Draw:** Keep track of what's plugged into each socket

7. **Create Shortcuts:** Save common sequences as scripts

8. **Schedule Wisely:** Consider electricity rates, noise, and household routines

---

## 📱 Integration Roadmap

**Current:**
- ✅ Manual control via JARVIS
- ✅ Manual control via web interface
- ✅ Python script control

**Coming Soon:**
- ⏱️ Time-based schedules
- 📅 Calendar integration
- 🌡️ Sensor-based triggers
- 🎤 Voice commands
- 📊 Usage statistics
- 🔄 IFTTT integration

---

Have more ideas? Add them to the list! The possibilities are endless! 🎉
