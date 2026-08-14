#!/usr/bin/env python3
"""
JARVIS ESP32 RF Smart Plug Integration
========================================

This module allows the JARVIS Raspberry Pi assistant to control
ESP32-powered smart plugs via HTTP requests.

Requirements:
    - ESP32 running rf_web_control.ino
    - ESP32 and Raspberry Pi on same network
    - Python 3.6+
    - requests library: pip install requests

Usage:
    from jarvis_integration import SmartPlugController
    
    controller = SmartPlugController("192.168.1.100")
    controller.turn_on(1)
    controller.turn_off(1)
    status = controller.get_status()
"""

import requests
import time
from typing import Dict, List, Optional


class SmartPlugController:
    """Control ESP32 RF smart plugs via HTTP API."""
    
    def __init__(self, esp32_ip: str, timeout: int = 5):
        """
        Initialize the smart plug controller.
        
        Args:
            esp32_ip: IP address of the ESP32 (e.g., "192.168.1.100")
            timeout: HTTP request timeout in seconds (default: 5)
        """
        self.base_url = f"http://{esp32_ip}"
        self.timeout = timeout
        self.available_plugs = [1, 2, 3, 4]
    
    def _make_request(self, endpoint: str) -> Optional[Dict]:
        """
        Make HTTP request to ESP32.
        
        Args:
            endpoint: API endpoint (e.g., "/plug1/on")
        
        Returns:
            JSON response dict or None if request failed
        """
        try:
            url = f"{self.base_url}{endpoint}"
            response = requests.get(url, timeout=self.timeout)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Error communicating with ESP32: {e}")
            return None
    
    def turn_on(self, plug_number: int) -> bool:
        """
        Turn on a specific plug.
        
        Args:
            plug_number: Plug number (1-4)
        
        Returns:
            True if successful, False otherwise
        """
        if plug_number not in self.available_plugs:
            print(f"Invalid plug number: {plug_number}")
            return False
        
        result = self._make_request(f"/plug{plug_number}/on")
        if result and result.get("success"):
            print(f"✓ Plug {plug_number} turned ON")
            return True
        else:
            print(f"✗ Failed to turn on plug {plug_number}")
            return False
    
    def turn_off(self, plug_number: int) -> bool:
        """
        Turn off a specific plug.
        
        Args:
            plug_number: Plug number (1-4)
        
        Returns:
            True if successful, False otherwise
        """
        if plug_number not in self.available_plugs:
            print(f"Invalid plug number: {plug_number}")
            return False
        
        result = self._make_request(f"/plug{plug_number}/off")
        if result and result.get("success"):
            print(f"✓ Plug {plug_number} turned OFF")
            return True
        else:
            print(f"✗ Failed to turn off plug {plug_number}")
            return False
    
    def toggle(self, plug_number: int) -> bool:
        """
        Toggle a plug's state (ON → OFF or OFF → ON).
        
        Args:
            plug_number: Plug number (1-4)
        
        Returns:
            True if successful, False otherwise
        """
        status = self.get_status()
        if not status:
            return False
        
        current_state = status.get(f"plug{plug_number}")
        if current_state:
            return self.turn_off(plug_number)
        else:
            return self.turn_on(plug_number)
    
    def all_on(self) -> bool:
        """
        Turn on all plugs.
        
        Returns:
            True if successful, False otherwise
        """
        result = self._make_request("/all/on")
        if result and result.get("success"):
            print("✓ All plugs turned ON")
            return True
        else:
            print("✗ Failed to turn on all plugs")
            return False
    
    def all_off(self) -> bool:
        """
        Turn off all plugs.
        
        Returns:
            True if successful, False otherwise
        """
        result = self._make_request("/all/off")
        if result and result.get("success"):
            print("✓ All plugs turned OFF")
            return True
        else:
            print("✗ Failed to turn off all plugs")
            return False
    
    def get_status(self) -> Optional[Dict]:
        """
        Get status of all plugs and system info.
        
        Returns:
            Dict with plug states and system info, or None if failed
            Example: {
                "plug1": true,
                "plug2": false,
                "plug3": true,
                "plug4": false,
                "wifi_rssi": -45,
                "ip": "192.168.1.100"
            }
        """
        return self._make_request("/status")
    
    def is_online(self) -> bool:
        """
        Check if ESP32 is reachable.
        
        Returns:
            True if online, False otherwise
        """
        result = self.get_status()
        return result is not None
    
    def wait_for_ready(self, max_wait: int = 30) -> bool:
        """
        Wait for ESP32 to become ready.
        
        Args:
            max_wait: Maximum time to wait in seconds
        
        Returns:
            True if ESP32 became ready, False if timeout
        """
        print(f"Waiting for ESP32 to be ready (max {max_wait}s)...")
        start_time = time.time()
        
        while time.time() - start_time < max_wait:
            if self.is_online():
                print("✓ ESP32 is ready!")
                return True
            time.sleep(1)
        
        print("✗ ESP32 did not become ready")
        return False
    
    def get_plug_names(self) -> Dict[int, str]:
        """
        Get custom names for plugs.
        Override this method or create a config file for custom names.
        
        Returns:
            Dict mapping plug numbers to names
        """
        return {
            1: "Lamp",
            2: "Fan",
            3: "Heater",
            4: "TV"
        }
    
    def control_by_name(self, name: str, state: str) -> bool:
        """
        Control plug by device name.
        
        Args:
            name: Device name (e.g., "Lamp")
            state: "on" or "off"
        
        Returns:
            True if successful, False otherwise
        """
        names = self.get_plug_names()
        plug_number = None
        
        for num, device_name in names.items():
            if device_name.lower() == name.lower():
                plug_number = num
                break
        
        if plug_number is None:
            print(f"Unknown device: {name}")
            return False
        
        if state.lower() == "on":
            return self.turn_on(plug_number)
        elif state.lower() == "off":
            return self.turn_off(plug_number)
        else:
            print(f"Invalid state: {state}")
            return False
    
    def schedule_on(self, plug_number: int, delay_seconds: int) -> None:
        """
        Schedule plug to turn on after delay (blocking).
        
        Args:
            plug_number: Plug number (1-4)
            delay_seconds: Delay in seconds
        """
        print(f"Scheduling plug {plug_number} to turn on in {delay_seconds}s")
        time.sleep(delay_seconds)
        self.turn_on(plug_number)
    
    def schedule_off(self, plug_number: int, delay_seconds: int) -> None:
        """
        Schedule plug to turn off after delay (blocking).
        
        Args:
            plug_number: Plug number (1-4)
            delay_seconds: Delay in seconds
        """
        print(f"Scheduling plug {plug_number} to turn off in {delay_seconds}s")
        time.sleep(delay_seconds)
        self.turn_off(plug_number)


class SmartPlugScene:
    """
    Manage scenes (groups of plug states).
    
    Example:
        scene = SmartPlugScene(controller)
        scene.create("Movie Time", {1: False, 2: True, 3: False, 4: True})
        scene.activate("Movie Time")
    """
    
    def __init__(self, controller: SmartPlugController):
        """
        Initialize scene manager.
        
        Args:
            controller: SmartPlugController instance
        """
        self.controller = controller
        self.scenes: Dict[str, Dict[int, bool]] = {}
    
    def create(self, name: str, plug_states: Dict[int, bool]) -> None:
        """
        Create a new scene.
        
        Args:
            name: Scene name
            plug_states: Dict mapping plug numbers to desired states
                        Example: {1: True, 2: False, 3: True, 4: False}
        """
        self.scenes[name] = plug_states
        print(f"✓ Scene '{name}' created")
    
    def activate(self, name: str) -> bool:
        """
        Activate a scene.
        
        Args:
            name: Scene name
        
        Returns:
            True if successful, False otherwise
        """
        if name not in self.scenes:
            print(f"Unknown scene: {name}")
            return False
        
        print(f"Activating scene: {name}")
        states = self.scenes[name]
        
        for plug_number, state in states.items():
            if state:
                self.controller.turn_on(plug_number)
            else:
                self.controller.turn_off(plug_number)
            time.sleep(0.1)  # Small delay between commands
        
        print(f"✓ Scene '{name}' activated")
        return True
    
    def list_scenes(self) -> List[str]:
        """
        List all available scenes.
        
        Returns:
            List of scene names
        """
        return list(self.scenes.keys())


# Example scenes
def create_default_scenes(controller: SmartPlugController) -> SmartPlugScene:
    """
    Create default scenes for common use cases.
    
    Args:
        controller: SmartPlugController instance
    
    Returns:
        SmartPlugScene with default scenes
    """
    scene_manager = SmartPlugScene(controller)
    
    # All Off
    scene_manager.create("All Off", {1: False, 2: False, 3: False, 4: False})
    
    # All On
    scene_manager.create("All On", {1: True, 2: True, 3: True, 4: True})
    
    # Movie Time (example: dim lights, turn on TV)
    scene_manager.create("Movie Time", {1: False, 2: False, 3: False, 4: True})
    
    # Work Mode (example: lights on, electronics on)
    scene_manager.create("Work Mode", {1: True, 2: False, 3: False, 4: True})
    
    # Sleep Mode (example: everything off except nightlight)
    scene_manager.create("Sleep Mode", {1: True, 2: False, 3: False, 4: False})
    
    return scene_manager


# =============================================================================
# Example Usage Functions
# =============================================================================

def example_basic_control():
    """Example: Basic plug control."""
    # Initialize controller with ESP32 IP address
    controller = SmartPlugController("192.168.1.100")
    
    # Check if ESP32 is online
    if not controller.is_online():
        print("ESP32 is not reachable!")
        return
    
    # Control individual plugs
    controller.turn_on(1)
    time.sleep(2)
    controller.turn_off(1)
    
    # Control all plugs
    controller.all_on()
    time.sleep(2)
    controller.all_off()


def example_status_check():
    """Example: Check status of all plugs."""
    controller = SmartPlugController("192.168.1.100")
    
    status = controller.get_status()
    if status:
        print("Current Status:")
        print(f"  Plug 1: {'ON' if status['plug1'] else 'OFF'}")
        print(f"  Plug 2: {'ON' if status['plug2'] else 'OFF'}")
        print(f"  Plug 3: {'ON' if status['plug3'] else 'OFF'}")
        print(f"  Plug 4: {'ON' if status['plug4'] else 'OFF'}")
        print(f"  WiFi Signal: {status['wifi_rssi']} dBm")
        print(f"  IP Address: {status['ip']}")


def example_named_control():
    """Example: Control plugs by device name."""
    controller = SmartPlugController("192.168.1.100")
    
    # Control by name
    controller.control_by_name("Lamp", "on")
    time.sleep(2)
    controller.control_by_name("Lamp", "off")


def example_scenes():
    """Example: Use scenes for grouped control."""
    controller = SmartPlugController("192.168.1.100")
    scene_manager = create_default_scenes(controller)
    
    # List available scenes
    print("Available scenes:", scene_manager.list_scenes())
    
    # Activate scenes
    scene_manager.activate("Work Mode")
    time.sleep(5)
    scene_manager.activate("All Off")


def example_scheduled_control():
    """Example: Schedule plug control."""
    controller = SmartPlugController("192.168.1.100")
    
    # Turn on after 10 seconds
    print("Plug 1 will turn on in 10 seconds...")
    controller.schedule_on(1, 10)
    
    # Turn off after another 10 seconds
    print("Plug 1 will turn off in 10 seconds...")
    controller.schedule_off(1, 10)


# =============================================================================
# Main CLI Interface
# =============================================================================

def main():
    """Main CLI interface for testing."""
    import sys
    
    if len(sys.argv) < 2:
        print("Usage:")
        print("  python jarvis_integration.py <ESP32_IP> <command> [args]")
        print("\nCommands:")
        print("  on <plug>      - Turn on plug (1-4)")
        print("  off <plug>     - Turn off plug (1-4)")
        print("  toggle <plug>  - Toggle plug state")
        print("  allon          - Turn all plugs on")
        print("  alloff         - Turn all plugs off")
        print("  status         - Show status")
        print("  test           - Run test sequence")
        print("\nExample:")
        print("  python jarvis_integration.py 192.168.1.100 on 1")
        return
    
    esp32_ip = sys.argv[1]
    controller = SmartPlugController(esp32_ip)
    
    if not controller.is_online():
        print(f"Error: Cannot reach ESP32 at {esp32_ip}")
        print("Make sure:")
        print("  1. ESP32 is powered on")
        print("  2. ESP32 is connected to WiFi")
        print("  3. IP address is correct")
        print("  4. Both devices are on same network")
        return
    
    command = sys.argv[2].lower() if len(sys.argv) > 2 else "status"
    
    if command == "on" and len(sys.argv) > 3:
        plug = int(sys.argv[3])
        controller.turn_on(plug)
    
    elif command == "off" and len(sys.argv) > 3:
        plug = int(sys.argv[3])
        controller.turn_off(plug)
    
    elif command == "toggle" and len(sys.argv) > 3:
        plug = int(sys.argv[3])
        controller.toggle(plug)
    
    elif command == "allon":
        controller.all_on()
    
    elif command == "alloff":
        controller.all_off()
    
    elif command == "status":
        example_status_check()
    
    elif command == "test":
        print("Running test sequence...")
        for i in range(1, 5):
            print(f"\nTesting plug {i}...")
            controller.turn_on(i)
            time.sleep(1)
            controller.turn_off(i)
            time.sleep(1)
        print("\n✓ Test complete!")
    
    else:
        print(f"Unknown command: {command}")


if __name__ == "__main__":
    main()


"""
Integration with JARVIS GUI (jarvis_app.py)
============================================

Add this to your jarvis_app.py:

from jarvis_integration import SmartPlugController

class JarvisApp:
    def __init__(self):
        # ... existing code ...
        
        # Add smart plug controller
        self.smart_plugs = SmartPlugController("192.168.1.100")
        
        # Add buttons for plug control
        self.add_smart_plug_controls()
    
    def add_smart_plug_controls(self):
        # Create frame for smart plugs
        plug_frame = tk.Frame(self.main_frame, bg="#1e1e1e")
        plug_frame.pack(pady=10, fill="x")
        
        tk.Label(plug_frame, text="Smart Plugs", 
                font=("Arial", 16, "bold"), 
                bg="#1e1e1e", fg="#00ff00").pack()
        
        # Add buttons for each plug
        for i in range(1, 5):
            btn_frame = tk.Frame(plug_frame, bg="#1e1e1e")
            btn_frame.pack(pady=5)
            
            tk.Button(btn_frame, text=f"Plug {i} ON", 
                     command=lambda x=i: self.smart_plugs.turn_on(x),
                     bg="#28a745", fg="white").pack(side="left", padx=5)
            
            tk.Button(btn_frame, text=f"Plug {i} OFF",
                     command=lambda x=i: self.smart_plugs.turn_off(x),
                     bg="#dc3545", fg="white").pack(side="left", padx=5)
"""
