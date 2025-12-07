import '../styles/sensor-panel.css'

export default function SensorPanel({ sensorId, reading, status, isAlerting, threshold }) {
  return (
    <div className={`sensor-panel ${isAlerting ? 'alert-active' : ''}`}>
      <h2 className="sensor-title">{sensorId}</h2>
      
      <div className="reading-display">
        <div className="reading-value">{reading}</div>
        <div className="reading-unit">ppm</div>
      </div>

      <div className="threshold-indicator">
        <span className="threshold-label">Threshold: {threshold} ppm</span>
      </div>

      <div className="led-container">
        <div className={`led led-green ${!isAlerting ? 'led-active' : ''}`}>
          <span className="led-label">Safe</span>
        </div>
        <div className={`led led-red ${isAlerting ? 'led-active' : ''}`}>
          <span className="led-label">Alert</span>
        </div>
      </div>

      <div className="buzzer-container">
        <div className={`buzzer-indicator ${isAlerting ? 'buzzer-active' : ''}`}>
          <svg className="buzzer-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9v6c0 1.105.895 2 2 2h4l4 4v-8l4 4h4c1.105 0 2-.895 2-2V9"></path>
            <line x1="1" y1="5" x2="23" y2="19"></line>
          </svg>
          <span className="buzzer-label">{isAlerting ? 'Buzzer ON' : 'Buzzer OFF'}</span>
        </div>
      </div>

      <div className={`status-badge ${isAlerting ? 'status-alert' : 'status-safe'}`}>
        {status}
      </div>
    </div>
  )
}
