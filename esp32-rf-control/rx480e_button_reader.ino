/*
 * RX480E Button Reader for ESP32
 * 
 * This sketch works with the QIACHIP RX480E receiver module.
 * The RX480E has BUILT-IN EV1527 decoding, so no RCSwitch library is needed!
 * 
 * Hardware:
 * - ESP32 board
 * - QIACHIP RX480E 433 MHz receiver module
 * - TX118SA 4-button remote (or any EV1527-compatible remote)
 * 
 * Wiring:
 * RX480E → ESP32
 * ──────────────
 * GND   → GND
 * +V    → 5V (or 3.3V)
 * D0    → GPIO 25 (Button 1 / K1)
 * D1    → GPIO 26 (Button 2 / K2)
 * D2    → GPIO 27 (Button 4 / K4)
 * D3    → GPIO 14 (Button 3 / K3)
 * VT    → GPIO 33 (optional - Valid Transmission detect)
 * 
 * Setup Instructions:
 * 1. Wire the RX480E to ESP32 as shown above
 * 2. Pair your TX118SA remote with RX480E:
 *    - Press learning button on RX480E (1x for Momentary, 2x for Toggle)
 *    - LED turns on = learning mode active
 *    - Press any button on TX118SA remote
 *    - LED flashes 3 times = successfully paired
 * 3. Upload this sketch
 * 4. Open Serial Monitor (115200 baud)
 * 5. Press buttons on your remote
 */

// ========================================
// Pin Definitions
// ========================================
// Button inputs from RX480E
#define BUTTON1_PIN 25  // D0 from RX480E (K1 on remote)
#define BUTTON2_PIN 26  // D1 from RX480E (K2 on remote)
#define BUTTON3_PIN 14  // D3 from RX480E (K3 on remote)
#define BUTTON4_PIN 27  // D2 from RX480E (K4 on remote)
#define VALID_TX_PIN 33 // VT from RX480E (optional)

// Built-in LED for visual feedback
#define LED_PIN 2

// ========================================
// Variables
// ========================================
bool lastState1 = LOW;
bool lastState2 = LOW;
bool lastState3 = LOW;
bool lastState4 = LOW;

unsigned long lastDebounceTime = 0;
const unsigned long debounceDelay = 50; // 50ms debounce

// ========================================
// Setup
// ========================================
void setup() {
  Serial.begin(115200);
  delay(1000);
  
  // Print header
  Serial.println("\n\n========================================");
  Serial.println("   RX480E Button Reader for ESP32");
  Serial.println("========================================\n");
  
  // Configure button pins as inputs
  pinMode(BUTTON1_PIN, INPUT);
  pinMode(BUTTON2_PIN, INPUT);
  pinMode(BUTTON3_PIN, INPUT);
  pinMode(BUTTON4_PIN, INPUT);
  pinMode(VALID_TX_PIN, INPUT);
  
  // Configure LED for visual feedback
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, LOW);
  
  Serial.println("✓ Pins configured");
  Serial.println("✓ Ready to receive button presses");
  Serial.println("\nPress buttons on your TX118SA remote...\n");
  
  // Flash LED to indicate ready
  for (int i = 0; i < 3; i++) {
    digitalWrite(LED_PIN, HIGH);
    delay(100);
    digitalWrite(LED_PIN, LOW);
    delay(100);
  }
}

// ========================================
// Main Loop
// ========================================
void loop() {
  // Read current button states
  bool btn1 = digitalRead(BUTTON1_PIN);
  bool btn2 = digitalRead(BUTTON2_PIN);
  bool btn3 = digitalRead(BUTTON3_PIN);
  bool btn4 = digitalRead(BUTTON4_PIN);
  bool validTX = digitalRead(VALID_TX_PIN);
  
  // Detect button presses (rising edge - LOW to HIGH)
  if (btn1 == HIGH && lastState1 == LOW) {
    if (millis() - lastDebounceTime > debounceDelay) {
      handleButtonPress(1);
      lastDebounceTime = millis();
    }
  }
  
  if (btn2 == HIGH && lastState2 == LOW) {
    if (millis() - lastDebounceTime > debounceDelay) {
      handleButtonPress(2);
      lastDebounceTime = millis();
    }
  }
  
  if (btn3 == HIGH && lastState3 == LOW) {
    if (millis() - lastDebounceTime > debounceDelay) {
      handleButtonPress(3);
      lastDebounceTime = millis();
    }
  }
  
  if (btn4 == HIGH && lastState4 == LOW) {
    if (millis() - lastDebounceTime > debounceDelay) {
      handleButtonPress(4);
      lastDebounceTime = millis();
    }
  }
  
  // Update last states
  lastState1 = btn1;
  lastState2 = btn2;
  lastState3 = btn3;
  lastState4 = btn4;
  
  // Optional: monitor Valid Transmission pin
  // This pin goes HIGH when any valid EV1527 signal is received
  
  delay(10);
}

// ========================================
// Button Press Handler
// ========================================
void handleButtonPress(int buttonNumber) {
  Serial.println("┌─────────────────────────────────────┐");
  Serial.print("│ Button ");
  Serial.print(buttonNumber);
  Serial.println(" Pressed!                   │");
  Serial.println("├─────────────────────────────────────┤");
  Serial.print("│ Time: ");
  Serial.print(millis());
  Serial.println(" ms");
  Serial.print("│ Remote Button: K");
  Serial.println(buttonNumber);
  Serial.println("└─────────────────────────────────────┘\n");
  
  // Flash LED for visual feedback
  digitalWrite(LED_PIN, HIGH);
  delay(50);
  digitalWrite(LED_PIN, LOW);
  
  // Here you can add your custom actions
  // For example, to control smart plugs, you would:
  // 1. Detect which button was pressed
  // 2. Send the appropriate RF code via a TRANSMITTER module
  //    (Note: RX480E is receive-only!)
  
  switch(buttonNumber) {
    case 1:
      // Example: Turn on Plug 1
      Serial.println("→ Action: Turn on Plug 1");
      // sendRFCode(PLUG1_ON);  // You need a transmitter for this!
      break;
    
    case 2:
      // Example: Turn off Plug 1
      Serial.println("→ Action: Turn off Plug 1");
      // sendRFCode(PLUG1_OFF);
      break;
    
    case 3:
      // Example: Turn on Plug 2
      Serial.println("→ Action: Turn on Plug 2");
      // sendRFCode(PLUG2_ON);
      break;
    
    case 4:
      // Example: Turn off Plug 2
      Serial.println("→ Action: Turn off Plug 2");
      // sendRFCode(PLUG2_OFF);
      break;
  }
}

// ========================================
// Helper Functions
// ========================================

// Check if any button is currently pressed
bool isAnyButtonPressed() {
  return digitalRead(BUTTON1_PIN) || 
         digitalRead(BUTTON2_PIN) || 
         digitalRead(BUTTON3_PIN) || 
         digitalRead(BUTTON4_PIN);
}

// Get button states as a 4-bit value (for debugging)
byte getButtonStates() {
  byte states = 0;
  if (digitalRead(BUTTON1_PIN)) states |= 0b0001;
  if (digitalRead(BUTTON2_PIN)) states |= 0b0010;
  if (digitalRead(BUTTON3_PIN)) states |= 0b0100;
  if (digitalRead(BUTTON4_PIN)) states |= 0b1000;
  return states;
}

/*
 * IMPORTANT NOTES:
 * 
 * 1. The RX480E is a RECEIVER ONLY module
 *    - It CANNOT transmit RF signals
 *    - It CANNOT control your Energizer smart plugs directly
 *    - You need a separate transmitter module for that
 * 
 * 2. To control Energizer smart plugs, you need:
 *    - A standard 433 MHz transmitter module (FS1000A, XY-FST, etc.)
 *    - Connect it to another GPIO pin (e.g., GPIO 13)
 *    - Use RCSwitch library to send the captured codes
 * 
 * 3. The TX118SA remote:
 *    - Is a handheld battery-powered remote
 *    - Uses EV1527 encoding
 *    - Works ONLY with the RX480E receiver
 *    - CANNOT directly control Energizer plugs
 * 
 * 4. RX480E Operating Modes (set during pairing):
 *    - Momentary: Output HIGH only while button held
 *    - Toggle: Output toggles HIGH/LOW with each press
 *    - Interlock: Only one output HIGH at a time
 * 
 * 5. Troubleshooting:
 *    - No button presses detected?
 *      → Check wiring (especially +V and GND)
 *      → Verify remote is paired (press learning button)
 *      → Replace remote battery (CR2032)
 *      → Move remote closer to receiver
 *    
 *    - Multiple button presses detected?
 *      → Increase debounceDelay (currently 50ms)
 *      → Check for loose connections
 * 
 * 6. Next Steps:
 *    - To control smart plugs, see CORRECT_HARDWARE_GUIDE.md
 *    - You'll need to add a transmitter module
 *    - Capture codes from your Energizer remote first
 *    - Then send those codes when buttons are pressed
 * 
 * EXAMPLE WITH TRANSMITTER:
 * 
 * #include <RCSwitch.h>
 * 
 * RCSwitch mySwitch = RCSwitch();
 * 
 * void setup() {
 *   // ... existing setup ...
 *   mySwitch.enableTransmit(13);  // Transmitter on GPIO 13
 * }
 * 
 * void handleButtonPress(int buttonNumber) {
 *   // ... existing code ...
 *   
 *   switch(buttonNumber) {
 *     case 1:
 *       mySwitch.send(13383452, 24);  // Your captured code
 *       break;
 *     // ... etc
 *   }
 * }
 */
