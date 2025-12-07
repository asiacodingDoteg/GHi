# Arduino Gas Monitoring System - Example Code

This document provides example Arduino code for the Gas Monitoring System GUI.

## Hardware Setup

- Arduino Uno/Nano/Mega
- 3x MQ Sensor (MQ-2, MQ-5, MQ-7, etc.)
- 3x LED (Green)
- 3x LED (Red)
- 3x Buzzer or Piezo Speaker
- Resistors (220Ω for LEDs, 1kΩ for buzzer)

## Pin Configuration

```
Sensors (Analog):
- Sensor 1: A0
- Sensor 2: A1
- Sensor 3: A2

Green LEDs (Digital):
- Sensor 1: Pin 2
- Sensor 2: Pin 3
- Sensor 3: Pin 4

Red LEDs (Digital):
- Sensor 1: Pin 5
- Sensor 2: Pin 6
- Sensor 3: Pin 7

Buzzers (Digital):
- Sensor 1: Pin 8
- Sensor 2: Pin 9
- Sensor 3: Pin 10
```

## Arduino Code

```cpp
#include <Wire.h>

// Sensor Pins
const int SENSOR_PINS[] = {A0, A1, A2};
const int NUM_SENSORS = 3;

// LED Pins
const int GREEN_LED_PINS[] = {2, 3, 4};
const int RED_LED_PINS[] = {5, 6, 7};

// Buzzer Pins
const int BUZZER_PINS[] = {8, 9, 10};

// Threshold for gas detection (adjust based on your sensors)
const int THRESHOLD = 300;

// Variables to store sensor readings
int sensorReadings[NUM_SENSORS];
bool previousAlertState[NUM_SENSORS] = {false, false, false};

void setup() {
  // Initialize Serial Communication
  Serial.begin(9600);
  
  // Initialize LED pins as outputs
  for (int i = 0; i < NUM_SENSORS; i++) {
    pinMode(GREEN_LED_PINS[i], OUTPUT);
    pinMode(RED_LED_PINS[i], OUTPUT);
    pinMode(BUZZER_PINS[i], OUTPUT);
    
    // Initialize all LEDs and buzzers as OFF
    digitalWrite(GREEN_LED_PINS[i], LOW);
    digitalWrite(RED_LED_PINS[i], LOW);
    digitalWrite(BUZZER_PINS[i], LOW);
  }
  
  delay(1000); // Wait for sensors to stabilize
}

void loop() {
  // Read all sensors
  for (int i = 0; i < NUM_SENSORS; i++) {
    sensorReadings[i] = analogRead(SENSOR_PINS[i]);
  }
  
  // Process each sensor
  for (int i = 0; i < NUM_SENSORS; i++) {
    bool isAlerting = sensorReadings[i] > THRESHOLD;
    
    // Update LEDs
    if (isAlerting) {
      digitalWrite(GREEN_LED_PINS[i], LOW);  // Turn off green LED
      digitalWrite(RED_LED_PINS[i], HIGH);   // Turn on red LED
      digitalWrite(BUZZER_PINS[i], HIGH);    // Turn on buzzer
    } else {
      digitalWrite(GREEN_LED_PINS[i], HIGH); // Turn on green LED
      digitalWrite(RED_LED_PINS[i], LOW);    // Turn off red LED
      digitalWrite(BUZZER_PINS[i], LOW);     // Turn off buzzer
    }
  }
  
  // Send data to GUI in CSV format
  // Format: sensor1_value,sensor2_value,sensor3_value
  Serial.print(sensorReadings[0]);
  Serial.print(",");
  Serial.print(sensorReadings[1]);
  Serial.print(",");
  Serial.println(sensorReadings[2]);
  
  // Delay before next reading (in milliseconds)
  delay(1000);
}
```

## Alternative JSON Format

If you prefer to send data in JSON format instead of CSV, use this code:

```cpp
#include <ArduinoJson.h>

void loop() {
  // Read all sensors
  for (int i = 0; i < NUM_SENSORS; i++) {
    sensorReadings[i] = analogRead(SENSOR_PINS[i]);
  }
  
  // Process each sensor
  for (int i = 0; i < NUM_SENSORS; i++) {
    bool isAlerting = sensorReadings[i] > THRESHOLD;
    
    // Update LEDs
    if (isAlerting) {
      digitalWrite(GREEN_LED_PINS[i], LOW);
      digitalWrite(RED_LED_PINS[i], HIGH);
      digitalWrite(BUZZER_PINS[i], HIGH);
    } else {
      digitalWrite(GREEN_LED_PINS[i], HIGH);
      digitalWrite(RED_LED_PINS[i], LOW);
      digitalWrite(BUZZER_PINS[i], LOW);
    }
  }
  
  // Create JSON document
  StaticJsonDocument<200> doc;
  doc["sensor1"] = sensorReadings[0];
  doc["sensor2"] = sensorReadings[1];
  doc["sensor3"] = sensorReadings[2];
  
  // Send JSON to GUI
  serializeJson(doc, Serial);
  Serial.println();
  
  delay(1000);
}
```

## Sensor Calibration Tips

1. **Air Quality Check**: Place sensors in clean air first to get baseline readings
2. **Sensitivity Adjustment**: Most MQ sensors have a potentiometer to adjust sensitivity
3. **Warm-up Time**: Allow sensors 24 hours to stabilize in your environment
4. **Threshold Setting**: Adjust the `THRESHOLD` value (300 ppm in this example) based on your safety requirements

## Serial Data Format

The GUI expects data in one of these formats:

### CSV Format (Default)
```
value1,value2,value3
450,280,320
```

### JSON Format
```json
{"sensor1":450,"sensor2":280,"sensor3":320}
```

## Troubleshooting

1. **No Data Appearing**: Check USB connection and Serial Monitor baud rate (9600)
2. **Inconsistent Readings**: Ensure sensors are warmed up and not exposed to vibrations
3. **LEDs Not Responding**: Verify pin connections and that LEDs are properly polarized
4. **Buzzer Too Loud**: Add a 1kΩ resistor in series with the buzzer or use PWM
