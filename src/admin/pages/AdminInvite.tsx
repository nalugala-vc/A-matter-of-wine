import { useState } from 'react'
import { inviteAdmin } from '../services/adminApi'
import './AdminInvite.css'

function AdminInvite() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      await inviteAdmin(email)
      setSuccess(true)
      setEmail('')
    } catch (err) {
      setError('Failed to send invite. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-invite">
      <div className="admin-invite-header">
        <h1>Invite Admin</h1>
        <p>Send an invitation to a new administrator</p>
      </div>

      <div className="admin-invite-card">
        <div className="admin-invite-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="8.5" cy="7" r="4" />
            <line x1="20" y1="8" x2="20" y2="14" />
            <line x1="23" y1="11" x2="17" y2="11" />
          </svg>
        </div>

        <h2>Add a New Admin</h2>
        <p className="admin-invite-description">
          Enter the email address of the person you want to invite as an admin.
          They will receive an email with instructions to complete their registration.
        </p>

        <form onSubmit={handleSubmit} className="admin-invite-form">
          <div className="admin-invite-input-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
              required
            />
          </div>

          {error && <div className="admin-invite-error">{error}</div>}
          {success && (
            <div className="admin-invite-success">
              Invitation sent successfully! The recipient will receive an email shortly.
            </div>
          )}

          <button type="submit" className="admin-invite-submit" disabled={loading}>
            {loading ? (
              <>
                <span className="admin-invite-spinner" />
                Sending...
              </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
                Send Invitation
              </>
            )}
          </button>
        </form>

        <div className="admin-invite-note">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <span>
            The invitation link will expire in 7 days. Admins have full access to
            user management, events, and stories.
          </span>
        </div>
      </div>
    </div>
  )
}

export default AdminInvite
