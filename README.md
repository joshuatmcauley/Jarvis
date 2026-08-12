# JARVIS - Personal AI Assistant (Skeleton)

A simple desktop application for Raspberry Pi that serves as the foundation for your JARVIS AI assistant.

## Hardware Requirements
- Raspberry Pi 5
- Elecrow 7-inch display (optional)
- Pi Camera module 3 (for future features)
- Arduino ESP32 (for RF remote control)
- 433MHz RF modules (for smart plug control)

## Features (Current)
- 🖥️ Desktop application with GUI
- 📊 System monitoring (CPU, Memory, Disk)
- ⚡ RF remote control for smart plugs
- ⏰ Real-time clock display
- 🎨 Dark theme interface
- 🔧 Extensible architecture for future features

## Quick Setup

1. **Clone or download the files to your Raspberry Pi:**
   ```bash
   # If you have git installed
   git clone <your-repo-url>
   cd JARVIS
   
   # Or just copy the files to your Pi
   ```

2. **Make the installation script executable and run it:**
   ```bash
   chmod +x install.sh
   ./install.sh
   ```

3. **Set up auto-startup (optional):**
   ```bash
   chmod +x setup_autostart.sh
   ./setup_autostart.sh
   ```

4. **Run JARVIS:**
   ```bash
   python3 jarvis_app.py
   ```

## What You Get

- **Desktop Icon**: JARVIS will appear in your applications menu and on the desktop
- **Auto-startup**: JARVIS will start automatically when you log in (if you ran the autostart script)
- **System Monitoring**: Click "System Status" to see CPU, memory, and disk usage
- **Time Display**: Real-time clock in the header
- **Extensible**: Easy to add new features

## File Structure
```
JARVIS/
├── jarvis_app.py          # Main application
├── jarvis.desktop         # Desktop entry file
├── install.sh             # Installation script
├── setup_autostart.sh     # Auto-startup setup
├── requirements.txt       # Python dependencies
└── README.md             # This file
```

## RF Remote Control Setup

JARVIS now supports controlling RF remote control plugs (like Energizer plugs from B&M Bargains)!

### Quick Setup:

1. **Get the hardware:**
   - ESP32 or Arduino board (~£5-10)
   - 433MHz RF transmitter/receiver modules (~£5-10)
   - See `equipment.txt` for full list

2. **Capture RF codes:**
   - Follow instructions in `RF_SETUP_GUIDE.md`
   - Sniff codes from your existing remote

3. **Upload controller:**
   - Configure `energizer_rf_controller.ino`
   - Upload to ESP32

4. **Control your plugs:**
   - Via JARVIS app (click "RF Plug Control")
   - Via phone browser (ESP32 web interface)
   - Via Python scripts

📖 **Full instructions:** See `QUICK_START_RF.md` for step-by-step guide

## Future Features (Coming Soon)
- 🎤 Voice recognition and speech synthesis
- 📷 Camera integration
- 🌐 Weather information
- 📰 News updates
- 🎵 Music control
- ⏱️ Scheduled plug control
- 🤖 Smart automation rules

## Troubleshooting

**If JARVIS doesn't start:**
```bash
# Check if tkinter is installed
python3 -c "import tkinter; print('tkinter is available')"

# Install if missing
sudo apt-get install python3-tk
```

**If you want to remove auto-startup:**
```bash
rm ~/.config/autostart/jarvis.desktop
```

**To run from terminal for debugging:**
```bash
python3 jarvis_app.py
```

## Customization

You can easily modify `jarvis_app.py` to:
- Change colors and themes
- Add new buttons and features
- Modify the interface layout
- Add your own functionality

This is a simple starting point that you can build upon! 