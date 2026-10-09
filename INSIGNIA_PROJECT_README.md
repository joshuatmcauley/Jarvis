# 2015 Insignia Upgrade Project
## Tesla-Style Infotainment + Interior/Exterior Upgrades

**Owner**: CS Graduate with Arduino/Pi/Homelab Experience  
**Vehicle**: 2015 Vauxhall/Opel Insignia  
**Location**: Northern Ireland, UK  
**Project Started**: August 3, 2026

---

## 📖 Quick Navigation

### 🚀 Tesla-Style Infotainment System
This is the main technical project - building a custom Tesla-inspired infotainment system with multi-camera support!

| Document | Purpose | Start Here? |
|----------|---------|-------------|
| **[TESLA_STYLE_SYSTEM.md](TESLA_STYLE_SYSTEM.md)** | Complete technical guide | ⭐ **YES - READ FIRST** |
| **[WEEKEND_QUICKSTART.md](WEEKEND_QUICKSTART.md)** | Build a prototype this weekend | ⚡ **START CODING** |
| **[SHOPPING_LIST.md](SHOPPING_LIST.md)** | Parts & UK suppliers | 🛒 **BUY PARTS** |
| **[UK_LEGAL_COMPLIANCE.md](UK_LEGAL_COMPLIANCE.md)** | Legal requirements (NI/UK) | ⚖️ **LEGAL CHECKLIST** |

### 🎨 Vehicle Cosmetic Upgrades
Traditional upgrade planning for interior/exterior improvements.

| Document | Purpose |
|----------|---------|
| **[INSIGNIA_UPGRADES.md](INSIGNIA_UPGRADES.md)** | Detailed upgrade tracker |
| **[insignia_quick_checklist.txt](insignia_quick_checklist.txt)** | Quick reference |

---

## 🎯 Project Goals

### Primary Goal: Tesla-Style Infotainment
Build a custom Raspberry Pi 5 based infotainment system that provides:
- Large touchscreen display (10-13")
- Multi-camera view (rear + side cameras)
- Real-time vehicle data (OBD-II)
- Navigation with offline maps
- Media player
- Voice control (JARVIS integration!)
- Dash cam with parking mode

**Why DIY vs Buying?**
- Commercial Tesla-style screens: £1500+
- DIY with Pi 5: £500-800
- **Savings: £700-1000+**
- Plus: 100% customizable, no subscriptions, learning experience

### Secondary Goal: Cosmetic Upgrades
Improve interior and exterior appearance:
- Seat refurbishment/covers
- Dashboard restoration
- Interior LED lighting
- Paint correction & ceramic coating
- Wheel refurbishment
- Window tinting
- Chrome delete

---

## 🚗 System Overview

### What You'll Build

```
┌─────────────────────────────────────────────────────────┐
│          2015 INSIGNIA TESLA-STYLE SYSTEM              │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌───────────────────────────────────────────────┐    │
│  │    13" Touchscreen (1920x1080, 1000+ nits)   │    │
│  │  ┌──────┬──────┬──────┬──────┬──────────┐    │    │
│  │  │ Nav  │Media │Vehicle│Camera│ JARVIS  │    │    │
│  │  └──────┴──────┴──────┴──────┴──────────┘    │    │
│  │                                                │    │
│  │  [Live navigation, music, gauges, or camera]  │    │
│  └───────────────────────────────────────────────┘    │
│                                                         │
│  [Rear Camera] [Left Camera]        [Right Camera]    │
│      170°           140°                  140°         │
│                                                         │
│  ┌─────────────────────────────────────────────┐      │
│  │   Raspberry Pi 5 (8GB) + NVMe SSD (256GB)  │      │
│  │   + Power Management + OBD-II + GPS        │      │
│  └─────────────────────────────────────────────┘      │
│                                                         │
│  Powered by 12V car battery → 5V buck converter       │
│  Auto on/off with ignition sensing                    │
└─────────────────────────────────────────────────────────┘
```

### Key Features

✅ **Tesla UI** - Custom Qt6/QML interface (dark theme, smooth animations)  
✅ **Multi-Camera** - Rear view + side blind spot cameras (Tesla-style)  
✅ **360° View** - Combine all cameras for parking/maneuvering  
✅ **OBD-II Data** - Speed, RPM, fuel, coolant temp, DTCs  
✅ **Navigation** - Offline OpenStreetMap with turn-by-turn  
✅ **Media** - Music library, Spotify, Bluetooth audio  
✅ **Voice Control** - "Hey JARVIS" integration with existing project  
✅ **Dash Cam** - Continuous recording, parking mode  
✅ **Smart Power** - Auto on when ignition on, graceful shutdown when off  
✅ **MOT Legal** - Designed to comply with UK regulations  

---

## 📋 Implementation Plan

### Phase 1: Bench Prototype (2-3 weeks)
**Goal**: Working system on your desk before car installation

- [ ] Order hardware (Pi 5, screen, power supply)
- [ ] Assemble Pi + NVMe + display
- [ ] Install Raspberry Pi OS and Qt6
- [ ] Build basic Tesla UI following tutorials
- [ ] Test touchscreen and audio
- [ ] Create navigation, media, vehicle status screens

**Time**: 10-15 hours  
**Cost**: £250-370  
**Deliverable**: Working desktop prototype

👉 **Follow**: [WEEKEND_QUICKSTART.md](WEEKEND_QUICKSTART.md)

---

### Phase 2: Vehicle Integration (3-4 weeks)
**Goal**: Installed and running in car

- [ ] Design power circuit (12V→5V + ignition sense)
- [ ] Wire power from fuse box or battery
- [ ] Install relay for auto on/off
- [ ] Mount screen in dashboard (temporary or permanent)
- [ ] Secure Pi in safe location (under seat/behind dash)
- [ ] Integrate with car audio (aux input or speaker taps)
- [ ] Connect OBD-II adapter (Bluetooth/WiFi)
- [ ] Display real vehicle data on screen

**Time**: 15-20 hours  
**Cost**: £50-100 (wiring, mounting hardware)  
**Deliverable**: Functional infotainment in car

---

### Phase 3: Camera System (2-3 weeks)
**Goal**: Tesla-style multi-camera array

- [ ] Install rear camera (license plate mount)
- [ ] Install side cameras (mirrors or fenders)
- [ ] Route camera cables through car (weatherproof)
- [ ] Connect cameras to USB capture device
- [ ] Implement auto-switch to rear view when reversing
- [ ] Add parking guidelines overlay (software)
- [ ] Create 360° surround view mode
- [ ] Enable dash cam recording

**Time**: 10-15 hours  
**Cost**: £130-250  
**Deliverable**: Full multi-camera system

---

### Phase 4: Advanced Features (Ongoing)
**Goal**: Tesla-level smart features

- [ ] Offline navigation with turn-by-turn
- [ ] JARVIS voice assistant ("Hey JARVIS, navigate home")
- [ ] Spotify/streaming integration
- [ ] Climate control via CAN bus (if possible)
- [ ] Remote access (4G/LTE module)
- [ ] Tire pressure monitoring
- [ ] Maintenance reminders
- [ ] Smart home integration (unlock house on arrival)

**Time**: Ongoing improvements  
**Cost**: £100-250  
**Deliverable**: Feature-complete Tesla experience

---

## 💰 Budget

### Tesla Infotainment System

| Phase | Components | Cost |
|-------|-----------|------|
| **Phase 1** | Pi 5, screen, NVMe, power supply | £250-370 |
| **Phase 2** | Wiring, mounting, relay, fuses | £50-100 |
| **Phase 3** | 3 cameras, USB capture, cables | £130-250 |
| **Phase 4** | OBD-II, GPS, 4G, voice, extras | £100-250 |
| | **TOTAL** | **£530-970** |

**Compare to**:
- Tesla-style commercial units: £1500-2500
- **You save**: £700-1500+

### Cosmetic Upgrades (Separate Budget)

| Category | Estimated |
|----------|-----------|
| Interior upgrades | £500-1000 |
| Exterior upgrades | £800-1500 |
| **Total** | **£1300-2500** |

**Total Project Budget**: £1800-3500 (infotainment + cosmetics)

---

## 🧰 Required Skills

### What You Already Have ✅
- CS degree background
- Arduino experience (electronics fundamentals)
- Raspberry Pi experience (Linux, GPIO)
- Homelab experience (networking, servers)

### What You'll Learn 📚
- Qt6 framework and QML (UI development)
- Automotive electronics (12V systems, CAN bus)
- GStreamer (video pipeline management)
- Embedded Linux (boot optimization, systemd)
- Hardware integration (power management, sensors)
- Automotive law and compliance (UK/NI specific)

**Skill Level Required**: Intermediate (perfect for a CS grad!)

---

## ⚖️ Legal Compliance (UK/NI)

### What's Legal ✅
- ✅ Aftermarket infotainment systems
- ✅ Dash cameras (front/rear/side)
- ✅ Touchscreen displays (if not obstructing view)
- ✅ Camera-monitor systems replacing mirrors (as of April 2025)
- ✅ OBD-II data reading
- ✅ Custom interior/exterior modifications

### What's Required ⚠️
- ⚠️ Video playback disabled while driving (speed lockout)
- ⚠️ Front camera max 40mm into wiper area
- ⚠️ Secure mounting (no loose parts)
- ⚠️ Dashboard warning lights functional (if replaced)
- ⚠️ Declare modification to insurer
- ⚠️ Pass MOT with modifications

**See**: [UK_LEGAL_COMPLIANCE.md](UK_LEGAL_COMPLIANCE.md) for complete checklist

---

## 🛠️ Tools Needed

### Already Have (Probably)
- Laptop/desktop for development
- Basic hand tools (screwdrivers, pliers)
- Internet connection

### Need to Buy
- Multimeter (£12-25)
- Crimping tool (£15-30)
- Wire strippers (£8)
- Trim removal tools (£8)
- Soldering iron (£20-40, optional)

**Total Tools**: £40-90 if buying everything

---

## 📚 Learning Resources

### Tutorials & Videos
- [Tesla UI in Qt/QML Part 1](https://www.youtube.com/watch?v=Tq-E6lqO6tM) - Step-by-step UI build
- [Tesla UI Part 2](https://www.youtube.com/watch?v=MEdJNc1tfwE) - Advanced features
- [Qt6 Documentation](https://doc.qt.io/qt-6/) - Official Qt docs
- [Raspberry Pi Forums](https://forums.raspberrypi.com/) - Pi-specific help

### Communities
- **Reddit**: r/raspberry_pi, r/CarAV, r/CarTech, r/Vauxhall
- **Forums**: VX244 Insignia forum (UK-specific)
- **Discord**: Pi Labs server, Qt Discord

### Software Projects (Reference)
- [LIVI](https://github.com/f-io/LIVI) - Open source CarPlay/Android Auto
- [TruckDash](https://github.com/erichexter/Carplay) - Example Pi carputer

---

## 🚀 Getting Started

### This Weekend
1. **Read** [TESLA_STYLE_SYSTEM.md](TESLA_STYLE_SYSTEM.md) (main guide)
2. **Order** Raspberry Pi 5 8GB + display (see [SHOPPING_LIST.md](SHOPPING_LIST.md))
3. **Watch** Tesla UI Qt tutorials (linked above)
4. **Join** r/raspberry_pi and r/CarAV communities

### Next Weekend
1. **Follow** [WEEKEND_QUICKSTART.md](WEEKEND_QUICKSTART.md)
2. **Build** bench prototype with basic Tesla UI
3. **Test** touchscreen and audio
4. **Demo** to friends and get feedback

### Next Month
1. **Design** power circuit and mounting
2. **Order** cameras and capture devices
3. **Plan** dashboard integration
4. **Start** vehicle installation

---

## 📊 Project Status

### Current Phase: Planning ✅
- [x] Research UK/NI legal requirements
- [x] Create technical documentation
- [x] Plan hardware architecture
- [x] Create shopping lists
- [x] Design implementation roadmap

### Next Phase: Prototype
- [ ] Order Phase 1 hardware
- [ ] Build bench prototype
- [ ] Learn Qt6/QML basics
- [ ] Create basic Tesla UI
- [ ] Test touchscreen interface

---

## 📞 Support & Contact

### If You Get Stuck
1. Check troubleshooting sections in each guide
2. Search existing forum threads (VX244, Reddit)
3. Ask on r/raspberry_pi or r/CarAV
4. Review Qt6 documentation
5. Check similar projects on GitHub

### Document Issues
If you find errors or have suggestions for these docs:
- Create GitHub issue
- Update docs directly (you're the owner!)
- Share improvements with community

---

## 🎉 Why This Project is Awesome

1. **Learn Real Skills**: Qt6, embedded Linux, automotive electronics, CAN bus
2. **Save Money**: £700-1500 vs commercial solutions
3. **Full Control**: No subscriptions, customize everything, add features anytime
4. **Portfolio Project**: Impressive for job applications (embedded systems, UI dev)
5. **Integrate JARVIS**: Voice control in your car!
6. **Community**: Share your build, help others, get feedback
7. **Future-Proof**: Update software anytime, add new features

---

## 📝 Version History

- **v1.0** (Aug 3, 2026): Initial documentation
  - Tesla-style infotainment planning
  - UK/NI legal compliance research
  - Shopping lists and suppliers
  - Weekend quickstart guide
  - Insignia cosmetic upgrade planning

---

## 🔗 Quick Links

- [Main Technical Guide](TESLA_STYLE_SYSTEM.md) - Start here!
- [Weekend Prototype Guide](WEEKEND_QUICKSTART.md) - Build this weekend
- [UK Legal Checklist](UK_LEGAL_COMPLIANCE.md) - Stay compliant
- [Shopping List](SHOPPING_LIST.md) - What to buy
- [Cosmetic Upgrades](INSIGNIA_UPGRADES.md) - Interior/exterior planning
- [Pull Request #1](https://github.com/joshuatmcauley/Jarvis/pull/1) - View changes

---

**Ready to build the coolest Insignia in Northern Ireland?** 🚗💨

Let's go! 🚀
