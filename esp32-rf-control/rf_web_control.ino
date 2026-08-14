/*
 * RF Smart Plug Web Control for ESP32
 * 
 * Control Energizer smart plugs via web browser over WiFi.
 * Creates a simple web interface accessible from any device on your network.
 * 
 * Hardware:
 * - ESP32 board
 * - 433 MHz RF Transmitter (TX118SA)
 * 
 * Wiring:
 * - Transmitter VCC  → ESP32 5V (or 3.3V if supported)
 * - Transmitter GND  → ESP32 GND
 * - Transmitter DATA → ESP32 GPIO 25
 * 
 * Setup:
 * 1. Update WiFi credentials below
 * 2. Run rf_signal_scanner.ino to get your RF codes
 * 3. Update RF codes below
 * 4. Upload this sketch
 * 5. Open Serial Monitor to get IP address
 * 6. Access web interface from browser
 */

#include <WiFi.h>
#include <WebServer.h>
#include <RCSwitch.h>

// ========================================
// WiFi Configuration
// ========================================
const char* ssid = "YOUR_WIFI_SSID";         // Change this!
const char* password = "YOUR_WIFI_PASSWORD"; // Change this!

// ========================================
// Pin Configuration
// ========================================
#define RF_TRANSMITTER_PIN 25

// ========================================
// RF CODES - REPLACE WITH YOUR CODES!
// ========================================
// Run rf_signal_scanner.ino first to get these codes

// Plug 1 Codes
#define PLUG1_ON  0         // Replace with your code
#define PLUG1_OFF 0         // Replace with your code

// Plug 2 Codes
#define PLUG2_ON  0         // Replace with your code
#define PLUG2_OFF 0         // Replace with your code

// Plug 3 Codes
#define PLUG3_ON  0         // Replace with your code
#define PLUG3_OFF 0         // Replace with your code

// Plug 4 Codes
#define PLUG4_ON  0         // Replace with your code
#define PLUG4_OFF 0         // Replace with your code

// ========================================
// RF Settings
// ========================================
#define RF_PROTOCOL 1       // Change if your remote uses different protocol
#define RF_BIT_LENGTH 24    // Change based on your signal (usually 24 or 32)
#define RF_REPEAT 10        // Number of times to repeat transmission

// ========================================
// Objects
// ========================================
RCSwitch rfTransmit = RCSwitch();
WebServer server(80);

// ========================================
// Plug States
// ========================================
bool plug1State = false;
bool plug2State = false;
bool plug3State = false;
bool plug4State = false;

// ========================================
// Setup
// ========================================
void setup() {
  Serial.begin(115200);
  delay(2000);
  
  Serial.println("\n\n========================================");
  Serial.println("   ESP32 RF Web Controller v1.0");
  Serial.println("========================================\n");
  
  // Initialize RF transmitter
  rfTransmit.enableTransmit(RF_TRANSMITTER_PIN);
  rfTransmit.setProtocol(RF_PROTOCOL);
  rfTransmit.setRepeatTransmit(RF_REPEAT);
  Serial.println("✓ RF Transmitter initialized");
  
  // Connect to WiFi
  connectWiFi();
  
  // Setup web server routes
  setupWebServer();
  
  // Start web server
  server.begin();
  Serial.println("✓ Web server started");
  Serial.println("\n========================================");
  Serial.println("Ready! Open your browser and go to:");
  Serial.print("http://");
  Serial.println(WiFi.localIP());
  Serial.println("========================================\n");
}

// ========================================
// Main Loop
// ========================================
void loop() {
  server.handleClient();
}

// ========================================
// WiFi Connection
// ========================================
void connectWiFi() {
  Serial.print("Connecting to WiFi: ");
  Serial.println(ssid);
  
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 30) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n✓ WiFi connected!");
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());
    Serial.print("Signal Strength: ");
    Serial.print(WiFi.RSSI());
    Serial.println(" dBm");
  } else {
    Serial.println("\n❌ WiFi connection failed!");
    Serial.println("Please check your credentials and try again.");
  }
}

// ========================================
// Web Server Setup
// ========================================
void setupWebServer() {
  // Main page
  server.on("/", handleRoot);
  
  // Control endpoints
  server.on("/plug1/on", []() { handlePlugControl(1, true); });
  server.on("/plug1/off", []() { handlePlugControl(1, false); });
  server.on("/plug2/on", []() { handlePlugControl(2, true); });
  server.on("/plug2/off", []() { handlePlugControl(2, false); });
  server.on("/plug3/on", []() { handlePlugControl(3, true); });
  server.on("/plug3/off", []() { handlePlugControl(3, false); });
  server.on("/plug4/on", []() { handlePlugControl(4, true); });
  server.on("/plug4/off", []() { handlePlugControl(4, false); });
  server.on("/all/on", handleAllOn);
  server.on("/all/off", handleAllOff);
  
  // Status endpoint
  server.on("/status", handleStatus);
  
  // 404
  server.onNotFound(handleNotFound);
}

// ========================================
// Web Page HTML
// ========================================
String getHTML() {
  String html = R"rawliteral(
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Smart Plug Controller</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
    }
    .container {
      background: white;
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      padding: 40px;
      max-width: 600px;
      width: 100%;
    }
    h1 {
      color: #333;
      text-align: center;
      margin-bottom: 10px;
      font-size: 2em;
    }
    .subtitle {
      text-align: center;
      color: #666;
      margin-bottom: 30px;
      font-size: 0.9em;
    }
    .plug-container {
      margin-bottom: 20px;
      padding: 20px;
      background: #f8f9fa;
      border-radius: 10px;
      border-left: 4px solid #667eea;
    }
    .plug-header {
      font-size: 1.2em;
      font-weight: bold;
      color: #333;
      margin-bottom: 10px;
    }
    .plug-controls {
      display: flex;
      gap: 10px;
    }
    button {
      flex: 1;
      padding: 12px 20px;
      border: none;
      border-radius: 8px;
      font-size: 1em;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
      text-transform: uppercase;
    }
    .btn-on {
      background: #28a745;
      color: white;
    }
    .btn-on:hover {
      background: #218838;
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }
    .btn-off {
      background: #dc3545;
      color: white;
    }
    .btn-off:hover {
      background: #c82333;
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }
    .all-controls {
      margin-top: 30px;
      padding: 20px;
      background: #e9ecef;
      border-radius: 10px;
      text-align: center;
    }
    .all-controls h2 {
      margin-bottom: 15px;
      color: #333;
      font-size: 1.3em;
    }
    .status {
      text-align: center;
      padding: 15px;
      margin-top: 20px;
      border-radius: 8px;
      font-weight: bold;
    }
    .status.success { background: #d4edda; color: #155724; }
    .status.error { background: #f8d7da; color: #721c24; }
    .status.hidden { display: none; }
    @media (max-width: 600px) {
      .container { padding: 20px; }
      h1 { font-size: 1.5em; }
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🔌 Smart Plug Controller</h1>
    <div class="subtitle">ESP32 RF Control System</div>
    
    <div class="plug-container">
      <div class="plug-header">⚡ Plug 1</div>
      <div class="plug-controls">
        <button class="btn-on" onclick="control(1, 'on')">ON</button>
        <button class="btn-off" onclick="control(1, 'off')">OFF</button>
      </div>
    </div>
    
    <div class="plug-container">
      <div class="plug-header">⚡ Plug 2</div>
      <div class="plug-controls">
        <button class="btn-on" onclick="control(2, 'on')">ON</button>
        <button class="btn-off" onclick="control(2, 'off')">OFF</button>
      </div>
    </div>
    
    <div class="plug-container">
      <div class="plug-header">⚡ Plug 3</div>
      <div class="plug-controls">
        <button class="btn-on" onclick="control(3, 'on')">ON</button>
        <button class="btn-off" onclick="control(3, 'off')">OFF</button>
      </div>
    </div>
    
    <div class="plug-container">
      <div class="plug-header">⚡ Plug 4</div>
      <div class="plug-controls">
        <button class="btn-on" onclick="control(4, 'on')">ON</button>
        <button class="btn-off" onclick="control(4, 'off')">OFF</button>
      </div>
    </div>
    
    <div class="all-controls">
      <h2>All Plugs</h2>
      <div class="plug-controls">
        <button class="btn-on" onclick="control('all', 'on')">ALL ON</button>
        <button class="btn-off" onclick="control('all', 'off')">ALL OFF</button>
      </div>
    </div>
    
    <div id="status" class="status hidden"></div>
  </div>
  
  <script>
    function control(plug, action) {
      const url = `/plug${plug}/${action}`;
      const statusDiv = document.getElementById('status');
      
      statusDiv.textContent = `Sending command to Plug ${plug}...`;
      statusDiv.className = 'status';
      
      fetch(url)
        .then(response => response.json())
        .then(data => {
          statusDiv.textContent = data.message;
          statusDiv.className = data.success ? 'status success' : 'status error';
          setTimeout(() => {
            statusDiv.className = 'status hidden';
          }, 3000);
        })
        .catch(error => {
          statusDiv.textContent = 'Error: ' + error;
          statusDiv.className = 'status error';
        });
    }
  </script>
</body>
</html>
)rawliteral";
  
  return html;
}

// ========================================
// Route Handlers
// ========================================
void handleRoot() {
  server.send(200, "text/html", getHTML());
}

void handlePlugControl(int plug, bool turnOn) {
  unsigned long code = 0;
  String action = turnOn ? "ON" : "OFF";
  
  // Select the appropriate code
  switch(plug) {
    case 1:
      code = turnOn ? PLUG1_ON : PLUG1_OFF;
      plug1State = turnOn;
      break;
    case 2:
      code = turnOn ? PLUG2_ON : PLUG2_OFF;
      plug2State = turnOn;
      break;
    case 3:
      code = turnOn ? PLUG3_ON : PLUG3_OFF;
      plug3State = turnOn;
      break;
    case 4:
      code = turnOn ? PLUG4_ON : PLUG4_OFF;
      plug4State = turnOn;
      break;
  }
  
  // Send response
  if (code == 0) {
    server.send(200, "application/json", 
      "{\"success\":false,\"message\":\"Code not configured for Plug " + String(plug) + "\"}");
    Serial.println("❌ Code not configured for Plug " + String(plug));
    return;
  }
  
  // Send RF signal
  rfTransmit.send(code, RF_BIT_LENGTH);
  
  server.send(200, "application/json", 
    "{\"success\":true,\"message\":\"Plug " + String(plug) + " turned " + action + "\"}");
  
  Serial.println("✓ Plug " + String(plug) + " turned " + action + " (Code: " + String(code) + ")");
}

void handleAllOn() {
  int count = 0;
  
  if (PLUG1_ON != 0) { rfTransmit.send(PLUG1_ON, RF_BIT_LENGTH); delay(100); plug1State = true; count++; }
  if (PLUG2_ON != 0) { rfTransmit.send(PLUG2_ON, RF_BIT_LENGTH); delay(100); plug2State = true; count++; }
  if (PLUG3_ON != 0) { rfTransmit.send(PLUG3_ON, RF_BIT_LENGTH); delay(100); plug3State = true; count++; }
  if (PLUG4_ON != 0) { rfTransmit.send(PLUG4_ON, RF_BIT_LENGTH); delay(100); plug4State = true; count++; }
  
  server.send(200, "application/json", 
    "{\"success\":true,\"message\":\"Turned ON " + String(count) + " plugs\"}");
  
  Serial.println("✓ All plugs turned ON (" + String(count) + " plugs)");
}

void handleAllOff() {
  int count = 0;
  
  if (PLUG1_OFF != 0) { rfTransmit.send(PLUG1_OFF, RF_BIT_LENGTH); delay(100); plug1State = false; count++; }
  if (PLUG2_OFF != 0) { rfTransmit.send(PLUG2_OFF, RF_BIT_LENGTH); delay(100); plug2State = false; count++; }
  if (PLUG3_OFF != 0) { rfTransmit.send(PLUG3_OFF, RF_BIT_LENGTH); delay(100); plug3State = false; count++; }
  if (PLUG4_OFF != 0) { rfTransmit.send(PLUG4_OFF, RF_BIT_LENGTH); delay(100); plug4State = false; count++; }
  
  server.send(200, "application/json", 
    "{\"success\":true,\"message\":\"Turned OFF " + String(count) + " plugs\"}");
  
  Serial.println("✓ All plugs turned OFF (" + String(count) + " plugs)");
}

void handleStatus() {
  String json = "{";
  json += "\"plug1\":" + String(plug1State ? "true" : "false") + ",";
  json += "\"plug2\":" + String(plug2State ? "true" : "false") + ",";
  json += "\"plug3\":" + String(plug3State ? "true" : "false") + ",";
  json += "\"plug4\":" + String(plug4State ? "true" : "false") + ",";
  json += "\"wifi_rssi\":" + String(WiFi.RSSI()) + ",";
  json += "\"ip\":\"" + WiFi.localIP().toString() + "\"";
  json += "}";
  
  server.send(200, "application/json", json);
}

void handleNotFound() {
  server.send(404, "text/plain", "404: Not Found");
}

/*
 * API ENDPOINTS:
 * 
 * GET /                  - Web interface
 * GET /plug1/on          - Turn plug 1 ON
 * GET /plug1/off         - Turn plug 1 OFF
 * GET /plug2/on          - Turn plug 2 ON
 * GET /plug2/off         - Turn plug 2 OFF
 * GET /plug3/on          - Turn plug 3 ON
 * GET /plug3/off         - Turn plug 3 OFF
 * GET /plug4/on          - Turn plug 4 ON
 * GET /plug4/off         - Turn plug 4 OFF
 * GET /all/on            - Turn all plugs ON
 * GET /all/off           - Turn all plugs OFF
 * GET /status            - Get system status (JSON)
 * 
 * CURL EXAMPLES:
 * 
 * curl http://192.168.1.100/plug1/on
 * curl http://192.168.1.100/plug1/off
 * curl http://192.168.1.100/status
 * 
 * INTEGRATION WITH OTHER SYSTEMS:
 * 
 * You can call these endpoints from:
 * - Python scripts
 * - Home automation systems
 * - Voice assistants
 * - JARVIS Raspberry Pi assistant
 * - Any HTTP client
 */
