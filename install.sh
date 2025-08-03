#!/bin/bash

echo "Installing JARVIS on Raspberry Pi..."

# Get the current directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# Make the app executable
chmod +x "$SCRIPT_DIR/jarvis_app.py"

# Install required packages
echo "Installing required packages..."
sudo apt-get update
sudo apt-get install -y python3-tk python3-pip

# Install Python dependencies
echo "Installing Python dependencies..."
pip3 install psutil

# Create desktop entry
echo "Creating desktop entry..."
cp "$SCRIPT_DIR/jarvis.desktop" ~/Desktop/
chmod +x ~/Desktop/jarvis.desktop

# Copy to applications directory
sudo cp "$SCRIPT_DIR/jarvis.desktop" /usr/share/applications/

# Update desktop database
sudo update-desktop-database

echo "JARVIS installation complete!"
echo "You can now find JARVIS in your applications menu and on the desktop."
echo "To run JARVIS, double-click the desktop icon or run: python3 jarvis_app.py" 