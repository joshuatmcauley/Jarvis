# Relay on Remote Button Guide (Alternative Approach)

## Overview

This is a clever middle-ground solution that uses **5V relays** to physically "press" the buttons on your Energizer remote control.

### Why This Approach?

✅ **Safe** - Only low voltage (5V) relay work
✅ **Uses your RF plugs** - They continue to work
✅ **More reliable than RF transmission** - Remote does the RF work
✅ **No code sniffing needed** - Don't need to capture RF codes
✅ **Manual override** - Physical buttons still work
✅ **Legal** - No mains voltage work
✅ **Rental-friendly** - Non-invasive

### How It Works

```
ESP32 → 5V Relay → Remote Button Contacts → RF Signal → Your Plugs
```

When ESP32 activates a relay, it closes the circuit across the button contacts, "pressing" the button electronically. The remote sends the RF signal to your plugs.

---

## What You Need

### Hardware:
- **4-channel 5V relay module** (£3-5)
  - Amazon/eBay: "4 channel 5V relay module"
  - Need 4 relays for 2 plugs (ON/OFF each)
- **ESP32 or Arduino** (£5-10)
- **Your Energizer remote** (what you already have)
- **Jumper wires**
- **Thin wire for soldering** (24-28 AWG)
- **Small project case** (optional, for tidiness)

### Tools:
- Soldering iron
- Solder
- Wire cutters/strippers
- Multimeter (helpful but not essential)
- Small screwdriver set
- Helping hands/PCB holder (recommended)

---

## Step 1: Open Your Remote

### Safety Check:
✅ Remove batteries first!

### Opening:
1. Look for screws (usually under battery compartment sticker)
2. Carefully pry apart the case
3. Note which button is which:
   - Identify Plug 1 ON button
   - Identify Plug 1 OFF button
   - Identify Plug 2 ON button
   - Identify Plug 2 OFF button

### What You'll See:
- PCB (circuit board)
- Button contacts (metal pads)
- Battery holder
- RF transmitter IC

---

## Step 2: Identify Button Contacts

### Method 1: Visual Inspection
Look for button contact pads on the PCB. They usually look like:
```
  [Pad]     [Pad]
     \       /
      \     /
       Button
```

### Method 2: Multimeter Continuity Test
1. Set multimeter to continuity mode (beep)
2. Touch probes to suspected contact pads
3. Press the button
4. If it beeps when pressed, you've found the contacts!

### Typical Layout:
Most remotes have one common ground and individual signal pads per button.

```
Common GND ----+
               |
Button 1 ------+--[Button]
Button 2 ------+--[Button]
Button 3 ------+--[Button]
Button 4 ------+--[Button]
```

---

## Step 3: Solder Wires to Buttons

### Preparation:
1. Clean the contact pads with isopropyl alcohol
2. Cut 4 pairs of thin wires (about 15cm each)
3. Strip 2-3mm from each end
4. Pre-tin the wire ends with solder

### Soldering:
For each button:
1. **Identify the two contacts** for that button
2. **Tin the contact pads** (add a small amount of solder)
3. **Solder wire to each contact**
4. **Label the wires** (e.g., "P1-ON", "P1-OFF", etc.)
5. **Test with multimeter** - should have continuity when wires touch

### Important:
- Don't overheat - quick soldering (1-2 seconds max)
- Use minimal solder
- Don't bridge adjacent contacts
- Keep wires color-coded or labeled

### Wire Routing:
Run wires out through an existing hole or carefully notch the case.

---

## Step 4: Wire to Relay Module

### Relay Module Pinout:
```
Relay Module Side:
VCC  - Connect to ESP32 5V
GND  - Connect to ESP32 GND
IN1  - Connect to ESP32 GPIO (e.g., GPIO 4)
IN2  - Connect to ESP32 GPIO (e.g., GPIO 5)
IN3  - Connect to ESP32 GPIO (e.g., GPIO 18)
IN4  - Connect to ESP32 GPIO (e.g., GPIO 19)

Relay Contact Side (per relay):
COM  - Common (connect one button wire)
NO   - Normally Open (connect other button wire)
NC   - Normally Closed (leave unconnected)
```

### Wiring Diagram:
```
Button Contacts → Relay → ESP32

Plug 1 ON Button:
  Wire 1 → Relay 1 COM
  Wire 2 → Relay 1 NO
  Relay 1 IN → ESP32 GPIO 4

Plug 1 OFF Button:
  Wire 1 → Relay 2 COM
  Wire 2 → Relay 2 NO
  Relay 2 IN → ESP32 GPIO 5

Plug 2 ON Button:
  Wire 1 → Relay 3 COM
  Wire 2 → Relay 3 NO
  Relay 3 IN → ESP32 GPIO 18

Plug 2 OFF Button:
  Wire 1 → Relay 4 COM
  Wire 2 → Relay 4 NO
  Relay 4 IN → ESP32 GPIO 19
```

### Power:
```
ESP32 5V → Relay Module VCC
ESP32 GND → Relay Module GND (and remote battery GND if needed)
```

---

## Step 5: Arduino/ESP32 Code

### Simple Version:

```cpp
// Pin definitions
#define RELAY_PLUG1_ON  4
#define RELAY_PLUG1_OFF 5
#define RELAY_PLUG2_ON  18
#define RELAY_PLUG2_OFF 19

// Relay activation time (milliseconds)
#define BUTTON_PRESS_TIME 200  // 200ms press

void setup() {
  Serial.begin(115200);
  
  // Setup relay pins as outputs
  pinMode(RELAY_PLUG1_ON, OUTPUT);
  pinMode(RELAY_PLUG1_OFF, OUTPUT);
  pinMode(RELAY_PLUG2_ON, OUTPUT);
  pinMode(RELAY_PLUG2_OFF, OUTPUT);
  
  // Relays off initially (HIGH = off for active-low relays)
  digitalWrite(RELAY_PLUG1_ON, HIGH);
  digitalWrite(RELAY_PLUG1_OFF, HIGH);
  digitalWrite(RELAY_PLUG2_ON, HIGH);
  digitalWrite(RELAY_PLUG2_OFF, HIGH);
  
  Serial.println("Remote Button Controller Ready!");
}

void loop() {
  // Check for serial commands
  if (Serial.available()) {
    String cmd = Serial.readStringUntil('\n');
    cmd.trim();
    handleCommand(cmd);
  }
}

void pressButton(int relayPin) {
  Serial.print("Pressing button on relay pin ");
  Serial.println(relayPin);
  
  digitalWrite(relayPin, LOW);   // Activate relay (press button)
  delay(BUTTON_PRESS_TIME);       // Hold for 200ms
  digitalWrite(relayPin, HIGH);   // Release relay (release button)
  
  delay(100);  // Small delay before next command
}

void handleCommand(String cmd) {
  cmd.toUpperCase();
  
  if (cmd == "PLUG1_ON") {
    pressButton(RELAY_PLUG1_ON);
    Serial.println("OK - Plug 1 ON");
  }
  else if (cmd == "PLUG1_OFF") {
    pressButton(RELAY_PLUG1_OFF);
    Serial.println("OK - Plug 1 OFF");
  }
  else if (cmd == "PLUG2_ON") {
    pressButton(RELAY_PLUG2_ON);
    Serial.println("OK - Plug 2 ON");
  }
  else if (cmd == "PLUG2_OFF") {
    pressButton(RELAY_PLUG2_OFF);
    Serial.println("OK - Plug 2 OFF");
  }
  else if (cmd == "STATUS") {
    Serial.println("OK");
  }
  else {
    Serial.println("ERROR - Unknown command");
  }
}
```

### With WiFi (ESP32):

Add WiFi web server from the original `energizer_rf_controller.ino` but use `pressButton()` instead of `mySwitch.send()`.

---

## Step 6: Testing

### Initial Test:
1. **Don't close the remote case yet**
2. Power up ESP32
3. Open Serial Monitor (115200 baud)
4. Send test commands:
   ```
   PLUG1_ON
   PLUG1_OFF
   ```
5. **Watch for relay clicking**
6. **Check if plugs respond**

### Troubleshooting Tests:

**Relay clicks but plug doesn't respond:**
- Check button wire connections
- Verify button contacts are correct
- Test with multimeter across relay NO/COM when activated

**No relay click:**
- Check relay module power (5V)
- Check GPIO pin assignments
- Check relay module type (active HIGH vs active LOW)

**Plug responds to some buttons but not others:**
- Recheck that specific button's wiring
- Verify no cold solder joints

---

## Step 7: Final Assembly

Once everything works:

1. **Secure wires** - Use hot glue or cable ties
2. **Close remote case** - Route wires cleanly
3. **Mount in enclosure** - Keep ESP32 and relay module together
4. **Add remote battery back** - Remote needs power for RF transmission
5. **Position remote** - Near controlled plugs for best RF range

### Enclosure Tips:
- Leave access to remote buttons (manual override)
- Ventilation holes for ESP32
- Cable entry points
- Label which plug is which

---

## Advantages Over Direct RF

### Why This Is Better:

1. **Don't need to capture codes** - Remote does the work
2. **Don't need RF transmitter module** - Save £5
3. **Remote's RF quality** - Manufacturer-tuned circuit
4. **Better reliability** - Known good signal from remote
5. **Manual buttons still work** - Backup control
6. **Easier setup** - No code sniffing step

---

## Integration with JARVIS

### Python Integration:

The same `RFController` class in `jarvis_app.py` works!

The commands are identical:
```python
controller.send_command("PLUG1_ON")
controller.send_command("PLUG1_OFF")
```

JARVIS doesn't know the difference - it just sends commands to the serial port.

---

## Costs

### Relay-on-Remote Approach:
- 4-channel relay module: £5
- ESP32: £8 (or reuse from RF setup)
- Wire/solder: £2
- **Total: £7-15**

### vs Direct RF Approach:
- ESP32: £8
- RF transmitter: £3
- RF receiver: £3
- **Total: £14**

**Savings:** Minimal (£0-7), but simpler setup!

---

## When to Use This Approach

### Choose "Relay on Remote" if:
✅ You want simpler setup (no code sniffing)
✅ You have soldering skills
✅ Direct RF transmission is unreliable
✅ You want manual override option
✅ You want to keep using manufacturer's RF circuit

### Choose "Direct RF" if:
❌ You don't want to modify your remote
❌ You don't have soldering skills
❌ You want wireless freedom (no wires from remote)
❌ You might want to use remote independently

---

## Safety Notes

✅ **This is safe** - only 5V relays and low voltage RF
✅ **No mains voltage** - much safer than mains relays
✅ **Modular** - if it breaks, just replace the remote
✅ **Reversible** - can unsolder and restore remote

⚠️ **Remote battery** - ensure correct polarity
⚠️ **Heat sensitivity** - don't overheat remote PCB when soldering
⚠️ **Wire routing** - don't pinch wires in case closure

---

## Advanced: Hybrid Approach

### Best of Both Worlds:

Build BOTH systems:
1. **Relay on remote** - for reliable local control
2. **Direct RF transmitter** - for backup/testing

Switch between them in software!

```cpp
#define USE_RELAY_MODE  // Comment out to use RF mode
```

---

## Conclusion

The "relay on remote" approach is a clever compromise that:
- ✅ Uses your existing RF plugs
- ✅ Safer than mains relays
- ✅ More reliable than DIY RF transmission
- ✅ Keeps manual control
- ✅ Easier setup (no code sniffing)

It's a great option if you're comfortable with basic soldering!

---

## Need Help?

Common issues:
- **No response**: Check button wiring and relay activation
- **Intermittent**: Check solder joints
- **Some buttons work**: Verify all connections
- **Remote battery dies quickly**: Use external power for remote

---

*Note: This modification may void your remote's warranty. Proceed at your own risk. Test thoroughly before permanent assembly.*
