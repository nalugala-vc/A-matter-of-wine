import { useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { Ticket, MockPaymentData } from '../types'
import { confirmPayment } from '../services'
import Navbar from '../../../components/Navbar'
import './MockCheckout.css'

function MockCheckout() {
  const { ticketId } = useParams<{ ticketId: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const ticket = (location.state as { ticket?: Ticket })?.ticket

  const [formData, setFormData] = useState({
    cardNumber: '4242 4242 4242 4242',
    cardHolder: 'Test User',
    expiry: '12/28',
    cvv: '123',
  })
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!ticket || !ticketId) {
    return (
      <div className="checkout-page">
        <Navbar />
        <div className="checkout-container">
          <div className="checkout-error">
            Ticket information not found. Please try purchasing again.
          </div>
          <button className="checkout-back" onClick={() => navigate('/events')}>
            Back to Events
          </button>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setProcessing(true)
    setError(null)

    try {
      const paymentData: MockPaymentData = {
        ticket_id: ticketId,
        payment_token: ticket.paymentToken || '',
        card_number: formData.cardNumber.replace(/\s/g, ''),
        card_holder: formData.cardHolder,
        expiry: formData.expiry,
        cvv: formData.cvv,
      }

      const confirmed = await confirmPayment(paymentData)
      navigate(`/tickets/confirmation/${confirmed.ticketCode}`)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Payment failed. Please try again.')
      setProcessing(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="checkout-page">
      <Navbar />
      <div className="checkout-container">
        <button className="checkout-back" onClick={() => navigate(-1)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back
        </button>

        <h1 className="checkout-title">Checkout</h1>

        {/* Order Summary */}
        <div className="checkout-summary">
          <div className="checkout-summary-title">Order Summary</div>
          <div className="checkout-summary-event">{ticket.eventTitle}</div>
          <div className="checkout-summary-detail">{ticket.eventDate}</div>
          <div className="checkout-summary-detail">{ticket.eventLocation}</div>

          <div className="checkout-summary-divider" />

          <div className="checkout-summary-row">
            <span>Ticket x {ticket.quantity}</span>
            <span>${ticket.amountPaid.toFixed(2)}</span>
          </div>

          <div className="checkout-summary-total">
            <span>Total</span>
            <span>${ticket.amountPaid.toFixed(2)}</span>
          </div>
        </div>

        {/* Payment Form */}
        {processing ? (
          <div className="checkout-payment">
            <div className="checkout-processing">
              <div className="checkout-spinner" />
              <p className="checkout-processing-text">Processing your payment...</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="checkout-payment">
              <div className="checkout-payment-title">Payment Details</div>

              <div className="checkout-mock-banner">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                This is a mock payment. No real charges will be made.
              </div>

              {error && <div className="checkout-error">{error}</div>}

              <div className="checkout-form-group">
                <label className="checkout-form-label">Card Number</label>
                <input
                  type="text"
                  className="checkout-form-input"
                  value={formData.cardNumber}
                  onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                  placeholder="4242 4242 4242 4242"
                />
              </div>

              <div className="checkout-form-group">
                <label className="checkout-form-label">Cardholder Name</label>
                <input
                  type="text"
                  className="checkout-form-input"
                  value={formData.cardHolder}
                  onChange={(e) => handleInputChange('cardHolder', e.target.value)}
                  placeholder="Test User"
                />
              </div>

              <div className="checkout-form-row">
                <div className="checkout-form-group">
                  <label className="checkout-form-label">Expiry Date</label>
                  <input
                    type="text"
                    className="checkout-form-input"
                    value={formData.expiry}
                    onChange={(e) => handleInputChange('expiry', e.target.value)}
                    placeholder="MM/YY"
                  />
                </div>
                <div className="checkout-form-group">
                  <label className="checkout-form-label">CVV</label>
                  <input
                    type="text"
                    className="checkout-form-input"
                    value={formData.cvv}
                    onChange={(e) => handleInputChange('cvv', e.target.value)}
                    placeholder="123"
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="checkout-pay-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                <line x1="1" y1="10" x2="23" y2="10" />
              </svg>
              Pay ${ticket.amountPaid.toFixed(2)}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default MockCheckout
