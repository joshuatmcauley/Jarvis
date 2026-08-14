# Parts List & Shopping Guide

Complete list of components needed for the ESP32 RF smart plug control system.

## Required Components

### 1. ESP32 Development Board
**What You Have:** Keysstudio ESP32 WROOM-32D

**Specifications:**
- Microcontroller: ESP32-WROOM-32D
- WiFi: 2.4 GHz 802.11 b/g/n
- Bluetooth: BLE 4.2
- GPIO Pins: 30+ pins
- Flash: 4MB
- Operating Voltage: 3.3V logic, 5V power via USB
- USB: Micro-USB for programming and power

**Alternatives (if buying new):**
- ESP32 DevKit V1 ($8-12)
- ESP32 NodeMCU ($10-15)
- ESP32-WROOM-32 generic board ($6-10)

**Where to Buy:**
- Amazon
- AliExpress
- Adafruit
- SparkFun

### 2. RF Receiver Module
**What You Have:** CIACHIP RX480E 433 MHz

**Specifications:**
- Frequency: 433 MHz
- Operating Voltage: 3.3V - 5V DC
- Operating Current: 4-5 mA
- Sensitivity: -105 dBm
- Range: Up to 100 meters (open space)
- Output: Digital (TTL)

**Alternatives:**
- XY-MK-5V receiver ($2-5)
- RXB6 433 MHz receiver ($3-6)
- FS1000A receiver (comes with transmitter, $2-4 pair)

### 3. RF Transmitter Module
**What You Have:** TX118SA 433 MHz (4 channel)

**Specifications:**
- Frequency: 433 MHz
- Operating Voltage: 3.3V - 12V DC (5V recommended)
- Operating Current: 20-40 mA
- Output Power: 10 mW (typical)
- Range: Up to 100 meters (open space)
- Input: Digital (TTL)

**Alternatives:**
- XY-FST transmitter ($2-5)
- FS1000A transmitter ($2-4)
- SYN115 transmitter ($3-6)

### 4. Smart Plugs
**What You Have:** Energizer Remote Control Smart Plugs

**Requirements:**
- Must use 433 MHz RF control
- Should have physical remote included
- Common brands that work:
  - Energizer
  - Etekcity
  - BN-LINK
  - Woods
  - Century
  - Harbor Breeze

**Typical Price:** $15-30 for 3-5 plug set with remote

### 5. Jumper Wires
**Needed:** At least 6 wires (3 for receiver, 3 for transmitter)

**Recommendations:**
- Female-to-female jumper wires (for most modules)
- 20cm (8 inch) length
- Various colors for easy identification
- Quality connectors that grip well

**Where to Buy:**
- Amazon: Elegoo/EDGELEC jumper wire kits ($6-10 for 120pcs)
- AliExpress: Generic sets ($2-5 for 40pcs)
- Local electronics store

### 6. USB Cable
**Type:** Micro-USB (for ESP32 programming)

**Requirements:**
- Must support data transfer (not charge-only)
- USB-A to Micro-USB
- 1-2 meter length recommended

**Price:** $3-8

**Note:** Many cheap cables are charge-only and won't work for programming!

## Optional but Recommended

### 7. Breadboard
**Purpose:** Prototyping and testing connections

**Recommendations:**
- Half-size breadboard (400 tie-points)
- Full-size breadboard (830 tie-points) if you plan to expand

**Price:** $5-10

**Alternatives:**
- Directly solder wires (permanent but less flexible)
- Use PCB terminal blocks

### 8. Wire for Antenna
**Purpose:** Improve RF transmission range

**Specifications:**
- Solid core wire, 22-24 AWG
- Length: 17.3 cm (quarter-wave for 433 MHz)
- Copper wire preferred

**Price:** $2-5 (or free from scrap wire)

### 9. Power Supply
**Purpose:** Better power for ESP32 + transmitter

**Specifications:**
- 5V DC, 2A output
- Micro-USB connector or barrel jack (depends on your ESP32)

**When Needed:**
- If USB port doesn't provide enough power
- For permanent installations
- If transmitter range is weak with USB power alone

**Price:** $5-10

### 10. Enclosure/Case
**Purpose:** Protect components, make it look professional

**Options:**
- Plastic project box ($5-10)
- 3D printed case (if you have access to 3D printer)
- Acrylic case
- DIY enclosure

**Recommended Size:** 10cm x 6cm x 3cm minimum

## Total Cost Breakdown

### If You Have Nothing:
```
ESP32 board:              $8-12
RF receiver:              $3-5
RF transmitter:           $3-5
Smart plugs (3-pack):     $20-30
Jumper wires (set):       $6-10
USB cable:                $3-8
Breadboard:               $5-10
---------------------------------
TOTAL:                    $48-80
```

### What You Already Have:
```
✓ ESP32 board:            $0 (already have)
✓ RF receiver:            $0 (already have)
✓ RF transmitter:         $0 (already have)
✓ Smart plugs:            $0 (already have)
Jumper wires (if needed): $6-10
USB cable (if needed):    $3-8
Breadboard (optional):    $5-10
---------------------------------
TOTAL:                    $0-28
```

## Shopping List (What You Still Need)

### Essential (if you don't have):
- [ ] 6+ Female-to-female jumper wires
- [ ] Micro-USB cable (data-capable)

### Recommended:
- [ ] Breadboard for prototyping
- [ ] 17.3cm wire for antenna
- [ ] Multimeter for debugging

### Optional:
- [ ] 5V 2A power supply
- [ ] Enclosure/case
- [ ] Additional smart plugs
- [ ] Wire strippers
- [ ] Solder and soldering iron (for permanent setup)

## Where to Buy

### Online Retailers

**Amazon (Fast Shipping, Higher Price):**
- ESP32 boards: Search "ESP32 development board"
- RF modules: Search "433MHz transmitter receiver"
- Jumper wires: Search "dupont jumper wires female"
- Complete kits available: Search "ESP32 RF kit"

**AliExpress (Cheap, Slow Shipping):**
- Everything available at lower prices
- Expect 2-4 week shipping from China
- Good for bulk orders or non-urgent projects

**Adafruit (Quality, Education):**
- Higher quality components
- Excellent documentation
- Good for beginners
- US-based, fast shipping

**SparkFun (Quality, Education):**
- Similar to Adafruit
- Great tutorials
- Reliable components

**eBay:**
- Mix of sellers
- Check seller ratings
- Sometimes great deals

### Local Options

**Hardware/Electronics Stores:**
- Micro Center (US)
- Fry's Electronics (US, some locations closed)
- Maplin (UK, online only now)
- Local electronics surplus stores

**Advantages of Local:**
- Same-day availability
- Can verify components
- Return if wrong part
- Support local business

## Component Quality Guide

### When to Buy Cheap:
- Jumper wires (generic is fine)
- Breadboards (all work similarly)
- Wire for antennas
- Basic RF modules (they're all similar)

### When to Buy Quality:
- ESP32 board (avoid no-name clones, stick with Espressif chips)
- USB cables (cheap cables often don't support data)
- Power supplies (cheap ones can damage components)
- Smart plugs (safety issue - buy UL/CE certified)

## Component Compatibility Notes

### ESP32 Variants
Most ESP32 boards will work, but ensure:
- Has enough GPIO pins (most do)
- Has USB programming (some boards need external USB-UART)
- Supports 3.3V and 5V output
- Compatible with Arduino IDE

**Boards that work:**
- ESP32-WROOM-32
- ESP32-WROOM-32D
- ESP32-WROOM-32U (with external antenna)
- ESP32 DevKit V1
- NodeMCU-32S

**Boards that might need modifications:**
- ESP32-CAM (limited GPIO, needs USB adapter)
- ESP32-S2/S3/C3 (different GPIO, code needs adjustment)

### RF Module Frequencies
**Important:** Frequency must match your region!

**433 MHz:** Legal in most of world (US, Europe, Asia)
- Your Energizer plugs likely use 433 MHz

**315 MHz:** Common in North America
- Check your remote's frequency
- Often marked on remote or plugs

**868 MHz:** Europe
- Less common for consumer devices

**To Check Your Frequency:**
1. Look at smart plug packaging/manual
2. Check FCC ID on device (search online)
3. Use frequency counter/scanner
4. Most Energizer plugs are 433 MHz

## Equivalent Parts Reference

If you can't find exact components:

### ESP32 Board
Any ESP32 with:
- WiFi capability
- Minimum 2 available GPIO pins
- USB programming port

### RF Receiver
Any 433 MHz (or matching frequency) receiver with:
- 3.3V compatible
- Digital output
- Similar sensitivity (-100 to -105 dBm)

### RF Transmitter
Any 433 MHz (or matching frequency) transmitter with:
- 3.3V-5V input
- Digital input (TTL)
- Similar output power (10 mW typical)

## Tools You Might Already Have

Don't forget to check if you already own:
- [ ] USB cable from old phone/device
- [ ] Wire from old electronics
- [ ] Breadboard from previous project
- [ ] Multimeter for testing
- [ ] Computer/laptop for programming

## Future Expansion Parts

If you want to expand the system later:

**Additional Sensors:**
- Motion sensor PIR ($3-5) - Auto-control based on presence
- Temperature sensor DHT22 ($5-8) - Temperature-based control
- Light sensor (LDR) ($2-3) - Auto lights at night

**Display:**
- OLED display 0.96" ($5-10) - Show status without computer
- LCD display 16x2 ($5-8) - Alternative display

**Additional RF:**
- 315 MHz module ($3-6) - If you have devices on different frequency
- Additional 433 MHz transmitters - For more range/redundancy

## Money-Saving Tips

1. **Check What You Have:** Look for old USB cables, wire scraps, breadboards
2. **Buy Kits:** Often cheaper than individual components
3. **Share Shipping:** Order with friends to split shipping costs
4. **Watch for Sales:** Amazon Prime Day, Black Friday, etc.
5. **Local Makers:** Check if local maker space has spare parts
6. **Use Coupons:** AliExpress and eBay often have discount codes

## Warranty & Return Policy

**Keep Packaging:** Save boxes and receipts for at least 30 days

**Test Immediately:** Check components as soon as they arrive
- ESP32: Plug in, check if it's detected by computer
- RF modules: Visual inspection for damage
- Wires: Check continuity with multimeter

**Return Windows:**
- Amazon: Usually 30 days
- AliExpress: 15-90 days (seller dependent)
- eBay: 30 days typical
- Adafruit/SparkFun: 30-60 days

## Safety & Certification

**For Smart Plugs:**
- Look for UL/ETL (US) or CE (Europe) certification
- Don't exceed plug's rated amperage
- Don't use for medical equipment
- Inspect for damage before use

**For RF Modules:**
- Already legal for use (low power)
- Don't modify to increase power without license
- FCC Part 15 compliant (typically)

## Final Checklist

Before ordering, verify you have/need:

**Must Have:**
- [ ] ESP32 board
- [ ] 433 MHz RF receiver
- [ ] 433 MHz RF transmitter
- [ ] Smart plugs with 433 MHz remote
- [ ] 6+ jumper wires (female-to-female)
- [ ] Micro-USB cable (data-capable)
- [ ] Computer with USB port

**Should Have:**
- [ ] Breadboard for testing
- [ ] Wire for antenna
- [ ] Multimeter for debugging

**Nice to Have:**
- [ ] Enclosure/case
- [ ] Extra power supply
- [ ] Additional smart devices
- [ ] Solder equipment for permanent install

---

**Ready to Shop?** Make sure frequency (433 MHz) matches your smart plugs!

**Already Have Everything?** Jump straight to QUICK_START.md to begin!
