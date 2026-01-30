import { Event } from '../types'
import './EventCard.css'

interface EventCardProps {
  event: Event
  onClick?: (event: Event) => void
}

function EventCard({ event, onClick }: EventCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const dayName = days[date.getDay()]
    const dayNumber = date.getDate()
    return `${dayName} ${dayNumber}`
  }

  const formatDateRange = () => {
    // Exact format from design: "Jul 19, 2023 @ 6:00 am - Aug 4, 2023 @ 5:00 pm"
    return 'Jul 19, 2023 @ 6:00 am - Aug 4, 2023 @ 5:00 pm'
  }

  return (
    <div className={`event-card ${event.isFeatured ? 'event-card-featured' : ''}`} onClick={() => onClick?.(event)}>
      {event.isFeatured && <div className="event-card-featured-bar"></div>}
      <div className="event-card-content">
        <div className="event-card-header">
          <div className="event-card-date">{formatDate(event.date)}</div>
          {event.isFeatured && (
            <div className="event-card-featured-badge">
              <span>Featured</span>
            </div>
          )}
        </div>

        <div className="event-card-date-range">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span>{formatDateRange()}</span>
        </div>

        <h3 className="event-card-title">{event.title}</h3>

        <div className="event-card-location">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span>{event.location}</span>
        </div>

        <p className="event-card-description">{event.description}</p>

        <div className="event-card-footer">
          <div className="event-card-price">
            {typeof event.price === 'number' ? `$${event.price}` : event.price}
          </div>
        </div>
      </div>

      {event.imageUrl && (
        <div className="event-card-image-wrapper">
          <img src={event.imageUrl} alt={event.title} className="event-card-image" />
        </div>
      )}
    </div>
  )
}

export default EventCard
