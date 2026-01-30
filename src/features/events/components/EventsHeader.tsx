import { ViewMode } from '../types'
import './EventsHeader.css'

interface EventsHeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  onFindEvents: () => void
  onSubscribe: () => void
}

function EventsHeader({
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  onFindEvents,
  onSubscribe,
}: EventsHeaderProps) {
  return (
    <div className="events-header">
      <h1 className="events-title">Upcoming Events</h1>

      <div className="events-controls">
        <div className="events-search-section">
          <div className="events-search-wrapper">
            <svg
              className="events-search-icon"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search for events..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="events-search-input"
            />
          </div>
          <button className="events-find-btn" onClick={onFindEvents}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            Find Events
          </button>
        </div>

        <div className="events-view-controls">
          <div className="events-view-options">
            <button
              className={`events-view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => onViewModeChange('list')}
            >
              List
            </button>
            <button
              className={`events-view-btn ${viewMode === 'month' ? 'active' : ''}`}
              onClick={() => onViewModeChange('month')}
            >
              Month
            </button>
            <button
              className={`events-view-btn ${viewMode === 'day' ? 'active' : ''}`}
              onClick={() => onViewModeChange('day')}
            >
              Day
            </button>
          </div>
          <button className="events-subscribe-btn" onClick={onSubscribe}>
            Subscribe to calendar
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default EventsHeader
