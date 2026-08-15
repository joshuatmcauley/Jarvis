# RX480E Standalone Guide - No ESP32 Required!

## YES - It Works Without a Microcontroller!

The RX480E has a **built-in decoder chip**, so it can control devices directly without needing an ESP32, Arduino, or any other microcontroller.

## How It Works Standalone

```
TX118SA Remote  →  433MHz Signal  →  RX480E  →  Direct to Relay/LED/Buzzer
(press button)                      (decoder)    (device turns on)
```

**No programming needed. No ESP32 needed. Just wire and go.**

## What You Can Control Directly

### ✅ Things That Work:
- **Relays** (turn on/off high-power devices)
- **LEDs** (indicator lights)
- **Buzzers** (alarms, doorbells)
- **Small motors** (fans, pumps - if low current)
- **Solenoid valves** (irrigation, pneumatics)
- **Transistor circuits** (for larger loads)
- **Other digital inputs** (existing alarm systems, etc.)

### ❌ Things That DON'T Work:
- Complex logic (need microcontroller for that)
- WiFi control (need ESP32 for that)
- Multiple sequential actions (need programming)
- Sensors that need power (RX480E is output-only)

## Simple Standalone Projects

### 1. Wireless Doorbell

**What you need:**
- RX480E module
- 5V power supply
- Buzzer or small speaker
- TX118SA remote

**Wiring:**
```
Power Supply   RX480E        Buzzer
5V ────────────► +V
GND ───────┬───► GND ────────► Buzzer (-)
           │
           └──────────────────► Common
           
RX480E D0 ─────────────────────► Buzzer (+)
```

**How it works:**
- Press button 1 on remote
- D0 goes HIGH (3.3V)
- Buzzer sounds
- Release button = buzzer stops (if momentary mode)

**Cost:** ~$15 total
**No programming required!**

### 2. Wireless Light Switch

**What you need:**
- RX480E module
- 5V power supply
- 5V relay module
- TX118SA remote
- Light/lamp to control

**Wiring:**
```
Power Supply: 5V ──► RX480E +V
              GND ──► RX480E GND

RX480E D0 ──► Relay IN (signal)
5V ─────────► Relay VCC
GND ────────► Relay GND

Relay contacts ──► In series with your light
```

**Setup:**
1. Pair remote in **Toggle Mode** (press learning button 2x)
2. Press button = light on
3. Press again = light off

**Cost:** ~$20 total (RX480E + relay + power supply)
**No programming required!**

### 3. Wireless Garage Door Opener

**What you need:**
- RX480E module
- 5V power supply
- Relay module
- TX118SA remote

**Wiring:**
```
RX480E D0 ──► Relay (momentary pulse)
Relay ──► Connected to garage opener button terminals
```

**Setup:**
1. Pair in **Momentary Mode** (press learning button 1x)
2. Press remote button = simulates button press
3. Works just like the wall button

**Cost:** ~$20 total
**Safer than hacking the original remote!**

### 4. Panic Button / Emergency Alert

**What you need:**
- RX480E module
- 12V power supply
- Loud siren (12V)
- Relay module
- TX118SA remote (keep on keychain)

**Wiring:**
```
RX480E D0 ──► Relay IN
12V ───────► Relay VCC & Siren (+)
GND ───────► Relay GND & Siren (-)
Relay NO ──► Siren (+)
```

**Setup:**
1. Pair in **Toggle Mode**
2. Press once = siren ON
3. Press again = siren OFF
4. Mount siren outdoors, keep remote in pocket

**Use cases:**
- Personal safety device
- Workshop emergency stop
- Medical alert for elderly
- Security system

**Cost:** ~$30 total
**Could save a life!**

### 5. Wireless Sprinkler Control

**What you need:**
- RX480E module
- 12V power supply
- 12V solenoid valve
- TX118SA remote
- Relay module

**Wiring:**
```
RX480E D0 ──► Relay
Relay ──► Controls 12V to solenoid valve
Valve ──► Inline with water hose
```

**Benefits:**
- Turn on sprinklers from inside
- No running wires across yard
- Control up to 4 zones (4 buttons)

**Cost:** ~$35 total
**No digging trenches for wires!**

## Power Options

### RX480E Power Requirements
- **Voltage:** 3.3V - 5V DC
- **Current:** ~5 mA (very low)
- **Total system:** Depends on what you're controlling

### Power Supply Options

**Option 1: USB Power Supply** (Easiest)
```
USB wall adapter (5V) → Micro USB breakout → RX480E
Cost: $3
```

**Option 2: Battery Pack** (Portable)
```
4x AA batteries (6V) → Voltage regulator (5V) → RX480E
Cost: $5
Lasts: Months (RX480E uses very little power)
```

**Option 3: Existing Device Power** (Free)
```
Tap into existing 5V supply in your project
Examples: USB port, phone charger, existing electronics
Cost: Free
```

**Option 4: Solar** (Outdoor)
```
Small solar panel (6V) → Charge controller → Battery → RX480E
Cost: $15
Perfect for garden automation
```

## Operating Modes Explained

The RX480E has **3 modes** you set during pairing:

### Mode 1: Momentary (Inching)
- Output HIGH only while button HELD
- Perfect for: Doorbells, garage doors, momentary switches
- Pairing: Press learning button **1x**, then remote button

### Mode 2: Toggle (Self-Lock)
- Output toggles on each press (ON → OFF → ON)
- Perfect for: Light switches, fans, anything you want to toggle
- Pairing: Press learning button **2x**, then remote button

### Mode 3: Interlock
- Only one output HIGH at a time
- New button press turns off previous
- Perfect for: Mode selection, one-at-a-time control
- Pairing: Press learning button **3x**, then remote button

### Advanced Modes (Multiple Buttons)

**Mode 4: 2 Momentary + 2 Toggle**
- D0, D1 = Momentary
- D2, D3 = Toggle
- Pairing: Press learning button **4x**

**Mode 5: 2 Momentary + 2 Interlock**
- D0, D1 = Momentary
- D2, D3 = Interlock (only one active)
- Pairing: Press learning button **5x**

**Mode 6: 2 Toggle + 2 Interlock**
- D0, D1 = Toggle
- D2, D3 = Interlock
- Pairing: Press learning button **6x**

## Real-World Standalone Examples

### Home Security
- **Wireless door sensor:** Reed switch + RF transmitter → RX480E → Siren
- **Panic button:** Remote on keychain → RX480E → Loud alarm
- **Gate control:** Remote in car → RX480E → Electric gate opener

### Workshop
- **Tool activation:** Remote near each tool → RX480E → Dust collector ON
- **Emergency stop:** Remote anywhere → RX480E → Kill power to machines
- **Light control:** Remote at door → RX480E → Shop lights

### Garden
- **Irrigation zones:** 4 buttons → 4 valves (one remote controls 4 zones)
- **Pond pump:** Remote from window → RX480E → Pump relay
- **Greenhouse vent:** Remote → RX480E → Vent motor

### Accessibility
- **Bed remote:** Control room lights without getting up
- **Wheelchair control:** Remote mounted on chair → Door openers, lights
- **Elderly care:** Large button remote → Emergency alert

## Wiring Examples

### Controlling a Relay

```
┌──────────────┐
│   RX480E     │
│              │
│  +V  ────────┼──── 5V Power Supply
│  GND ────────┼──── Ground
│  D0  ────────┼──── Relay IN (signal)
│              │
└──────────────┘

┌──────────────┐
│  5V Relay    │
│              │
│  VCC ────────┼──── 5V Power Supply
│  GND ────────┼──── Ground
│  IN  ────────┼──── From RX480E D0
│              │
│  COM ────────┼──── Light Hot wire
│  NO  ────────┼──── To Light
│  NC  ────────┼──── (not used)
│              │
└──────────────┘
```

### Controlling Multiple Relays (4 Zones)

```
RX480E          Relay Module (4-channel)
                
+V  ──────────► VCC (5V)
GND ──────────► GND
D0  ──────────► IN1 (Zone 1)
D1  ──────────► IN2 (Zone 2)
D2  ──────────► IN3 (Zone 3)
D3  ──────────► IN4 (Zone 4)
```

### Controlling LED Indicators

```
RX480E D0 ──► [330Ω Resistor] ──► LED (+) ──► LED (-) ──► GND

Note: RX480E outputs 3.3V, safe for LEDs with resistor
```

### Controlling a Buzzer

```
RX480E D0 ──► Buzzer (+)
GND       ──► Buzzer (-)

Note: Use active buzzer (has built-in oscillator)
```

## Shopping List for Standalone Use

### Basic Wireless Switch ($20)
- RX480E + TX118SA (you have this) ✓
- 5V power supply: $3
- Relay module: $5
- Wires: $2

### 4-Zone Control ($35)
- RX480E + TX118SA (you have this) ✓
- 5V power supply: $3
- 4-channel relay board: $12
- Wires: $3

### Wireless Doorbell ($15)
- RX480E + TX118SA (you have this) ✓
- 5V power supply: $3
- Buzzer: $2

## Advantages of Standalone Use

### ✅ Pros:
1. **No programming needed** - Just wire and pair
2. **Super reliable** - No software to crash
3. **Instant response** - No processing delay
4. **Very cheap** - No ESP32 needed (~$8 saved)
5. **Low power** - Runs for months on batteries
6. **Simple troubleshooting** - If it doesn't work, check wiring
7. **No WiFi required** - Works anywhere
8. **Perfect for simple tasks** - Door openers, light switches, etc.

### ❌ Cons (vs ESP32):
1. No WiFi control
2. No logging/monitoring
3. No conditional logic
4. No notifications
5. No scenes (multiple actions)
6. Can't integrate with other systems

## When to Use Standalone vs ESP32

### Use Standalone When:
- ✅ Simple on/off control
- ✅ Want simplicity and reliability
- ✅ Budget is tight
- ✅ No WiFi available
- ✅ Permanent installation (set and forget)
- ✅ High reliability required (security, safety)

### Use ESP32 When:
- ✅ Need WiFi control
- ✅ Want notifications
- ✅ Need data logging
- ✅ Complex automation
- ✅ Integration with other systems
- ✅ Remote monitoring

## Common Questions

**Q: Can I use both? Standalone AND with ESP32?**
A: Yes! You can wire the RX480E outputs to BOTH a relay AND the ESP32. The ESP32 monitors what's happening while the relay directly controls the device.

**Q: How far does the remote work?**
A: 20-50 meters indoors through walls, 50-100 meters outdoors in open space.

**Q: Can I pair multiple remotes?**
A: Yes! You can pair up to ~50 remotes to one RX480E. Great for family members, spare remotes, etc.

**Q: Can I use one remote for multiple RX480E receivers?**
A: Yes! One remote can control multiple receivers. Great for controlling multiple rooms.

**Q: What if I want to control my Energizer plugs standalone?**
A: You can't - those plugs use a different RF encoding. You'd need to capture codes with different hardware. BUT you could replace them with relay modules and regular plugs!

**Q: Is it safe for mains voltage (110V/220V)?**
A: The RX480E outputs are low voltage (3.3V) and low current. Use a properly rated relay to switch mains voltage. Never connect mains directly to the RX480E!

**Q: Can I power the RX480E from a 9V battery?**
A: Yes, but use a voltage regulator to step down to 5V. Direct 9V will damage it.

## Safety Notes

1. **Never connect mains voltage directly to RX480E** - Always use a relay
2. **Check relay ratings** - Make sure it can handle your load
3. **Proper enclosures** - Put electronics in a safe box
4. **Fuse your circuits** - Add fuses for safety
5. **Follow electrical codes** - Especially for permanent installations
6. **Test first** - Always test with low voltage before connecting high voltage

## Quick Start: Your First Standalone Project

**Let's make a wireless light switch in 5 minutes:**

1. **Get these:**
   - RX480E (you have it)
   - TX118SA remote (you have it)
   - 5V USB power adapter ($3)
   - 5V relay module ($5)
   - Lamp to control

2. **Wire it:**
   ```
   USB power → RX480E +V and GND
   RX480E D0 → Relay IN
   5V → Relay VCC
   GND → Relay GND
   Relay contacts → In series with lamp cord (cut hot wire)
   ```

3. **Pair it:**
   - Press learning button on RX480E **2 times** (toggle mode)
   - Press button 1 on remote
   - LED flashes 3 times = paired!

4. **Test it:**
   - Press button 1 = lamp on
   - Press button 1 again = lamp off
   - Done!

**Total cost:** $8 (just the relay and power supply)
**Time:** 5 minutes
**Skills needed:** Basic wiring
**Result:** Wireless light switch that works forever

---

## Bottom Line

**The RX480E is AMAZING for standalone use!**

You don't need an ESP32 for simple projects. The RX480E's built-in decoder makes it perfect for:
- Wireless switches
- Remote controls
- Simple automation
- Accessibility aids
- Workshop controls
- Garden irrigation
- Security systems

**Just add power, a relay, and wire it up. No programming. No configuration. It just works.**

For complex stuff (WiFi, logging, scenes), add the ESP32. But for simple on/off control? The RX480E alone is perfect!
