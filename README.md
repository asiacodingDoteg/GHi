# Gas Monitoring System GUI - 3 MQ Sensors

A real-time web-based GUI application for monitoring gas sensors (MQ series) connected to an Arduino via serial communication.

## Features

✅ **Real-time Monitoring**: Live sensor readings with automatic refresh
✅ **Multiple Data Formats**: Supports GAS=value, CSV, and JSON formats
✅ **3 Independent Sensors**: Side-by-side panel layout for easy comparison
✅ **Visual Indicators**:
  - Green LED (Safe) / Red LED (Alert)
  - Buzzer icon with animation (when gas detected)
  - Status badge (Safe / Gas Detected)

✅ **Smart Event Logging**: Timestamped log of all status changes
✅ **Settings Panel**:
  - Adjustable threshold (0-2000 ppm) with slider
  - Quick presets (200/300/500/1000 ppm)
  - Auto-save to browser storage

✅ **Responsive Design**: Works on desktop, tablet, and mobile
✅ **Mandatory UART**: Requires real hardware connection (no mock data)
✅ **Dark Mode**: Eye-friendly interface with toggle  

## System Requirements

- Modern web browser (Chrome, Edge, Firefox, Safari)
- Arduino with 3 MQ sensors (any model: MQ-2, MQ-5, MQ-7, MQ-135, etc.)
- USB cable for Arduino connection
- Node.js 14+ (for development)

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

The app will start at `http://localhost:3000/`

### 3. Connect Arduino

**Option A: Using Web Serial API (Recommended)**
- Click on the connection status indicator in the top-right
- Select your Arduino COM port
- Grant browser permission to access the serial port
- The app will automatically connect and receive data

**Option B: Mock Data (No Arduino Needed)**
- If you don't select a serial port, the app simulates random sensor readings
- This is perfect for testing and development

### 4. Upload Arduino Code

See `ARDUINO_EXAMPLE.md` for complete Arduino sketch and pin configuration.

## Serial Data Format

The GUI supports three data formats from Arduino:

### GAS=value Format (Recommended for Single Sensor)
```
GAS=450
GAS=280
```
Simple, lightweight format for single gas sensor. See `ARDUINO_EXAMPLE_GAS_FORMAT.md` for details.

### CSV Format (Multiple Sensors)
```
value1,value2,value3
450,280,320
```

### JSON Format
```json
{"sensor1":450,"sensor2":280,"sensor3":320}
```

**Baud Rate**: 9600

## Configuration

### Adjust Gas Detection Threshold (Via Settings Panel)

1. Once connected to UART, click **⚙️ Settings** button
2. Use the **Threshold slider** to adjust (0-2000 ppm)
3. Or use **Quick Presets**:
   - 200 ppm: High sensitivity
   - 300 ppm: Balanced (default)
   - 500 ppm: Medium sensitivity
   - 1000 ppm: Low sensitivity
4. Settings save **automatically** to browser storage

### Programmatic Configuration

If you need to change defaults, edit `src/App.jsx`:

```javascript
const DEFAULT_THRESHOLD = 300  // Default threshold in ppm
```

### Modify Sensor Names

Edit `src/App.jsx` line 10:
```javascript
const SENSOR_IDS = ['Sensor 1', 'Sensor 2', 'Sensor 3']
```

## File Structure

```
├── src/
│   ├── App.jsx                 # Main application component
│   ├── main.jsx                # Entry point
│   ├── components/
│   │   ├── SensorPanel.jsx     # Individual sensor display
│   │   └── EventLog.jsx        # Event log display
│   ├── utils/
│   │   └── serialHandler.js    # Serial communication handler
│   └── styles/
│       ├── global.css          # Global styles
│       ├── app.css             # App layout styles
│       ├── sensor-panel.css    # Sensor panel styles
│       └── event-log.css       # Event log styles
├── ARDUINO_EXAMPLE.md          # Arduino code examples
├── README.md                   # This file
├── index.html                  # HTML entry point
├── vite.config.js              # Vite configuration
└── package.json                # Project dependencies
```

## Features Explained

### Settings Panel (Connected Only)
Accessible via **⚙️ Settings** button in header:
- **Threshold Slider**: Fine-tune gas detection threshold (0-2000 ppm)
- **Numeric Input**: Enter exact PPM value
- **Quick Presets**: 200/300/500/1000 ppm presets
- **Auto-Save**: Settings persist in browser storage
- **Real-time Updates**: All sensors immediately use new threshold

### Sensor Panels
Each sensor panel displays:
- **Sensor Name**: Labeled Sensor 1, 2, or 3
- **Real-time Reading**: Current PPM value with large, easy-to-read display
- **Threshold**: Shows the alert threshold (default 300 ppm)
- **LED Indicators**: 
  - Green LED (ON when reading < threshold)
  - Red LED (ON when reading > threshold)
- **Buzzer Status**: Shows "Buzzer ON/OFF" with animated indicator
- **Status Badge**: "Safe" or "Gas Detected"

### Event Log
Located at the bottom of the screen:
- Shows all state changes (threshold crossing events)
- Displays timestamp of each event
- Color-coded: Green for normal, Red for alerts
- Latest events appear at the top
- Scrollable history (keeps last 50 events)

### Connection Status
Top-right corner shows:
- **Green dot**: Connected to Arduino
- **Yellow dot**: Using mock data (disconnected)

## Troubleshooting

### Arduino Not Connecting
1. Check USB cable and drivers
2. Verify baud rate is 9600
3. Check Arduino COM port in Device Manager
4. Try clicking the connection status indicator again

### No Data Appearing
1. Verify Arduino is sending data in correct format
2. Open Arduino Serial Monitor to verify data
3. Check sensor connections and power supply
4. Allow browser permission to access USB devices

### LEDs Not Responding on Arduino
1. Check pin connections match Arduino code
2. Verify LED polarity (longer leg is +)
3. Check resistor values (220Ω recommended)
4. Test LEDs with simple digitalWrite sketch first

### Sensors Reading Very High/Low
1. Give sensors 1-2 hours warmup time
2. Calibrate sensors in clean air
3. Check sensor connections for loose wires
4. Verify analog pin configuration

## Advanced Configuration

### Custom Alert Sound
The GUI currently shows a visual buzzer indicator. To add actual audio:

1. Uncomment audio code in `SensorPanel.jsx`
2. Use Web Audio API or HTML5 `<audio>` tag
3. Trigger alert sound when `isAlerting === true`

### Data Logging to Database
To store sensor data:
1. Add API endpoint in backend
2. Call POST request in `App.jsx` when threshold exceeded
3. Store timestamp and sensor ID with reading
4. Build dashboard to view historical data

### Multiple Arduino Boards
Current implementation supports one Arduino. For multiple:
1. Update `SerialHandler` to handle multiple ports
2. Create separate handler instances per device
3. Update state management to handle multiple data sources

## Browser Compatibility

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome  | ✅ Full | Recommended, full Web Serial API support |
| Edge    | ✅ Full | Full Web Serial API support |
| Firefox | ⚠️ Partial | Limited Web Serial API support |
| Safari  | ❌ None | No Web Serial API support |

For Safari, use alternative connection method or consider WebSocket + Serial gateway.

## Building for Production

```bash
npm run build
```

Output will be in the `dist/` folder. Deploy to any static hosting service.

## License

This project is open source and available for educational and commercial use.

## Support

For Arduino setup issues, see `ARDUINO_EXAMPLE.md`.  
For GUI issues, check browser console (F12) for error messages.

## Future Enhancements

- [ ] Data export to CSV
- [ ] Historical graph display
- [ ] Configurable alert sounds
- [ ] Multiple Arduino support
- [ ] Database integration
- [ ] Mobile app version
- [ ] Email/SMS notifications
- [ ] Cloud data sync

---

**Made with ❤️ for IoT enthusiasts**
