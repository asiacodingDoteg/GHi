import { useState, useEffect, useRef } from 'react'
import SensorPanel from './components/SensorPanel'
import EventLog from './components/EventLog'
import { SerialHandler } from './utils/serialHandler'
import './styles/app.css'

const THRESHOLD = 300
const SENSOR_IDS = ['Sensor 1', 'Sensor 2', 'Sensor 3']

export default function App() {
  const [sensors, setSensors] = useState({
    'Sensor 1': { reading: 0, status: 'Safe', isAlerting: false },
    'Sensor 2': { reading: 0, status: 'Safe', isAlerting: false },
    'Sensor 3': { reading: 0, status: 'Safe', isAlerting: false },
  })
  const [events, setEvents] = useState([])
  const [isConnected, setIsConnected] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true'
    }
    return false
  })
  const [isLoading, setIsLoading] = useState(false)
  const [connectionError, setConnectionError] = useState(null)
  const serialHandlerRef = useRef(null)
  const previousStatusRef = useRef({
    'Sensor 1': 'Safe',
    'Sensor 2': 'Safe',
    'Sensor 3': 'Safe',
  })

  useEffect(() => {
    localStorage.setItem('darkMode', isDarkMode)
    if (isDarkMode) {
      document.documentElement.classList.add('dark-mode')
    } else {
      document.documentElement.classList.remove('dark-mode')
    }
  }, [isDarkMode])

  const connectToUART = async () => {
    setIsLoading(true)
    setConnectionError(null)

    if (!serialHandlerRef.current) {
      serialHandlerRef.current = new SerialHandler()
    }

    try {
      const handleData = (data) => {
        try {
          let parsedData

          if (typeof data === 'string') {
            if (data.includes(',')) {
              const values = data.split(',').map(v => parseFloat(v.trim()))
              parsedData = {
                sensor1: values[0] || 0,
                sensor2: values[1] || 0,
                sensor3: values[2] || 0,
              }
            } else {
              parsedData = JSON.parse(data)
            }
          } else {
            parsedData = data
          }

          setSensors(prevSensors => {
            const newSensors = { ...prevSensors }
            const newEvents = []

            SENSOR_IDS.forEach((sensorId, index) => {
              const key = `sensor${index + 1}`
              const reading = Math.round(parsedData[key] || 0)
              const isAlerting = reading > THRESHOLD
              const newStatus = isAlerting ? 'Gas Detected' : 'Safe'

              newSensors[sensorId] = {
                reading,
                status: newStatus,
                isAlerting,
              }

              if (previousStatusRef.current[sensorId] !== newStatus) {
                const timestamp = new Date().toLocaleTimeString()
                const eventMessage = isAlerting
                  ? `${sensorId} detected gas at ${reading} ppm`
                  : `${sensorId} returned to safe level (${reading} ppm)`

                newEvents.push({
                  id: Date.now() + index,
                  message: eventMessage,
                  timestamp,
                  type: isAlerting ? 'alert' : 'normal',
                })

                previousStatusRef.current[sensorId] = newStatus
              }
            })

            if (newEvents.length > 0) {
              setEvents(prevEvents => [...newEvents, ...prevEvents].slice(0, 50))
            }

            return newSensors
          })
        } catch (error) {
          console.error('Error parsing sensor data:', error)
        }
      }

      const handleConnect = () => {
        setIsConnected(true)
        setConnectionError(null)
        setIsLoading(false)
      }

      const handleDisconnect = () => {
        setIsConnected(false)
        setConnectionError('UART connection lost. Please reconnect.')
      }

      serialHandlerRef.current.onData(handleData)
      serialHandlerRef.current.onConnect(handleConnect)
      serialHandlerRef.current.onDisconnect(handleDisconnect)

      const connected = await serialHandlerRef.current.initialize()

      if (!connected) {
        setConnectionError('Failed to connect to UART. Please select a valid serial port.')
        setIsLoading(false)
      }
    } catch (error) {
      setConnectionError(`Connection error: ${error.message}`)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    connectToUART()
  }, [])

  const handleRetryConnection = () => {
    connectToUART()
  }

  const renderEmptyState = () => (
    <div className="empty-state">
      <div className="empty-state-content">
        <h2 className="empty-state-title">UART Connection Required</h2>
        <p className="empty-state-description">
          This application requires a real-time UART connection to display sensor data.
        </p>
        {connectionError && (
          <p className="empty-state-error">{connectionError}</p>
        )}
        <button
          className="connect-button"
          onClick={handleRetryConnection}
          disabled={isLoading}
        >
          {isLoading ? 'Connecting...' : 'Connect to UART'}
        </button>
      </div>
    </div>
  )

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">Gas Monitoring System – 3 MQ Sensors</h1>
        <div className="header-controls">
          <button
            className="dark-mode-toggle"
            onClick={() => setIsDarkMode(!isDarkMode)}
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
          <div className="header-buttons">
            {!isConnected && (
              <button
                className="reconnect-button"
                onClick={handleRetryConnection}
                disabled={isLoading}
                title="Reconnect to UART"
              >
                {isLoading ? '⏳ Connecting...' : '🔌 Connect'}
              </button>
            )}
            <div className="connection-status">
              <span className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}></span>
              <span className="status-text">{isConnected ? 'Connected to UART' : 'Not Connected'}</span>
            </div>
          </div>
        </div>
      </header>

      {!isConnected ? (
        renderEmptyState()
      ) : (
        <>
          <main className="sensors-container">
            {SENSOR_IDS.map((sensorId) => (
              <SensorPanel
                key={sensorId}
                sensorId={sensorId}
                reading={sensors[sensorId].reading}
                status={sensors[sensorId].status}
                isAlerting={sensors[sensorId].isAlerting}
                threshold={THRESHOLD}
              />
            ))}
          </main>

          <footer className="app-footer">
            <EventLog events={events} />
          </footer>
        </>
      )}
    </div>
  )
}
