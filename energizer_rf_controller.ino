/*
 * Energizer RF Remote Control - ESP32/Arduino Controller
 * 
 * This sketch allows you to control Energizer RF remote plugs via:
 * - Serial commands (from Raspberry Pi)
 * - WiFi web server (for phone control)
 * 
 * Hardware Required:
 * - ESP32 or Arduino board
 * - 433MHz RF Transmitter module (e.g., FS1000A, STX882)
 * - Energizer remote control plug 2-pack
 * 
 * Wiring:
 * - RF Transmitter DATA pin -> GPIO 4 (or pin 4 on Arduino)
 * - RF Transmitter VCC -> 5V
 * - RF Transmitter GND -> GND
 * 
 * First, you need to sniff the RF codes from your remote!
 * See instructions in RF_SETUP_GUIDE.md
 */

#ifdef ESP32
  #include <WiFi.h>
  #include <WebServer.h>
  WebServer server(80);
  #define RF_TX_PIN 4
#else
  #define RF_TX_PIN 4
#endif

#include <RCSwitch.h>

// WiFi credentials (change these!)
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// RF Switch object
RCSwitch mySwitch = RCSwitch();

// Store your captured RF codes here (you'll get these by sniffing your remote)
// Example format: 0x123456 (24-bit codes are common)
struct PlugCode {
  unsigned long onCode;
  unsigned long offCode;
  int pulseLength;  // Usually between 180-400
  int protocol;     // Usually 1-5
};

// Plug 1 codes (replace with your actual codes)
PlugCode plug1 = {
  0x000000,  // ON code - REPLACE THIS
  0x000000,  // OFF code - REPLACE THIS
  350,       // Pulse length - adjust after sniffing
  1          // Protocol - adjust after sniffing
};

// Plug 2 codes (replace with your actual codes)
PlugCode plug2 = {
  0x000000,  // ON code - REPLACE THIS
  0x000000,  // OFF code - REPLACE THIS
  350,       // Pulse length
  1          // Protocol
};

void setup() {
  Serial.begin(115200);
  Serial.println("Energizer RF Controller Starting...");
  
  // Initialize RF transmitter
  mySwitch.enableTransmit(RF_TX_PIN);
  
  #ifdef ESP32
    // Connect to WiFi
    Serial.print("Connecting to WiFi");
    WiFi.begin(ssid, password);
    
    int attempts = 0;
    while (WiFi.status() != WL_CONNECTED && attempts < 20) {
      delay(500);
      Serial.print(".");
      attempts++;
    }
    
    if (WiFi.status() == WL_CONNECTED) {
      Serial.println("\nWiFi connected!");
      Serial.print("IP address: ");
      Serial.println(WiFi.localIP());
      Serial.println("Access the control panel from your phone or browser");
      
      // Setup web server routes
      server.on("/", handleRoot);
      server.on("/plug1/on", []() { controlPlug(1, true); });
      server.on("/plug1/off", []() { controlPlug(1, false); });
      server.on("/plug2/on", []() { controlPlug(2, true); });
      server.on("/plug2/off", []() { controlPlug(2, false); });
      server.on("/status", handleStatus);
      
      server.begin();
      Serial.println("Web server started");
    } else {
      Serial.println("\nWiFi connection failed - running in serial mode only");
    }
  #endif
  
  Serial.println("Ready! Commands: PLUG1_ON, PLUG1_OFF, PLUG2_ON, PLUG2_OFF");
}

void loop() {
  #ifdef ESP32
    server.handleClient();
  #endif
  
  // Handle serial commands
  if (Serial.available() > 0) {
    String command = Serial.readStringUntil('\n');
    command.trim();
    handleSerialCommand(command);
  }
}

void handleSerialCommand(String command) {
  command.toUpperCase();
  
  if (command == "PLUG1_ON") {
    controlPlug(1, true);
  } else if (command == "PLUG1_OFF") {
    controlPlug(1, false);
  } else if (command == "PLUG2_ON") {
    controlPlug(2, true);
  } else if (command == "PLUG2_OFF") {
    controlPlug(2, false);
  } else if (command == "STATUS") {
    Serial.println("OK");
  } else {
    Serial.println("ERROR: Unknown command");
    Serial.println("Valid commands: PLUG1_ON, PLUG1_OFF, PLUG2_ON, PLUG2_OFF, STATUS");
  }
}

void controlPlug(int plugNumber, bool turnOn) {
  PlugCode* plug;
  String plugName;
  
  if (plugNumber == 1) {
    plug = &plug1;
    plugName = "Plug 1";
  } else {
    plug = &plug2;
    plugName = "Plug 2";
  }
  
  unsigned long code = turnOn ? plug->onCode : plug->offCode;
  String action = turnOn ? "ON" : "OFF";
  
  // Check if codes have been configured
  if (code == 0x000000) {
    Serial.println("ERROR: RF codes not configured! See RF_SETUP_GUIDE.md");
    #ifdef ESP32
      server.send(500, "text/plain", "ERROR: RF codes not configured");
    #endif
    return;
  }
  
  // Set protocol and pulse length
  mySwitch.setProtocol(plug->protocol);
  mySwitch.setPulseLength(plug->pulseLength);
  
  // Transmit the code (repeat a few times for reliability)
  Serial.print("Sending ");
  Serial.print(action);
  Serial.print(" signal to ");
  Serial.println(plugName);
  
  for (int i = 0; i < 5; i++) {
    mySwitch.send(code, 24);  // 24-bit code (adjust if needed)
    delay(10);
  }
  
  Serial.println("Signal sent successfully");
  
  #ifdef ESP32
    server.send(200, "text/plain", "OK");
  #endif
}

#ifdef ESP32
void handleRoot() {
  String html = R"(
<!DOCTYPE html>
<html>
<head>
    <title>Energizer RF Controller</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 50px auto;
            padding: 20px;
            background: #1a1a1a;
            color: white;
        }
        h1 {
            color: #00ff00;
            text-align: center;
        }
        .plug-control {
            background: #2a2a2a;
            padding: 20px;
            margin: 20px 0;
            border-radius: 10px;
        }
        .plug-control h2 {
            margin-top: 0;
        }
        button {
            padding: 15px 30px;
            font-size: 16px;
            margin: 5px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: all 0.3s;
        }
        .on-btn {
            background: #00ff00;
            color: black;
        }
        .on-btn:hover {
            background: #00cc00;
        }
        .off-btn {
            background: #ff0000;
            color: white;
        }
        .off-btn:hover {
            background: #cc0000;
        }
        .status {
            text-align: center;
            padding: 10px;
            margin: 10px 0;
            background: #333;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <h1>⚡ Energizer RF Controller</h1>
    
    <div class="plug-control">
        <h2>🔌 Plug 1</h2>
        <button class="on-btn" onclick="control('plug1/on')">Turn ON</button>
        <button class="off-btn" onclick="control('plug1/off')">Turn OFF</button>
    </div>
    
    <div class="plug-control">
        <h2>🔌 Plug 2</h2>
        <button class="on-btn" onclick="control('plug2/on')">Turn ON</button>
        <button class="off-btn" onclick="control('plug2/off')">Turn OFF</button>
    </div>
    
    <div class="status" id="status">Ready</div>
    
    <script>
        function control(endpoint) {
            document.getElementById('status').textContent = 'Sending...';
            fetch('/' + endpoint)
                .then(response => response.text())
                .then(data => {
                    document.getElementById('status').textContent = 'Success! ✓';
                    setTimeout(() => {
                        document.getElementById('status').textContent = 'Ready';
                    }, 2000);
                })
                .catch(error => {
                    document.getElementById('status').textContent = 'Error! ✗';
                });
        }
    </script>
</body>
</html>
  )";
  
  server.send(200, "text/html", html);
}

void handleStatus() {
  String status = "{\"status\":\"online\",\"ip\":\"" + WiFi.localIP().toString() + "\"}";
  server.send(200, "application/json", status);
}
#endif
