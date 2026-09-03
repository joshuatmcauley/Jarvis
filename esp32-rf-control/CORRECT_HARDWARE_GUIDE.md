# QIACHIP RX480E + TX118SA Hardware Guide

## Important: Your Hardware is Different!

The QIACHIP RX480E module you purchased works **completely differently** from standard RF receivers. Here's what you actually have:

### What You Have

1. **RX480E Receiver Module**
   - PCB module with 6 pins
   - **Built-in EV1527 decoder chip**
   - 4 digital outputs (D0, D1, D2, D3)
   - Learning button for pairing remotes
   - No external decoding needed!

2. **TX118SA 4-Button Remote**
   - Handheld battery-powered remote (CR2032 battery)
   - 4 buttons (K1, K2, K3, K4)
   - Sends EV1527-encoded 433 MHz signals
   - NOT a module to wire to ESP32

### How It Actually Works

```
TX118SA Remote     433MHz Signal      RX480E Receiver      Digital Pins      ESP32
(handheld)      ─────────────────►   (has decoder)     ─────────────────►  (reads pins)
  [K1]                                    [D0] ────────► GPIO 25
  [K2]                                    [D1] ────────► GPIO 26  
  [K3]                                    [D3] ────────► GPIO 14
  [K4]                                    [D2] ────────► GPIO 27
```

**Key Point:** The TX118SA remote sends signals TO the RX480E receiver. The ESP32 just reads which button was pressed by checking the digital outputs.

## The Problem with Your Goal

You want to control **Energizer smart plugs**, but:

1. ❌ The TX118SA remote **cannot** directly control Energizer plugs
   - TX118SA uses EV1527 encoding
   - Energizer plugs use a different encoding
   - They won't understand each other

2. ✅ Your Energizer plugs came with their own remote
   - That remote uses a different RF protocol
   - You need to capture codes from THAT remote

## Two Possible Approaches

### Approach 1: Use RX480E to Trigger Actions (Recommended)

Use the TX118SA remote to trigger the ESP32, which then uses a separate transmitter to control your Energizer plugs:

```
TX118SA Remote → RX480E → ESP32 → [Need 433MHz Transmitter Module] → Energizer Plugs
```

**What you still need:**
- A standard 433 MHz transmitter module (like FS1000A or XY-FST)
- Cost: $2-5

### Approach 2: Capture Energizer Remote Codes (Better)

Forget the TX118SA remote and focus on capturing your Energizer remote's codes:

```
Energizer Remote → [Need 433MHz Receiver Module] → ESP32 → [Need 433MHz Transmitter Module] → Energizer Plugs
```

**What you need:**
- Standard 433 MHz receiver module (like XY-MK-5V or RXB6) - $2-5
- Standard 433 MHz transmitter module (like FS1000A) - $2-3

The RX480E **cannot** be used to capture Energizer remote codes because it only works with EV1527-encoded remotes.

## What Your RX480E Module CAN Do

### Good Uses:
1. **Wireless switch input for ESP32**
   - Use TX118SA as a 4-button wireless controller
   - Control anything connected to your ESP32
   - Great for home automation projects

2. **Learning remote codes from other EV1527 devices**
   - Can pair with multiple EV1527 remotes
   - Works with many cheap 433MHz remotes from Amazon/eBay
   - Good for consolidating multiple remotes

3. **Wireless relay control**
   - Connect RX480E outputs directly to relay boards
   - ESP32 monitors which relay is active
   - Build custom wireless switches

### What it CANNOT Do:
- ❌ Capture codes from non-EV1527 remotes (like your Energizer remote)
- ❌ Transmit RF signals (RX480E is receive-only)
- ❌ Work with rolling-code security systems
- ❌ Control devices that don't use EV1527 encoding

## Recommended Solution

I recommend you get these additional components:

### Shopping List
1. **433 MHz Receiver Module** (super-regenerative type)
   - Examples: XY-MK-5V, RXB6, or part of FS1000A kit
   - Cost: $2-5
   - Used to capture your Energizer remote codes

2. **433 MHz Transmitter Module** (standard type)
   - Examples: FS1000A, XY-FST, SYN115
   - Cost: $2-3
   - Used to control your Energizer plugs

**Total additional cost: $4-8**

### Why You Need Both

| Module | Purpose | What It Does |
|--------|---------|--------------|
| XY-MK-5V Receiver | Code capture | Captures codes from YOUR Energizer remote |
| FS1000A Transmitter | Control plugs | Replays those codes to control plugs |
| RX480E (you have) | Optional input | Use TX118SA as wireless button for ESP32 |
| TX118SA (you have) | Optional input | 4-button wireless remote for ESP32 |

## Wiring for RX480E (What You Have Now)

### RX480E Pin Layout

```
┌──────────────────┐
│    RX480E        │
│                  │
│  GND  [1] ●      │  Ground
│  +V   [2] ●      │  Power (3.3-5V)
│  D0   [3] ●      │  Button 1 output (K1)
│  D1   [4] ●      │  Button 2 output (K2)
│  D2   [5] ●      │  Button 4 output (K4)
│  D3   [6] ●      │  Button 3 output (K3)
│  VT   [7] ●      │  Valid Transmission (optional)
│                  │
│  [Learning LED]  │
│  [Learning Button]│
└──────────────────┘
```

### Connect to ESP32

```
RX480E Pin    →    ESP32 Pin
──────────────────────────────
GND           →    GND
+V            →    5V (or 3.3V)
D0 (K1)       →    GPIO 25
D1 (K2)       →    GPIO 26
D2 (K4)       →    GPIO 27
D3 (K3)       →    GPIO 14
VT (optional) →    GPIO 33
```

### Pairing TX118SA Remote with RX480E

1. **Press the learning button** on RX480E:
   - 1 press = Momentary mode (button active only while held)
   - 2 presses = Toggle mode (button press toggles on/off)
   - 3 presses = Interlock mode (only one button active at a time)

2. **LED turns on** = RX480E is in learning mode

3. **Press any button** on TX118SA remote

4. **LED flashes 3 times** = Successfully paired!

5. **Test it**: Press the button again, corresponding D pin goes HIGH

## Arduino Code for RX480E

### Simple Button Reader

```cpp
// RX480E Button Reader for ESP32
// No RCSwitch library needed!

// Define pins
#define BUTTON1_PIN 25  // D0 from RX480E
#define BUTTON2_PIN 26  // D1 from RX480E
#define BUTTON3_PIN 14  // D3 from RX480E
#define BUTTON4_PIN 27  // D2 from RX480E

void setup() {
  Serial.begin(115200);
  
  // Set pins as inputs
  pinMode(BUTTON1_PIN, INPUT);
  pinMode(BUTTON2_PIN, INPUT);
  pinMode(BUTTON3_PIN, INPUT);
  pinMode(BUTTON4_PIN, INPUT);
  
  Serial.println("RX480E Button Reader Ready");
  Serial.println("Press buttons on TX118SA remote");
}

void loop() {
  // Read button states
  bool btn1 = digitalRead(BUTTON1_PIN);
  bool btn2 = digitalRead(BUTTON2_PIN);
  bool btn3 = digitalRead(BUTTON3_PIN);
  bool btn4 = digitalRead(BUTTON4_PIN);
  
  // Print when button is pressed
  if (btn1) Serial.println("Button 1 (K1) pressed!");
  if (btn2) Serial.println("Button 2 (K2) pressed!");
  if (btn3) Serial.println("Button 3 (K3) pressed!");
  if (btn4) Serial.println("Button 4 (K4) pressed!");
  
  delay(100);
}
```

## Next Steps

### Option A: Use What You Have (Limited)
Your RX480E + TX118SA can be used as a wireless input device for ESP32 projects, but **cannot** control your Energizer smart plugs.

### Option B: Get Additional Modules (Recommended)
Buy a standard 433MHz receiver and transmitter ($4-8 total) to capture and replay your Energizer remote codes.

### Option C: Different Approach
Consider using WiFi smart plugs instead, which can be controlled directly by ESP32 without RF modules.

## Why This Confusion Happened

The product listing on Amazon is somewhat misleading:
- It says "compatible with Arduino/ESP32" ✓ (True - but only as input)
- Product images show it wired to development boards ✓ (True - for reading buttons)
- But it's NOT a general-purpose RF transceiver

The RX480E is specifically designed for:
- Wireless switch applications
- Relay control
- Remote control receivers

It's NOT designed for:
- RF code capturing/replaying
- Working with arbitrary RF protocols
- Security system remotes

## Summary

| What You Thought | What You Actually Have |
|------------------|----------------------|
| RF receiver for capturing any 433MHz code | RX480E: Only works with EV1527 remotes |
| RF transmitter module to wire to ESP32 | TX118SA: Handheld remote, not a module |
| Can control Energizer plugs with this | Need different modules to do this |

**Bottom Line:** Your RX480E + TX118SA kit is excellent for wireless input projects, but you need additional standard RF modules ($4-8) to capture and control your Energizer smart plugs.

## Questions?

**Q: Can I return the RX480E and get something else?**
A: You could, but the RX480E is still useful. I'd recommend keeping it and buying the $4-8 in additional modules.

**Q: Will the TX118SA work with my Energizer plugs directly?**
A: No, they use different RF encoding protocols.

**Q: Can I modify the RX480E to capture other codes?**
A: No, the decoding chip is fixed to EV1527 protocol only.

**Q: What should I buy to control my Energizer plugs?**
A: Get an FS1000A transmitter/receiver kit ($3-5) or XY-MK-5V receiver + XY-FST transmitter.

---

**I'll create updated code and guides based on your actual hardware. Do you want to:**
1. **Use the RX480E as wireless input** (works now, just different purpose)
2. **Buy additional modules** to control Energizer plugs ($4-8)
3. **Both** - Use RX480E for input AND control plugs with new modules

Let me know which direction you want to go!
