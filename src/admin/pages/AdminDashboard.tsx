import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import StatsCard from '../components/StatsCard'
import { getDashboardStats } from '../services/adminApi'
import { DashboardStats } from '../types'
import './AdminDashboard.css'

function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setError(null)
        const data = await getDashboardStats()
        setStats(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="admin-dashboard-loading">
        <div className="admin-dashboard-spinner" />
        <p>Loading dashboard...</p>
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className="admin-dashboard-error">
        <h2>Unable to load dashboard</h2>
        <p>{error || 'Please try again later.'}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome to the Ethnovino Admin Panel</p>
      </div>

      <div className="admin-dashboard-stats">
        <StatsCard title="Total Users" value={stats.stats.total_users} icon="users" />
        <StatsCard title="Wines Logged" value={stats.stats.total_wines} icon="wines" />
        <StatsCard title="Events" value={stats.stats.total_events} icon="events" />
        <StatsCard title="Stories" value={stats.stats.total_stories} icon="stories" />
        <StatsCard title="AI Conversations" value={stats.stats.total_conversations} icon="conversations" />
      </div>

      <div className="admin-dashboard-grid">
        <div className="admin-dashboard-card">
          <div className="admin-dashboard-card-header">
            <h2>Recent Signups</h2>
            <Link to="/admin/users" className="admin-dashboard-link">View All</Link>
          </div>
          <div className="admin-dashboard-list">
            {stats.recent_signups.map((user) => (
              <div key={user.id} className="admin-dashboard-list-item">
                <div className="admin-dashboard-list-avatar">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div className="admin-dashboard-list-info">
                  <p className="admin-dashboard-list-name">{user.username}</p>
                  <p className="admin-dashboard-list-meta">{user.email}</p>
                </div>
                <span className="admin-dashboard-list-date">
                  {formatDate(user.created_at)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-dashboard-card">
          <div className="admin-dashboard-card-header">
            <h2>Upcoming Events</h2>
            <Link to="/admin/events" className="admin-dashboard-link">View All</Link>
          </div>
          <div className="admin-dashboard-list">
            {stats.upcoming_events.map((event) => (
              <div key={event.id} className="admin-dashboard-list-item">
                <div className="admin-dashboard-list-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
                <div className="admin-dashboard-list-info">
                  <p className="admin-dashboard-list-name">{event.title}</p>
                  <p className="admin-dashboard-list-meta">{event.attendee_count} attendees</p>
                </div>
                <span className="admin-dashboard-list-date">
                  {formatDate(event.date)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="admin-dashboard-actions">
        <Link to="/admin/events" className="admin-dashboard-action-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Create Event
        </Link>
        <Link to="/admin/stories" className="admin-dashboard-action-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Create Story
        </Link>
        <Link to="/admin/invite" className="admin-dashboard-action-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="8.5" cy="7" r="4" />
            <line x1="20" y1="8" x2="20" y2="14" />
            <line x1="23" y1="11" x2="17" y2="11" />
          </svg>
          Invite Admin
        </Link>
      </div>
    </div>
  )
}

export default AdminDashboard
