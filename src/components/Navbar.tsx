import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useUnreadCount, useNotifications } from '../features/notifications/hooks'

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileDropdown, setProfileDropdown] = useState(false)
  const [notifDropdown, setNotifDropdown] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated, user, signOut } = useAuth()
  const { count: unreadCount, refetch: refetchCount } = useUnreadCount()
  const { notifications, loading: notifsLoading, markAsRead, markAllAsRead } = useNotifications()
  const notifRef = useRef<HTMLDivElement>(null)

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/')

  useEffect(() => {
    if (notifDropdown) refetchCount()
  }, [notifDropdown])

  useEffect(() => {
    setNotifDropdown(false)
    setProfileDropdown(false)
  }, [location.pathname])

  const handleLogout = async () => {
    setMobileMenuOpen(false)
    setProfileDropdown(false)
    setNotifDropdown(false)
    await signOut()
    navigate('/')
  }

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'now'
    if (mins < 60) return `${mins}m`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}h`
    const days = Math.floor(hours / 24)
    if (days < 7) return `${days}d`
    return new Date(dateStr).toLocaleDateString()
  }

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'like': return '♥'
      case 'comment': return '💬'
      case 'follow': return '👤'
      case 'mention': return '@'
      default: return '🔔'
    }
  }

  const handleNotifClick = (notif: typeof notifications[0]) => {
    if (!notif.isRead) markAsRead(notif.id)
    setNotifDropdown(false)
    if (notif.type === 'follow' && notif.actorId) {
      navigate(`/profile/${notif.actorId}`)
    } else if (notif.targetId && notif.targetType === 'post') {
      navigate('/feed')
    }
  }

  const toggleNotifDropdown = () => {
    setNotifDropdown(prev => !prev)
    setProfileDropdown(false)
  }

  const toggleProfileDropdown = () => {
    setProfileDropdown(prev => !prev)
    setNotifDropdown(false)
  }

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-logo">
          <Link to={isAuthenticated ? '/feed' : '/'} style={{ textDecoration: 'none', color: 'inherit' }}>
            <h2>Ethnovino</h2>
          </Link>
        </div>
        <button 
          className="mobile-menu-toggle" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? '\u2715' : '\u2630'}
        </button>
        {mobileMenuOpen && (
          <div 
            className="mobile-menu-overlay" 
            onClick={() => setMobileMenuOpen(false)}
          ></div>
        )}
        <div className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          {isAuthenticated && (
            <Link to="/feed" className={`nav-link ${isActive('/feed') ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>Feed</Link>
          )}
          <Link to="/events" className={`nav-link ${isActive('/events') ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>Events</Link>
          <Link to="/sommelier" className={`nav-link ${isActive('/sommelier') ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>Sommelier</Link>
          <Link to="/stories" className={`nav-link ${isActive('/stories') ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>Stories</Link>
          {isAuthenticated ? (
            <button className="nav-button nav-button-mobile" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <Link to="/login" className="nav-button nav-button-mobile" style={{ textDecoration: 'none' }} onClick={() => setMobileMenuOpen(false)}>
              Get Started
            </Link>
          )}
        </div>
        
        {/* Desktop right section */}
        {isAuthenticated ? (
          <div className="nav-desktop-right">
            <Link to="/explore" className="nav-icon-btn" title="Search">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </Link>

            <div className="nav-notif-wrapper" ref={notifRef}>
              <button
                className="nav-icon-btn"
                onClick={toggleNotifDropdown}
                title="Notifications"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                {unreadCount > 0 && (
                  <span className="nav-notif-badge-desktop">{unreadCount > 9 ? '9+' : unreadCount}</span>
                )}
              </button>
              {notifDropdown && (
                <>
                  <div className="nav-dropdown-overlay" onClick={() => setNotifDropdown(false)} />
                  <div className="nav-notif-dropdown">
                    <div className="nav-notif-dropdown-header">
                      <span className="nav-notif-dropdown-title">Notifications</span>
                      {notifications.some(n => !n.isRead) && (
                        <button className="nav-notif-mark-read" onClick={markAllAsRead}>
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="nav-notif-dropdown-divider" />
                    <div className="nav-notif-dropdown-list">
                      {notifsLoading ? (
                        <div className="nav-notif-dropdown-empty">Loading...</div>
                      ) : notifications.length === 0 ? (
                        <div className="nav-notif-dropdown-empty">No notifications yet</div>
                      ) : (
                        notifications.slice(0, 8).map(notif => (
                          <button
                            key={notif.id}
                            className={`nav-notif-dropdown-item ${notif.isRead ? '' : 'unread'}`}
                            onClick={() => handleNotifClick(notif)}
                          >
                            <span className="nav-notif-dropdown-icon">{getNotifIcon(notif.type)}</span>
                            <div className="nav-notif-dropdown-body">
                              <span className="nav-notif-dropdown-text">
                                <strong>{notif.actorUsername}</strong>{' '}
                                {notif.type === 'like' && 'liked your post'}
                                {notif.type === 'comment' && 'commented on your post'}
                                {notif.type === 'follow' && 'started following you'}
                                {notif.type === 'mention' && 'mentioned you'}
                              </span>
                              <span className="nav-notif-dropdown-time">{timeAgo(notif.createdAt)}</span>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                    {notifications.length > 0 && (
                      <>
                        <div className="nav-notif-dropdown-divider" />
                        <Link
                          to="/notifications"
                          className="nav-notif-dropdown-viewall"
                          onClick={() => setNotifDropdown(false)}
                        >
                          View all notifications
                        </Link>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>

            <div className="nav-profile-wrapper">
              <button
                className="nav-profile-btn"
                onClick={toggleProfileDropdown}
              >
                <div className="nav-avatar">
                  {user?.image ? (
                    <img src={user.image} alt={user.name} />
                  ) : (
                    user?.name?.charAt(0).toUpperCase() || '?'
                  )}
                </div>
              </button>
              {profileDropdown && (
                <>
                  <div className="nav-dropdown-overlay" onClick={() => setProfileDropdown(false)} />
                  <div className="nav-profile-dropdown">
                    <div className="nav-dropdown-name">{user?.name}</div>
                    <div className="nav-dropdown-email">{user?.email}</div>
                    <div className="nav-dropdown-divider" />
                    <Link
                      to={`/profile/${user?.id}`}
                      className="nav-dropdown-item"
                      onClick={() => setProfileDropdown(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/cellar"
                      className="nav-dropdown-item"
                      onClick={() => setProfileDropdown(false)}
                    >
                      Cellar
                    </Link>
                    <Link
                      to="/tickets"
                      className="nav-dropdown-item"
                      onClick={() => setProfileDropdown(false)}
                    >
                      Tickets
                    </Link>
                    <div className="nav-dropdown-divider" />
                    <button className="nav-dropdown-item nav-dropdown-logout" onClick={handleLogout}>
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          <Link to="/login" className="nav-button nav-button-desktop" style={{ textDecoration: 'none' }}>
            Get Started
          </Link>
        )}
      </div>
    </nav>
  )
}

export default Navbar
