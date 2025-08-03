#!/bin/bash

echo "Setting up JARVIS on Raspberry Pi..."

# Get the GitHub repository URL from user
read -p "Enter your GitHub repository URL: " REPO_URL

# Navigate to home directory
cd ~

# Remove existing JARVIS folder if it exists
if [ -d "JARVIS" ]; then
    echo "Removing existing JARVIS folder..."
    rm -rf JARVIS
fi

# Clone the repository
echo "Cloning JARVIS repository..."
git clone $REPO_URL JARVIS

# Navigate to JARVIS folder
cd JARVIS

# Make scripts executable
chmod +x install.sh
chmod +x setup_autostart.sh

# Run installation
echo "Installing JARVIS..."
./install.sh

# Ask if user wants auto-startup
read -p "Do you want JARVIS to start automatically on login? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Setting up auto-startup..."
    ./setup_autostart.sh
fi

echo "JARVIS setup complete!"
echo "You can now run JARVIS with: python3 jarvis_app.py"
echo "Or find it in your applications menu." 