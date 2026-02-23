import { useParams, Link } from 'react-router-dom'
import { useTicket } from '../hooks'
import { getTicketQrUrl } from '../services'
import Navbar from '../../../components/Navbar'
import './TicketConfirmation.css'

function TicketConfirmation() {
  const { ticketCode } = useParams<{ ticketCode: string }>()
  const { ticket, loading } = useTicket(ticketCode || null)

  if (loading) {
    return (
      <div className="confirmation-page">
        <Navbar />
        <div className="confirmation-container">
          <p className="confirmation-loading">Loading your ticket...</p>
        </div>
      </div>
    )
  }

  if (!ticket) {
    return (
      <div className="confirmation-page">
        <Navbar />
        <div className="confirmation-container">
          <p>Ticket not found.</p>
          <Link to="/events" className="confirmation-btn confirmation-btn-primary">
            Browse Events
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="confirmation-page">
      <Navbar />
      <div className="confirmation-container">
        <div className="confirmation-success-icon">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>

        <h1 className="confirmation-title">Ticket Confirmed!</h1>
        <p className="confirmation-subtitle">
          Your ticket has been confirmed. A confirmation email has been sent.
        </p>

        <div className="confirmation-ticket-card">
          <div className="confirmation-ticket-code">{ticket.ticketCode}</div>

          <div className="confirmation-event-name">{ticket.eventTitle}</div>

          <div className="confirmation-event-detail">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            {ticket.eventDate}
          </div>

          <div className="confirmation-event-detail">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {ticket.eventLocation}
          </div>

          {ticket.qrCodeUrl && (
            <>
              <div className="confirmation-qr-wrapper">
                <img src={getTicketQrUrl(ticket.ticketCode)} alt="Ticket QR Code" />
              </div>
              <p className="confirmation-qr-hint">
                Show this QR code at the event entrance
              </p>
            </>
          )}
        </div>

        <div className="confirmation-actions">
          <Link
            to={`/tickets/verify/${ticket.ticketCode}`}
            className="confirmation-btn confirmation-btn-primary"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
            View Full Ticket
          </Link>
          <Link to="/tickets" className="confirmation-btn confirmation-btn-secondary">
            My Tickets
          </Link>
          <Link to="/events" className="confirmation-btn confirmation-btn-secondary">
            Browse Events
          </Link>
        </div>
      </div>
    </div>
  )
}

export default TicketConfirmation
