import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTicket } from '../hooks'
import { getTicketQrUrl } from '../services'
import Navbar from '../../../components/Navbar'
import './TicketView.css'

const STATUS_LABELS: Record<string, string> = {
  confirmed: 'Confirmed',
  checked_in: 'Checked In',
  cancelled: 'Cancelled',
  pending_payment: 'Pending Payment',
}

function TicketView() {
  const { ticketCode } = useParams<{ ticketCode: string }>()
  const { ticket, loading, error, cancel } = useTicket(ticketCode || null)
  const [cancelling, setCancelling] = useState(false)

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this ticket? This cannot be undone.')) return

    setCancelling(true)
    try {
      await cancel()
    } catch {
      alert('Failed to cancel ticket.')
    } finally {
      setCancelling(false)
    }
  }

  if (loading) {
    return (
      <div className="ticket-view-page">
        <Navbar />
        <div className="ticket-view-container">
          <p className="ticket-view-loading">Loading ticket...</p>
        </div>
      </div>
    )
  }

  if (error || !ticket) {
    return (
      <div className="ticket-view-page">
        <Navbar />
        <div className="ticket-view-container">
          <div className="ticket-view-error">
            <p>{error || 'Ticket not found'}</p>
            <Link to="/events" className="ticket-view-back">
              Browse Events
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const showQr = ticket.status === 'confirmed' || ticket.status === 'checked_in'
  const canCancel = ticket.status === 'confirmed' || ticket.status === 'pending_payment'

  return (
    <div className="ticket-view-page">
      <Navbar />
      <div className="ticket-view-container">
        <Link to="/tickets" className="ticket-view-back">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          My Tickets
        </Link>

        <div className="ticket-view-card">
          <div className="ticket-view-header">
            <div className="ticket-view-header-label">Event Ticket</div>
            <div className="ticket-view-header-title">{ticket.eventTitle}</div>
          </div>

          <div className="ticket-view-body">
            <div className="ticket-view-code-wrapper">
              <span className="ticket-view-code">{ticket.ticketCode}</span>
            </div>

            {showQr && (
              <div className="ticket-view-qr-wrapper">
                <div className="ticket-view-qr">
                  <img src={getTicketQrUrl(ticket.ticketCode)} alt="Ticket QR Code" />
                </div>
              </div>
            )}

            <div className="ticket-view-divider" />

            <div className="ticket-view-info">
              <div className="ticket-view-info-row">
                <span className="ticket-view-info-label">Date</span>
                <span className="ticket-view-info-value">{ticket.eventDate}</span>
              </div>
              <div className="ticket-view-info-row">
                <span className="ticket-view-info-label">Location</span>
                <span className="ticket-view-info-value">{ticket.eventLocation}</span>
              </div>
              <div className="ticket-view-info-row">
                <span className="ticket-view-info-label">Attendee</span>
                <span className="ticket-view-info-value">{ticket.userName}</span>
              </div>
              <div className="ticket-view-info-row">
                <span className="ticket-view-info-label">Quantity</span>
                <span className="ticket-view-info-value">{ticket.quantity}</span>
              </div>
              <div className="ticket-view-info-row">
                <span className="ticket-view-info-label">Amount</span>
                <span className="ticket-view-info-value">
                  {ticket.amountPaid > 0 ? `$${ticket.amountPaid.toFixed(2)}` : 'Free'}
                </span>
              </div>
              <div className="ticket-view-info-row">
                <span className="ticket-view-info-label">Status</span>
                <span className={`ticket-view-status-badge ticket-view-status-${ticket.status}`}>
                  {STATUS_LABELS[ticket.status] || ticket.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="ticket-view-actions">
          {canCancel && (
            <button
              className="ticket-view-cancel-btn"
              onClick={handleCancel}
              disabled={cancelling}
            >
              {cancelling ? 'Cancelling...' : 'Cancel Ticket'}
            </button>
          )}
          <p className="ticket-view-print-hint">
            Tip: Use Ctrl+P / Cmd+P to print this ticket
          </p>
        </div>
      </div>
    </div>
  )
}

export default TicketView
