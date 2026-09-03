# Weekend Quickstart Guide
## Build a Tesla UI Prototype in One Weekend

**Goal**: Get a working Tesla-style interface running on a Pi connected to a screen by Sunday evening  
**Time**: 8-12 hours over 2 days  
**Skill Level**: CS grad with Pi experience  
**Cost**: £120 (if you buy minimal hardware)

---

## What You'll Achieve This Weekend

By Sunday evening, you'll have:
- ✅ Pi 5 running with NVMe storage
- ✅ Touchscreen displaying custom Tesla-inspired UI
- ✅ Basic navigation interface (tabs/screens)
- ✅ Simulated vehicle data display
- ✅ Proof-of-concept ready to demo

**You WON'T yet have**:
- ❌ Car installation (that's next weekend)
- ❌ Real cameras (we'll simulate them)
- ❌ OBD-II integration (we'll mock data)

---

## Before You Start

### Hardware You Need NOW
- [ ] Raspberry Pi 5 (4GB or 8GB)
- [ ] Pi 5 Active Cooler
- [ ] NVMe SSD (256GB+) + M.2 HAT
- [ ] USB-C power supply (5V 5A official Pi PSU)
- [ ] 7"+ touchscreen (HDMI or DSI)
- [ ] Micro HDMI to HDMI cable
- [ ] USB keyboard + mouse (for setup)
- [ ] MicroSD card (32GB, for initial boot only)

**Already have**: Mouse, keyboard, internet connection

### Software You'll Download
- Raspberry Pi Imager (https://www.raspberrypi.com/software/)
- Qt6 (installed on Pi)
- Example Tesla UI code (GitHub)

---

## Saturday Morning (3-4 hours): Hardware Setup

### 9:00 AM - Assemble Hardware (30 mins)

1. **Attach Active Cooler to Pi 5**
   ```
   - Align cooler with Pi board
   - Connect power cable to fan header
   - Secure with included screws
   ```

2. **Install M.2 HAT and NVMe SSD**
   ```
   - Attach M.2 HAT to Pi 5 GPIO
   - Insert NVMe SSD into M.2 slot
   - Secure with standoffs/screws
   ```

3. **Connect Display**
   ```
   - Plug micro HDMI into Pi 5 (port 0)
   - Connect HDMI to display
   - Connect display power
   - If touchscreen: connect USB for touch input
   ```

4. **Connect Peripherals**
   ```
   - USB keyboard
   - USB mouse
   - Ethernet cable (recommended for first setup)
   ```

### 9:30 AM - Install Raspberry Pi OS (1 hour)

1. **On your laptop/PC, download Raspberry Pi Imager**
   - https://www.raspberrypi.com/software/

2. **Flash SD Card (we'll move to NVMe later)**
   - Open Pi Imager
   - Choose Device: Raspberry Pi 5
   - Choose OS: **Raspberry Pi OS (64-bit) - Desktop**
   - Choose Storage: Your MicroSD card
   - Click ⚙️ Settings:
     - Enable SSH
     - Set username: `pi` / password: `yourpassword`
     - Configure WiFi (optional)
     - Set hostname: `tesla-pi`
   - Click "Write"

3. **First Boot from SD Card**
   - Insert SD card into Pi 5
   - Connect power (should boot automatically)
   - Wait for desktop to appear (~60 seconds)
   - Complete setup wizard if prompted

### 10:30 AM - Move OS to NVMe (30 mins)

**Why?**: NVMe is 10x faster than SD card and more reliable for automotive use

1. **Update Bootloader (if needed)**
   ```bash
   sudo apt update
   sudo apt full-upgrade -y
   sudo rpi-eeprom-update
   # If update available:
   sudo rpi-eeprom-update -a
   sudo reboot
   ```

2. **Clone SD to NVMe**
   ```bash
   # Install SD Card Copier (GUI tool)
   sudo raspi-config
   # Navigate to: Advanced Options → Boot Order → NVMe/USB Boot
   # Enable and reboot
   
   # OR use command line:
   sudo dd if=/dev/mmcblk0 of=/dev/nvme0n1 bs=4M status=progress
   # This takes 5-10 minutes
   ```

3. **Boot from NVMe**
   ```bash
   # Power off Pi
   sudo shutdown -h now
   # Remove SD card
   # Power on - should boot from NVMe
   ```

### 11:00 AM - Install Development Tools (1.5 hours)

1. **Update System**
   ```bash
   sudo apt update && sudo apt full-upgrade -y
   ```

2. **Install Qt6 and Development Tools**
   ```bash
   # Install Qt6 and QML
   sudo apt install -y qt6-base-dev qt6-declarative-dev \
       qml6-module-qtquick qml6-module-qtquick-controls \
       qml6-module-qtquick-layouts qml6-module-qtquick-window \
       qt6-wayland qml6-module-qtmultimedia
   
   # Install additional tools
   sudo apt install -y cmake ninja-build git \
       gstreamer1.0-tools gstreamer1.0-plugins-good \
       gstreamer1.0-plugins-bad gstreamer1.0-plugins-ugly
   
   # Install Python tools (for future OBD-II work)
   sudo apt install -y python3-pip python3-venv
   ```

3. **Install Qt Creator IDE (Optional but Recommended)**
   ```bash
   sudo apt install -y qtcreator
   ```

---

## Saturday Afternoon (4-5 hours): Build Tesla UI

### 1:00 PM - Clone Tesla UI Example (30 mins)

1. **Find a Tesla UI Template**
   ```bash
   cd ~/
   mkdir -p tesla-infotainment
   cd tesla-infotainment
   
   # Option A: Use Qt Quick Controls example
   # We'll build from scratch following YouTube tutorial
   
   # Option B: Clone an existing project (if available)
   # Search GitHub for "tesla qt qml raspberry pi"
   git clone https://github.com/[example-tesla-ui-project]
   ```

2. **OR: Follow Video Tutorial**
   - Watch: [Recreate Tesla UI in Qt/QML Part 1](https://www.youtube.com/watch?v=Tq-E6lqO6tM)
   - Follow along step-by-step
   - Code as you go

### 1:30 PM - Create Basic Project Structure (1 hour)

If building from scratch:

1. **Create Project Files**
   ```bash
   cd ~/tesla-infotainment
   mkdir -p qml images
   touch main.cpp main.qml
   ```

2. **main.cpp** (C++ entry point):
   ```cpp
   #include <QGuiApplication>
   #include <QQmlApplicationEngine>
   
   int main(int argc, char *argv[])
   {
       QGuiApplication app(argc, argv);
       QQmlApplicationEngine engine;
       
       engine.load(QUrl(QStringLiteral("qrc:/main.qml")));
       
       if (engine.rootObjects().isEmpty())
           return -1;
       
       return app.exec();
   }
   ```

3. **main.qml** (Basic UI structure):
   ```qml
   import QtQuick 2.15
   import QtQuick.Controls 2.15
   import QtQuick.Layouts 1.15
   
   ApplicationWindow {
       id: root
       visible: true
       width: 1024
       height: 600
       title: "Tesla Infotainment"
       color: "#000000"
       
       // Top Bar
       Rectangle {
           id: topBar
           anchors.top: parent.top
           width: parent.width
           height: 60
           color: "#1a1a1a"
           
           Row {
               anchors.centerIn: parent
               spacing: 40
               
               Text {
                   text: "Navigation"
                   color: "white"
                   font.pixelSize: 18
                   
                   MouseArea {
                       anchors.fill: parent
                       onClicked: stackView.push(navPage)
                   }
               }
               
               Text {
                   text: "Media"
                   color: "white"
                   font.pixelSize: 18
                   
                   MouseArea {
                       anchors.fill: parent
                       onClicked: stackView.push(mediaPage)
                   }
               }
               
               Text {
                   text: "Vehicle"
                   color: "white"
                   font.pixelSize: 18
                   
                   MouseArea {
                       anchors.fill: parent
                       onClicked: stackView.push(vehiclePage)
                   }
               }
               
               Text {
                   text: "Camera"
                   color: "white"
                   font.pixelSize: 18
                   
                   MouseArea {
                       anchors.fill: parent
                       onClicked: stackView.push(cameraPage)
                   }
               }
           }
       }
       
       // Main Content Area
       StackView {
           id: stackView
           anchors.top: topBar.bottom
           anchors.bottom: parent.bottom
           anchors.left: parent.left
           anchors.right: parent.right
           
           initialItem: navPage
       }
       
       // Pages
       Component {
           id: navPage
           Rectangle {
               color: "#0a0a0a"
               Text {
                   anchors.centerIn: parent
                   text: "Navigation\n\n(Map goes here)"
                   color: "white"
                   font.pixelSize: 24
                   horizontalAlignment: Text.AlignHCenter
               }
           }
       }
       
       Component {
           id: mediaPage
           Rectangle {
               color: "#0a0a0a"
               Text {
                   anchors.centerIn: parent
                   text: "Media Player\n\n(Album art & controls go here)"
                   color: "white"
                   font.pixelSize: 24
                   horizontalAlignment: Text.AlignHCenter
               }
           }
       }
       
       Component {
           id: vehiclePage
           Rectangle {
               color: "#0a0a0a"
               
               ColumnLayout {
                   anchors.centerIn: parent
                   spacing: 20
                   
                   Text {
                       text: "Vehicle Status"
                       color: "#00ff00"
                       font.pixelSize: 32
                       Layout.alignment: Qt.AlignHCenter
                   }
                   
                   Text {
                       text: "Speed: 0 mph"
                       color: "white"
                       font.pixelSize: 20
                   }
                   
                   Text {
                       text: "Range: 250 miles"
                       color: "white"
                       font.pixelSize: 20
                   }
                   
                   Text {
                       text: "Temp: 20°C"
                       color: "white"
                       font.pixelSize: 20
                   }
               }
           }
       }
       
       Component {
           id: cameraPage
           Rectangle {
               color: "#0a0a0a"
               
               Text {
                   anchors.centerIn: parent
                   text: "Camera View\n\n(Camera feeds go here)"
                   color: "white"
                   font.pixelSize: 24
                   horizontalAlignment: Text.AlignHCenter
               }
           }
       }
   }
   ```

4. **CMakeLists.txt** (Build configuration):
   ```cmake
   cmake_minimum_required(VERSION 3.16)
   project(tesla-infotainment)
   
   set(CMAKE_CXX_STANDARD 17)
   set(CMAKE_AUTOMOC ON)
   set(CMAKE_AUTORCC ON)
   
   find_package(Qt6 REQUIRED COMPONENTS Core Gui Quick)
   
   qt_add_executable(tesla-infotainment
       main.cpp
   )
   
   qt_add_qml_module(tesla-infotainment
       URI TeslaInfotainment
       VERSION 1.0
       QML_FILES main.qml
   )
   
   target_link_libraries(tesla-infotainment PRIVATE
       Qt6::Core
       Qt6::Gui
       Qt6::Quick
   )
   ```

### 2:30 PM - Build and Run (30 mins)

1. **Build the Project**
   ```bash
   cd ~/tesla-infotainment
   mkdir build
   cd build
   cmake ..
   make
   ```

2. **Run Your Tesla UI!**
   ```bash
   ./tesla-infotainment
   ```

3. **Test Touch Input**
   - Tap different navigation tabs
   - Verify screen transitions
   - Check touch responsiveness

### 3:00 PM - Iterate and Improve (2-3 hours)

Now spend the afternoon making it look more Tesla-like:

1. **Add Better Styling**
   - Dark theme (#0a0a0a background)
   - Tesla-style fonts (Gotham, Montserrat alternatives)
   - Smooth animations (StackView transitions)
   - Rounded corners and gradients

2. **Add Mock Vehicle Data**
   - Speed (animated from 0-70)
   - Battery/fuel gauge
   - Temperature readings
   - Time/date display

3. **Add Camera Placeholder**
   - Show static image as "camera feed"
   - Add grid overlay for parking guidelines
   - Multi-view layout (rear + sides)

4. **Polish UI**
   - Add icons (download from Font Awesome or similar)
   - Improve typography
   - Add status indicators (WiFi, battery, time)

**Resources**:
- Qt Quick Controls Gallery: Run `qml6 /usr/lib/qt6/examples/quickcontrols/gallery/gallery.qml`
- Qt Documentation: https://doc.qt.io/qt-6/qtquick-index.html
- Tesla UI inspiration: Google Image Search "Tesla Model 3 screen"

---

## Sunday Morning (2-3 hours): Integration

### 9:00 AM - Add JARVIS Integration (1 hour)

Since you already have a JARVIS project, let's integrate it!

1. **Simple Approach: System Calls**
   ```qml
   // In your QML file
   Button {
       text: "Launch JARVIS"
       onClicked: {
           // Call your existing JARVIS app
           Qt.callLater(function() {
               var process = Qt.createQmlObject('import QtQuick 2.15; import Qt.labs.platform 1.1; Process {}', parent);
               process.start("python3", ["/path/to/jarvis_app.py"]);
           });
       }
   }
   ```

2. **Better Approach: Embed as QML Component**
   - Convert JARVIS functionality to Qt Quick Controls
   - Create JARVIS page in your stack view
   - Share system monitoring code

### 10:00 AM - Add Simulated Camera Feed (1 hour)

1. **Use Webcam for Testing**
   ```bash
   # Test webcam
   v4l2-ctl --list-devices
   ```

2. **Add Video Output to QML**
   ```qml
   import QtMultimedia
   
   VideoOutput {
       id: cameraView
       anchors.fill: parent
       
       MediaPlayer {
           id: camera
           source: "camera:///dev/video0"
           autoPlay: true
       }
   }
   ```

3. **Test Camera Switching**
   - Use keyboard shortcuts to simulate gear shifts
   - Auto-switch to "rear" view (webcam feed)

### 11:00 AM - Auto-Start & Kiosk Mode (1 hour)

1. **Create Launch Script**
   ```bash
   cd ~/tesla-infotainment
   nano launch.sh
   ```
   
   ```bash
   #!/bin/bash
   cd ~/tesla-infotainment/build
   ./tesla-infotainment --fullscreen
   ```
   
   ```bash
   chmod +x launch.sh
   ```

2. **Auto-Start on Boot**
   ```bash
   mkdir -p ~/.config/autostart
   nano ~/.config/autostart/tesla.desktop
   ```
   
   ```ini
   [Desktop Entry]
   Type=Application
   Name=Tesla Infotainment
   Exec=/home/pi/tesla-infotainment/launch.sh
   X-GNOME-Autostart-enabled=true
   ```

3. **Test Auto-Start**
   ```bash
   sudo reboot
   ```
   
   - Pi should boot directly to your Tesla UI!

---

## Sunday Afternoon (1-2 hours): Demo & Documentation

### 12:00 PM - Polish for Demo (1 hour)

1. **Fix Any Bugs**
   - Smooth out transitions
   - Fix touch target sizes (make buttons bigger)
   - Add loading indicators

2. **Create Demo Data**
   - Populate fake trip data
   - Add music playlist entries
   - Create realistic gauges

3. **Record Demo Video**
   - Use OBS Studio or phone camera
   - Show off UI navigation
   - Demo touch responsiveness
   - Share with friends!

### 1:00 PM - Plan Next Steps (30 mins)

1. **Document What You Built**
   ```bash
   cd ~/tesla-infotainment
   nano PROGRESS.md
   ```
   
   Write down:
   - What works
   - What doesn't yet
   - Next weekend's goals
   - Parts to order

2. **Create Issue List**
   - [ ] Improve UI animations
   - [ ] Add real GPS/maps
   - [ ] Integrate real cameras
   - [ ] OBD-II data integration
   - [ ] Power management for car

---

## 2:00 PM - You're Done! 🎉

By now you should have:
- ✅ Working Tesla-style UI on Pi
- ✅ Touch screen interface
- ✅ Multiple screens/tabs
- ✅ Auto-boot to your app
- ✅ Proof of concept complete!

**Next Weekend**: Install in car!

---

## Troubleshooting

### Qt6 Won't Compile
```bash
# Make sure Qt6 is properly installed
sudo apt install qt6-base-dev qt6-declarative-dev

# Check Qt version
qmake6 --version
```

### Touchscreen Not Working
```bash
# Check if detected
ls /dev/input/
# Should see event0, event1, etc.

# Test touch input
sudo apt install evtest
sudo evtest /dev/input/event0
# Tap screen and watch for events
```

### Display Resolution Wrong
```bash
# Edit boot config
sudo nano /boot/firmware/config.txt

# Add these lines:
hdmi_force_hotplug=1
hdmi_group=2
hdmi_mode=87
hdmi_cvt=1024 600 60 6 0 0 0  # Adjust to your screen resolution
```

### Black Screen on Boot
```bash
# Boot to console instead of desktop
sudo raspi-config
# System Options → Boot / Auto Login → Console
```

---

## Monday: Show Off Your Work!

- Post demo video on r/raspberry_pi
- Share with friends
- Post on VX244 Insignia forums
- Update your GitHub with code
- Plan car installation for next weekend

---

**Time Tracking**:
- Saturday: 7-9 hours (hardware + basic UI)
- Sunday: 4-5 hours (integration + polish)
- **Total: 11-14 hours** (but you'll be having fun!)

**You've got this!** 💪

As a CS grad with Pi experience, this should be very achievable. The key is to start simple and iterate. Don't aim for perfection on day 1!
