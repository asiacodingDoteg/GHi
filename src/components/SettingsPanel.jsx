import '../styles/settings-panel.css'

export default function SettingsPanel({ threshold, onThresholdChange, onClose }) {
  const handleSliderChange = (e) => {
    const value = parseInt(e.target.value, 10)
    onThresholdChange(value)
  }

  const handleInputChange = (e) => {
    const value = parseInt(e.target.value, 10) || 0
    if (value >= 0 && value <= 2000) {
      onThresholdChange(value)
    }
  }

  const handlePreset = (value) => {
    onThresholdChange(value)
  }

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-panel" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <h2 className="settings-title">Sensor Settings</h2>
          <button className="settings-close" onClick={onClose} aria-label="Close settings">
            ✕
          </button>
        </div>

        <div className="settings-content">
          <div className="settings-section">
            <h3 className="settings-section-title">Gas Detection Threshold</h3>
            <p className="settings-description">
              Set the PPM (parts per million) value at which sensors trigger an alert.
            </p>

            <div className="threshold-control">
              <label className="threshold-label" htmlFor="threshold-slider">
                Threshold Value
              </label>
              <div className="threshold-input-group">
                <input
                  type="range"
                  id="threshold-slider"
                  className="threshold-slider"
                  min="0"
                  max="2000"
                  step="10"
                  value={threshold}
                  onChange={handleSliderChange}
                />
                <input
                  type="number"
                  className="threshold-input"
                  min="0"
                  max="2000"
                  value={threshold}
                  onChange={handleInputChange}
                />
                <span className="threshold-unit">ppm</span>
              </div>
              <div className="threshold-range">
                <span className="range-min">0 ppm</span>
                <span className="range-max">2000 ppm</span>
              </div>
            </div>

            <div className="preset-buttons">
              <p className="preset-label">Quick Presets:</p>
              <div className="presets">
                <button
                  className={`preset-button ${threshold === 200 ? 'active' : ''}`}
                  onClick={() => handlePreset(200)}
                >
                  200 ppm
                </button>
                <button
                  className={`preset-button ${threshold === 300 ? 'active' : ''}`}
                  onClick={() => handlePreset(300)}
                >
                  300 ppm
                </button>
                <button
                  className={`preset-button ${threshold === 500 ? 'active' : ''}`}
                  onClick={() => handlePreset(500)}
                >
                  500 ppm
                </button>
                <button
                  className={`preset-button ${threshold === 1000 ? 'active' : ''}`}
                  onClick={() => handlePreset(1000)}
                >
                  1000 ppm
                </button>
              </div>
            </div>
          </div>

          <div className="settings-info">
            <h4 className="info-title">ℹ️ Information</h4>
            <ul className="info-list">
              <li>Lower values = More sensitive (more alerts)</li>
              <li>Higher values = Less sensitive (fewer alerts)</li>
              <li>Settings are saved automatically</li>
              <li>All sensors use the same threshold</li>
            </ul>
          </div>
        </div>

        <div className="settings-footer">
          <button className="settings-done-button" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
