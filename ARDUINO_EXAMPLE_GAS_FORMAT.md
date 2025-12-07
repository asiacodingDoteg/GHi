# Arduino Gas Monitoring System - GAS=value Format

This document provides example Arduino code for the Gas Monitoring System GUI using the new `GAS=value` format.

## Hardware Setup

- Arduino Uno/Nano/Mega
- 1x MQ Sensor (MQ-2, MQ-5, MQ-7, etc.)
- Optional: Additional sensors for multi-sensor setup
- USB cable for serial communication

## Pin Configuration

```
Sensor (Analog):
- Gas Sensor: A0

Optional LED/Buzzer pins (for local feedback):
- Green LED: Pin 2
- Red LED: Pin 3
- Buzzer: Pin 4
```

## Arduino Code - GAS=value Format (Recommended)

```cpp
// Simple Gas Sensor Reading with GAS=value format
// This is the recommended format for the Gas Monitoring GUI

const int GAS_SENSOR_PIN = A0;

void setup() {
  // Initialize Serial Communication at 9600 baud
  Serial.begin(9600);
  delay(1000);
}

void loop() {
  // Read analog value from gas sensor
  int rawValue = analogRead(GAS_SENSOR_PIN);
  
  // Convert to PPM (parts per million)
  // This conversion depends on your sensor's calibration
  // Simple linear mapping: 0-1023 ADC to 0-2000 PPM
  int ppmValue = map(rawValue, 0, 1023, 0, 2000);
  
  // Send data in GAS=value format
  Serial.print("GAS=");
  Serial.println(ppmValue);
  
  // Send data every 1 second
  delay(1000);
}
```

## Advanced Example with Local LED Feedback

```cpp
const int GAS_SENSOR_PIN = A0;
const int GREEN_LED_PIN = 2;
const int RED_LED_PIN = 3;
const int BUZZER_PIN = 4;

const int THRESHOLD = 300;  // Alert threshold in PPM

void setup() {
  Serial.begin(9600);
  
  pinMode(GREEN_LED_PIN, OUTPUT);
  pinMode(RED_LED_PIN, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  
  delay(1000);
}

void loop() {
  int rawValue = analogRead(GAS_SENSOR_PIN);
  int ppmValue = map(rawValue, 0, 1023, 0, 2000);
  
  // Control local LEDs and buzzer
  if (ppmValue > THRESHOLD) {
    digitalWrite(GREEN_LED_PIN, LOW);
    digitalWrite(RED_LED_PIN, HIGH);
    digitalWrite(BUZZER_PIN, HIGH);
  } else {
    digitalWrite(GREEN_LED_PIN, HIGH);
    digitalWrite(RED_LED_PIN, LOW);
    digitalWrite(BUZZER_PIN, LOW);
  }
  
  // Send data to GUI
  Serial.print("GAS=");
  Serial.println(ppmValue);
  
  delay(1000);
}
```

## Data Format Specifications

### GAS=value Format
```
GAS=150
GAS=450
GAS=1200
```

**Advantages:**
- Simple and lightweight
- Easy to parse
- Works with single sensor
- Lower bandwidth usage

**Notes:**
- Value range: 0-2000 PPM (recommended)
- Sent once per second (or as needed)
- No spaces or special characters

## Sensor Calibration

### Important: PPM Conversion

The conversion from ADC reading to PPM depends on your specific sensor:

```cpp
// For MQ-2 Sensor:
// Sensitivity: typically 200-10000 ppm for LPG
// You need to calibrate the sensor first

// Step 1: Take baseline reading in clean air
int baselineValue = readAverageADC(10);  // Average of 10 readings

// Step 2: Calculate PPM using sensor's sensitivity curve
// Most MQ sensors use a logarithmic relationship:
// ppm = 10^((log10(rawValue/baselineValue) - B) / m)
// Where m and B are sensor-specific constants
```

### Basic Calibration Code

```cpp
const int CALIBRATION_TIME = 60000;  // 60 seconds
const float m = 2.3;  // Sensor slope (varies by sensor type)
const float B = 0.9;  // Sensor intercept (varies by sensor type)

int baselinePPM = 400;  // Baseline in clean air (adjust based on your environment)

int readPPM(int rawValue) {
  float ratio = (float)rawValue / baselinePPM;
  
  // Using exponential relationship
  float ppm = 116.6022582 * pow(ratio, -2.769034857);
  
  return (int)ppm;
}

void loop() {
  int rawValue = analogRead(GAS_SENSOR_PIN);
  int ppmValue = readPPM(rawValue);
  
  Serial.print("GAS=");
  Serial.println(ppmValue);
  
  delay(1000);
}
```

## GUI Settings

The Gas Monitoring System GUI now supports adjustable thresholds:

1. **Connect to UART** and establish connection
2. **Click ⚙️ Settings** button in the header
3. **Adjust Threshold** using the slider (0-2000 PPM)
4. **Use Quick Presets:**
   - 200 ppm: High sensitivity (more alerts)
   - 300 ppm: Balanced (default)
   - 500 ppm: Medium sensitivity
   - 1000 ppm: Low sensitivity (fewer alerts)
5. **Settings are saved automatically** to browser storage

## Testing Your Arduino Code

### Step 1: Upload Code
1. Open Arduino IDE
2. Copy the code from above
3. Select correct board and COM port
4. Click Upload

### Step 2: Test with Serial Monitor
1. Open Serial Monitor (Tools → Serial Monitor)
2. Set baud rate to 9600
3. Verify you see output like: `GAS=450`

### Step 3: Connect to GUI
1. Open the Gas Monitoring System app
2. Click "🔌 Connect" button
3. Select your Arduino COM port
4. Grant browser permission
5. Verify data appears in Sensor 1 panel

### Step 4: Test Settings
1. Click "⚙️ Settings" button
2. Adjust the threshold slider
3. Verify sensor status changes appropriately

## Troubleshooting

### No Data in GUI
- **Check:** Serial Monitor shows `GAS=value` output
- **Check:** Baud rate is 9600
- **Check:** COM port is selected correctly
- **Check:** Arduino is powered on and connected

### Readings Seem Wrong
- **Calibrate:** Expose sensor to known PPM values
- **Check:** Sensor has warmed up (24+ hours recommended)
- **Check:** Sensor is not exposed to extreme temperatures
- **Check:** ADC mapping is correct for your sensor

### Buzzer/LED Not Working on Arduino
- **Note:** GUI buzzer is visual only (animation)
- **Check:** Local Arduino LEDs/buzzer wiring
- **Check:** Pin definitions match your hardware

## Alternative Data Formats

The GUI still supports other formats if needed:

### CSV Format (Multiple Sensors)
```
150,200,180
```

### JSON Format
```json
{"sensor1":150,"sensor2":200,"sensor3":180}
```

## Performance Tips

- **Lower delay():** 500ms updates = more responsive but higher bandwidth
- **Higher delay():** 2000ms updates = lower bandwidth but less responsive
- **Sensor warmup:** Allow 24+ hours for sensor stabilization
- **Filtering:** Consider averaging multiple readings for stability

## Sensor Recommendations

- **MQ-2:** LPG, butane, methane (50-10000 ppm)
- **MQ-5:** LPG, natural gas (200-10000 ppm)
- **MQ-7:** Carbon monoxide (10-10000 ppm)
- **MQ-135:** Air quality (10-1000 ppm CO2 equivalent)
- **MQ-136:** Hydrogen sulfide (0-100 ppm)
- **MQ-137:** Ammonia (5-500 ppm)

Choose based on the gas you need to detect!

## Next Steps

1. ✅ Upload Arduino code
2. ✅ Test with Serial Monitor
3. ✅ Connect to GUI
4. ✅ Adjust settings as needed
5. ✅ Monitor events in the log

---

**Questions?** Check the main README.md for more information!
