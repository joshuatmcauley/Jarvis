# Tesla-Style Infotainment System for 2015 Insignia
## DIY Raspberry Pi Build Guide

**Project Status**: Planning Phase  
**Target Vehicle**: 2015 Vauxhall/Opel Insignia  
**Location**: Northern Ireland, UK  
**Builder Profile**: CS Grad with Arduino/Pi/Homelab Experience

---

## Table of Contents
1. [Legal Compliance (UK/NI)](#legal-compliance)
2. [System Architecture](#system-architecture)
3. [Hardware Components](#hardware-components)
4. [Software Stack](#software-stack)
5. [Camera System](#camera-system)
6. [Power Management](#power-management)
7. [Implementation Roadmap](#implementation-roadmap)
8. [Budget & Timeline](#budget-timeline)

---

## Legal Compliance (UK/NI)

### ✅ Camera Laws (As of 2026)
**Dash Cams & Cameras - LEGAL** but must comply with:
- **Positioning**: Max 40mm intrusion into windscreen wiper area
- **View Obstruction**: Must not block driver's view of the road
- **Mounting**: Behind rear-view mirror (center-top) is ideal
- **Data Protection**: GDPR compliant (30-day rolling storage recommended)
- **Recording**: Public road recording is legal for personal use

### ✅ Screen & Display Laws
**Screen Installation - LEGAL** with requirements:
- **No Video Playback While Driving**: Driver must not see video content while moving
- **Allowed Content While Driving**: Navigation, vehicle status, reversing camera, instrument data
- **MOT Compliance**:
  - Secure mounting (no loose parts)
  - No exposed wiring
  - Must not obstruct driver's view
  - If displaying speedometer/warning lights, must accurately read from CAN bus
  - All dashboard warning lights (ABS, airbag, engine) must remain functional

### 🆕 Camera-Mirror Replacement (Legal as of April 2025)
- **Camera-Monitor Systems** can legally replace physical mirrors
- **Must comply with**: ECE Regulation 46.04
- **Applies to**: Side mirrors and potentially rear-view mirror
- **Requirements**: High reliability, fail-safe operation, proper positioning

### ⚠️ MOT Considerations
To pass MOT with custom screen:
1. Keep screen on navigation/home during inspection (not video)
2. Hide all exposed cables
3. Ensure secure mounting
4. Test all steering wheel controls
5. Verify parking cameras work (if equipped)
6. Dashboard warning lights must function correctly

### 📋 Insurance Considerations
- **Declare Modification**: Notify insurer of custom infotainment
- **Reversing Camera**: May reduce premium (safety feature)
- **Dash Cam**: Some insurers offer 10-15% discount
- **Professional Installation**: Keep receipts for proof of proper installation

---

## System Architecture

### High-Level Design
```
┌─────────────────────────────────────────────────────────────┐
│                    TESLA-STYLE SYSTEM                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         MAIN DISPLAY (10-13" Touchscreen)           │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐    │  │
│  │  │ Navigation │  │  Media     │  │  Vehicle   │    │  │
│  │  │   Maps     │  │  Player    │  │   Info     │    │  │
│  │  └────────────┘  └────────────┘  └────────────┘    │  │
│  │                                                      │  │
│  │  ┌──────────────────────────────────────────────┐  │  │
│  │  │     Multi-Camera View (Rear/Side/360°)       │  │  │
│  │  └──────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
│                          │                                  │
│               ┌──────────┴──────────┐                      │
│               │   Raspberry Pi 5    │                      │
│               │   (Brain/Computer)  │                      │
│               └──────────┬──────────┘                      │
│                          │                                  │
│  ┌───────────┬───────────┼───────────┬──────────┐         │
│  │           │           │           │          │         │
│  ▼           ▼           ▼           ▼          ▼         │
│ CAN      Camera      Audio       Power     Storage        │
│ Bus      Inputs      Output      System     (NVMe)        │
└─────────────────────────────────────────────────────────────┘
```

### System Components

#### 1. **Compute Module** - Raspberry Pi 5
- 8GB RAM (recommended for smooth multitasking)
- NVMe SSD for OS and media storage (fast, reliable)
- Active cooling (official cooler or better)

#### 2. **Display System**
- 10-13" capacitive touchscreen
- 800-1000+ nit brightness (readable in sunlight)
- Anti-glare matte finish
- HDMI or DSI connection
- I2C brightness control (auto-dim at night)

#### 3. **Camera Array**
- **Rear Camera**: Wide-angle (170°+), night vision
- **Side Cameras**: 2x (left/right blind spots) - Tesla style
- **Optional Front Camera**: Dash cam / parking mode
- USB or CSI interface

#### 4. **Audio System**
- USB 5.1 sound card OR
- Direct DAC hat (HiFiBerry, etc.)
- Integration with existing amplifiers

#### 5. **Vehicle Integration**
- OBD-II adapter (ELM327 or OBDLink)
- CAN bus interface (read speedometer, RPM, fuel, warnings)
- Steering wheel control integration (optional)
- Reverse gear trigger wire

#### 6. **Power Management**
- 12V to 5V buck converter (minimum 5A/25W, recommend 60W)
- Ignition sense circuit (auto power on/off)
- Supercapacitor or UPS for graceful shutdown
- Fuse protection (inline 10A fuse)

---

## Hardware Components

### Essential Hardware (Phase 1)

| Component | Specification | Example Products | Est. Cost (GBP) |
|-----------|--------------|------------------|-----------------|
| **Raspberry Pi 5** | 8GB RAM | Raspberry Pi 5 8GB | £75 |
| **Active Cooler** | Official or better | Raspberry Pi Active Cooler | £5 |
| **NVMe SSD** | 256GB-512GB | Samsung 980 256GB | £30 |
| **M.2 HAT** | For Pi 5 | Pimoroni NVMe Base | £10 |
| **Main Display** | 10.1-13" IPS, 1000+ nit, capacitive | Waveshare 10.1" HDMI 1024x600<br>OR Elecrow 11.6" 1920x1080 | £80-150 |
| **USB Sound Card** | 5.1 or stereo DAC | Generic USB audio adapter | £15-25 |
| **Power Supply** | 12V→5V 60W buck converter | DROK LM2596 60W | £12 |
| **Ignition Sense** | Relay/circuit for auto power | DIY or commercial module | £5-15 |
| **Mounting Hardware** | Custom dash mount/bezel | 3D printed or DIY | £10-30 |
| | | **Phase 1 Subtotal** | **£242-352** |

### Camera System (Phase 2)

| Component | Specification | Example Products | Est. Cost (GBP) |
|-----------|--------------|------------------|-----------------|
| **Rear Camera** | 170° wide angle, night vision, IP67 | Generic automotive backup camera | £20-40 |
| **Side Cameras** | 2x, 140°+ angle, compact, IP67 | Automotive blind spot cameras | £25-50 ea |
| **USB Video Capture** | 3-4 channel USB capture card | EasyCap 4-channel OR<br>3x individual USB dongles | £30-60 |
| **Camera Switch/Trigger** | Auto-switch on reverse | DIY relay from reverse light wire | £5-10 |
| **Cabling** | Extension cables, weatherproof | RCA/USB extensions | £15-25 |
| | | **Phase 2 Subtotal** | **£120-235** |

### Optional/Advanced Hardware (Phase 3)

| Component | Purpose | Est. Cost (GBP) |
|-----------|---------|-----------------|
| **OBD-II Adapter** | ELM327 or OBDLink EX (Bluetooth/WiFi) | £15-80 |
| **GPS Module** | USB GPS for offline navigation | £20-35 |
| **4G/LTE Modem** | Mobile internet connectivity | £30-50 |
| **Microphone Array** | Voice commands (Jarvis integration!) | £10-20 |
| **Arduino/ESP32** | Additional I/O, steering wheel controls | £5-15 |
| **Supercapacitor** | Safe shutdown on power loss | £15-25 |
| **Ambient LED Strip** | Interior lighting control | £10-20 |
| | **Phase 3 Subtotal** | **£105-245** |

### **TOTAL PROJECT COST**: £467-832 (depending on options)

---

## Software Stack

### Operating System Options

#### **Option 1: Raspberry Pi OS (Recommended for beginners)**
- **Base**: Raspberry Pi OS Lite (Debian-based)
- **Display Server**: Wayland with labwc compositor
- **Advantages**: Well-documented, large community, easy setup
- **Use Case**: Custom QML/Qt application or web-based interface

#### **Option 2: Yocto Linux (Advanced, best performance)**
- **Base**: Custom Yocto/Kirkstone build
- **Display Server**: Wayland/Weston
- **Advantages**: Minimal overhead, fast boot, production-ready
- **Use Case**: Professional-grade, Tesla-like experience

#### **Option 3: Buildroot (Embedded-focused)**
- **Base**: Minimalist embedded Linux
- **Display Server**: Direct framebuffer or Wayland
- **Advantages**: Ultra-fast boot (<10s), small footprint
- **Use Case**: Appliance-style infotainment

### Infotainment Software Options

#### **Option A: OpenAuto Pro (Commercial, Easiest)**
- **Cost**: ~£30 one-time license
- **Features**:
  - Android Auto support (wired/wireless)
  - Apple CarPlay (requires MFi chip)
  - Built-in media player
  - OBD-II integration
  - Pre-built Raspberry Pi image
- **Pros**: Plug-and-play, polished UI, active development
- **Cons**: Paid license, limited customization
- **Website**: https://bluewavestudio.io/

#### **Option B: LIVI (Open Source, Flexible)**
- **Cost**: FREE (open source)
- **Features**:
  - Apple CarPlay (wired/wireless with MFi chip)
  - Android Auto (wired/wireless)
  - Hardware-accelerated video (zero-copy GStreamer)
  - Multi-touch support
  - Low latency audio
- **Pros**: Free, highly customizable, native performance
- **Cons**: More technical setup, requires MFi chip for CarPlay
- **GitHub**: https://github.com/f-io/LIVI

#### **Option C: Custom Qt6/QML Application (DIY, Tesla-like)**
- **Cost**: FREE (open source frameworks)
- **Features**:
  - 100% custom Tesla-inspired UI
  - Full control over every element
  - Integration with JARVIS AI assistant
  - Media player, maps, vehicle data
  - Your own branding and features
- **Framework**: Qt6 with QML (hardware-accelerated)
- **Pros**: Complete creative control, perfect Tesla clone, integrate with existing JARVIS
- **Cons**: Most development work, steeper learning curve
- **Tutorials**: 
  - [Recreate Tesla UI in Qt/QML Part 1](https://www.youtube.com/watch?v=Tq-E6lqO6tM)
  - [Part 2](https://www.youtube.com/watch?v=MEdJNc1tfwE)

#### **Option D: Web-Based (HTML/CSS/JS)**
- **Cost**: FREE
- **Features**:
  - Use your existing web dev skills
  - Electron or Chromium kiosk mode
  - Responsive design
  - Easy UI iteration
- **Pros**: Familiar tech stack, rapid prototyping
- **Cons**: Higher resource usage, less native feel

### **Recommended Software Stack for Tesla-like System:**
```
┌─────────────────────────────────────────┐
│   Custom Qt6/QML Application           │ ← Tesla-inspired UI
├─────────────────────────────────────────┤
│   • GStreamer (video pipeline)          │ ← Camera feeds
│   • Qt Location (maps)                  │ ← Navigation
│   • Qt Multimedia (audio/video)         │ ← Media player
│   • Python OBD-II daemon (background)   │ ← Vehicle data
│   • GPSd (GPS data)                     │ ← Location
│   • MQTT broker (optional, IoT)         │ ← Smart home integration
├─────────────────────────────────────────┤
│   Wayland Compositor (labwc/Weston)    │ ← Display server
├─────────────────────────────────────────┤
│   Raspberry Pi OS Lite (Debian)        │ ← Operating system
└─────────────────────────────────────────┘
```

### Key Software Libraries & Tools

| Component | Library/Tool | Purpose |
|-----------|-------------|---------|
| **UI Framework** | Qt6 + QML | Hardware-accelerated UI |
| **Video Pipeline** | GStreamer | Camera feeds, video playback |
| **Maps** | Qt Location + OSM | Offline navigation |
| **OBD-II** | python-OBD | Read vehicle data |
| **GPS** | gpsd | Location services |
| **Audio** | PipeWire/ALSA | Audio routing |
| **Media Player** | VLC, MPV, or Qt Multimedia | Music/video |
| **Voice** | Porcupine (wake word) + Whisper (STT) | Voice control |

---

## Camera System

### Tesla-Style Camera Layout

```
                    ┌─────────────────┐
                    │  Optional Front │  ← Dash cam view
                    │     Camera      │  (parking/incidents)
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        │                    │                    │
   ┌────▼────┐          ┌────▼────┐          ┌───▼─────┐
   │  Left   │          │  MAIN   │          │  Right  │
   │  Side   │          │  REAR   │          │  Side   │
   │ Camera  │          │ Camera  │          │ Camera  │
   └─────────┘          └─────────┘          └─────────┘
   (Blind spot)         (Reversing)          (Blind spot)
```

### Camera Specifications

#### **Rear Camera (Essential)**
- **Resolution**: 720p minimum (1080p recommended)
- **Field of View**: 170° wide angle
- **Night Vision**: IR LEDs or Starlight sensor
- **Mounting**: License plate mount or bumper
- **Trigger**: Auto-activate when reverse gear engaged
- **Overlay**: Distance guidelines (software-generated)

#### **Side Cameras (Tesla Style)**
- **Resolution**: 720p minimum
- **Field of View**: 140-160° (capture blind spots)
- **Mounting**: Door mirrors or front fenders
- **View**: Side repeater view like Tesla
- **Use Cases**: 
  - Lane changes
  - Parking assistance
  - 360° surround view (with front/rear)

#### **Front Camera (Optional)**
- **Resolution**: 1080p
- **Field of View**: 140-160°
- **Purpose**: Dash cam, forward collision view
- **Mounting**: Behind rear-view mirror (comply with 40mm rule!)

### Camera Display Modes

1. **Normal Driving**: Small side camera indicators (or hidden)
2. **Reverse Mode**: Full-screen rear camera with guidelines
3. **Tesla 360° Mode**: Split-screen showing all cameras
4. **Parking Mode**: Picture-in-picture or quad-view
5. **Dash Cam Mode**: Front camera with recording indicator

### Camera Connection Methods

| Method | Channels | Latency | Cost | Notes |
|--------|----------|---------|------|-------|
| **USB Video Capture (4ch)** | 4 cameras | ~100-200ms | £30-60 | Single device, easier wiring |
| **Individual USB Dongles** | 1 per camera | ~100-200ms | £10 each | More flexible, more USB ports |
| **CSI Camera Module** | 1-2 cameras | <50ms | £20-40 | Lowest latency, limited cameras |
| **IP Cameras over Ethernet** | Unlimited | ~200-500ms | £30+ each | Higher cost, more complex |

**Recommended**: USB 4-channel capture card for simplicity

---

## Power Management

### Power Requirements

| Component | Current Draw | Power (12V) | Power (5V) |
|-----------|-------------|-------------|------------|
| Raspberry Pi 5 (load) | - | - | 5A / 25W |
| Screen (10-13") | - | - | 8-15W |
| USB Cameras (3x) | - | - | 1.5W |
| GPS/OBD-II | - | - | 1W |
| **Total 5V** | - | - | **~35-45W** |
| **12V Buck (70% eff)** | ~4-5A | 48-64W | - |

**Recommendation**: 12V→5V buck converter rated for **60W minimum** (e.g., DROK LM2596 60W)

### Power Circuit Design

```
┌──────────────────────────────────────────────────────────┐
│                    VEHICLE 12V SYSTEM                    │
└───────────┬──────────────────────────────────────────────┘
            │
            │ [10A Fuse]
            │
            ├──────────┬──────────────────────────┐
            │          │                          │
            │      ┌───▼───┐                  ┌───▼────┐
            │      │Ignition│                 │Always  │
            │      │ Sense  │                 │  Hot   │
            │      │(ACC/ON)│                 │(Battery)│
            │      └───┬───┘                  └───┬────┘
            │          │                          │
            │          │ Relay Control            │ Main Power
            │          │                          │
            │      ┌───▼──────────────────────────▼────┐
            │      │         Power Relay               │
            │      │  (Auto On: Ignition ON)           │
            │      │  (Auto Off: Ignition OFF + Delay) │
            │      └───────────┬───────────────────────┘
            │                  │
            │              ┌───▼────┐
            │              │12V→5V  │
            │              │ Buck   │
            │              │Converter│
            │              │ (60W)  │
            │              └───┬────┘
            │                  │
            │                  │ USB-C PD (5V/5A)
            │                  │
            │          ┌───────▼────────┐
            │          │ Raspberry Pi 5 │
            │          │   + Screen     │
            │          └────────────────┘
            │
            └──────► [Optional: Supercap for shutdown]
```

### Ignition Sense (Auto Power On/Off)

**Goal**: Pi powers on when you start the car, shuts down gracefully when you turn off ignition

#### **Method 1: Simple Relay (No Graceful Shutdown)**
- Relay connected to ACC/ignition wire
- Pi powers on when ignition on, cuts power when off
- **Risk**: Potential SD card/SSD corruption (not recommended)

#### **Method 2: Microcontroller Shutdown Handler (Recommended)**
- Arduino/ESP32 monitors ignition wire
- Sends shutdown signal to Pi via GPIO
- Pi shuts down gracefully (30 seconds)
- Then cuts power via relay
- **Best**: Safe filesystem, no corruption

#### **Method 3: Automotive Pi UPS (Commercial)**
- Pre-built modules (e.g., "Pi-oT" or "Sleepy Pi")
- Handles ignition sense, graceful shutdown, supercapacitor backup
- **Cost**: £30-50
- **Easiest**: Plug-and-play solution

### Recommended Circuit Components

| Component | Specification | Purpose | Cost |
|-----------|--------------|---------|------|
| **Buck Converter** | LM2596 12V→5V 60W | Main power supply | £12 |
| **Relay Module** | 12V 30A automotive relay | Ignition switching | £5 |
| **Supercapacitor** | 5V 10F (optional) | Shutdown backup power | £15 |
| **Inline Fuse** | 10A ATO blade fuse | Circuit protection | £2 |
| **Arduino Nano** | Optional, for shutdown control | Ignition monitoring | £5 |

---

## Implementation Roadmap

### Phase 1: Bench Prototype (2-3 weeks)
**Goal**: Get basic system running on a desk before car installation

- [ ] **Hardware Setup**
  - [ ] Assemble Pi 5 + NVMe + cooler
  - [ ] Flash Raspberry Pi OS to NVMe
  - [ ] Connect display (HDMI) and verify output
  - [ ] Test touchscreen functionality
  - [ ] Connect USB audio and test output

- [ ] **Software Foundation**
  - [ ] Install Qt6 development environment
  - [ ] Clone Tesla UI tutorial and run demo
  - [ ] Set up GStreamer for video playback
  - [ ] Test USB camera input (use webcam for testing)
  - [ ] Create basic QML layout: navigation, media, vehicle tabs

- [ ] **Integration Testing**
  - [ ] Test audio playback (MP3/streaming)
  - [ ] Test video playback (camera feed simulation)
  - [ ] Test touchscreen responsiveness
  - [ ] Implement basic navigation between screens

**Deliverable**: Working desktop prototype with Tesla-like UI

---

### Phase 2: Vehicle Integration (3-4 weeks)
**Goal**: Install hardware in car, integrate with vehicle systems

- [ ] **Power System**
  - [ ] Design and build 12V→5V power circuit
  - [ ] Wire ignition sense (ACC line tap)
  - [ ] Install relay and fuse block
  - [ ] Test power on/off sequence
  - [ ] Implement graceful shutdown script

- [ ] **Physical Installation**
  - [ ] Design/3D print dash mount or bezel
  - [ ] Run power cables from engine bay (or fuse box)
  - [ ] Mount screen in dashboard (temporary mount for testing)
  - [ ] Secure Pi in safe location (behind dash, under seat)
  - [ ] Route cables cleanly (hidden behind trim)

- [ ] **Audio Integration**
  - [ ] Tap into existing car speakers OR
  - [ ] Connect to amplifier inputs (aux input if available)
  - [ ] Test audio output at various volumes
  - [ ] Ensure no alternator whine/interference

- [ ] **OBD-II Integration**
  - [ ] Connect OBD-II adapter (Bluetooth or WiFi)
  - [ ] Install python-OBD library
  - [ ] Read basic PIDs (speed, RPM, fuel level, coolant temp)
  - [ ] Display vehicle data on screen (Tesla-like gauge cluster)

**Deliverable**: Functional infotainment system installed in car with basic features

---

### Phase 3: Camera System (2-3 weeks)
**Goal**: Install and integrate multi-camera system

- [ ] **Camera Hardware**
  - [ ] Install rear camera (license plate mount)
  - [ ] Install side cameras (mirror or fender mounts)
  - [ ] Route camera cables through car body (weatherproof grommets)
  - [ ] Connect cameras to USB capture device
  - [ ] Test camera feeds on Pi

- [ ] **Camera Software**
  - [ ] Integrate GStreamer pipelines for multi-camera input
  - [ ] Implement reverse gear trigger (wire from reverse light)
  - [ ] Auto-switch to rear camera when reversing
  - [ ] Add parking guidelines overlay (software-drawn)
  - [ ] Create 360° surround view mode
  - [ ] Add recording functionality (dash cam mode)

- [ ] **Legal Compliance Check**
  - [ ] Verify cameras don't obstruct view (especially front camera)
  - [ ] Ensure rear camera provides adequate view for reversing
  - [ ] Test camera visibility in various lighting conditions
  - [ ] Add privacy indicator (recording status LED)

**Deliverable**: Full Tesla-style camera array with multi-view modes

---

### Phase 4: Advanced Features (Ongoing)
**Goal**: Add Tesla-like smart features

- [ ] **Navigation**
  - [ ] Install offline maps (OpenStreetMap)
  - [ ] Integrate GPS module
  - [ ] Implement turn-by-turn navigation
  - [ ] Add traffic data (if 4G/LTE module installed)

- [ ] **Media & Entertainment**
  - [ ] Music library (USB/NVMe storage)
  - [ ] Spotify/streaming integration
  - [ ] Bluetooth audio (phone connection)
  - [ ] Video playback (parked mode only!)

- [ ] **Voice Control (JARVIS Integration!)**
  - [ ] Install Porcupine wake word ("Hey JARVIS")
  - [ ] Integrate Whisper STT (speech-to-text)
  - [ ] Voice commands: navigation, media, climate (if accessible)
  - [ ] Text-to-speech responses

- [ ] **Smart Features**
  - [ ] Tire pressure monitoring (if OBD-II supports)
  - [ ] Maintenance reminders (oil change, MOT)
  - [ ] Trip computer (distance, fuel efficiency)
  - [ ] Dashcam with parking mode
  - [ ] Integration with home automation (unlock house when arriving)

- [ ] **Climate Control** (if CAN bus accessible)
  - [ ] Read current temperature settings
  - [ ] Control HVAC via CAN commands (advanced!)
  - [ ] Pre-condition car remotely (Tesla-like)

**Deliverable**: Feature-complete Tesla-style system

---

## Budget & Timeline

### Cost Breakdown

| Phase | Description | Cost (GBP) |
|-------|-------------|------------|
| **Phase 1** | Core hardware (Pi, screen, power) | £242-352 |
| **Phase 2** | Vehicle integration (wiring, mounting) | £50-100 |
| **Phase 3** | Camera system (3 cameras + capture) | £120-235 |
| **Phase 4** | Optional upgrades (GPS, OBD-II, 4G) | £105-245 |
| | **TOTAL** | **£517-932** |

### Alternative Budget Options

**Minimal Build (£300-400)**:
- Pi 5 4GB instead of 8GB (£60 vs £75)
- Smaller 7" screen (£50-80)
- Rear camera only (£20-40)
- No advanced features

**Premium Build (£1000+)**:
- High-res 13" screen (£200-300)
- Pi Compute Module 4 (industrial-grade)
- 4 camera setup with 4G/LTE
- Professional enclosure and installation

### Implementation Timeline

| Phase | Duration | Parallel Work | Key Milestones |
|-------|----------|---------------|----------------|
| **Phase 1** | 2-3 weeks | Can work alongside uni/work | Working bench prototype |
| **Phase 2** | 3-4 weeks | Requires car access, weekend work | Installed and driving |
| **Phase 3** | 2-3 weeks | Incremental (one camera at a time) | Full camera system |
| **Phase 4** | Ongoing | Add features as desired | Continuous improvement |
| **Total** | 2-3 months | For fully featured system | - |

**Realistic Timeline for CS Grad**: 
- 10-15 hours/week = ~2.5 months to full system
- Can drive with basic system after Phase 2 (4-6 weeks)

---

## Next Steps

### Immediate Actions (This Week)
1. **Research & Planning**
   - [ ] Read through this document completely
   - [ ] Watch Tesla UI Qt tutorials (linked above)
   - [ ] Join communities: r/CarAV, r/CarTech, r/raspberry_pi

2. **Hardware Sourcing**
   - [ ] Order Pi 5 8GB (£75) - In stock at Pimoroni, CPC, Pi Hut
   - [ ] Order display (£80-150) - Research shipping times
   - [ ] Order power components (£15-30)

3. **Skill Building**
   - [ ] Qt6 tutorial (if new to Qt): https://doc.qt.io/qt-6/gettingstarted.html
   - [ ] QML basics: https://doc.qt.io/qt-6/qtquick-index.html
   - [ ] GStreamer camera pipelines

### Decision Points
- [ ] **Software choice**: Custom Qt app vs OpenAuto Pro vs LIVI?
- [ ] **Display size**: 10.1" vs 11.6" vs 13"?
- [ ] **Installation**: Dash replacement vs add-on mount?
- [ ] **Audio**: USB sound card vs DAC hat?

---

## Resources & Links

### Documentation
- **UK MOT Manual**: https://www.gov.uk/guidance/mot-inspection-manual-for-private-passenger-and-light-commercial-vehicles
- **ECE Regulation 46.04** (Camera-Mirror Systems): https://unece.org/transport/vehicle-regulations-wp29

### Software Projects
- **LIVI** (Open source CarPlay/Android Auto): https://github.com/f-io/LIVI
- **OpenAuto Pro**: https://bluewavestudio.io/
- **TruckDash** (Example Pi carputer): https://github.com/erichexter/Carplay

### Communities
- **Reddit**: r/CarAV, r/CarTech, r/raspberry_pi, r/VAUXHALL
- **Forums**: VX244 Insignia forum (UK-specific help)
- **Discord**: Pi Labs server, Qt Discord

### Suppliers (UK)
- **Raspberry Pi**: Pimoroni, The Pi Hut, CPC Farnell
- **Displays**: Waveshare, Elecrow, AliExpress
- **Automotive Parts**: Amazon UK, eBay, 12Volt Planet
- **3D Printing**: Local maker spaces, Shapeways (custom bezels)

---

## Notes & Ideas
- Consider integrating with existing JARVIS project (voice control!)
- Potential to control home automation (unlock door when arriving home)
- Could add wireless CarPlay dongle for iPhone users (£60-100)
- Think about parking mode (motion detection, always-on camera)
- OTA updates via SSH/VPN?

---

**Document Version**: 1.0  
**Last Updated**: August 3, 2026  
**Status**: Planning Phase
