#!/usr/bin/env python3
"""
Example Script: Control RF Plugs Programmatically
Demonstrates how to control Energizer RF plugs from Python scripts
"""

import serial
import time
import sys

class RFPlugController:
    """Simple controller for RF plugs via ESP32/Arduino"""
    
    def __init__(self, port='/dev/ttyUSB0', baudrate=115200):
        """
        Initialize connection to RF controller
        
        Args:
            port: Serial port (usually /dev/ttyUSB0 or /dev/ttyACM0)
            baudrate: Communication speed (default 115200)
        """
        try:
            self.ser = serial.Serial(port, baudrate, timeout=1)
            time.sleep(2)  # Wait for connection to stabilize
            print(f"✓ Connected to RF controller on {port}")
        except Exception as e:
            print(f"✗ Error connecting to {port}: {e}")
            sys.exit(1)
    
    def send_command(self, command):
        """Send a command and get response"""
        try:
            self.ser.write(f"{command}\n".encode())
            time.sleep(0.1)
            response = self.ser.readline().decode().strip()
            return response
        except Exception as e:
            print(f"✗ Error sending command: {e}")
            return None
    
    def turn_on(self, plug_number):
        """Turn on a specific plug (1 or 2)"""
        print(f"Turning ON Plug {plug_number}...")
        response = self.send_command(f"PLUG{plug_number}_ON")
        if response:
            print(f"✓ Response: {response}")
        return response
    
    def turn_off(self, plug_number):
        """Turn off a specific plug (1 or 2)"""
        print(f"Turning OFF Plug {plug_number}...")
        response = self.send_command(f"PLUG{plug_number}_OFF")
        if response:
            print(f"✓ Response: {response}")
        return response
    
    def check_status(self):
        """Check if controller is responding"""
        response = self.send_command("STATUS")
        return response == "OK"
    
    def close(self):
        """Close serial connection"""
        if self.ser:
            self.ser.close()
            print("✓ Connection closed")


def example_basic_control():
    """Example: Basic on/off control"""
    print("\n=== Example 1: Basic Control ===\n")
    
    controller = RFPlugController()
    
    # Turn on plug 1
    controller.turn_on(1)
    time.sleep(2)
    
    # Turn off plug 1
    controller.turn_off(1)
    
    controller.close()


def example_timed_control():
    """Example: Turn on for a specific duration"""
    print("\n=== Example 2: Timed Control ===\n")
    
    controller = RFPlugController()
    
    # Turn on plug 2 for 10 seconds
    print("Plug 2 will be ON for 10 seconds...")
    controller.turn_on(2)
    time.sleep(10)
    controller.turn_off(2)
    
    controller.close()


def example_sequence():
    """Example: Control multiple plugs in sequence"""
    print("\n=== Example 3: Sequence Control ===\n")
    
    controller = RFPlugController()
    
    # Turn on both plugs with a delay
    controller.turn_on(1)
    time.sleep(1)
    controller.turn_on(2)
    
    print("Both plugs ON - waiting 5 seconds...")
    time.sleep(5)
    
    # Turn off both plugs
    controller.turn_off(1)
    time.sleep(1)
    controller.turn_off(2)
    
    controller.close()


def example_schedule_simulation():
    """Example: Simulate a schedule"""
    print("\n=== Example 4: Schedule Simulation ===\n")
    
    controller = RFPlugController()
    
    schedule = [
        (1, True, 2),   # Plug 1 ON for 2 seconds
        (2, True, 2),   # Plug 2 ON for 2 seconds
        (1, False, 1),  # Plug 1 OFF, wait 1 second
        (2, False, 1),  # Plug 2 OFF, wait 1 second
    ]
    
    print("Running schedule...")
    for plug, state, wait in schedule:
        if state:
            controller.turn_on(plug)
        else:
            controller.turn_off(plug)
        time.sleep(wait)
    
    print("Schedule complete!")
    controller.close()


def example_coffee_maker():
    """Example: Coffee maker automation"""
    print("\n=== Example 5: Coffee Maker Automation ===\n")
    
    controller = RFPlugController()
    
    print("☕ Coffee maker automation starting...")
    print("Turning on coffee maker (Plug 1)...")
    controller.turn_on(1)
    
    # Simulate brewing time (5 minutes in this example)
    brew_time = 300  # 5 minutes
    print(f"Coffee brewing for {brew_time} seconds...")
    print("(In real use, adjust time based on your coffee maker)")
    
    # For demo, use shorter time
    time.sleep(10)
    
    print("Turning off coffee maker...")
    controller.turn_off(1)
    print("☕ Coffee ready! Enjoy!")
    
    controller.close()


def example_interactive():
    """Example: Interactive control"""
    print("\n=== Example 6: Interactive Control ===\n")
    
    controller = RFPlugController()
    
    while True:
        print("\nCommands:")
        print("  1on  - Turn Plug 1 ON")
        print("  1off - Turn Plug 1 OFF")
        print("  2on  - Turn Plug 2 ON")
        print("  2off - Turn Plug 2 OFF")
        print("  quit - Exit")
        
        cmd = input("\nEnter command: ").strip().lower()
        
        if cmd == "quit":
            break
        elif cmd == "1on":
            controller.turn_on(1)
        elif cmd == "1off":
            controller.turn_off(1)
        elif cmd == "2on":
            controller.turn_on(2)
        elif cmd == "2off":
            controller.turn_off(2)
        else:
            print("Unknown command")
    
    controller.close()


def main():
    """Main menu"""
    print("=" * 50)
    print("RF Plug Control Examples")
    print("=" * 50)
    print("\nSelect an example:")
    print("1. Basic Control")
    print("2. Timed Control")
    print("3. Sequence Control")
    print("4. Schedule Simulation")
    print("5. Coffee Maker Automation")
    print("6. Interactive Control")
    print("0. Exit")
    
    choice = input("\nEnter choice (0-6): ").strip()
    
    if choice == "1":
        example_basic_control()
    elif choice == "2":
        example_timed_control()
    elif choice == "3":
        example_sequence()
    elif choice == "4":
        example_schedule_simulation()
    elif choice == "5":
        example_coffee_maker()
    elif choice == "6":
        example_interactive()
    elif choice == "0":
        print("Goodbye!")
    else:
        print("Invalid choice")


if __name__ == "__main__":
    main()
