import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../../components/Navbar'
import { Event, ViewMode } from '../types'
import EventsHeader from '../components/EventsHeader'
import EventsList from '../components/EventsList'
import { useEvents } from '../hooks'
import { getCalendarSubscriptionUrl } from '../services'
import './Events.css'

function Events() {
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const navigate = useNavigate()
  const { events, loading, error, updateFilters } = useEvents()

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        updateFilters({ search: searchQuery })
      } else {
        updateFilters({ search: undefined })
      }
    }, 300)
    
    return () => clearTimeout(timer)
  }, [searchQuery]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleFindEvents = () => {
    updateFilters({ search: searchQuery })
  }

  const handleSubscribe = () => {
    // Open calendar subscription URL
    window.open(getCalendarSubscriptionUrl(), '_blank')
  }

  const handleEventClick = (event: Event) => {
    navigate(`/events/${event.id}`)
  }

  return (
    <div className="events-page">
      <Navbar />
      <div className="events-container">
        <EventsHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onFindEvents={handleFindEvents}
          onSubscribe={handleSubscribe}
        />

        {loading ? (
          <div className="events-loading">Loading events...</div>
        ) : error ? (
          <div className="events-error">
            <p>Unable to load events. Please try again later.</p>
          </div>
        ) : (
          <EventsList
            events={events}
            onEventClick={handleEventClick}
            emptyMessage="No events found. Try adjusting your search."
          />
        )}
      </div>
    </div>
  )
}

export default Events
