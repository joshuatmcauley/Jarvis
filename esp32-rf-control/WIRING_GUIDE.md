# Wiring Guide for ESP32 RF Control System

## Components Overview

### ESP32 Board (Keysstudio ESP32 WROOM-32D)
- **Power**: 5V via USB or VIN pin
- **Operating Voltage**: 3.3V logic
- **GPIO Pins**: Multiple digital I/O pins
- **WiFi**: Built-in 2.4 GHz WiFi

### RF Receiver Module (RX480E - 433 MHz)
- **Operating Voltage**: 3.3V - 5V DC
- **Frequency**: 433 MHz
- **Output**: 4 digital channels (D0, D1, D2, D3) + VT (valid transmission)
- **Built-in EV1527 decoder** - No external decoding needed!
- **Range**: Up to 50m in open space
- **Modes**: Momentary, Toggle, Interlock

### RF Transmitter Module (TX118SA - 4-button remote)
- **Operating Voltage**: Uses CR2032 battery (3V)
- **Frequency**: 433 MHz
- **Encoding**: EV1527
- **Buttons**: 4 buttons (K1, K2, K3, K4)
- **Button mapping**: K1→D0, K2→D1, K3→D3, K4→D2

## Detailed Wiring Instructions

### Step 1: Identify the Pins

#### ESP32 Pin Layout (Common Pins)
```
                    ESP32-WROOM-32D
                   ┌─────────────┐
              3V3 ─┤1         38├─ GND
         EN (RST) ─┤2         37├─ GPIO23
          GPIO36  ─┤3         36├─ GPIO22
          GPIO39  ─┤4         35├─ TXD0
          GPIO34  ─┤5         34├─ RXD0
          GPIO35  ─┤6         33├─ GPIO21
          GPIO32  ─┤7         32├─ GND
          GPIO33  ─┤8         31├─ GPIO19
   *** → GPIO25  ─┤9         30├─ GPIO18
   *** → GPIO26  ─┤10        29├─ GPIO5
   *** → GPIO27  ─┤11        28├─ GPIO17
          GPIO14  ─┤12        27├─ GPIO16
          GPIO12  ─┤13        26├─ GPIO4
              GND ─┤14        25├─ GPIO0
          GPIO13  ─┤15        24├─ GPIO2
           SD2/9  ─┤16        23├─ GPIO15
           SD3/10 ─┤17        22├─ SD1/8
            CMD   ─┤18        21├─ SD0/7
              5V  ─┤19        20├─ CLK/6
                   └─────────────┘

*** = Pins we're using in this project
```

#### RF Module Pin Identification

**RX480E Receiver Module** (usually has 3-4 pins):
```
┌─────────┐
│  RX480E │
│         │
│  VCC    │ ← Connect to 3.3V
│  DATA   │ ← Signal output (to GPIO 27)
│  GND    │ ← Connect to GND
└─────────┘
```

**TX118SA Transmitter Module** (usually has 3 pins):
```
┌─────────┐
│ TX118SA │
│         │
│  VCC    │ ← Connect to 5V
│  DATA   │ ← Signal input (from GPIO 25)
│  GND    │ ← Connect to GND
└─────────┘
```

### Step 2: Connect RF Receiver (for Signal Capture)

1. **Receiver VCC → ESP32 3.3V**
   - Use the 3.3V pin on ESP32
   - DO NOT use 5V for receiver

2. **Receiver GND → ESP32 GND**
   - Any GND pin on ESP32 works

3. **Receiver DATA → ESP32 GPIO 27**
   - This is the signal output pin
   - GPIO 27 is used in the scanner sketch

**Visual Connection:**
```
RF Receiver                   ESP32
  ┌────┐                    ┌──────┐
  │VCC ├────────────────────┤ 3.3V │
  │    │                    │      │
  │DATA├────────────────────┤GPIO27│
  │    │                    │      │
  │GND ├────────────────────┤ GND  │
  └────┘                    └──────┘
```

### Step 3: Connect RF Transmitter (for Controlling Plugs)

1. **Transmitter VCC → ESP32 5V**
   - Use the 5V pin (labeled "VIN" or "5V")
   - This gives better transmission range
   - If your module only supports 3.3V, use 3.3V instead

2. **Transmitter GND → ESP32 GND**
   - Any GND pin on ESP32 works
   - Can share with receiver GND

3. **Transmitter DATA → ESP32 GPIO 25**
   - This is the signal input pin
   - GPIO 25 is used in the control sketches

**Visual Connection:**
```
RF Transmitter                ESP32
  ┌────┐                    ┌──────┐
  │VCC ├────────────────────┤  5V  │
  │    │                    │      │
  │DATA├────────────────────┤GPIO25│
  │    │                    │      │
  │GND ├────────────────────┤ GND  │
  └────┘                    └──────┘
```

### Step 4: Complete System (Both Modules)

When both modules are connected simultaneously:

```
                          ESP32
                     ┌────────────┐
                     │            │
RF Receiver          │            │          RF Transmitter
  ┌────┐             │            │             ┌────┐
  │VCC ├─────────────┤ 3.3V       │             │    │
  │    │             │            │             │    │
  │DATA├─────────────┤ GPIO27     │             │    │
  │    │             │            │             │    │
  │GND ├─────┬───────┤ GND        │             │    │
  └────┘     │       │            │             │    │
             │       │ GPIO25 ────┼─────────────┤DATA│
             │       │            │             │    │
             │       │ 5V ────────┼─────────────┤VCC │
             │       │            │             │    │
             └───────┤ GND ───────┼─────────────┤GND │
                     │            │             └────┘
                     └────────────┘
```

## Breadboard Layout

### Using a Breadboard (Recommended for Testing)

```
Power Rails:            Components:
  + ─────────           ESP32 in center
  - ─────────           Receivers on left
                        Transmitters on right
```

**Step-by-step breadboard setup:**

1. Place ESP32 in center of breadboard
2. Connect ESP32 GND to breadboard GND rail (-)
3. Connect ESP32 3.3V to one power rail (+)
4. Connect ESP32 5V to another power rail (+)
5. Place receiver module on left side
6. Place transmitter module on right side
7. Use jumper wires for connections

## Wire Management Tips

### Best Practices

1. **Keep Wires Short**
   - Shorter wires = better signal quality
   - Use 10-20cm jumper wires maximum
   - Avoid coiling excess wire

2. **Use Quality Jumper Wires**
   - Female-to-female for most modules
   - Male-to-female if modules have pins
   - Avoid loose connections

3. **Label Your Wires**
   - Use colored wires consistently:
     - Red = Power (VCC)
     - Black = Ground (GND)
     - Yellow/Green = Data signals

4. **Antenna Considerations**
   - Both modules may have spring antennas
   - Keep antennas straight and extended
   - Don't let antennas touch metal objects
   - For better range, add 17.3cm wire antenna

## Troubleshooting Wiring Issues

### No Signal Detected (Receiver)

**Check:**
- [ ] Receiver VCC connected to 3.3V (NOT 5V if module is 3.3V only)
- [ ] Receiver GND connected to ESP32 GND
- [ ] Receiver DATA connected to GPIO 27
- [ ] Receiver has power (LED indicator if present)
- [ ] Jumper wires are firmly connected
- [ ] Try different GPIO pin if issue persists

### Signal Not Transmitting

**Check:**
- [ ] Transmitter VCC connected to 5V (or 3.3V if required)
- [ ] Transmitter GND connected to ESP32 GND
- [ ] Transmitter DATA connected to GPIO 25
- [ ] ESP32 is powered (not just from USB if using 5V transmitter)
- [ ] Transmitter is close to smart plug (< 1 meter for testing)
- [ ] Antenna is properly positioned

### Power Issues

**Check:**
- [ ] USB cable supports data + power (not charge-only cable)
- [ ] USB port provides sufficient current (500mA minimum)
- [ ] For better transmitter power, use external 5V power supply
- [ ] Don't power high-current devices from ESP32 pins

### General Debugging

**Multimeter Checks:**
1. Measure voltage at receiver VCC (should be ~3.3V)
2. Measure voltage at transmitter VCC (should be ~5V)
3. Check continuity of GND connections
4. Verify GPIO pins are not damaged (measure voltage when HIGH)

## Advanced Wiring Options

### Adding an Antenna

For better range, add a simple wire antenna:

**Antenna Length Calculation:**
- Frequency: 433 MHz
- Wavelength (λ) = 300 / 433 = 69.3 cm
- Quarter-wave (λ/4) = 17.3 cm ← Use this!

**How to Add:**
1. Cut a 17.3 cm piece of solid wire
2. Solder to ANT pad on RF module (if available)
3. Or wrap around existing spring antenna
4. Keep antenna straight and vertical

### External Power Supply

For maximum transmitter power:

1. Use 5V 2A power supply
2. Connect to ESP32 VIN pin
3. Share GND with ESP32
4. Powers both ESP32 and transmitter

```
Power Supply (5V 2A)
  │
  ├─── VIN (ESP32)
  │
  └─── GND (ESP32)
```

### Multiple Transmitters

To control multiple frequencies:

1. Use different GPIO pins for each transmitter
2. Update code to use multiple RCSwitch objects
3. Common GND and VCC rails

## Safety Notes

1. **Voltage Levels**
   - Never apply more than 3.3V to ESP32 GPIO pins
   - Check module voltage requirements
   - Use level shifters if needed

2. **Current Limits**
   - ESP32 GPIO max: 12mA per pin
   - Total GPIO current: 40mA max
   - Use external power for high-current loads

3. **Static Discharge**
   - ESP32 is sensitive to static electricity
   - Touch grounded object before handling
   - Use ESD protection if available

## Final Checklist

Before powering on:

- [ ] All connections match wiring diagram
- [ ] No shorts between VCC and GND
- [ ] Correct voltage to each module (3.3V vs 5V)
- [ ] All GND connections are solid
- [ ] DATA pins connected to correct GPIOs
- [ ] Antennas are not touching metal
- [ ] USB cable is data-capable
- [ ] Sketch is uploaded before connecting power loads

## Next Steps

Once wiring is complete:

1. Double-check all connections
2. Connect ESP32 to computer via USB
3. Open Arduino IDE
4. Upload `rf_signal_scanner.ino`
5. Test with original remote control
6. Proceed to signal capture phase

---

**Need Help?**

If you encounter wiring issues:
1. Take a clear photo of your setup
2. Use a multimeter to verify connections
3. Try one module at a time (receiver first)
4. Check the troubleshooting section in main README
