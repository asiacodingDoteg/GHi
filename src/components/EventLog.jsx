import '../styles/event-log.css'

export default function EventLog({ events }) {
  return (
    <div className="event-log-container">
      <h2 className="event-log-title">Event Log</h2>
      <div className="event-log-list">
        {events.length === 0 ? (
          <div className="event-log-empty">No events yet</div>
        ) : (
          events.map((event) => (
            <div key={event.id} className={`event-log-item ${event.type}`}>
              <span className="event-timestamp">{event.timestamp}</span>
              <span className="event-message">{event.message}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
