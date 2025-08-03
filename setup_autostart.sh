#!/bin/bash

echo "Setting up JARVIS auto-startup..."

# Get the current directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# Create autostart directory if it doesn't exist
mkdir -p ~/.config/autostart

# Create desktop entry for autostart
cat > ~/.config/autostart/jarvis.desktop << EOF
[Desktop Entry]
Version=1.0
Type=Application
Name=JARVIS
Comment=Personal AI Assistant
Exec=python3 $SCRIPT_DIR/jarvis_app.py
Icon=$SCRIPT_DIR/jarvis_icon.png
Terminal=false
Categories=Utility;System;
Keywords=AI;Assistant;JARVIS;
StartupNotify=true
X-GNOME-Autostart-enabled=true
EOF

echo "JARVIS will now start automatically when you log in."
echo "To disable auto-startup, delete the file: ~/.config/autostart/jarvis.desktop" 