/*
 * RF Signal Scanner for ESP32
 * 
 * This sketch captures and displays RF signals from your Energizer remote control.
 * Use this to identify the codes for each button on your remote.
 * 
 * Hardware:
 * - ESP32 board
 * - 433 MHz RF Receiver (RX480E)
 * 
 * Wiring:
 * - Receiver VCC  → ESP32 3.3V
 * - Receiver GND  → ESP32 GND
 * - Receiver DATA → ESP32 GPIO 27
 * 
 * Instructions:
 * 1. Upload this sketch to your ESP32
 * 2. Open Serial Monitor (115200 baud)
 * 3. Press buttons on your remote control
 * 4. Record the codes displayed
 * 5. Use these codes in the control sketch
 */

#include <RCSwitch.h>

// Pin definitions
#define RF_RECEIVER_PIN 27

// Create RF receiver object
RCSwitch rfReceive = RCSwitch();

void setup() {
  Serial.begin(115200);
  
  // Wait for serial connection
  delay(2000);
  
  Serial.println("\n\n========================================");
  Serial.println("   ESP32 RF Signal Scanner v1.0");
  Serial.println("========================================");
  Serial.println("Scanning for 433 MHz RF signals...");
  Serial.println("Press buttons on your remote control.");
  Serial.println("========================================\n");
  
  // Enable receiver on the specified pin
  rfReceive.enableReceive(digitalPinToInterrupt(RF_RECEIVER_PIN));
  
  Serial.println("✓ Receiver ready and listening...\n");
}

void loop() {
  // Check if a signal has been received
  if (rfReceive.available()) {
    
    // Get signal details
    unsigned long receivedValue = rfReceive.getReceivedValue();
    unsigned int bitLength = rfReceive.getReceivedBitlength();
    unsigned int protocol = rfReceive.getReceivedProtocol();
    unsigned int delay = rfReceive.getReceivedDelay();
    
    // Only process valid signals (non-zero)
    if (receivedValue != 0) {
      
      Serial.println("┌─────────────────────────────────────┐");
      Serial.println("│       RF SIGNAL DETECTED!           │");
      Serial.println("├─────────────────────────────────────┤");
      
      // Display decimal code
      Serial.print("│ Code (Dec):  ");
      Serial.println(receivedValue);
      
      // Display hexadecimal code
      Serial.print("│ Code (Hex):  0x");
      Serial.println(receivedValue, HEX);
      
      // Display binary code
      Serial.print("│ Code (Bin):  ");
      Serial.println(receivedValue, BIN);
      
      // Display bit length
      Serial.print("│ Bit Length:  ");
      Serial.print(bitLength);
      Serial.println(" bits");
      
      // Display protocol
      Serial.print("│ Protocol:    ");
      Serial.println(protocol);
      
      // Display pulse length (delay)
      Serial.print("│ Pulse:       ");
      Serial.print(delay);
      Serial.println(" μs");
      
      Serial.println("└─────────────────────────────────────┘");
      
      // Provide formatted code for easy copying
      Serial.println("\n📋 COPY THIS FOR YOUR CODE:");
      Serial.print("   #define BUTTON_CODE ");
      Serial.println(receivedValue);
      Serial.println();
      
      // Alternative format
      Serial.println("📋 OR USE THIS LINE:");
      Serial.print("   rfTransmit.send(");
      Serial.print(receivedValue);
      Serial.print(", ");
      Serial.print(bitLength);
      Serial.println(");");
      Serial.println("\n" + String("─").c_str());
      Serial.println();
      
    } else {
      // Unknown or corrupted signal
      Serial.println("⚠ Unknown encoding (corrupted signal)");
    }
    
    // Reset receiver for next signal
    rfReceive.resetAvailable();
    
    // Small delay to avoid multiple detections
    delay(50);
  }
}

/*
 * USAGE TIPS:
 * 
 * 1. Test each button on your remote multiple times
 *    - Most remotes send the same code consistently
 *    - Some remotes alternate between codes (rolling codes)
 * 
 * 2. If you see no signals:
 *    - Check wiring connections
 *    - Move receiver closer to remote (< 1 meter)
 *    - Verify receiver is powered (should have LED indicator)
 *    - Try a different GPIO pin
 * 
 * 3. Signal variations:
 *    - Same button should produce same code
 *    - Different buttons should produce different codes
 *    - Note the protocol number - you'll need it later
 * 
 * 4. Recording codes:
 *    - Label each code with its function (ON/OFF, Plug 1/2/3/4)
 *    - Test each code multiple times to confirm
 *    - Keep the remote batteries fresh for consistent signals
 * 
 * 5. Common protocols:
 *    - Protocol 1: Most common, used by many devices
 *    - Protocol 2: Less common
 *    - Protocol 4: Some newer devices
 * 
 * EXAMPLE OUTPUT:
 * 
 * Button "Plug 1 ON":  13383452
 * Button "Plug 1 OFF": 13383449
 * Button "Plug 2 ON":  13385500
 * Button "Plug 2 OFF": 13385497
 * 
 * Once you have all codes, use them in the control sketch!
 */
