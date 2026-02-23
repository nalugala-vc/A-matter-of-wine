import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMyTickets } from '../hooks'
import { getTicketQrUrl } from '../services'
import { Ticket } from '../types'
import Navbar from '../../../components/Navbar'
import './MyTickets.css'

const STATUS_LABELS: Record<string, string> = {
  confirmed: 'Confirmed',
  checked_in: 'Checked In',
  cancelled: 'Cancelled',
  pending_payment: 'Pending',
}

function MyTickets() {
  const [filter, setFilter] = useState<string | undefined>(undefined)
  const { tickets, loading } = useMyTickets(filter)
  const navigate = useNavigate()

  const filters = [
    { value: undefined, label: 'All' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'checked_in', label: 'Checked In' },
    { value: 'cancelled', label: 'Cancelled' },
  ]

  const handleTicketClick = (ticket: Ticket) => {
    navigate(`/tickets/verify/${ticket.ticketCode}`)
  }

  return (
    <div className="my-tickets-page">
      <Navbar />
      <div className="my-tickets-container">
        <div className="my-tickets-header">
          <h1 className="my-tickets-title">My Tickets</h1>
          <div className="my-tickets-filters">
            {filters.map((f) => (
              <button
                key={f.label}
                className={`my-tickets-filter-btn ${filter === f.value ? 'active' : ''}`}
                onClick={() => setFilter(f.value)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="my-tickets-loading">Loading your tickets...</div>
        ) : tickets.length === 0 ? (
          <div className="my-tickets-empty">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="2" y="6" width="20" height="12" rx="2" />
              <path d="M2 10h20" />
              <path d="M6 14h.01" />
              <path d="M10 14h4" />
            </svg>
            <p className="my-tickets-empty-text">
              {filter ? 'No tickets with this status.' : "You don't have any tickets yet."}
            </p>
            <Link to="/events" className="my-tickets-browse-btn">
              Browse Events
            </Link>
          </div>
        ) : (
          tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="ticket-card"
              onClick={() => handleTicketClick(ticket)}
            >
              <div className="ticket-card-inner">
                <div className="ticket-card-qr">
                  {ticket.qrCodeUrl ? (
                    <img src={getTicketQrUrl(ticket.ticketCode)} alt="QR" />
                  ) : (
                    <div className="ticket-card-qr-placeholder">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="7" height="7" />
                        <rect x="14" y="3" width="7" height="7" />
                        <rect x="3" y="14" width="7" height="7" />
                        <rect x="14" y="14" width="7" height="7" />
                      </svg>
                    </div>
                  )}
                </div>

                <div className="ticket-card-content">
                  <div className="ticket-card-top">
                    <span className="ticket-card-event-name">{ticket.eventTitle}</span>
                    <span className={`ticket-card-status ticket-card-status-${ticket.status}`}>
                      {STATUS_LABELS[ticket.status] || ticket.status}
                    </span>
                  </div>

                  <div className="ticket-card-details">
                    <span className="ticket-card-detail">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                      </svg>
                      {ticket.eventDate}
                    </span>
                    <span className="ticket-card-detail">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      {ticket.eventLocation}
                    </span>
                    {ticket.amountPaid > 0 && (
                      <span className="ticket-card-detail">
                        ${ticket.amountPaid.toFixed(2)}
                      </span>
                    )}
                  </div>

                  <div className="ticket-card-code">{ticket.ticketCode}</div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default MyTickets
