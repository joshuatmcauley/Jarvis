# ESP32 RF Control for Energizer Smart Plugs

Control your Energizer remote control smart plugs using an ESP32 and 433 MHz RF transmitter/receiver module.

## Hardware Required

- **Keysstudio ESP32 WROOM-32D** (ESP32 development board)
- **CIACHIP RX480E 433 MHz RF Module** with TX118SA 4-channel transmitter/receiver
- **Energizer Remote Control Smart Plugs** (original remote for signal capture)
- Jumper wires (female-to-female recommended)
- USB cable for ESP32 programming
- Breadboard (optional, for prototyping)

## Wiring Connections

### RF Receiver Module (for capturing signals)

Connect the **RX480E receiver** to your ESP32:

```
RF Receiver    →    ESP32
---------------------------
VCC           →    3.3V
GND           →    GND
DATA (OUT)    →    GPIO 27
```

### RF Transmitter Module (for sending signals)

Connect the **TX118SA transmitter** to your ESP32:

```
RF Transmitter  →    ESP32
---------------------------
VCC            →    5V (or 3.3V if module supports it)
GND            →    GND
DATA (IN)      →    GPIO 25
```

**Important Notes:**
- Most 433 MHz transmitters work better with 5V, but check your module specs
- The receiver typically uses 3.3V
- Use short wires (< 20cm) for best signal quality
- Both modules can be connected simultaneously

### Complete Wiring Diagram

```
                        ESP32
                    ┌─────────┐
                    │         │
    RF Receiver     │         │     RF Transmitter
    ┌─────────┐     │         │     ┌─────────┐
    │         │     │         │     │         │
    │ VCC  ───┼─────┤ 3.3V    │     │         │
    │ GND  ───┼─────┤ GND     │     │         │
    │ DATA ───┼─────┤ GPIO27  │     │         │
    │         │     │         │     │         │
    └─────────┘     │ GPIO25  ├─────┼─── DATA │
                    │ 5V      ├─────┼─── VCC  │
                    │ GND     ├─────┼─── GND  │
                    │         │     │         │
                    └─────────┘     └─────────┘
```

## Software Setup

### 1. Install Arduino IDE and ESP32 Support

1. Download and install [Arduino IDE](https://www.arduino.cc/en/software) (version 2.x recommended)
2. Add ESP32 board support:
   - Go to **File → Preferences**
   - Add to **Additional Board Manager URLs**:
     ```
     https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
     ```
   - Go to **Tools → Board → Boards Manager**
   - Search for "esp32" and install **ESP32 by Espressif Systems**

### 2. Install Required Libraries

Open **Tools → Manage Libraries** and install:
- **RCSwitch** by Suat Özgür (for 433 MHz communication)

Alternative library options:
- **rc-switch** (if RCSwitch is not available)

## Step-by-Step Usage Guide

### Step 1: Capture Your Remote's RF Signals

1. Wire up the **RF Receiver** to your ESP32 (see wiring above)
2. Upload the **`rf_signal_scanner.ino`** sketch to your ESP32
3. Open the Serial Monitor (115200 baud)
4. Press buttons on your Energizer remote control one at a time
5. Record the signal codes displayed in the Serial Monitor

**Example output:**
```
Received: 13383452 / 24bit Protocol: 1
Received: 13383449 / 24bit Protocol: 1
```

### Step 2: Control Your Smart Plugs

1. Edit **`rf_smart_plug_control.ino`**
2. Replace the placeholder codes with your captured codes:
   ```cpp
   #define PLUG1_ON  13383452
   #define PLUG1_OFF 13383449
   ```
3. Upload the sketch to your ESP32
4. Wire up the **RF Transmitter** (see wiring above)
5. Open Serial Monitor and send commands:
   - `1ON` - Turn plug 1 ON
   - `1OFF` - Turn plug 1 OFF
   - `2ON` - Turn plug 2 ON
   - `2OFF` - Turn plug 2 OFF

### Step 3: Web Control (Optional)

Use **`rf_web_control.ino`** for WiFi-based control:

1. Edit the WiFi credentials in the sketch
2. Upload to ESP32
3. Open Serial Monitor to see the IP address
4. Open the IP address in your web browser
5. Control plugs from any device on your network

## Troubleshooting

### No Signals Detected

- Check wiring connections (VCC, GND, DATA)
- Ensure receiver is powered (3.3V)
- Move receiver closer to remote (< 1 meter initially)
- Try different GPIO pins if needed
- Check that RCSwitch library is installed correctly

### Signals Not Working to Control Plugs

- Verify captured codes are correct
- Check transmitter wiring (especially VCC - try 5V if 3.3V doesn't work)
- Increase transmission repeat count in code (currently 10)
- Move transmitter closer to smart plugs
- Ensure transmitter antenna is straight and unobstructed
- Try different protocol numbers (1-6) in the code

### Signal Range Issues

- Use a proper antenna (17.3 cm wire for 433 MHz = λ/4)
- Increase transmitter voltage to 5V if supported
- Add `rf_transmit.setRepeatTransmit(15);` for more repeats
- Keep transmitter away from metal objects
- Position ESP32 higher up

### ESP32 Not Programming

- Press and hold BOOT button while uploading
- Check USB cable (must support data, not just charging)
- Try different USB port
- Verify correct board selected: **ESP32 Dev Module**
- Reduce upload speed: **Tools → Upload Speed → 115200**

## Technical Details

### 433 MHz Frequency

- Common frequency for remote controls and wireless sensors
- Good penetration through walls
- Legal in most countries for low-power devices
- Typical range: 50-100 meters in open space, 10-30 meters indoors

### RF Protocols

The RCSwitch library supports multiple protocols. Most remote controls use:
- Protocol 1 (most common)
- Protocol 2
- Protocol 4

### Signal Format

RF signals are typically:
- **Binary** (on/off keying)
- **24-bit or 32-bit** codes
- **Pulse length**: usually 300-500 microseconds

## Integration with JARVIS

This ESP32 RF control system can be integrated with the main JARVIS assistant:

1. Add ESP32 to the same network as Raspberry Pi
2. Use the web control interface
3. Call ESP32 API endpoints from JARVIS Python code
4. Add voice commands to control smart plugs

Example integration code coming soon!

## Safety & Legal Notes

- Only control YOUR OWN devices
- RF transmission may be regulated in your area
- Use appropriate power supply for ESP32 (5V, 1A minimum)
- Do not exceed 10 mW transmission power without proper licensing

## Next Steps

1. **Capture signals** from your remote
2. **Test control** via Serial Monitor
3. **Add more plugs** by capturing additional codes
4. **Set up web control** for remote access
5. **Integrate with JARVIS** for voice control

## Useful Resources

- [RCSwitch Library Documentation](https://github.com/sui77/rc-switch)
- [ESP32 Arduino Core](https://github.com/espressif/arduino-esp32)
- [433 MHz RF Protocol Analysis](https://www.princetronics.com/how-to-read-433-mhz-codes-w-arduino-433-mhz-receiver/)

---

**Note:** Different Energizer smart plug models may use different protocols. The code provided works with most standard 433 MHz remotes, but you may need to adjust parameters for your specific model.
