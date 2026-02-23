import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useEvent } from '../hooks'
import { useAuth } from '../../../contexts/AuthContext'
import { purchaseTicket } from '../../tickets/services'
import { getMyTickets } from '../../tickets/services'
import { Ticket } from '../../tickets/types'
import Navbar from '../../../components/Navbar'
import './EventDetail.css'

function EventDetail() {
  const { eventId } = useParams<{ eventId: string }>()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const { event, loading, error } = useEvent(eventId || null)
  const [purchasing, setPurchasing] = useState(false)
  const [existingTicket, setExistingTicket] = useState<Ticket | null>(null)
  const [ticketCheckDone, setTicketCheckDone] = useState(false)

  // Check if user already has a ticket
  useEffect(() => {
    if (!isAuthenticated || !eventId) {
      setTicketCheckDone(true)
      return
    }

    const checkExistingTicket = async () => {
      try {
        const result = await getMyTickets(1, 50)
        const found = result.tickets.find(
          (t) => t.eventId === eventId && (t.status === 'confirmed' || t.status === 'pending_payment')
        )
        setExistingTicket(found || null)
      } catch {
        // ignore
      } finally {
        setTicketCheckDone(true)
      }
    }

    checkExistingTicket()
  }, [isAuthenticated, eventId])

  const handleBuyTicket = async () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    if (!eventId) return

    setPurchasing(true)
    try {
      const ticket = await purchaseTicket(eventId, 1)
      navigate(`/tickets/confirmation/${ticket.ticketCode}`)
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to purchase ticket')
    } finally {
      setPurchasing(false)
    }
  }

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatTime = (time: string) => {
    if (!time) return ''
    const [h, m] = time.split(':')
    const hour = parseInt(h)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const hour12 = hour % 12 || 12
    return `${hour12}:${m} ${ampm}`
  }

  if (loading) {
    return (
      <div className="event-detail-page">
        <Navbar />
        <div className="event-detail-container">
          <div className="event-detail-loading">Loading event details...</div>
        </div>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="event-detail-page">
        <Navbar />
        <div className="event-detail-container">
          <div className="event-detail-error">
            <p>{error || 'Event not found'}</p>
            <button className="event-detail-back" onClick={() => navigate('/events')}>
              Back to Events
            </button>
          </div>
        </div>
      </div>
    )
  }

  const priceDisplay = typeof event.price === 'number' ? `$${event.price.toFixed(2)}` : 'Free'
  const isFree = event.price === 'Free' || event.price === 0

  return (
    <div className="event-detail-page">
      <Navbar />
      <div className="event-detail-container">
        <button className="event-detail-back" onClick={() => navigate('/events')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to Events
        </button>

        {/* Hero Image */}
        <div className="event-detail-hero">
          {event.imageUrl ? (
            <img src={event.imageUrl} alt={event.title} />
          ) : (
            <div className="event-detail-hero-placeholder">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
          )}
        </div>

        {/* Badges */}
        <div className="event-detail-meta">
          {event.isFeatured && (
            <span className="event-detail-badge event-detail-badge-featured">Featured</span>
          )}
          {event.category && (
            <span className="event-detail-badge event-detail-badge-category">{event.category}</span>
          )}
        </div>

        {/* Title */}
        <h1 className="event-detail-title">{event.title}</h1>

        {/* Info Grid */}
        <div className="event-detail-info-grid">
          <div className="event-detail-info-item">
            <div className="event-detail-info-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <div>
              <div className="event-detail-info-label">Date</div>
              <div className="event-detail-info-value">{formatDate(event.date)}</div>
            </div>
          </div>

          <div className="event-detail-info-item">
            <div className="event-detail-info-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <div>
              <div className="event-detail-info-label">Time</div>
              <div className="event-detail-info-value">
                {formatTime(event.startTime)} - {formatTime(event.endTime)}
              </div>
            </div>
          </div>

          <div className="event-detail-info-item">
            <div className="event-detail-info-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <div>
              <div className="event-detail-info-label">Location</div>
              <div className="event-detail-info-value">{event.location}</div>
            </div>
          </div>

          <div className="event-detail-info-item">
            <div className="event-detail-info-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div>
              <div className="event-detail-info-label">Attendees</div>
              <div className="event-detail-info-value">
                {event.attendeeCount}
                {event.maxAttendees ? ` / ${event.maxAttendees}` : ''} attending
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="event-detail-description">{event.description}</div>

        {/* Ticket Section */}
        <div className="event-detail-ticket-section">
          <div className="event-detail-ticket-header">
            <h3 className="event-detail-ticket-title">
              {isFree ? 'Get Your Free Ticket' : 'Get Your Ticket'}
            </h3>
            <span className="event-detail-price">{priceDisplay}</span>
          </div>

          {event.maxAttendees && (
            <div className="event-detail-capacity">
              {event.maxAttendees - event.attendeeCount} spots remaining out of {event.maxAttendees}
              <div className="event-detail-capacity-bar">
                <div
                  className="event-detail-capacity-fill"
                  style={{ width: `${(event.attendeeCount / event.maxAttendees) * 100}%` }}
                />
              </div>
            </div>
          )}

          {ticketCheckDone && existingTicket ? (
            <div className="event-detail-has-ticket">
              <p>You already have a ticket for this event!</p>
              <Link
                to={`/tickets/verify/${existingTicket.ticketCode}`}
                className="event-detail-view-ticket-btn"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <polyline points="10 17 15 12 10 7" />
                  <line x1="15" y1="12" x2="3" y2="12" />
                </svg>
                View Ticket
              </Link>
            </div>
          ) : (
            <button
              className="event-detail-buy-btn"
              onClick={handleBuyTicket}
              disabled={purchasing}
            >
              {purchasing ? (
                'Processing...'
              ) : isFree ? (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  Get Free Ticket
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                    <line x1="1" y1="10" x2="23" y2="10" />
                  </svg>
                  Buy Ticket - {priceDisplay}
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default EventDetail
