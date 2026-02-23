import { useState, useRef, useEffect } from 'react'
import { validateTicket } from '../../features/tickets/services'
import { TicketValidationResult } from '../../features/tickets/types'
import './TicketScanner.css'

function TicketScanner() {
  const [ticketCode, setTicketCode] = useState('')
  const [validating, setValidating] = useState(false)
  const [result, setResult] = useState<TicketValidationResult | null>(null)
  const [cameraActive, setCameraActive] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  const handleValidate = async (code?: string) => {
    const codeToValidate = code || ticketCode.trim()
    if (!codeToValidate) return

    setValidating(true)
    setResult(null)

    try {
      const validationResult = await validateTicket(codeToValidate)
      setResult(validationResult)
    } catch (err: any) {
      setResult({
        valid: false,
        message: err.response?.data?.detail || 'Validation failed. Please try again.',
        ticket: null,
      })
    } finally {
      setValidating(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleValidate()
    }
  }

  const handleScanAgain = () => {
    setResult(null)
    setTicketCode('')
    inputRef.current?.focus()
  }

  const toggleCamera = async () => {
    if (cameraActive) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
        streamRef.current = null
      }
      setCameraActive(false)
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setCameraActive(true)
    } catch {
      alert('Could not access camera. Please use manual entry instead.')
    }
  }

  return (
    <div className="ticket-scanner">
      <h1>Ticket Scanner</h1>
      <p className="ticket-scanner-subtitle">
        Validate tickets by entering the code or scanning the QR code
      </p>

      {/* Validation Result */}
      {result && (
        <div className={`scanner-result ${result.valid ? 'scanner-result-valid' : 'scanner-result-invalid'}`}>
          <div className="scanner-result-icon">
            {result.valid ? (
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            ) : (
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            )}
          </div>

          <p className="scanner-result-message">{result.message}</p>

          {result.ticket && (
            <div className="scanner-result-details">
              <p><strong>Event:</strong> {result.ticket.eventTitle}</p>
              <p><strong>Attendee:</strong> {result.ticket.userName}</p>
              <p><strong>Code:</strong> {result.ticket.ticketCode}</p>
              <p><strong>Qty:</strong> {result.ticket.quantity}</p>
            </div>
          )}

          <button className="scanner-scan-again-btn" onClick={handleScanAgain}>
            Scan Another Ticket
          </button>
        </div>
      )}

      {/* Manual Entry */}
      <div className="scanner-manual-entry">
        <div className="scanner-manual-title">Manual Entry</div>
        <div className="scanner-input-row">
          <input
            ref={inputRef}
            type="text"
            className="scanner-input"
            value={ticketCode}
            onChange={(e) => setTicketCode(e.target.value.toUpperCase())}
            onKeyDown={handleKeyDown}
            placeholder="WINE-XXXXXX"
            disabled={validating}
          />
          <button
            className="scanner-validate-btn"
            onClick={() => handleValidate()}
            disabled={validating || !ticketCode.trim()}
          >
            {validating ? 'Checking...' : 'Validate'}
          </button>
        </div>
      </div>

      {/* Camera Scanner */}
      <div className="scanner-camera-section">
        <div className="scanner-camera-title">Camera Scanner</div>
        <button className="scanner-camera-toggle" onClick={toggleCamera}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
          {cameraActive ? 'Stop Camera' : 'Start Camera'}
        </button>

        {cameraActive && (
          <div className="scanner-camera-view">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        )}

        {cameraActive && (
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
            Camera preview is active. For QR scanning, please manually enter the ticket code shown on the attendee's screen. Full QR decoding can be added with the html5-qrcode library.
          </p>
        )}
      </div>
    </div>
  )
}

export default TicketScanner
