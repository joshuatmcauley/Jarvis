/*
 * ESP32 + Relay Module → Energizer Remote Control
 * Simple starter version for ONE relay controlling ONE button
 * 
 * Hardware:
 * - Keyestudio ESP32 Plus
 * - 1x Relay Module (from Elegoo 37 sensor kit)
 * - Energizer remote with wires soldered to ONE button
 * - Jumper wires
 * 
 * Wiring:
 * ESP32 5V    → Relay VCC
 * ESP32 GND   → Relay GND
 * ESP32 GPIO4 → Relay IN (or S)
 * 
 * Relay COM   → Remote button contact 1
 * Relay NO    → Remote button contact 2
 */

#include <WiFi.h>
#include <WebServer.h>

// ========== CONFIGURATION - CHANGE THESE! ==========
const char* ssid = "YOUR_WIFI_NAME";        // Your WiFi name
const char* password = "YOUR_WIFI_PASSWORD"; // Your WiFi password

// Relay pin (connected to Plug 1 ON button)
#define RELAY_PIN 4

// Button press duration (milliseconds)
#define PRESS_TIME 200
// ====================================================

WebServer server(80);

void setup() {
  Serial.begin(115200);
  Serial.println("\n\nESP32 Relay Remote Controller Starting...");
  
  // Setup relay pin
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, HIGH);  // Relay OFF initially (HIGH = OFF for most modules)
  
  // Connect to WiFi
  Serial.print("Connecting to WiFi: ");
  Serial.println(ssid);
  
  WiFi.begin(ssid, password);
  
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n✓ WiFi connected!");
    Serial.print("✓ IP address: ");
    Serial.println(WiFi.localIP());
    Serial.println("\nOpen this address in your phone browser:");
    Serial.print("http://");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("\n✗ WiFi connection failed!");
    Serial.println("Check SSID and password in the code");
  }
  
  // Setup web server routes
  server.on("/", handleRoot);
  server.on("/on", handleTurnOn);
  server.on("/test", handleTest);
  
  server.begin();
  Serial.println("✓ Web server started");
  Serial.println("\nReady! Access from your phone browser.");
}

void loop() {
  server.handleClient();
}

// Press the remote button via relay
void pressButton() {
  Serial.println("→ Pressing remote button...");
  digitalWrite(RELAY_PIN, LOW);   // Activate relay (press button)
  delay(PRESS_TIME);               // Hold for 200ms
  digitalWrite(RELAY_PIN, HIGH);  // Deactivate relay (release button)
  Serial.println("✓ Button pressed");
}

// Handle main page
void handleRoot() {
  String html = R"rawliteral(
<!DOCTYPE html>
<html>
<head>
    <title>Energizer Control</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: Arial, sans-serif;
            background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
            color: white;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 20px;
        }
        h1 {
            margin: 40px 0 20px 0;
            font-size: 32px;
            color: #00ff00;
            text-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
        }
        .subtitle {
            color: #888;
            margin-bottom: 40px;
            font-size: 14px;
        }
        .control-panel {
            background: #2a2a2a;
            border-radius: 20px;
            padding: 30px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            max-width: 400px;
            width: 100%;
        }
        button {
            width: 100%;
            padding: 20px;
            font-size: 20px;
            font-weight: bold;
            margin: 10px 0;
            border: none;
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.3s;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }
        .btn-on {
            background: linear-gradient(135deg, #00ff00 0%, #00cc00 100%);
            color: black;
        }
        .btn-on:active {
            background: #00aa00;
            transform: scale(0.98);
        }
        .btn-test {
            background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
            color: white;
            font-size: 16px;
            padding: 15px;
        }
        .btn-test:active {
            background: #2d5a8f;
            transform: scale(0.98);
        }
        .status {
            text-align: center;
            padding: 15px;
            margin: 20px 0;
            background: #333;
            border-radius: 8px;
            font-size: 14px;
            min-height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .info {
            margin-top: 30px;
            padding: 20px;
            background: #1a1a1a;
            border-radius: 10px;
            font-size: 12px;
            color: #888;
        }
        .info strong {
            color: #00ff00;
        }
    </style>
</head>
<body>
    <h1>⚡ Energizer Control</h1>
    <p class="subtitle">ESP32 Relay Controller</p>
    
    <div class="control-panel">
        <button class="btn-on" onclick="control('/on')">
            🔌 Turn Plug ON
        </button>
        
        <div class="status" id="status">Ready</div>
        
        <button class="btn-test" onclick="control('/test')">
            🔧 Test Relay
        </button>
    </div>
    
    <div class="info">
        <strong>ℹ️ Info:</strong> This controls ONE plug via relay.<br>
        Press "Turn Plug ON" to activate your device.<br>
        Use "Test Relay" to check if relay is working.
    </div>
    
    <script>
        function control(endpoint) {
            const status = document.getElementById('status');
            status.textContent = 'Sending command...';
            
            fetch(endpoint)
                .then(response => response.text())
                .then(data => {
                    status.textContent = '✓ ' + data;
                    setTimeout(() => {
                        status.textContent = 'Ready';
                    }, 2000);
                })
                .catch(error => {
                    status.textContent = '✗ Error: ' + error;
                });
        }
    </script>
</body>
</html>
  )rawliteral";
  
  server.send(200, "text/html", html);
}

// Handle turn on command
void handleTurnOn() {
  pressButton();
  server.send(200, "text/plain", "Command sent!");
}

// Handle test relay command
void handleTest() {
  Serial.println("Testing relay...");
  for (int i = 0; i < 3; i++) {
    digitalWrite(RELAY_PIN, LOW);
    delay(100);
    digitalWrite(RELAY_PIN, HIGH);
    delay(100);
  }
  Serial.println("Test complete");
  server.send(200, "text/plain", "Relay tested (3 clicks)");
}
