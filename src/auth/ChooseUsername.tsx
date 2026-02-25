import { useState, FormEvent, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { updateUser } from '../lib/auth'
import './Login.css'
const loginImage = 'https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?w=1200&h=1800&fit=crop&q=80'

function ChooseUsername() {
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { user, isLoading, isAuthenticated, needsUsername } = useAuth()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login')
    }
    if (!isLoading && isAuthenticated && !needsUsername) {
      navigate('/feed')
    }
  }, [isLoading, isAuthenticated, needsUsername, navigate])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    const trimmed = username.trim().toLowerCase()

    if (trimmed.length < 3) {
      setError('Username must be at least 3 characters')
      return
    }
    if (trimmed.length > 20) {
      setError('Username must be 20 characters or less')
      return
    }
    if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) {
      setError('Only letters, numbers, and underscores are allowed')
      return
    }

    setLoading(true)

    try {
      const result = await updateUser({
        username: trimmed,
      } as Parameters<typeof updateUser>[0])

      if (result.error) {
        setError(result.error.message || 'Failed to set username')
      } else {
        navigate('/feed')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (isLoading || (!isLoading && isAuthenticated && !needsUsername)) {
    return null
  }

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <div className="auth-form-section">
          <div className="auth-form-content">
            {user?.image && (
              <img
                src={user.image}
                alt={user.name}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  marginBottom: 16,
                }}
              />
            )}
            <h2 className="auth-title">Choose your username</h2>
            <p className="auth-subtitle">
              Welcome, {user?.name}! Pick a unique username for your profile.
            </p>

            <form className="auth-form" onSubmit={handleSubmit}>
              {error && <div className="auth-error">{error}</div>}

              <div className="auth-input-group">
                <input
                  type="text"
                  placeholder="Enter username"
                  className="auth-input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoFocus
                  required
                />
              </div>
              <p className="auth-subtitle" style={{ fontSize: '0.8rem', marginTop: -8 }}>
                Letters, numbers, and underscores only. 3–20 characters.
              </p>

              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? 'Setting username...' : 'Continue'}
              </button>
            </form>
          </div>
        </div>

        <div className="auth-image-section">
          <div className="auth-brand-overlay">
            <h1>Ethnovino</h1>
          </div>
          <img src={loginImage} alt="Wine" className="auth-image" />
        </div>
      </div>
    </div>
  )
}

export default ChooseUsername
