/*
 * RF Smart Plug Control for ESP32
 * 
 * Control Energizer smart plugs via serial commands using captured RF codes.
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
 * Setup Instructions:
 * 1. First run rf_signal_scanner.ino to capture your remote codes
 * 2. Replace the codes below with your captured codes
 * 3. Upload this sketch to your ESP32
 * 4. Open Serial Monitor (115200 baud)
 * 5. Send commands to control your plugs
 * 
 * Serial Commands:
 * - 1ON  : Turn plug 1 ON
 * - 1OFF : Turn plug 1 OFF
 * - 2ON  : Turn plug 2 ON
 * - 2OFF : Turn plug 2 OFF
 * - 3ON  : Turn plug 3 ON
 * - 3OFF : Turn plug 3 OFF
 * - 4ON  : Turn plug 4 ON
 * - 4OFF : Turn plug 4 OFF
 * - ALLON  : Turn all plugs ON
 * - ALLOFF : Turn all plugs OFF
 * - STATUS : Show current configuration
 */

#include <RCSwitch.h>

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
#define PULSE_LENGTH 0      // Pulse length in microseconds (0 = auto)

// ========================================
// Create RF transmitter object
// ========================================
RCSwitch rfTransmit = RCSwitch();

// ========================================
// Plug States (for tracking)
// ========================================
bool plug1State = false;
bool plug2State = false;
bool plug3State = false;
bool plug4State = false;

void setup() {
  Serial.begin(115200);
  delay(2000);
  
  printHeader();
  
  // Enable transmitter on the specified pin
  rfTransmit.enableTransmit(RF_TRANSMITTER_PIN);
  
  // Set protocol
  rfTransmit.setProtocol(RF_PROTOCOL);
  
  // Set pulse length if specified
  if (PULSE_LENGTH > 0) {
    rfTransmit.setPulseLength(PULSE_LENGTH);
  }
  
  // Set repeat count
  rfTransmit.setRepeatTransmit(RF_REPEAT);
  
  Serial.println("✓ Transmitter initialized");
  Serial.println("✓ Ready to control smart plugs\n");
  
  printHelp();
  checkCodes();
}

void loop() {
  // Check for serial input
  if (Serial.available() > 0) {
    String command = Serial.readStringUntil('\n');
    command.trim();
    command.toUpperCase();
    
    processCommand(command);
  }
}

// ========================================
// Command Processing
// ========================================
void processCommand(String cmd) {
  Serial.println("\n┌─────────────────────────────────────┐");
  Serial.print("│ Command: ");
  Serial.print(cmd);
  
  // Pad with spaces for alignment
  for (int i = cmd.length(); i < 27; i++) {
    Serial.print(" ");
  }
  Serial.println("│");
  Serial.println("├─────────────────────────────────────┤");
  
  bool validCommand = true;
  
  // Plug 1 Commands
  if (cmd == "1ON") {
    sendRFCode(PLUG1_ON, "Plug 1 ON");
    plug1State = true;
  }
  else if (cmd == "1OFF") {
    sendRFCode(PLUG1_OFF, "Plug 1 OFF");
    plug1State = false;
  }
  
  // Plug 2 Commands
  else if (cmd == "2ON") {
    sendRFCode(PLUG2_ON, "Plug 2 ON");
    plug2State = true;
  }
  else if (cmd == "2OFF") {
    sendRFCode(PLUG2_OFF, "Plug 2 OFF");
    plug2State = false;
  }
  
  // Plug 3 Commands
  else if (cmd == "3ON") {
    sendRFCode(PLUG3_ON, "Plug 3 ON");
    plug3State = true;
  }
  else if (cmd == "3OFF") {
    sendRFCode(PLUG3_OFF, "Plug 3 OFF");
    plug3State = false;
  }
  
  // Plug 4 Commands
  else if (cmd == "4ON") {
    sendRFCode(PLUG4_ON, "Plug 4 ON");
    plug4State = true;
  }
  else if (cmd == "4OFF") {
    sendRFCode(PLUG4_OFF, "Plug 4 OFF");
    plug4State = false;
  }
  
  // All Plugs Commands
  else if (cmd == "ALLON") {
    Serial.println("│ Turning all plugs ON...            │");
    sendRFCode(PLUG1_ON, "Plug 1");
    delay(100);
    sendRFCode(PLUG2_ON, "Plug 2");
    delay(100);
    sendRFCode(PLUG3_ON, "Plug 3");
    delay(100);
    sendRFCode(PLUG4_ON, "Plug 4");
    plug1State = plug2State = plug3State = plug4State = true;
  }
  else if (cmd == "ALLOFF") {
    Serial.println("│ Turning all plugs OFF...           │");
    sendRFCode(PLUG1_OFF, "Plug 1");
    delay(100);
    sendRFCode(PLUG2_OFF, "Plug 2");
    delay(100);
    sendRFCode(PLUG3_OFF, "Plug 3");
    delay(100);
    sendRFCode(PLUG4_OFF, "Plug 4");
    plug1State = plug2State = plug3State = plug4State = false;
  }
  
  // Status Command
  else if (cmd == "STATUS") {
    printStatus();
    validCommand = false;  // Don't show success message
  }
  
  // Help Command
  else if (cmd == "HELP" || cmd == "?") {
    printHelp();
    validCommand = false;
  }
  
  // Unknown Command
  else {
    Serial.println("│ ❌ Unknown command!                  │");
    Serial.println("│ Type HELP for command list          │");
    validCommand = false;
  }
  
  if (validCommand) {
    Serial.println("│ ✓ Command sent successfully         │");
  }
  
  Serial.println("└─────────────────────────────────────┘\n");
}

// ========================================
// Send RF Code
// ========================================
void sendRFCode(unsigned long code, String description) {
  if (code == 0) {
    Serial.println("│ ⚠ Code not configured!              │");
    Serial.println("│ Please set codes at top of sketch   │");
    return;
  }
  
  Serial.print("│ Sending: ");
  Serial.print(description);
  
  // Pad with spaces
  for (int i = description.length(); i < 25; i++) {
    Serial.print(" ");
  }
  Serial.println("│");
  
  Serial.print("│ Code: ");
  Serial.print(code);
  
  // Pad with spaces
  String codeStr = String(code);
  for (int i = codeStr.length(); i < 29; i++) {
    Serial.print(" ");
  }
  Serial.println("│");
  
  // Send the RF code
  rfTransmit.send(code, RF_BIT_LENGTH);
  
  // Small delay for reliability
  delay(50);
}

// ========================================
// Print Functions
// ========================================
void printHeader() {
  Serial.println("\n\n");
  Serial.println("========================================");
  Serial.println("   ESP32 RF Smart Plug Controller");
  Serial.println("========================================");
  Serial.println();
}

void printHelp() {
  Serial.println("📋 Available Commands:");
  Serial.println("   1ON, 1OFF   - Control Plug 1");
  Serial.println("   2ON, 2OFF   - Control Plug 2");
  Serial.println("   3ON, 3OFF   - Control Plug 3");
  Serial.println("   4ON, 4OFF   - Control Plug 4");
  Serial.println("   ALLON       - Turn all plugs ON");
  Serial.println("   ALLOFF      - Turn all plugs OFF");
  Serial.println("   STATUS      - Show plug states");
  Serial.println("   HELP        - Show this help");
  Serial.println();
}

void printStatus() {
  Serial.println("│ Plug States:                        │");
  Serial.println("├─────────────────────────────────────┤");
  
  Serial.print("│ Plug 1: ");
  Serial.print(plug1State ? "ON " : "OFF");
  Serial.print(" | Code: ");
  Serial.print(PLUG1_ON);
  Serial.println();
  
  Serial.print("│ Plug 2: ");
  Serial.print(plug2State ? "ON " : "OFF");
  Serial.print(" | Code: ");
  Serial.print(PLUG2_ON);
  Serial.println();
  
  Serial.print("│ Plug 3: ");
  Serial.print(plug3State ? "ON " : "OFF");
  Serial.print(" | Code: ");
  Serial.print(PLUG3_ON);
  Serial.println();
  
  Serial.print("│ Plug 4: ");
  Serial.print(plug4State ? "ON " : "OFF");
  Serial.print(" | Code: ");
  Serial.print(PLUG4_ON);
  Serial.println();
  
  Serial.println("├─────────────────────────────────────┤");
  Serial.print("│ Protocol: ");
  Serial.print(RF_PROTOCOL);
  Serial.print(" | Bit Length: ");
  Serial.print(RF_BIT_LENGTH);
  Serial.print("       │");
  Serial.println();
}

void checkCodes() {
  if (PLUG1_ON == 0 && PLUG1_OFF == 0 && 
      PLUG2_ON == 0 && PLUG2_OFF == 0 &&
      PLUG3_ON == 0 && PLUG3_OFF == 0 &&
      PLUG4_ON == 0 && PLUG4_OFF == 0) {
    Serial.println("⚠️  WARNING: No RF codes configured!");
    Serial.println("   Please run rf_signal_scanner.ino first");
    Serial.println("   to capture your remote control codes,");
    Serial.println("   then update the #define codes at the");
    Serial.println("   top of this sketch.\n");
  } else {
    Serial.println("✓ RF codes configured\n");
  }
}

/*
 * SETUP GUIDE:
 * 
 * 1. Capture RF codes using rf_signal_scanner.ino
 * 2. Update the #define codes at the top of this file
 * 3. Upload this sketch to ESP32
 * 4. Open Serial Monitor (115200 baud)
 * 5. Test commands (e.g., "1ON", "1OFF")
 * 
 * TROUBLESHOOTING:
 * 
 * If plugs don't respond:
 * - Check transmitter wiring (VCC, GND, DATA)
 * - Try 5V instead of 3.3V for transmitter power
 * - Increase RF_REPEAT value (try 15 or 20)
 * - Verify RF codes are correct
 * - Check RF_PROTOCOL matches your remote
 * - Move transmitter closer to plugs
 * - Add a 17.3cm wire antenna to transmitter
 * 
 * If codes are wrong:
 * - Re-run rf_signal_scanner.ino
 * - Verify protocol number matches
 * - Check bit length (24 vs 32)
 */
