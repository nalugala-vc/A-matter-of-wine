import { Event } from '../types'
import EventCard from './EventCard'
import './EventsList.css'

interface EventsListProps {
  events: Event[]
  onEventClick?: (event: Event) => void
  emptyMessage?: string
}

function EventsList({ events, onEventClick, emptyMessage = 'No events found.' }: EventsListProps) {
  // Group events by month
  const groupedEvents = events.reduce((acc, event) => {
    const date = new Date(event.date)
    const monthKey = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    
    if (!acc[monthKey]) {
      acc[monthKey] = []
    }
    acc[monthKey].push(event)
    return acc
  }, {} as Record<string, Event[]>)

  // Sort months chronologically
  const sortedMonths = Object.keys(groupedEvents).sort((a, b) => {
    return new Date(a).getTime() - new Date(b).getTime()
  })

  if (events.length === 0) {
    return (
      <div className="events-list-empty">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        <p className="events-list-empty-text">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="events-list">
      {sortedMonths.map((month) => (
        <div key={month} className="events-month-group">
          <h2 className="events-month-title">{month}</h2>
          <div className="events-month-events">
            {groupedEvents[month].map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onClick={onEventClick}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default EventsList
