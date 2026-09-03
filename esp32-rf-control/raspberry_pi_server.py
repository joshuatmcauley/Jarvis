#!/usr/bin/env python3
"""
Simple HTTP Server for Raspberry Pi
Control ANYTHING from your TX118SA remote!

This creates a web server that your ESP32 can call when you press buttons.
You can control LEDs, servos, relays, or anything else connected to your Pi.

Usage:
    python3 raspberry_pi_server.py

Then update the ESP32 sketch with your Pi's IP address.
"""

from flask import Flask, jsonify, request
import subprocess
import os

app = Flask(__name__)

# ============================================
# Button Actions - Customize These!
# ============================================

@app.route('/button1')
def button1():
    """Button 1 - Example: Run a command"""
    print("🔴 Button 1 pressed!")
    
    # Example: Turn on/off GPIO pin if you have something connected
    # os.system("gpio write 17 1")
    
    # Example: Play a sound
    # os.system("aplay /home/pi/sounds/beep.wav")
    
    # Example: Show notification on Pi display
    # os.system("notify-send 'Button 1' 'Button 1 was pressed!'")
    
    return jsonify({"status": "success", "button": 1, "action": "executed"})


@app.route('/button2')
def button2():
    """Button 2 - Example: Toggle something"""
    print("🟢 Button 2 pressed!")
    
    # Example: Toggle a file flag
    flag_file = "/tmp/button2_state"
    if os.path.exists(flag_file):
        os.remove(flag_file)
        state = "OFF"
    else:
        open(flag_file, 'w').close()
        state = "ON"
    
    return jsonify({"status": "success", "button": 2, "state": state})


@app.route('/button3')
def button3():
    """Button 3 - Example: Run a script"""
    print("🔵 Button 3 pressed!")
    
    # Example: Run your JARVIS actions
    # result = subprocess.run(['python3', '/home/pi/jarvis_action.py'], 
    #                        capture_output=True, text=True)
    
    return jsonify({"status": "success", "button": 3, "action": "script_executed"})


@app.route('/button4')
def button4():
    """Button 4 - Example: Emergency stop or reset"""
    print("🟡 Button 4 pressed!")
    
    # Example: Kill all your automation scripts
    # os.system("pkill -f automation.py")
    
    # Example: Turn everything off
    # for pin in [17, 18, 27, 22]:
    #     os.system(f"gpio write {pin} 0")
    
    return jsonify({"status": "success", "button": 4, "action": "all_off"})


# ============================================
# Advanced Examples
# ============================================

@app.route('/toggle_lights')
def toggle_lights():
    """Toggle lights or any GPIO device"""
    # Your light control code here
    return jsonify({"status": "success", "lights": "toggled"})


@app.route('/scene/<name>')
def activate_scene(name):
    """Activate a scene (movie_mode, work_mode, etc.)"""
    print(f"🎬 Activating scene: {name}")
    
    scenes = {
        "movie_mode": lambda: print("Movie mode: Dim lights, turn on TV"),
        "work_mode": lambda: print("Work mode: Bright lights, music off"),
        "sleep_mode": lambda: print("Sleep mode: All off, nightlight on"),
    }
    
    if name in scenes:
        scenes[name]()
        return jsonify({"status": "success", "scene": name})
    else:
        return jsonify({"status": "error", "message": "Unknown scene"}), 404


@app.route('/jarvis_command')
def jarvis_command():
    """Execute JARVIS command"""
    action = request.args.get('action', 'status')
    print(f"🤖 JARVIS command: {action}")
    
    # Add your JARVIS integration here
    
    return jsonify({"status": "success", "jarvis_action": action})


@app.route('/all_off')
def all_off():
    """Emergency all off"""
    print("🛑 ALL OFF triggered!")
    
    # Turn off everything
    # Add your shutdown code here
    
    return jsonify({"status": "success", "action": "all_off"})


# ============================================
# Status and Info
# ============================================

@app.route('/')
def index():
    """Homepage - shows available endpoints"""
    return """
    <html>
    <head>
        <title>ESP32 Remote Control Server</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                max-width: 800px;
                margin: 50px auto;
                padding: 20px;
                background: #1e1e1e;
                color: #00ff00;
            }
            h1 { color: #00ff00; }
            .endpoint {
                background: #2e2e2e;
                padding: 10px;
                margin: 10px 0;
                border-left: 3px solid #00ff00;
            }
            .button { color: #00aaff; }
        </style>
    </head>
    <body>
        <h1>🎮 ESP32 Remote Control Server</h1>
        <p>Server is running! Use these endpoints from your ESP32:</p>
        
        <div class="endpoint">
            <span class="button">Button 1:</span> 
            <code>/button1</code>
        </div>
        
        <div class="endpoint">
            <span class="button">Button 2:</span>
            <code>/button2</code>
        </div>
        
        <div class="endpoint">
            <span class="button">Button 3:</span>
            <code>/button3</code>
        </div>
        
        <div class="endpoint">
            <span class="button">Button 4:</span>
            <code>/button4</code>
        </div>
        
        <h2>Advanced Endpoints:</h2>
        
        <div class="endpoint">
            <code>/toggle_lights</code> - Toggle lights
        </div>
        
        <div class="endpoint">
            <code>/scene/movie_mode</code> - Activate scenes
        </div>
        
        <div class="endpoint">
            <code>/jarvis_command?action=status</code> - JARVIS commands
        </div>
        
        <div class="endpoint">
            <code>/all_off</code> - Emergency off
        </div>
        
        <hr>
        <p>Configure your ESP32 with this server's IP address.</p>
        <p><strong>Example:</strong> <code>http://""" + request.host + """/button1</code></p>
    </body>
    </html>
    """


@app.route('/status')
def status():
    """Server status"""
    import socket
    hostname = socket.gethostname()
    ip = socket.gethostbyname(hostname)
    
    return jsonify({
        "status": "online",
        "hostname": hostname,
        "ip": ip,
        "endpoints": [
            "/button1", "/button2", "/button3", "/button4",
            "/toggle_lights", "/scene/<name>", "/jarvis_command", "/all_off"
        ]
    })


# ============================================
# Main
# ============================================

if __name__ == '__main__':
    print("\n" + "="*50)
    print("🎮 ESP32 Remote Control Server")
    print("="*50)
    print("\n✓ Server starting...")
    print("✓ Press Ctrl+C to stop\n")
    print("Configure your ESP32 with:")
    
    import socket
    hostname = socket.gethostname()
    try:
        ip = socket.gethostbyname(hostname)
        print(f"  http://{ip}:5000/button1")
        print(f"  http://{ip}:5000/button2")
        print(f"  http://{ip}:5000/button3")
        print(f"  http://{ip}:5000/button4")
    except:
        print("  http://YOUR_PI_IP:5000/button1")
    
    print("\n" + "="*50 + "\n")
    
    # Run server
    app.run(host='0.0.0.0', port=5000, debug=True)


"""
============================================
QUICK SETUP
============================================

1. Install Flask on Raspberry Pi:
   pip3 install flask

2. Run this server:
   python3 raspberry_pi_server.py

3. Note the IP address shown (e.g., 192.168.1.50)

4. Update ACTUAL_USEFUL_PROJECT.ino with your Pi's IP:
   const char* button1_url = "http://192.168.1.50:5000/button1";

5. Upload to ESP32 and press buttons!

============================================
MAKE IT AUTO-START
============================================

Create /etc/systemd/system/remote-server.service:

[Unit]
Description=ESP32 Remote Control Server
After=network.target

[Service]
ExecStart=/usr/bin/python3 /home/pi/raspberry_pi_server.py
WorkingDirectory=/home/pi
StandardOutput=inherit
StandardError=inherit
Restart=always
User=pi

[Install]
WantedBy=multi-user.target

Then:
sudo systemctl daemon-reload
sudo systemctl enable remote-server
sudo systemctl start remote-server

============================================
CONTROL IDEAS
============================================

1. GPIO Control:
   - Turn on/off lights connected to GPIO pins
   - Control servos, motors, relays
   - Read sensors and respond

2. System Control:
   - Run shell scripts
   - Play sounds/music
   - Display notifications
   - Control media players

3. Home Automation:
   - Trigger Home Assistant scenes
   - Control other WiFi devices
   - Send IFTTT webhooks
   - Control smart bulbs via API

4. JARVIS Integration:
   - Trigger JARVIS commands
   - Change JARVIS modes
   - Query system status
   - Emergency actions

5. Custom Actions:
   - Whatever Python can do!
   - Web scraping
   - API calls
   - Database updates
   - File operations

============================================
"""
